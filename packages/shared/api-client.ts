// packages/shared/api-client.ts

import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.REF_API_BASE_URL || 'https://api.ref.finance',
  timeout: 10_000,
});
