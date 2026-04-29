import React from "react";
import auth from "./../auth/auth-help";
import jwt1 from "jwt-decode"; // import dependency

const Follow = (props) => {
  return (
    <>
      <div>{props.user.name}</div>
      <button onClick={clickFollow}>follow</button>
    </>
  );
};

export default Follow;
