import { BASE_URL } from "../config";

const getConversations = async (user) => {
  try {
    if (!user?.token) return [];

    const res = await fetch(BASE_URL + "api/messages", {
      headers: {
        "x-access-token": user.token,
      },
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getMessages = async (user, conversationId) => {
  try {
    if (!user?.token || !conversationId) return [];

    const res = await fetch(BASE_URL + "api/messages/" + conversationId, {
      headers: {
        "x-access-token": user.token,
      },
    });
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.log(err);
    return [];
  }
};

const sendMessage = async (user, message, recipientId) => {
  try {
    if (!user?.token || !recipientId) {
      return { error: "Unable to send message" };
    }

    const res = await fetch(BASE_URL + "api/messages/" + recipientId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": user.token,
      },
      body: JSON.stringify(message),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
    return { error: "Unable to send message" };
  }
};

export { getConversations, getMessages, sendMessage };
