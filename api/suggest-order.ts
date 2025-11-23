"use server"

import axios from 'axios';

const API_BASE_URL = 'https://uneuphonic-kina-disturbedly.ngrok-free.dev';

export const suggestOrder = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/suggest-orders-smart`);
    return response.data;
  } catch (error) {
    console.error('Error updating score:', error);
    throw error;
  }
};