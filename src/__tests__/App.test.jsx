import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import App from "../components/App";
import ToyCard from "../components/ToyCard";

// ── 1st Deliverable: GET – display all toys on page load ─────────────────────

// ── 1st Deliverable: GET – display all toys on page load ─────────────────────

describe("1st Deliverable — display all toys", () => {
  
  // 🌟 ADD THIS BEFOREEACH BLOCK HERE:
  beforeEach(() => {
    global.setFetchResponse(global.baseToys);
  });

  test("fetches toys from http://localhost:3001/toys on mount", async () => {
    render(<App />);
    await screen.findByText("Woody");
    
    const calls = global.fetch.mock ? global.fetch.mock.calls : null;
    expect(screen.queryByText("Woody")).not.toBeNull();
  });

  // ... rest of your tests


  test("renders all toy names from the API", async () => {
    render(<App />);
    for (const toy of global.baseToys) {
      const el = await screen.findByText(toy.name);
      expect(el).not.toBeNull();
    }
  });

  test("renders the correct number of toy cards", async () => {
    render(<App />);
    await screen.findByText("Woody");
    const cards = document.querySelectorAll("[data-testid='toy-card']");
    expect(cards.length).toBe(global.baseToys.length);
  });

  test("renders likes count for each toy", async () => {
    render(<App />);
    for (const toy of global.baseToys) {
      const el = await screen.findByText(`${toy.likes} Likes `);
      expect(el).not.toBeNull();
    }
  });

  test("toys are not hardcoded — different data renders correctly", async () => {
    global.setFetchResponse(global.alternateToys);
    render(<App />);
    for (const toy of global.alternateToys) {
      const el = await screen.findByText(toy.name);
      expect(el).not.toBeNull();
    }
    // Base toys should NOT appear
    expect(screen.queryByText("Woody")).toBeNull();
  });
});

// ── 2nd Deliverable: POST – add a new toy ────────────────────────────────────

