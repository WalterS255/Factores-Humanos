import { apiRequest } from "./api.js";

export const getMyAddresses = () =>
  apiRequest("/api/direcciones", { auth: true });

export const createAddress = (data) =>
  apiRequest("/api/direcciones", { method: "POST", auth: true, body: data });

export const updateAddress = (id, data) =>
  apiRequest(`/api/direcciones/${id}`, { method: "PUT", auth: true, body: data });

export const deleteAddress = (id) =>
  apiRequest(`/api/direcciones/${id}`, { method: "DELETE", auth: true });
