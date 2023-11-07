import React from "react";
import { Link } from "react-router-dom";

const HowToPlay = () => {
  return (
    <div>
      <h1>How to Play DupMe</h1>

      <h2>Rules:</h2>
      <p>- Rule 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <p>
        - Rule 2: Vestibulum tincidunt tortor vel orci consectetur, vel eleifend
        urna dapibus.
      </p>
      {/* Add more rules as needed */}

      <h2>Tips:</h2>
      <p>
        - Tip 1: Integer lobortis purus ut dui convallis, at iaculis dolor
        vulputate.
      </p>
      <p>
        - Tip 2: Morbi vitae lacus vel felis volutpat volutpat nec nec urna.
      </p>
      {/* Add more tips as needed */}

      <h2>Guidelines:</h2>
      <p>- Guideline 1: Sed eu ligula non nisi euismod finibus ut nec neque.</p>
      <p>
        - Guideline 2: Quisque lacinia nulla nec elit euismod, at semper massa
        tempor.
      </p>
      {/* Add more guidelines as needed */}
      <p>
        <Link to="/">
          <button>Back to Home</button>
        </Link>
      </p>
    </div>
  );
};

export default HowToPlay;
