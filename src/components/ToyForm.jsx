import React, { useState } from "react";

// ToyForm is a controlled form. It calls onAddToy with the new toy
// data (name, image, likes starting at 0) so App can POST it.
function ToyForm({ onAddToy }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Always initialise likes to 0 for a brand-new toy.
    onAddToy({ name, image, likes: 0 });
    setName("");
    setImage("");
  }

  return (
    <div className="container">
      <form className="add-toy-form" onSubmit={handleSubmit}>
        <h3>Create a toy!</h3>
        <input
          type="text"
          name="name"
          placeholder="Enter a toy's name..."
          className="input-text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          name="image"
          placeholder="Enter a toy's image URL..."
          className="input-text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <input type="submit" name="submit" value="Create New Toy" className="submit" />
      </form>
    </div>
  );
}

export default ToyForm;