import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

afterEach(() => cleanup());

global.baseToys = [
  { id: 1, name: "Woody",  image: "http://localhost/woody.jpg",  likes: 8 },
  { id: 2, name: "Buzz",   image: "http://localhost/buzz.jpg",   likes: 10 },
  { id: 3, name: "Rex",    image: "http://localhost/rex.jpg",    likes: 3  },
];

global.alternateToys = [
  { id: 4, name: "Slinky", image: "http://localhost/slinky.jpg", likes: 0 },
  { id: 5, name: "Hamm",   image: "http://localhost/hamm.jpg",   likes: 7 },
];

global.setFetchResponse = (toys = global.baseToys) => {
  const toysArray = Array.isArray(toys) ? toys : [toys];

  const fetchImpl = (url, options = {}) => {
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
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: Date.now(), ...body }),
      });
    }
    if (method === "PATCH") {
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
  };

  global.fetch = jest.fn(fetchImpl);
};

beforeEach(() => global.setFetchResponse());