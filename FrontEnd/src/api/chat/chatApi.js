import { API_BASE_URL } from "../baseUrl";

export const fetchChats = async (params, credentials) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: credentials.t,
    },
  };
  const response = await fetch(`${API_BASE_URL}/api/chat/`, requestOptions);
  return await response.json();
};

export const setMessage = async (params, credentials, se) => {
  console.log(params);
  try {
    let response = await fetch(`/api/message/`, {
      method: "Post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: credentials.t,
      },
      body: JSON.stringify(params),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getMessage = async (params, credentials, se) => {
  console.log(se);
  try {
    let response = await fetch(`/api/message/${se}`, {
      method: "Get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const getChat = async (params, credentials, se) => {
  try {
    let response = await fetch(`/api/chat/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, id: se }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

// Add more chat-related API functions here as needed
