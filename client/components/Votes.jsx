import React, { useState, useEffect } from 'react';

export default function VotesList() {
  // the weather category pivotted into this instead. 
  // will come back to work on this more to make it searchable and presentable
  // goal is to dispaly the list of what a user (got from users table) voted for. and the information is joined at the joke_votes table.
  // states
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVotes = async () => {
      setLoading(true);
      setError(null);
      try {
        // console.log("Fetching Votes"); 
        const response = await fetch('http://localhost:5000/votes');
        if (!response.ok) {
          throw new Error('Failed to fetch votes');
        }
        const data = await response.json();
        // console.log('Votes:', data); 
        setVotes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchVotes();
  }, []);

  if (loading) return <p>Loading votes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>User Votes</h2>
      <ul>
        {/* display their votes */}
        {votes.map((vote, index) => (
          <li key={index}>
            {/* display counter for how many votes were upvoted or downvoted */}
            {vote.user_name} voted {vote.vote === 1 ? 'up' : 'down'} for "{vote.joke_text}"
          </li>
        ))}
      </ul>
    </div>
  );
}