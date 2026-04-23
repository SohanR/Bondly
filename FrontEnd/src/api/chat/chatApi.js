import { API_BASE_URL } from '../baseUrl';

export const fetchChats = async (params, credentials) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': credentials.t
    }
  };
  const response = await fetch(`${API_BASE_URL}/api/chat/`, requestOptions);
  return await response.json();
};

// Add more chat-related API functions here as needed
