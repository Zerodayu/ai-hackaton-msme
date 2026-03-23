"use server";

import { instance } from "@/lib/axios";

export const updateScore = async () => {
  try {
    const response = await instance.post("/api/v1/suppliers/update-scores");
    return response.data;
  } catch (error) {
    console.error("Error updating score:", error);
    throw error;
  }
};
