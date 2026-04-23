import { API_BASE_URL } from '../baseUrl';

export const createPost = async (params, credentials, post) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': credentials.t
    },
    body: JSON.stringify(post)
  };
  const response = await fetch(`${API_BASE_URL}/api/post/${params.userId}`, requestOptions);
  return await response.json();
};

export const getFeed = async (params, credentials, signal) => {
  const requestOptions = {
    method: 'GET',
    signal,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': credentials.t
    }
  };
  const response = await fetch(`${API_BASE_URL}/api/post/feed/${params.userId}`, requestOptions);
  return await response.json();
};

// Add more post-related API functions here as needed
