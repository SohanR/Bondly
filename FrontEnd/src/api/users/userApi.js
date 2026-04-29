import { API_BASE_URL } from "../baseUrl";

export const registerUser = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  const response = await fetch(
    `${API_BASE_URL}/api/users/register`,
    requestOptions,
  );
  return await response.json();
};

export const loginUser = async (data) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  const response = await fetch(
    `${API_BASE_URL}/api/users/login`,
    requestOptions,
  );
  return await response.json();
};

export const findPeoplee = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/users/findpeople/" + params.userId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: credentials.t,
        signal: signal,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const searchuser = async (params, credentials, se) => {
  console.log(se);
  try {
    let response = await fetch(`/api/users/?search=${se.search}`, {
      method: "GET",
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

export const followUser = async (params, credentials, followId) => {
  console.log("fl");

  try {
    let response = await fetch("/api/users/follow/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, followId: followId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const unfollowUser = async (params, credentials, unfollowId) => {
  console.log("unfl");

  try {
    let response = await fetch("/api/users/unfollow/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, unfollowId: unfollowId }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
// Add more user-related API functions here as needed
