import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174'
  ]
}));

app.use(express.json());

// Authentication configuration
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing from the .env file.');
}

// Verify administrator login tokens
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = db.prepare(`
      SELECT id, email, role, is_active
      FROM users
      WHERE id = ?
    `).get(decoded.sub);

    if (!user || !user.is_active || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Administrator access required.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired login session.'
    });
  }
};

// Administrator login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = db.prepare(`
      SELECT *
      FROM users
      WHERE email = ?
    `).get(email.trim().toLowerCase());

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      { sub: String(user.id) },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Login failed.'
    });
  }
});

// Retrieve currently logged-in administrator
app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Test that the API is running
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Zulaigah API is running!',
    timestamp: new Date().toISOString()
  });
});

// Retrieve all active products
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare(`
      SELECT *
      FROM products
      WHERE active = 1
      ORDER BY sort_order ASC
    `).all();

    const formattedProducts = products.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      featured: Boolean(product.featured),
      active: Boolean(product.active)
    }));

    res.json({
      success: true,
      total: formattedProducts.length,
      products: formattedProducts
    });
  } catch (error) {
    console.error('Products error:', error);

    res.status(500).json({
      success: false,
      message: 'Could not retrieve products.'
    });
  }
});

// Retrieve one product using its slug
app.get('/api/products/:slug', (req, res) => {
  try {
    const product = db.prepare(`
      SELECT *
      FROM products
      WHERE slug = ? AND active = 1
    `).get(req.params.slug);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.json({
      success: true,
      product: {
        ...product,
        images: JSON.parse(product.images || '[]'),
        featured: Boolean(product.featured),
        active: Boolean(product.active)
      }
    });
  } catch (error) {
    console.error('Product error:', error);

    res.status(500).json({
      success: false,
      message: 'Could not retrieve product.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Zulaigah API running at http://localhost:${PORT}`);
});
