import { api } from "../api";

interface User {
  name: string;
  email: string;
  isAdmin: boolean;
  _id: string;
  serviceName: string;
  password: string;
  isVerified: boolean;
}

interface LoginResponse {
  token: string;
  user: User;
}

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
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
    const response = await api.post<User>("/auth/signup", {
      email,
      password,
      name,
      serviceName,
    });
    if (response.status !== 200) {
      throw new Error("Failed to signup");
    }
    return response.data;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response.data;
  }
}
