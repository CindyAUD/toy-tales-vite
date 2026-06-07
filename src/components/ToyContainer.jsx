import React from "react";
import ToyCard from "./ToyCard";

// ToyContainer receives the filtered/full toys array from App and
// renders one ToyCard per toy.  All callbacks flow through from App.
function ToyContainer({ toys, onDeleteToy, onLikeToy }) {
  return (
    <div className="toy-collection">
      {toys.map((toy) => (
        <ToyCard
          key={toy.id}
          toy={toy}
          onDeleteToy={onDeleteToy}
          onLikeToy={onLikeToy}
        />
      ))}
    </div>
  );
}

export default ToyContainer;
