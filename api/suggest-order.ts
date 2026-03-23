"use server";

import { instance } from "@/lib/axios";

export const suggestOrder = async () => {
  try {
    const response = await instance.get("/api/v1/inventory/suggest-orders");
    return response.data;
  } catch (error) {
    console.error("Error updating score:", error);
    throw error;
  }
};
