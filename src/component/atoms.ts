import { atom } from "jotai";

export type Profile = {
  id: number;
  image: string;
  job: string;
  status: string;
};

export const profileAtom = atom<Profile[]>([
  {
    id: 1,
    image: "https://i.pravatar.cc/150?img=12",
    job: "Developer",
    status: "Active",
  },
  {
    id: 2,
    image: "https://i.pravatar.cc/150?img=13",
    job: "Designer",
    status: "Inactive",
  },
  {
    id: 3,
    image: "https://i.pravatar.cc/150?img=14",
    job: "Teacher",
    status: "Active",
  },
  {
    id: 4,
    image: "https://i.pravatar.cc/150?img=15",
    job: "Manager",
    status: "Active",
  },
  {
    id: 5,
    image: "https://i.pravatar.cc/150?img=16",
    job: "Frontend",
    status: "Inactive",
  },
  {
    id: 6,
    image: "https://i.pravatar.cc/150?img=17",
    job: "Backend",
    status: "Active",
  },
]);