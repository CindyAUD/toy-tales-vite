import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import App from '../components/App';
import '@testing-library/jest-dom';

describe("ToyForm Submission", () => {
  it("submits a new toy and displays it", async () => {
    global.setFetchResponse(global.baseToys)
    const { findByText, getByPlaceholderText, getByText } = render(<App />);
    await findByText("Woody");
    const firstToy = {name: "First Toy", image: "new-toy.jpg", id: "3810fqhrquhf9fnqnc0"}
    global.setFetchResponse({...firstToy})
    fireEvent.click(getByText("Add a Toy"));

    fireEvent.change(getByPlaceholderText("Enter a toy's name..."), {
      target: { value: firstToy.name},
    });
    fireEvent.change(getByPlaceholderText("Enter a toy's image URL..."), {
      target: { value: firstToy.image },
    });

    fireEvent.click(getByText("Create New Toy"));

    const newToy = await findByText(firstToy.name)
    expect(newToy).toBeInTheDocument();
  });
});
