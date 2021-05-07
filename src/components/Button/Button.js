import React from "react";
import "./Button.css";

function Button({ type, text, onClick, disabled }) {
  return (
    <button
      className="button"
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default Button;
