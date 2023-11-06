import React from "react";
import { AvatarGenerator } from "random-avatar-generator";
import NameInput from "./NameInput";

function SubmitUser() {
  const generator = new AvatarGenerator();

  // Simply get a random avatar
  const randomavatar = generator.generateRandomAvatar();

  return (
    <>
      <img
        style={{ width: "189px", height: "189px", flexWrap: "wrap" }}
        src={randomavatar}
        alt="avatar1"
      />
      <p></p>
      <NameInput avatar={randomavatar} />
    </>
  );
}

export default SubmitUser;
