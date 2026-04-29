import { API_BASE_URL } from "../baseUrl";

export const createPost = async (params, credentials, post) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: credentials.t,
    },
    body: JSON.stringify(post),
  };
  const response = await fetch(
    `${API_BASE_URL}/api/post/${params.userId}`,
    requestOptions,
  );
  return await response.json();
};

export const getFeed = async (params, credentials, signal) => {
  const requestOptions = {
    method: "GET",
    signal,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: credentials.t,
    },
  };
  const response = await fetch(
    `${API_BASE_URL}/api/post/feed/${params.userId}`,
    requestOptions,
  );
  return await response.json();
};

export const getFeedUser = async (params, credentials, signal) => {
  try {
    const requestOptions = {
      method: "Get",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: credentials.t,
      },
      authorization: credentials.t,
    };

    let response = await fetch(
      "/api/post/feedUser/" + params.userId,
      requestOptions,
    );

    const Data = await response.json();
    return Data;
  } catch (err) {
    return err;
  }
};

export const removePost = async (params, credentials) => {
  try {
    let response = await fetch("/api/post/" + params.postId, {
      method: "DELETE",
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

export const LikePost = async (params, credentials, postId) => {
  try {
    let response = await fetch("/api/post/like", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, postId: postId }),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const UnlikePost = async (params, credentials, postId) => {
  try {
    let response = await fetch("/api/post/unlike", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: credentials.t,
      },
      body: JSON.stringify({ userId: params.userId, postId: postId }),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export const CommentPost = async (params, credentials, postId, comment) => {
  try {
    let response = await fetch("/api/post/comment/", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: credentials.t,
      },
      body: JSON.stringify({
        userId: params.userId,
        postId: postId,
        comment: comment,
      }),
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

// Add more post-related API functions here as needed
