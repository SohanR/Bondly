import { BASE_URL } from "../config";

const getSpaces = async (query = {}) => {
  try {
    const res = await fetch(BASE_URL + "api/spaces?" + new URLSearchParams(query));
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getTopSpaces = async (query = {}) => {
  try {
    const res = await fetch(
      BASE_URL + "api/spaces/top?" + new URLSearchParams(query)
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const searchSpaces = async (query = {}) => {
  try {
    const res = await fetch(
      BASE_URL + "api/spaces/search?" + new URLSearchParams(query)
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getSpace = async (slug, token) => {
  try {
    const res = await fetch(BASE_URL + "api/spaces/" + slug, {
      headers: {
        "x-access-token": token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const createSpace = async (user, formData) => {
  try {
    const res = await fetch(BASE_URL + "api/spaces", {
      method: "POST",
      headers: {
        "x-access-token": user.token,
      },
      body: formData,
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const updateSpace = async (user, spaceId, formData) => {
  try {
    const res = await fetch(BASE_URL + "api/spaces/" + spaceId, {
      method: "PATCH",
      headers: {
        "x-access-token": user.token,
      },
      body: formData,
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const unpublishSpace = async (user, spaceId) => {
  try {
    const res = await fetch(BASE_URL + "api/spaces/" + spaceId, {
      method: "DELETE",
      headers: {
        "x-access-token": user.token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const followSpace = async (user, spaceId) => {
  try {
    const res = await fetch(BASE_URL + "api/spaces/" + spaceId + "/follow", {
      method: "POST",
      headers: {
        "x-access-token": user.token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const unfollowSpace = async (user, spaceId) => {
  try {
    const res = await fetch(BASE_URL + "api/spaces/" + spaceId + "/follow", {
      method: "DELETE",
      headers: {
        "x-access-token": user.token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const createSpacePost = async (user, spaceId, post) => {
  try {
    const res = await fetch(BASE_URL + "api/spaces/" + spaceId + "/posts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(post),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export {
  getSpaces,
  getTopSpaces,
  searchSpaces,
  getSpace,
  createSpace,
  updateSpace,
  unpublishSpace,
  followSpace,
  unfollowSpace,
  createSpacePost,
};
