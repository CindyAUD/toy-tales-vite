import React from 'react';
import { render } from '@testing-library/react';
import App from '../components/App';
import '@testing-library/jest-dom';

describe('1st Deliverable', () => {
  test('Displays all toys on startup', async () => {
    global.setFetchResponse(global.baseToys)
    let { findAllByTestId } = render(<App />);
    const toyCards = await findAllByTestId('toy-card');
    expect(toyCards).toHaveLength(global.baseToys.length);

    const toyNames = toyCards.map((toyCard) => toyCard.querySelector('h2').textContent);
    const baseToyNames = global.baseToys.map((toy) => toy.name);
    expect(toyNames).toEqual(baseToyNames);

    const toyImages = toyCards.map((toyCard) => toyCard.querySelector('img').src);
    const baseToyImages = global.baseToys.map((toy) => toy.image);
    expect(toyImages).toEqual(baseToyImages);

    const toyLikes = toyCards.map((toyCard) => toyCard.querySelector('p').textContent);
    const baseToyLikes = global.baseToys.map((toy) => toy.likes.toString() + " Likes");
    expect(toyLikes).toEqual(baseToyLikes);
  });

  test('Toys aren\'t hardcoded', async () => {
    global.setFetchResponse(global.alternateToys)
    let { findAllByTestId } = render(<App />);
    const toyCards = await findAllByTestId('toy-card');
    expect(toyCards).toHaveLength(global.alternateToys.length);

    const toyNames = toyCards.map((toyCard) => toyCard.querySelector('h2').textContent);
    const baseToyNames = global.alternateToys.map((toy) => toy.name);
    expect(toyNames).toEqual(baseToyNames);

    const toyImages = toyCards.map((toyCard) => toyCard.querySelector('img').src);
    const baseToyImages = global.alternateToys.map((toy) => toy.image);
    expect(toyImages).toEqual(baseToyImages);

    const toyLikes = toyCards.map((toyCard) => toyCard.querySelector('p').textContent);
    const baseToyLikes = global.alternateToys.map((toy) => toy.likes.toString() + " Likes");
    expect(toyLikes).toEqual(baseToyLikes);
  });
})