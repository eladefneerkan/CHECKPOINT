// @ts-check
import {test, expect} from '@playwright/test';
const mongoose = require('mongoose');
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// import needed models
const User = require('../models/User.js');
const list = require('../models/GameList.js');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/checkpoint_db.test_users";

test.describe.configure({mode: 'serial'});

test.describe('User E2E tests with list.', () => {

    // Connect to MongoDB before all tests
    test.beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri);
            console.log('Connected to MongoDB');
        }
    });

    // after each test, clean up test users created during tests
    test.afterEach(async () => {
        if(mongoose.connection.readyState === 1) {
            await User.deleteMany({
                username: {
                    $in: ['testuser1']
                }
            });
        }
    });

    // Disconnect from MongoDB after all tests
    test.afterAll(async () => {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
        }
    });

    test('Create user and associate a game list, add games to the list, delete games from the list, and delete the list, then delete user', async () => {
        // Create a test user
        const testUser = await User.create({
            username: 'testuser1',
            password: 'Password123@',
            email: 'testuser1@example.com',
            bio: 'Test bio 1',
            isVerified: true
        });
        console.log('Created testUser1:', testUser._id);

        // create a game list associated with the user
        const gameList = await list.create({
            userId: testUser._id,  // Changed from 'user' to 'userId'
            title: 'My Test Game List',  // Added required title field
            description: 'A test game list',  // Optional description
            games: []  // Games should be ObjectIds, leaving empty for now
        });
        console.log('Created game list for testUser1:', gameList._id);

        // Verify the game list is associated with the user
        const fetchedList = await list.findOne({ userId: testUser._id });
        expect(fetchedList).not.toBeNull();
        expect(fetchedList?.title).toBe('My Test Game List');
        expect(fetchedList?.userId.toString()).toBe(testUser._id.toString());

        // Add games to the list
        const gameId1 = new mongoose.Types.ObjectId();
        const gameId2 = new mongoose.Types.ObjectId();

        fetchedList?.games.push(gameId1, gameId2);
        await fetchedList?.save();

        // verify games were added
        const updatedList = await list.findById(fetchedList?._id);
        expect(updatedList).not.toBeNull();
        expect(updatedList?.games.length).toBe(2);
        expect(updatedList?.games).toContainEqual(gameId1);
        expect(updatedList?.games).toContainEqual(gameId2);
        console.log('Added games to the list:', updatedList?.games);

        // remove a game from the list 
        updatedList?.games.pop();
        updatedList?.games.pop();
        await updatedList?.save();

        // verify games were removed
        const finalList = await list.findById(fetchedList?._id);
        expect(finalList).not.toBeNull();
        expect(finalList?.games.length).toBe(0);
        console.log('Removed all games from the list:', finalList?.games);

        // delete the list
        await list.findByIdAndDelete(fetchedList?._id);

        // verify the list was deleted
        const deletedList = await list.findById(fetchedList?._id);
        expect(deletedList).toBeNull();
        console.log('Deleted the game list successfully.');

        // delete the user
        await User.findByIdAndDelete(testUser._id);

        // verify the user was deleted
        const deletedUser = await User.findById(testUser._id);
        expect(deletedUser).toBeNull();
        console.log('Deleted testUser1 successfully.');

    });
});




