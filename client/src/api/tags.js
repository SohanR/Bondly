import { BASE_URL } from "../config";

const getTopTags = async (query = {}) => {
  try {
    const res = await fetch(BASE_URL + "api/tags?" + new URLSearchParams(query));
    return await res.json();
  } catch (err) {
    console.log(err);
  }
};

export { getTopTags };
