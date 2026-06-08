import React from "react";

// ToyCard displays a single toy's details and provides two action buttons:
//   • Like   → calls onLikeToy (PATCH)
//   • Donate → calls onDeleteToy (DELETE)
// data-testid="toy-card" is added so test queries can target each card.
function ToyCard({ toy, onDeleteToy, onLikeToy }) {
  const { id, name, image, likes } = toy;

  return (
    <div className="card" data-testid="toy-card">
      <h2>{name}</h2>
      <img src={image} alt={name} className="toy-avatar" />
      <p>{likes} Likes</p>
      <button className="like-btn" onClick={() => onLikeToy(toy)}>
        Like {"<3"}
      </button>
      <button className="donate-btn" onClick={() => onDeleteToy(id)}>
  Donate to GoodWill
</button>
    </div>
  );
}

export default ToyCard;
