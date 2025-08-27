import axios from "axios";
import { env } from "@/env";

const BASE_URL = "https://sandboxapi.bitnob.co/api/v1/virtual-cards";
const headers = () => ({ Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` });

export async function registerCardUser(data: any) {
  try {
    const response = await axios.post(`${BASE_URL}/registercarduser`, data, { headers: headers() });
    return response.data;
  } catch (error: any) {
    console.log("Register user error:", error.response?.data || error.message);
    throw error;
  }
}

export async function updateCardUser(userId: string, data: any) {
  const response = await axios.put(`${BASE_URL}/users/${userId}`, data, { headers: headers() });
  return response.data;
}

export async function createVirtualCard(data: any) {
  const response = await axios.post(`${BASE_URL}/create`, data, { headers: headers() });
  return response.data;
}

export async function topupCard(data: any) {
  const response = await axios.post(`${BASE_URL}/topup`, data, { headers: headers() });
  return response.data;
}

export async function getCards() {
  const response = await axios.get(`${BASE_URL}/cards`, { headers: headers() });
  return response.data;
}

export async function getUsers() {
  const response = await axios.get(`${BASE_URL}/users`, { headers: headers() });
  return response.data;
}

export async function getUser(userId: string) {
  const response = await axios.get(`${BASE_URL}/users/${userId}`, { headers: headers() });
  return response.data;
}

export async function getCard(cardId: string) {
  const response = await axios.get(`${BASE_URL}/cards/${cardId}`, { headers: headers() });
  return response.data;
}

export async function getCardTransactions(cardId: string) {
  const response = await axios.get(`${BASE_URL}/cards/${cardId}/transactions`, { headers: headers() });
  return response.data;
}

export async function getAllTransactions() {
  const response = await axios.get(`${BASE_URL}/cards/transactions`, { headers: headers() });
  return response.data;
}

export async function withdrawFromCard(data: any) {
  const response = await axios.post(`${BASE_URL}/withdraw`, data, { headers: headers() });
  return response.data;
}

export async function freezeCard(data: any) {
  const response = await axios.post(`${BASE_URL}/freeze`, data, { headers: headers() });
  return response.data;
}

export async function unfreezeCard(data: any) {
  const response = await axios.post(`${BASE_URL}/unfreeze`, data, { headers: headers() });
  return response.data;
}

export async function mockTransaction(data: any) {
  const response = await axios.post(`${BASE_URL}/mock-transaction`, data, { headers: headers() });
  return response.data;
}

export async function terminateCard(data: any) {
  const response = await axios.post(`${BASE_URL}/terminate`, data, { headers: headers() });
  return response.data;
}

export async function enableAirlines(data: any) {
  const response = await axios.put(`${BASE_URL}/enable-airlines`, data, { headers: headers() });
  return response.data;
}