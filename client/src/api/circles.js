import { BASE_URL } from "../config";

const getCircles = async (query = {}) => {
  try {
    const res = await fetch(BASE_URL + "api/circles?" + new URLSearchParams(query));
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getTopCircles = async (query = {}) => {
  try {
    const res = await fetch(BASE_URL + "api/circles/top?" + new URLSearchParams(query));
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const searchCircles = async (query = {}) => {
  try {
    const res = await fetch(BASE_URL + "api/circles/search?" + new URLSearchParams(query));
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const getCircle = async (slug, token) => {
  try {
    const res = await fetch(BASE_URL + "api/circles/" + slug, {
      headers: {
        "x-access-token": token,
      },
    });
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const createCircle = async (user, formData) => {
  try {
    const res = await fetch(BASE_URL + "api/circles", {
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

const updateCircle = async (user, circleId, formData) => {
  try {
    const res = await fetch(BASE_URL + "api/circles/" + circleId, {
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

const joinCircle = async (user, circleId) => {
  try {
    const res = await fetch(BASE_URL + "api/circles/" + circleId + "/join", {
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

const leaveCircle = async (user, circleId) => {
  try {
    const res = await fetch(BASE_URL + "api/circles/" + circleId + "/join", {
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

const approveCircleMember = async (user, circleId, memberId) => {
  try {
    const res = await fetch(
      BASE_URL + "api/circles/" + circleId + "/members/" + memberId + "/approve",
      {
        method: "POST",
        headers: {
          "x-access-token": user.token,
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const rejectCircleMember = async (user, circleId, memberId) => {
  try {
    const res = await fetch(
      BASE_URL + "api/circles/" + circleId + "/members/" + memberId + "/reject",
      {
        method: "POST",
        headers: {
          "x-access-token": user.token,
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const kickCircleMember = async (user, circleId, memberId) => {
  try {
    const res = await fetch(
      BASE_URL + "api/circles/" + circleId + "/members/" + memberId,
      {
        method: "DELETE",
        headers: {
          "x-access-token": user.token,
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const createCirclePost = async (user, circleId, post) => {
  try {
    const res = await fetch(BASE_URL + "api/circles/" + circleId + "/posts", {
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

const approveCirclePost = async (user, circleId, postId) => {
  try {
    const res = await fetch(
      BASE_URL + "api/circles/" + circleId + "/posts/" + postId + "/approve",
      {
        method: "POST",
        headers: {
          "x-access-token": user.token,
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const rejectCirclePost = async (user, circleId, postId) => {
  try {
    const res = await fetch(
      BASE_URL + "api/circles/" + circleId + "/posts/" + postId + "/reject",
      {
        method: "POST",
        headers: {
          "x-access-token": user.token,
        },
      }
    );
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

const helpfulCirclePost = async (user, postId) => {
  try {
    const res = await fetch(BASE_URL + "api/circles/posts/" + postId + "/helpful", {
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

const unhelpfulCirclePost = async (user, postId) => {
  try {
    const res = await fetch(BASE_URL + "api/circles/posts/" + postId + "/helpful", {
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

export {
  getCircles,
  getTopCircles,
  searchCircles,
  getCircle,
  createCircle,
  updateCircle,
  joinCircle,
  leaveCircle,
  approveCircleMember,
  rejectCircleMember,
  kickCircleMember,
  createCirclePost,
  approveCirclePost,
  rejectCirclePost,
  helpfulCirclePost,
  unhelpfulCirclePost,
};
