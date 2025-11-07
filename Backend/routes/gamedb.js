const axios = require("axios");
const express = require("express")

const router = express.Router();

const BASE_URL = "https://api.thegamesdb.net/v1";
const API_KEY = process.env.API_KEY

/**
 * @swagger
 * /games/search:
 *   get:
 *     summary: Search games by name
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Game name to search
 *     responses:
 *       200:
 *         description: List of games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   game_id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   platform:
 *                     type: string
 *                   description:
 *                     type: string
 */
router.get("/search", async (req, res) => {
    const { name } = req.query;
    if (!name) return res.json([]);
  try {
        const response = await axios.get(`${BASE_URL}/Games/ByGameName`, {
        params: { name }, // only the game name
        headers: { Authorization: API_KEY }
    });
    const games = response.data?.data?.games;
    res.json(games ? Object.values(games) : []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch from TheGamesDB" });
  }
});


module.exports = router;


