import { api } from "../api";

interface Client {
  name: string;
  email: string;
  address: string;
  phone: string;
  currency: string;
  _id?: string;
  userId: string;
}

type ClientChangeCallback = (clients: Client[]) => void;

export class ClientService {
  private static listeners: ClientChangeCallback[] = [];

  static subscribe(callback: ClientChangeCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private static async notifyListeners() {
    const clients = await this.getClients();
    this.listeners.forEach((callback) => callback(clients));
  }

  static async getClients(): Promise<Client[]> {
    const response = await api.get<Client[]>("/clients");
    return response.data;
  }

  static async createClient(client: Client): Promise<Client> {
    const response = await api.post<Client>("/clients", client);
    await this.notifyListeners();
    return response.data;
  }

  static async deleteClient(clientId: string): Promise<void> {
    await api.delete(`/clients/${clientId}`);
    await this.notifyListeners();
  }
}
