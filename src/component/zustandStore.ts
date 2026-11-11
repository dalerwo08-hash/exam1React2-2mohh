import { create } from "zustand";

type Age = {
  id: number;
  age: number;
};

type ZustandState = {
  ages: Age[];
  addAge: (user: Age) => void;
  editAge: (user: Age) => void;
  deleteAge: (id: number) => void;
};

export const useZustand = create<ZustandState>((set) => ({
  ages: [
    { id: 1, age: 22 },
    { id: 2, age: 25 },
    { id: 3, age: 21 },
    { id: 4, age: 24 },
    { id: 5, age: 23 },
    { id: 6, age: 26 },
  ],

  addAge: (user) =>
    set((state) => ({
      ages: [...state.ages, user],
    })),

  editAge: (user) =>
    set((state) => ({
      ages: state.ages.map((item) =>
        item.id === user.id ? user : item
      ),
    })),

  deleteAge: (id) =>
    set((state) => ({
      ages: state.ages.filter((user) => user.id !== id),
    })),
}));