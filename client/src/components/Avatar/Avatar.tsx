import React from "react";
import { AvatarGenerator } from "random-avatar-generator";

function Avatar() {
  const generator = new AvatarGenerator();

  // Simply get a random avatar
  const randomavatar = generator.generateRandomAvatar();

  // Optionally specify a seed for the avatar. e.g. for always getting the same avatar for a user id.
  // With seed 'avatar', always returns https://avataaars.io/?accessoriesType=Kurt&avatarStyle=Circle&clotheColor=Blue01&clotheType=Hoodie&eyeType=EyeRoll&eyebrowType=RaisedExcitedNatural&facialHairColor=Blonde&facialHairType=BeardMagestic&hairColor=Black&hatColor=White&mouthType=Sad&skinColor=Yellow&topType=ShortHairShortWaved
  const avatarp1 = generator.generateRandomAvatar("randomavatar");

  return (
    <>
      <div>
        <img
          style={{ width: "189px", height: "189px", flexWrap: "wrap" }}
          src={avatarp1}
          alt="avatar1"
        />
      </div>
    </>
  );
}

export default Avatar;
