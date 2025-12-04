// @ts-check
import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Import User model - use require for CommonJS modules
const User = require('../models/User.js');
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/checkpoint_db.test_users";

test.beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
  await mongoose.connect(uri);
  }
});

test.afterEach(async () => {
  // Clean up only test users created during tests
  await User.deleteMany({ 
    username: { 
      $in: ['testuser1', 'testuser2', 'testuser_specific'] 
    } 
  });
});

test.afterAll(async () => {
  await mongoose.connection.close();
});

test.describe('User Database Tests', () => {

  // Test 1: Pull all users from database
  test('should pull all users from database', async () => {
    const testUser1 = await User.create({
      username: 'testuser1',
      password: 'hashedpass123',
      email: 'test1@example.com',
      bio: 'Test user 1',
      isVerified: true
    });

    const testUser2 = await User.create({
      username: 'testuser2',
      password: 'hashedpass456',
      email: 'test2@example.com',
      bio: 'Test user 2',
      isVerified: true
    });

    const users = await User.find();

    expect(users.length).toBeGreaterThanOrEqual(2);
    expect(users.some(u => u.username === 'testuser1')).toBeTruthy();
    expect(users.some(u => u.username === 'testuser2')).toBeTruthy();
  });

  // test 2: pull a specific user by ID
  test('should pull a specific user by ID from database', async () => {
    const testUser = await User.create({
      username: 'testuser_specific',
      password: 'hashedpass789',
      email: 'specific@example.com',
      bio: 'Specific test user',
      isVerified: true
    });

    const foundUser = await User.findById(testUser._id);

    expect(foundUser).not.toBeNull();
    expect(foundUser?.username).toBe('testuser_specific');
    expect(foundUser?.email).toBe('specific@example.com');
    expect(foundUser?.bio).toBe('Specific test user');
  });

});
