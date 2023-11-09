import React, { useEffect, useState } from "react";
import socket from "../../socket";
import "./Player.css";

import smile from "../../assets/pictures/smile.png";
import smirk from "../../assets/pictures/smirk.png";
import blah from "../../assets/pictures/blah.png";
import angry from "../../assets/pictures/angry.png";
import clown from "../../assets/pictures/clown.png";
import aunji from "../../assets/pictures/aunji.png";
import blank from "../../assets/pictures/blank.png";

function Opponent() {
  const [name, setName] = useState<string>();
  const [avatar, setAvatar] = useState<string>();
  const [score, setScore] = useState(0);

  const [oppoentReaction, settOpponenReaction] = useState<string>(blank);

  useEffect(() => {
    socket.on("opponent", (data) => {
      setName(data.name);
      setAvatar(data.avatar);
      setScore(data.score);
    });

    socket.on("receive_reaction", (data) => {
      settOpponenReaction(data.reaction);
      console.log(data.reaction);
    });
  }, [socket]);

  return (
    <>
      <h3>Opponent</h3>
      <img className="avatar" src={avatar} alt="Opponent" />
      <div className="name">{name}</div>
      <div>current score: {score}</div>
      <div className="reaction-bubble">
        <img src={`${oppoentReaction}`} style={{ width: 25, height: 25 }} />
      </div>
    </>
  );
}

export default Opponent;
