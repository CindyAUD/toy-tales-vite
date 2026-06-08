import React from "react";
function ToyCard({ toy, onDeleteToy, onLikeToy }) {
  const { id, name, image, likes } = toy;

  return (
    <div className="card" data-testid="toy-card">
      <h2>{name}</h2>
      <img src={image}  alt={name} className="toy-avatar" />
      <p>{likes} Likes </p>
      <button className="like-btn" onClick={() => onLikeToy(toy)}>
        Like {"<3"}
      </button>
      <button className="donate-btn" onClick={() => onDeleteToy(id)}>
        Donate to Goodwill
      </button>
    </div>
  );
}

export default ToyCard;
