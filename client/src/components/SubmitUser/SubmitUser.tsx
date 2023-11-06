import React, { ChangeEvent, useState } from "react";
import socket from "../../socket";
import Avatar1Image from "../../assets/pictures/avatar1.png";

function SubmitUser() {
  const [name, setName] = useState<string>("");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmitName = () => {
    socket.emit("submit_name", name);
    socket.connect();
  };
  return (
    <>
      <p>
        <div style={{ margin: "100px" }}>
          <img
            style={{ width: "189px", height: "189px" }}
            src={Avatar1Image}
            alt="avatar1"
          />
        </div>
      </p>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Enter your name"
      />
      <p></p>
      <button onClick={handleSubmitName}>Submit</button>
    </>
  );
}

export default SubmitUser;
