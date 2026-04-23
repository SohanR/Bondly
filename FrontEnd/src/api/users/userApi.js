import { API_BASE_URL } from '../baseUrl';

export const registerUser = async (data) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  const response = await fetch(`${API_BASE_URL}/api/users/register`, requestOptions);
  return await response.json();
};

export const loginUser = async (data) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
  const response = await fetch(`${API_BASE_URL}/api/users/login`, requestOptions);
  return await response.json();
};

// Add more user-related API functions here as needed
