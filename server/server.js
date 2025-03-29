import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import 'dotenv/config';
import pgPromise from 'pg-promise';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// pg-promise 
const pgp = pgPromise();
const db = pgp('postgres://tpl622_6@localhost:5432/weatherappvtwo');

app.get("/test-connection", (req, res) => {
  res.json({ message: "Succesfully connected to weather-app-2.0!" });
});

app.get("/weather/:city", async (req, res) => {
  const apiKey = process.env.WEATHER_API_KEY;
  // console.log("api", apiKey);
  const params = new URLSearchParams({
    q: req.params.city,
    appid: apiKey,
    units: "imperial",
  })

  const url = `https://api.openweathermap.org/data/2.5/weather?${params}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({error: "Cannot get the weather data you asked for"});
  }
});

// use the jokes api https://v2.jokeapi.dev/
app.get("/joke/", async (req, res) => {
  let jokeApiUrl = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single";
  try {
    const response = await fetch(jokeApiUrl);
    const jokeData = await response.json();
    if(jokeData.error){
      return res.status(500).json({ error: jokeData.message });
    }
    res.json({ joke: jokeData.joke });
  } catch (error) {
    console.error("Error fetching joke:", error);
    res.status(500).json({ error: "Failed to fetch joke" });
  }
});

// get users
app.get("/users", async (req, res) => {
  try {
    const users = await db.any('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// add favorite city with name 
// Create user (add favorite city and user name)
app.post("/users", async (req, res) => {
  const { user_name, favorite_city } = req.body;
  try {
    await db.none('INSERT INTO users (user_name, favorite_city) VALUES ($1, $2)', [user_name, favorite_city]);
    res.json({ message: "User created" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Delete users
app.delete("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    await db.none('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// edit user
app.put("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  const { user_name, email, favorite_city } = req.body;

  try {
    await db.none(
      "UPDATE users SET user_name = $1, email = $2, favorite_city = $3 WHERE id = $4",
      [user_name, email, favorite_city, userId]
    );

    res.json({ message: "User updated" });
  } catch (error) {
    console.error("Error updating user:", error.message, error.stack);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// get joke-vote
app.get('/votes', async (req, res) => {
  try {
    // console.log("got a vote!");
    const query = `
      SELECT
        users.user_name,
        joke_votes.joke_text,
        joke_votes.vote
      FROM
        joke_votes
      LEFT JOIN
        users ON joke_votes.user_id = users.id;
    `;
    const result = await db.any(query);
    // console.log("vote data", result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});
// add vote
app.post("/jokes/vote", async (req, res) => {
  const { userId, jokeText, vote } = req.body;
  try {
    await db.none(
      "INSERT INTO joke_votes (user_id, joke_text, vote) VALUES ($1, $2, $3)",
      [userId, jokeText, vote]
    );
    res.json({ message: "Vote recorded" });
  } catch (error) {
    console.error("Error recording vote:", error);
    res.status(500).json({ error: "Failed to record vote" });
  }
});

// the statictics of the votes from the joke_text 
app.post("/jokes/statistics", async (req, res) => {
  const { jokeText } = req.body;
  try {
    // utilized https://www.w3schools.com/sql/sql_sum.asp to help with this part
    const query = `
      SELECT
        SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END) AS upvotes,
        SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END) AS downvotes,
        COUNT(*) AS totalVotes
      FROM
        joke_votes
      WHERE
        joke_text = $1;
    `;
    const result = await db.any(query, [jokeText]);
    res.json(result);
  } catch (error) {
    console.error("Error fetching joke statistics:", error);
    res.status(500).json({ error: "Failed to fetch joke statistics" });
  }
});
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));