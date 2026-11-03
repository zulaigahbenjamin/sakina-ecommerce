
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

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
