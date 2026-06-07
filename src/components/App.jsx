import React, { useState, useEffect } from "react";
import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

// App is the single source of truth for the toys array.
// All four CRUD operations (GET, POST, PATCH, DELETE) live here
// so state stays in sync with the backend after every mutation.
function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  // ── 1. GET: fetch all toys on page load ──────────────────────
  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((res) => res.json())
      .then((data) => setToys(data))
      .catch((err) => console.error("Error fetching toys:", err));
  }, []);

  function handleClick() {
    setShowForm((show) => !show);
  }

  // ── 2. POST: add a new toy ───────────────────────────────────
  // Called by ToyForm on submit. POSTs to backend, then adds the
  // server response (which includes the new id) to state.
  function handleAddToy(newToy) {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newToy),
    })
      .then((res) => res.json())
      .then((savedToy) => setToys((prev) => [...prev, savedToy]))
      .catch((err) => console.error("Error adding toy:", err));
  }

  // ── 3. DELETE: donate (remove) a toy ────────────────────────
  // Sends DELETE to backend, then removes the toy from state by id.
  function handleDeleteToy(id) {
    fetch(`http://localhost:3001/toys/${id}`, { method: "DELETE" })
      .then(() => setToys((prev) => prev.filter((toy) => toy.id !== id)))
      .catch((err) => console.error("Error deleting toy:", err));
  }

  // ── 4. PATCH: like a toy ─────────────────────────────────────
  // Increments likes by 1, PATCHes the backend, then updates only
  // that toy in state (preserving array order).
  function handleLikeToy(toy) {
    const updatedLikes = toy.likes + 1;
    fetch(`http://localhost:3001/toys/${toy.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: updatedLikes }),
    })
      .then((res) => res.json())
      .then((updatedToy) =>
        setToys((prev) =>
          prev.map((t) => (t.id === updatedToy.id ? updatedToy : t))
        )
      )
      .catch((err) => console.error("Error liking toy:", err));
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="button-row">
        <button className="add-toy-btn" onClick={handleClick}>
          Add a Toy
        </button>
      </div>
      <ToyContainer
        toys={toys}
        onDeleteToy={handleDeleteToy}
        onLikeToy={handleLikeToy}
      />
    </>
  );
}

export default App;
