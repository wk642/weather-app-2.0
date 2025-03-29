import React, { useState, useEffect } from "react";

export default function DisplayJokesData({ joke, userId }) {
  const [voteStatus, setVoteStatus] = useState(null);
  const [jokeStats, setJokeStats] = useState(null); 

  const fetchJokeStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/jokes/statistics', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jokeText: joke }),
      });

      if (response.ok) {
        const data = await response.json();
        setJokeStats(data[0]); 
      } else {
        console.error('Failed to fetch joke statistics');
      }
    } catch (error) {
      console.error('Error fetching joke statistics:', error);
    }
  };

  useEffect(() => {
    // fetch when it loads
    fetchJokeStats(); 
    // fetch again when the joke changes
  }, [joke]); 

  // handling the voting
  const handleVote = async (vote) => {
    try {
      const response = await fetch("http://localhost:5000/jokes/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, jokeText: joke, vote }),
      });
      if (response.ok) {
        setVoteStatus(vote);
        fetchJokeStats();
      } else {
        const errorData = await response.json(); 
        console.error("Failed to record vote:", errorData);
        throw new Error("Failed to record vote");
      }
    } catch (error) {
      console.error("Error recording vote:", error);
    }
  };

  if (!joke) {
    return null;
  }

  return (
    <div className="joke-data-container">
      <div className="joke-data-content">
        <h3>Joke</h3>
        <p>{joke}</p>
        <button onClick={() => handleVote(1)}>Upvote</button>
        <button onClick={() => handleVote(-1)}>Downvote</button>
        {jokeStats && (
        <div>
          <p>Upvotes: {jokeStats.upvotes}</p>
          <p>Downvotes: {jokeStats.downvotes}</p>
        </div>
      )}
      </div>
    </div>
  );
}