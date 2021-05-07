import React from "react";
import "./Card.css";
// import image from './peakstudio.jpg';

function Card({ image, id, heading, subHeading, onClickDetail}) {
  const handleCardRemove = (event) => {
    event.stopPropagation();
  }
  return (
    <div className="card" onClick={() => onClickDetail && onClickDetail(id)}>
      <div className="image">
        <img src={image} alt={heading} />
      </div>
      <p className="exit" onClick={handleCardRemove}>X</p>
      <div className="content">
        <p>{heading}</p>
        <p>{subHeading}</p>
      </div>
    </div>
  );
}

export default Card;

