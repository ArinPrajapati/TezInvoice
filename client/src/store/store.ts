import { User } from "@/types/user";
import { create } from "zustand";

type Store = {
  login: boolean;
  path: string;
  loginData: User;
  publicRoute: boolean;
  setLogin: (login: boolean) => void;
  setPath: (path: string) => void;
  setLoginData: (loginData: User) => void;
  setPublicRoute: (publicRoute: boolean) => void;
};

const useStore = create<Store>()((set) => ({
  login: false,
  publicRoute: false,
  path: "",
  loginData: {
    name: "",
    email: "",
    isAdmin: false,
    _id: "",
    serviceName: "",
    password: "",
    isVerified: false,
    accountLevel: "",
    invoicesLimit: 0,
  },
  setPublicRoute: (publicRoute: boolean) =>
    set((state) => ({ ...state, publicRoute })),
  setLoginData: (loginData: User) => set((state) => ({ ...state, loginData })),
  setLogin: (login: boolean) => set((state) => ({ ...state, login })),
  setPath: (path: string) => set((state) => ({ ...state, path })),
}));

export default useStore;
