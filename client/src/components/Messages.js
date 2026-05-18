import {
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { MdArrowBack, MdForum } from "react-icons/md";
import { Link } from "react-router-dom";
import { getMessages, sendMessage } from "../api/messages";
import { isLoggedIn } from "../helpers/authHelper";
import { socket } from "../helpers/socketHelper";
import Loading from "./Loading";
import Message from "./Message";
import SendMessage from "./SendMessage";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";

const Messages = (props) => {
  const messagesEndRef = useRef(null);
  const user = isLoggedIn();
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);

  const conversationsRef = useRef(props.conversations);
  const conservantRef = useRef(props.conservant);
  const messagesRef = useRef(messages);
  useEffect(() => {
    conversationsRef.current = props.conversations;
    conservantRef.current = props.conservant;
    messagesRef.current = messages;
  });

  const conversation =
    Array.isArray(props.conversations) &&
    props.conservant &&
    props.getConversation(props.conversations, props.conservant._id);

  const setDirection = (messages) => {
    const messageList = Array.isArray(messages) ? messages : [];

    messageList.forEach((message) => {
      if (message.sender?._id === user.userId) {
        message.direction = "from";
      } else {
        message.direction = "to";
      }
    });
  };

  const fetchMessages = async () => {
    if (conversation) {
      if (conversation.new) {
        setLoading(false);
        setMessages(Array.isArray(conversation.messages) ? conversation.messages : []);
        return;
      }

      setLoading(true);

      const data = await getMessages(user, conversation._id);

      const messageList = Array.isArray(data) ? data : [];
      setDirection(messageList);
      setMessages(messageList);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [props.conservant]);

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const handleSendMessage = async (content) => {
    const newMessage = { direction: "from", content };
    const currentMessages = Array.isArray(messages) ? messages : [];
    const newMessages = [newMessage, ...currentMessages];

    if (conversation.new) {
      conversation.messages = [
        ...(Array.isArray(conversation.messages) ? conversation.messages : []),
        newMessage,
      ];
    }

    const conversationList = Array.isArray(props.conversations)
      ? props.conversations
      : [];

    let newConversations = conversationList.filter(
      (conversationCompare) => conversation._id !== conversationCompare._id
    );

    newConversations.unshift(conversation);

    props.setConversations(newConversations);

    setMessages(newMessages);

    await sendMessage(user, newMessage, conversation.recipient._id);

    socket.emit(
      "send-message",
      conversation.recipient._id,
      user.username,
      content
    );
  };

  const handleReceiveMessage = (senderId, username, content) => {
    const newMessage = { direction: "to", content };

    const conversation = props.getConversation(
      conversationsRef.current,
      senderId
    );

    console.log(username + " " + content);

    if (conversation) {
      let newMessages = [newMessage];
      if (Array.isArray(messagesRef.current)) {
        newMessages = [...newMessages, ...messagesRef.current];
      }

      setMessages(newMessages);

      if (conversation.new) {
        conversation.messages = newMessages;
      }
      conversation.lastMessageAt = Date.now();

      const conversationList = Array.isArray(conversationsRef.current)
        ? conversationsRef.current
        : [];

      let newConversations = conversationList.filter(
        (conversationCompare) => conversation._id !== conversationCompare._id
      );

      newConversations.unshift(conversation);

      props.setConversations(newConversations);
    } else {
      const newConversation = {
        _id: senderId,
        recipient: { _id: senderId, username },
        new: true,
        messages: [newMessage],
        lastMessageAt: Date.now(),
      };
      const conversationList = Array.isArray(conversationsRef.current)
        ? conversationsRef.current
        : [];
      props.setConversations([newConversation, ...conversationList]);
    }

    scrollToBottom();
  };

  useEffect(() => {
    socket.on("receive-message", handleReceiveMessage);
  }, []);

  return props.conservant ? (
    <>
      {messages && conversation && !loading ? (
        <>
          <HorizontalStack alignItems="center" spacing={1.25} sx={{ p: 2 }}>
            {props.mobile && (
              <IconButton
                onClick={() => props.setConservant(null)}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "grey.100",
                }}
              >
                <MdArrowBack />
              </IconButton>
            )}
            <UserAvatar
              username={props.conservant.username}
              height={42}
              width={42}
            />
            <Box>
              <Typography
                component={Link}
                to={"/users/" + props.conservant.username}
                sx={{
                  color: "text.primary",
                  textDecoration: "none",
                  fontWeight: 900,
                  "&:hover": { color: "primary.main" },
                }}
              >
                {props.conservant.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Private conversation
              </Typography>
            </Box>
          </HorizontalStack>
          <Box
            sx={{
              height: "calc(100vh - 274px)",
              background:
                "linear-gradient(180deg, rgba(25, 118, 210, 0.04), rgba(15, 23, 42, 0.02))",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ height: "100%" }}>
              <Stack
                sx={{ p: 2, overflowY: "auto", maxHeight: "100%" }}
                direction="column-reverse"
              >
                <div ref={messagesEndRef} />
                {messages.map((message, i) => (
                  <Message
                    conservant={props.conservant}
                    message={message}
                    key={i}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
          <SendMessage onSendMessage={handleSendMessage} />
          {scrollToBottom()}
        </>
      ) : (
        <Stack sx={{ height: "100%" }} justifyContent="center">
          <Loading />
        </Stack>
      )}
    </>
  ) : (
    <Stack
      sx={{ height: "100%", p: 3 }}
      justifyContent="center"
      alignItems="center"
      spacing={2}
      textAlign="center"
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
          backgroundColor: "rgba(25, 118, 210, 0.08)",
          fontSize: 36,
        }}
      >
        <MdForum />
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 900 }}>
        DevSpace Messenger
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 360 }}>
        Privately message other users on DevSpace
      </Typography>
    </Stack>
  );
};

export default Messages;
