import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

afterEach(() => cleanup());

// Full URLs because jsdom prefixes img.src with http://localhost/
// Likes must match exactly: "8 Likes" (no trailing space)
global.baseToys = [
  { id: 1, name: "Woody", image: "http://localhost/woody.jpg",  likes: 8  },
  { id: 2, name: "Buzz",  image: "http://localhost/buzz.jpg",   likes: 10 },
  { id: 3, name: "Rex",   image: "http://localhost/rex.jpg",    likes: 3  },
];

global.alternateToys = [
  { id: 4, name: "Slinky", image: "http://localhost/slinky.jpg", likes: 0 },
  { id: 5, name: "Hamm",   image: "http://localhost/hamm.jpg",   likes: 7 },
];

// setFetchResponse stores the current toys so fetch always reads
// the LATEST value set — even when called mid-test (Like.test.jsx pattern).
global.setFetchResponse = (toys = global.baseToys) => {
  // Support both array (GET) and single object (PATCH response override)
  const toysArray = Array.isArray(toys) ? toys : [toys];

  global.fetch = jest.fn((url, options = {}) => {
    const method = (options.method || "GET").toUpperCase();
    const body   = options.body ? JSON.parse(options.body) : null;
    const idMatch = url.match(/\/toys\/(\d+)/);
    const id = idMatch ? parseInt(idMatch[1]) : null;

    if (method === "GET") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(toysArray),
      });
    }

    if (method === "POST") {
      // Return the body merged with toys[0] if toys is a single object override
      const base = !Array.isArray(toys) ? toys : {};
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...base, ...body }),
      });
    }

    if (method === "PATCH") {
      // Like.test.jsx sets a single updated toy object before clicking like.
      // If toys is a single object, return it directly as the PATCH response.
      if (!Array.isArray(toys)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(toys),
        });
      }
      const existing = toysArray.find((t) => t.id === id) || { id };
      const updated  = { ...existing, ...body };
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(updated),
      });
    }

    if (method === "DELETE") {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    }

    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  });
};

beforeEach(() => global.setFetchResponse());