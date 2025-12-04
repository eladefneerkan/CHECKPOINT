// @ts-check
import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Import User model - use require for CommonJS modules
const User = require('../models/User.js');
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/checkpoint_db.test_users";

test.describe.configure({ mode: 'serial' });

test.describe('User Database Tests', () => {

  test.beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
    }
  });

  test.afterEach(async () => {
    // Clean up only test users created during tests
    if (mongoose.connection.readyState === 1) {
      await User.deleteMany({ 
        username: { 
          $in: ['testuser1', 'testuser2', 'testuser_specific'] 
        } 
      });
    }
  });

  test.afterAll(async () => {
    // Only close if connection is still open
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  });

  // Test 1: Pull all users from database
  test('should pull all user from database', async () => {
    // Create test users directly in the database
    const testUser1 = await User.create({
      username: 'testuser1',
      password: 'Password123@',
      email: 'testuser1@example.com',
      bio: 'Test bio 1',
      isVerified: true
    });
    console.log('Created testUser1:', testUser1._id);

    const testUser2 = await User.create({
      username: 'testuser2',
      password: 'Password456@',
      email: 'testuser2@example.com',
      bio: 'Test bio 2',
      isVerified: true
    });
    
    // Find specific user by username
    const foundUser1 = await User.findOne({ username: 'testuser1' });
    const foundUser2 = await User.findOne({ username: 'testuser2' });

    // Assertions
    expect(foundUser1).not.toBeNull();
    expect(foundUser1?.username).toBe('testuser1');
    expect(foundUser1?.email).toBe('testuser1@example.com');
    
    expect(foundUser2).not.toBeNull();
    expect(foundUser2?.username).toBe('testuser2');
    expect(foundUser2?.email).toBe('testuser2@example.com');
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

  test('failing test to find non-existent user', async () => 

});
