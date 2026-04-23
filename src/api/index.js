import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});


// GET /api/validate?email=&account=
export const validateUser = (email, account) =>
  api.get('/api/validate', { params: { email, account } });

// GET /api/rules?email=&account=
export const fetchRules = (email, account) =>
  api.get('/api/rules', { params: { email, account } });

// POST /api/rules?email=&account=
export const saveRules = (email, account, rules) =>
  api.post('/api/rules', rules, { params: { email, account } });

// GET /api/status?email=&account=
export const fetchStatus = (email, account) =>
  api.get('/api/status', { params: { email, account } });

// POST /api/register  ← called after payment to create user in DB
export const registerUser = (email, accountNumber, plan, paymentRef) =>
  api.post('/api/register', { email, accountNumber, plan, paymentRef });

export default api;
