import { useState } from "react";
import { useAtom } from "jotai";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  MenuItem,
} from "@mui/material";

import {
  addUser,
  editUser,
  deleteUser,
} from "./component/reduxStore";

import type {
  RootState,
  AppDispatch,
} from "./component/reduxStore";

import { useZustand } from "./component/zustandStore";
import { profileAtom } from "./component/atoms";

type User = {
  id: number;
  name: string;
  age: number;
  image: string;
  job: string;
  status: string;
};

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux
  const names = useSelector(
    (state: RootState) => state.users
  );

  // Zustand
  const ages = useZustand((state) => state.ages);
  const addAge = useZustand((state) => state.addAge);
  const editAge = useZustand((state) => state.editAge);
  const deleteAge = useZustand((state) => state.deleteAge);

  // Jotai
  const [profiles, setProfiles] = useAtom(profileAtom);

  // Search and Select
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Dialog
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    image: "",
    job: "",
    status: "Active",
  });

  // GET - Join all data by ID
  const users: User[] = names.map((item) => {
    const age = ages.find((user) => user.id === item.id);
    const profile = profiles.find(
      (user) => user.id === item.id
    );

    return {
      id: item.id,
      name: item.name,
      age: age?.age ?? 0,
      image: profile?.image ?? "",
      job: profile?.job ?? "",
      status: profile?.status ?? "Active",
    };
  });

  // Search and Select
  const filteredUsers = users.filter((user) => {
    const searchUser = user.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const statusUser =
      filter === "All" || user.status === filter;

    return searchUser && statusUser;
  });

  // Open Add Dialog
  const handleAdd = () => {
    setEditId(null);

    setForm({
      name: "",
      age: "",
      image: "https://i.pravatar.cc/150?img=12",
      job: "",
      status: "Active",
    });

    setOpen(true);
  };

  // Open Edit Dialog
  const handleEdit = (user: User) => {
    setEditId(user.id);

    setForm({
      name: user.name,
      age: String(user.age),
      image: user.image,
      job: user.job,
      status: user.status,
    });

    setOpen(true);
  };

  // ADD and EDIT
  const handleSave = () => {
    if (!form.name.trim() || !form.age || !form.job.trim()) {
      return;
    }

    const age = Number(form.age);

    if (!Number.isFinite(age) || age <= 0) {
      return;
    }

    if (editId !== null) {
      // Redux
      dispatch(
        editUser({
          id: editId,
          name: form.name,
        })
      );

      // Zustand
      editAge({
        id: editId,
        age,
      });

      // Jotai
      setProfiles((prev) =>
        prev.map((item) =>
          item.id === editId
            ? {
              ...item,
              image: form.image,
              job: form.job,
              status: form.status,
            }
            : item
        )
      );
    } else {
      const id = Date.now();

      // Redux
      dispatch(
        addUser({
          id,
          name: form.name,
        })
      );

      // Zustand
      addAge({
        id,
        age,
      });

      // Jotai
      setProfiles((prev) => [
        ...prev,
        {
          id,
          image: form.image,
          job: form.job,
          status: form.status,
        },
      ]);
    }

    setOpen(false);
  };

  // DELETE from all 3 State Managers
  const handleDelete = (id: number) => {
    // Redux
    dispatch(deleteUser(id));

    // Zustand
    deleteAge(id);

    // Jotai
    setProfiles((prev) =>
      prev.filter((user) => user.id !== id)
    );
  };

  return (
    <Box className="min-h-screen bg-gray-100 p-5 md:p-10">
      <Box className="mx-auto max-w-6xl">

        {/* Header */}
        <Box className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Users
            </Typography>

            <Typography color="text.secondary">
              Total users: {users.length}
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={handleAdd}
          >
            Add User
          </Button>
        </Box>

        {/* Search and Select */}
        <Box className="mb-6 flex flex-wrap gap-3">
          <TextField
            size="small"
            label="Search user"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-52 flex-1 bg-white"
          />

          <TextField
            select
            size="small"
            label="Status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="min-w-40 bg-white"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        </Box>

        {/* Users */}
        <Box className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {filteredUsers.map((user) => (
            <Card key={user.id} elevation={1}>
              <CardContent>

                <Box className="mb-4 flex items-center gap-3">
                  <Avatar
                    src={user.image}
                    alt={user.name}
                    sx={{ width: 65, height: 65 }}
                  />

                  <Box>
                    <Typography fontWeight="bold">
                      {user.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {user.job}
                    </Typography>
                  </Box>
                </Box>

                <Box className="mb-3 space-y-2">
                  <Typography variant="body2">
                    <b>Age:</b> {user.age}
                  </Typography>

                  <Typography variant="body2">
                    <b>ID:</b> {user.id}
                  </Typography>

                  <Chip
                    size="small"
                    label={user.status}
                    color={
                      user.status === "Active"
                        ? "success"
                        : "default"
                    }
                  />
                </Box>

                <Box className="flex gap-2">
                  <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>

                  <Button
                    fullWidth
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </Box>

              </CardContent>
            </Card>
          ))}

        </Box>

        {filteredUsers.length === 0 && (
          <Typography
            className="mt-10 text-center"
            color="text.secondary"
          >
            User not found
          </Typography>
        )}

        {/* Add and Edit Dialog */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editId !== null ? "Edit User" : "Add User"}
          </DialogTitle>

          <DialogContent className="flex flex-col gap-4 pt-4">

            <TextField
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <TextField
              label="Age"
              type="number"
              fullWidth
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />

            <TextField
              label="Image URL"
              fullWidth
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
            />

            <TextField
              label="Job"
              fullWidth
              value={form.job}
              onChange={(e) =>
                setForm({ ...form, job: e.target.value })
              }
            />

            <TextField
              select
              label="Status"
              fullWidth
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>

          </DialogContent>

          <DialogActions className="p-4">
            <Button
              color="inherit"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};

export default App;