import { create } from "zustand";

type Store = {
  login: boolean;
  token: string;
};

const useStore = create<Store>()((set) => ({
  login: false,
  token: "",
  setLogin: (login: boolean) => set((state) => ({ ...state, login })),
  setToken: (token: string) => set((state) => ({ ...state, token })),
}));

export default useStore;
