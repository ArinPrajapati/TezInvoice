import { _500 } from "../helper/error";
import Client from "../models/clients";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const createClient = async (req: Request, res: Response) => {
  try {
    const { userId, name, email, phone, currency } = req.body;
    if (!userId || !name || !email || !phone || !currency) {
      res.status(400).json({ message: "Please fill all the fields" });
      return;
    }
    const newClient = new Client({ userId, name, email, phoneNumber: phone, currency });
    await newClient.save();
    res.status(201).json(newClient);
    return;
  } catch (error) {
    _500("Failed to create client", "The Problem is in db", res);
  }
};

export const getClients = async (req: Request, res: Response) => {
  try {
    const { id } = req.data as jwt.JwtPayload;
    const clients = await Client.find({ userId: id });
    res.status(200).json(clients);
  } catch (error) {
    _500("Failed to get clients", "The Problem is in db", res);
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Please provide client id" });
      return;
    }
    await Client.findByIdAndDelete(id);
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    _500("Failed to delete client", "The Problem is in db", res);
  }
};

