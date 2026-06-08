import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import App from '../components/App';
import '@testing-library/jest-dom';

describe("Deleting a Toy", () => {
    it("removes the toy when donate button is clicked", async () => {
        global.setFetchResponse(global.baseToys)
        const {findByText, getAllByText } = render(<App />);
    
        const woody = await findByText("Woody")
        expect(woody).toBeInTheDocument();

        const donateButton = getAllByText(/Donate to GoodWill/i)[0];
        fireEvent.click(donateButton);

        await waitFor(() => {
          expect(screen.queryByText("Woody")).toBeNull();
        });
    });
});
  