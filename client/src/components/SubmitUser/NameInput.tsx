import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import socket from "../../socket";
import { AvatarGenerator } from "random-avatar-generator";

function NameInput({ avatar }: { avatar: string }) {
  const [name, setName] = useState<string>("");

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmitName = () => {
    
    socket.emit("submit_name", { name: name, avatar: avatar });
    socket.connect();
  };
  return (
    <>
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

export default NameInput;