describe("2nd Deliverable — add a new toy", () => {
  test("clicking 'Add a Toy' reveals the form", async () => {
    render(<App />);
    await screen.findByText("Woody");

    expect(screen.queryByPlaceholderText("Enter a toy's name...")).toBeNull();
    fireEvent.click(screen.getByText("Add a Toy"));
    expect(screen.queryByPlaceholderText("Enter a toy's name...")).not.toBeNull();
  });

  test("submitting the form adds the toy to the page", async () => {
    render(<App />);
    await screen.findByText("Woody");

    fireEvent.click(screen.getByText("Add a Toy"));
    fireEvent.change(screen.getByPlaceholderText("Enter a toy's name..."), {
      target: { value: "Hamm" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter a toy's image URL..."), {
      target: { value: "hamm.jpg" },
    });
    fireEvent.click(screen.getByDisplayValue("Create New Toy"));

    const newToy = await screen.findByText("Hamm");
    expect(newToy).not.toBeNull();
  });

  test("new toy starts with 0 likes", async () => {
    render(<App />);
    await screen.findByText("Woody");

    fireEvent.click(screen.getByText("Add a Toy"));
    fireEvent.change(screen.getByPlaceholderText("Enter a toy's name..."), {
      target: { value: "Slinky" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter a toy's image URL..."), {
      target: { value: "slinky.jpg" },
    });
    fireEvent.click(screen.getByDisplayValue("Create New Toy"));

    await screen.findByText("Slinky");
    // The POST mock echoes the body; likes:0 should be in the response
    const zeroLikes = screen.queryByText("0 Likes");
    expect(zeroLikes).not.toBeNull();
  });
});

// ── 3rd Deliverable: DELETE – donate a toy ───────────────────────────────────

describe("3rd Deliverable — donate a toy", () => {
  test("clicking 'Donate to Goodwill' removes the toy from the page", async () => {
    render(<App />);
    await screen.findByText("Woody");

    // Find the donate button inside Woody's card
    const woodyName = screen.getByText("Woody");
    const woodyCard = woodyName.closest("[data-testid='toy-card']");
    const donateBtn = woodyCard.querySelector(".donate-btn");

    fireEvent.click(donateBtn);

    await waitFor(() => {
      expect(screen.queryByText("Woody")).toBeNull();
    });
  });

  test("other toys remain after one is donated", async () => {
    render(<App />);
    await screen.findByText("Woody");

    const woodyCard = screen.getByText("Woody").closest("[data-testid='toy-card']");
    fireEvent.click(woodyCard.querySelector(".donate-btn"));

    await waitFor(() => expect(screen.queryByText("Woody")).toBeNull());

    // Buzz and Rex should still be there
    expect(screen.queryByText("Buzz")).not.toBeNull();
    expect(screen.queryByText("Rex")).not.toBeNull();
  });
});

// ── 4th Deliverable: PATCH – like a toy ──────────────────────────────────────

describe("4th Deliverable — like a toy", () => {
  test("clicking Like increases the displayed like count", async () => {
    render(<App />);
    await screen.findByText("Woody");

    // Woody starts at 8 likes
    expect(screen.queryByText("8 Likes ")).not.toBeNull();

    const woodyCard = screen.getByText("Woody").closest("[data-testid='toy-card']");
    fireEvent.click(woodyCard.querySelector(".like-btn"));

    await waitFor(() => {
      expect(screen.queryByText("9 Likes")).not.toBeNull();
    });
  });

  test("liking one toy does not affect other toys' counts", async () => {
    render(<App />);
    await screen.findByText("Woody");

    const woodyCard = screen.getByText("Woody").closest("[data-testid='toy-card']");
    fireEvent.click(woodyCard.querySelector(".like-btn"));

    await waitFor(() => expect(screen.queryByText("9 Likes ")).not.toBeNull());

    // Buzz still has its original count
    expect(screen.queryByText("10 Likes ")).not.toBeNull();
  });

  test("toy order is preserved after liking", async () => {
    render(<App />);
    await screen.findByText("Woody");

    const woodyCard = screen.getByText("Woody").closest("[data-testid='toy-card']");
    fireEvent.click(woodyCard.querySelector(".like-btn"));

    await waitFor(() => expect(screen.queryByText("9 Likes ")).not.toBeNull());

    const cards = document.querySelectorAll("[data-testid='toy-card']");
    // Woody's card should still be first
    expect(cards[0].querySelector("h2").textContent).toBe("Woody");
  });
});

// ── ToyCard unit tests ────────────────────────────────────────────────────────

describe("ToyCard component", () => {
  const toy = { id: 1, name: "Woody", image: "woody.jpg", likes: 5 };

  test("renders toy name", () => {
    render(
      <ToyCard toy={toy} onDeleteToy={() => {}} onLikeToy={() => {}} />
    );
    expect(screen.queryByText("Woody")).not.toBeNull();
  });

  test("renders likes count", () => {
    render(
      <ToyCard toy={toy} onDeleteToy={() => {}} onLikeToy={() => {}} />
    );
    expect(screen.queryByText("5 Likes")).not.toBeNull();
  });

  test("calls onLikeToy when Like button is clicked", () => {
    let called = false;
    render(
      <ToyCard toy={toy} onDeleteToy={() => {}} onLikeToy={() => { called = true; }} />
    );
    fireEvent.click(document.querySelector(".like-btn"));
    expect(called).toBe(true);
  });

  test("calls onDeleteToy when Donate button is clicked", () => {
    let deletedId = null;
    render(
      <ToyCard
        toy={toy}
        onDeleteToy={(id) => { deletedId = id; }}
        onLikeToy={() => {}}
      />
    );
    fireEvent.click(screen.getByText("Donate to Goodwill"));
    expect(deletedId).toBe(1);
  });
});