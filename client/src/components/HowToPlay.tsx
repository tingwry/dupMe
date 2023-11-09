import React from "react";
import { Link } from "react-router-dom";

const HowToPlay = () => {
  return (
    <div>
      <h1>How to Play DupMe</h1>
      <p>
        "DupMe is a two-player game where players take turns creating and
        following piano patterns.
      </p>
      <p> Players earn points for correctly mimicking each pattern. </p>

      <h2>Rules:</h2>
      <p>- The first player has 10 seconds to create a pattern on piano.</p>
      <p>- Next, the second player has 20 seconds to follow the pattern.</p>
      <p>- Then, the second player will start the next turn.</p>
      <p>- The game will end after 2 rounds.</p>

      <h2>Scoring:</h2>
      <p>- Scores are increased based on the continous right steps.</p>
      <p>- The right step has to be the right button and the right order.</p>
      <p>- The one with the higher score is the winner!</p>
      <p>
        <Link to="/">
          <button>Back to Home</button>
        </Link>
      </p>
    </div>
  );
};

export default HowToPlay;
