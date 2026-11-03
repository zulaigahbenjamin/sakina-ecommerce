
import db from './database.js';
import { SAMPLE_PRODUCTS } from '../src/data/catalog.js';

const insertProduct = db.prepare(`
  INSERT OR IGNORE INTO products (
    name,
    slug,
    category,
    price,
    compare_at_price,
    short,
    description,
    materials,
    image,
    images,
    stock,
    badge,
    featured,
    active,
    sort_order
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const seedProducts = db.transaction(() => {
  SAMPLE_PRODUCTS.forEach((product, index) => {
    insertProduct.run(
      product.name,
      product.slug,
      product.category,
      product.price,
      product.compare_at_price ?? null,
      product.short ?? null,
      product.description ?? null,
      product.materials ?? null,
      product.image ?? null,
      JSON.stringify(product.images ?? []),
      product.stock ?? 0,
      product.badge ?? null,
      product.featured ? 1 : 0,
      1,
      index + 1
    );
  });
});

seedProducts();

const result = db.prepare('SELECT COUNT(*) AS total FROM products').get();

console.log('Product import completed!');
console.log(`Products currently in database: ${result.total}`);

db.close();
