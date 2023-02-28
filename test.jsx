import React, { useState } from "react";

const test = () => {
  const [check, setCheck] = useState(false);

  return (
    <div onClick={setCheck(!check)}>
      check ? <img src="assets/images/Checkbox.png" alt="" /> :
      <img src="assets/images/Checkbox.png" alt="" /></div>
  );
};

export default test;
