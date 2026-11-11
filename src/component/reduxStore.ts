import { configureStore, createSlice } from "@reduxjs/toolkit";

type Name = {
  id: number;
  name: string;
};

const initialState: Name[] = [
  { id: 1, name: "Ali" },
  { id: 2, name: "Ahmad" },
  { id: 3, name: "Daler" },
  { id: 4, name: "Said" },
  { id: 5, name: "Farid" },
  { id: 6, name: "Islom" },
];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.push(action.payload);
    },

    editUser: (state, action) => {
      const user = state.find((item) => item.id === action.payload.id);

      if (user) {
        user.name = action.payload.name;
      }
    },

    deleteUser: (state, action) => {
      return state.filter((user) => user.id !== action.payload);
    },
  },
});

export const { addUser, editUser, deleteUser } = usersSlice.actions;

export const store = configureStore({
  reducer: {
    users: usersSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;