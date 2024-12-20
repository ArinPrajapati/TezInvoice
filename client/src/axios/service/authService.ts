import { api } from "../api";

interface User {
  name: string;
  email: string;
  isAdmin: boolean;
  _id: string;
  serviceName: string;
  password: string;
  isVerified: boolean;
  accountLevel: string;
  invoicesLimit: number;
}

interface LoginResponse {
  token: string;
  user: User;
}

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    console.log("login");
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("authToken", response.data.token);

    return response.data;
  }

  static async signup(
    email: string,
    password: string,
    name: string,
    serviceName: string
  ): Promise<User> {
    console.log("signup");
    const response = await api.post<User>("/auth/signup", {
      email,
      password,
      name,
      serviceName,
    });

    return response.data;
  }

  static async getCurrentUser(): Promise<User> {
    "getCurrentUser";
    const response = await api.get<User>("/auth/user");
    return response.data;
  }
}
