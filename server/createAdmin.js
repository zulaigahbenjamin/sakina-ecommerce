
import bcrypt from 'bcryptjs';
import readline from 'node:readline';
import db from './database.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function createAdmin() {
  try {
    const email = (await ask('Admin email: ')).trim().toLowerCase();
    const password = await ask('Admin password (minimum 12 characters): ');

    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    if (password.length < 12) {
      throw new Error('Password must be at least 12 characters.');
    }

    const existing = db.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).get(email);

    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    db.prepare(`
      INSERT INTO users (email, password_hash, role)
      VALUES (?, ?, 'admin')
    `).run(email, passwordHash);

    console.log('\nAdministrator account created successfully!');
    console.log(`Email: ${email}`);
  } catch (error) {
    console.error('\nCould not create administrator:', error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    db.close();
  }
}

createAdmin();
