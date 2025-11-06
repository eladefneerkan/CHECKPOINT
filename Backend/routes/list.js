const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all games
router.get('/games', (req, res) => {
    db.query("SELECT * FROM GAME LIST", (err, results)=> {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.json(results);
    });
});

// ADD a new game
router.post('/games', (req, res) => {
    const { title, genre, description } = req.body;
    if (!title || !genre || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    db.query("INSERT INTO GAME LIST (title, genre, description) VALUES (?, ?, ?)",
        [title, genre, description],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database insert failed' });
            }
            res.status(201).json({ message: 'Game added successfully', gameId: results.insertId });
        }
    );
});

// DELETE a game by id
router.delete('/games/:id', (req, res) => {
    const gameId = req.params.id;
    db.query("DELETE FROM GAME LIST WHERE id = ?", [gameId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database delete failed' });
        }
        res.json({ message: 'Game deleted successfully' });
    });
});




// update complete game info
router.put('/games/:id', (req, res) => {
    const gameId = req.params.id;
    const {complete} = req.body;

    db.query("UPDATE GAME LIST SET complete = ? WHERE id = ?",
        [complete, gameId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database update failed' });
            }
            res.json({ message: 'Game updated successfully' });
        }
    );
});

module.exports = router;



    
