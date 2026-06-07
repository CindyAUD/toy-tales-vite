import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import App from '../components/App';
import '@testing-library/jest-dom';

describe("Liking a Toy", () => {
    it("increments likes when the like button is clicked", async () => {
        let toyCards
        let toyCard
        let likes

        global.setFetchResponse([{
            "id": 1,
            "name": "Woody",
            "image": "http://www.pngmart.com/files/3/Toy-Story-Woody-PNG-Photos.png",
            "likes": 8
        }])

        const app = render(<App />);

        const likeButton = await app.findByText("Like <3")

        global.setFetchResponse({
            "id": 1,
            "name": "Woody",
            "image": "http://www.pngmart.com/files/3/Toy-Story-Woody-PNG-Photos.png",
            "likes": 9
        })

        fireEvent.click(likeButton);

        await app.findByText("9 Likes")
        toyCards = await app.findAllByTestId('toy-card')
        toyCard = toyCards[0]
        likes = parseInt(toyCard.querySelector('p').textContent.split(' ')[0])
        
        expect(likes).toBe(9);

        global.setFetchResponse({
            "id": 1,
            "name": "Woody",
            "image": "http://www.pngmart.com/files/3/Toy-Story-Woody-PNG-Photos.png",
            "likes": 10
        })

        fireEvent.click(likeButton);

        await app.findByText("10 Likes")
        toyCards = await app.findAllByTestId('toy-card')
        toyCard = toyCards[0]
        likes = parseInt(toyCard.querySelector('p').textContent.split(' ')[0])
        
        expect(likes).toBe(10);
    });
});
  