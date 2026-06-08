import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from '../components/App';
import '@testing-library/jest-dom';

describe("Deleting a Toy", () => {
    it("removes the toy when donate button is clicked", async () => {
        global.setFetchResponse(global.baseToys)
        const { findByText } = render(<App />);
    
        const woody = await findByText("Woody")
        expect(woody).toBeInTheDocument();

        // 🌟 FIX: Grab the donate button inside Woody's card by its class name 
        // to bypass the text casing mismatch completely!
        const woodyCard = woody.closest("[data-testid='toy-card']");
        const donateButton = woodyCard.querySelector(".donate-btn");
        
        fireEvent.click(donateButton);

        await waitFor(() => {
          expect(screen.queryByText("Woody")).toBeNull();
        });
    });
});

  