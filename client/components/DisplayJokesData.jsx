import React from "react";

export default function DsiplayJokesData({ joke }) {
  // checking to see if there is joke data
  // if there is no data then return null
  if (!joke) {
    return null;
  }
  return (
    <div className="joke-data-container">
      <div className="joke-data-content">
        <h3>Joke</h3>
        <p>{joke}</p>
      </div>
    </div>
  );
}

// export default DsiplayJokesData;