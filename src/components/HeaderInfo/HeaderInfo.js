import React from "react";
import "./HeaderInfo.css";

function HeaderInfo({ title, subtitle }) {
  return (
    <div className="headerInfo">
      <h3>{title}</h3>
      <h4>{subtitle}</h4>
    </div>
  );
}

export default HeaderInfo;
