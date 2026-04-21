import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DoodleChatAnimated,
  DoodleFriendsAnimated,
  DoodleFeedAnimated,
} from "./DoodlesAnimated";

const Home = () => {
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (localStorage.getItem("userInfo1")) {
      navigate("/s");
    }
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #e0e7ff 0%, #f8fafc 100%)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, Segoe UI, Arial, sans-serif",
      }}
    >
      <nav
        style={{
          padding: "1.5rem 2rem 1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "transparent",
          borderBottom: "1px solid #e0e7ff",
          boxShadow: "0 2px 12px #077ce81a",
        }}
      >
        <span
          style={{
            fontWeight: 900,
            fontSize: "2.5rem",
            color: "#077ce8",
            letterSpacing: "2px",
            textShadow: "0 2px 8px #077ce81a",
          }}
        >
          Bondly
        </span>
        <div>
          <button
            onClick={() => navigate("/login")}
            style={{
              marginRight: "1rem",
              padding: "0.7rem 2rem",
              borderRadius: "25px",
              border: "none",
              background: "#077ce8",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px #077ce81a",
              transition: "background 0.2s",
            }}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "0.7rem 2rem",
              borderRadius: "25px",
              border: "2px solid #077ce8",
              background: "#fff",
              color: "#077ce8",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px #077ce81a",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Register
          </button>
        </div>
      </nav>
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          gap: "2.5rem",
          padding: "2rem 0 0 0",
        }}
      >
        <div
          style={{ width: "100%", maxWidth: 700, margin: "0 auto", zIndex: 2 }}
        >
          <h1
            style={{
              fontSize: "3.2rem",
              fontWeight: 900,
              color: "#22223b",
              marginBottom: "1.2rem",
              letterSpacing: "1px",
              lineHeight: 1.1,
              textShadow: "0 2px 8px #e0e7ff",
            }}
          >
            Welcome to <span style={{ color: "#077ce8" }}>Bondly</span>
          </h1>
          <p
            style={{
              fontSize: "1.35rem",
              color: "#4a5568",
              maxWidth: "500px",
              margin: "0 auto 2.5rem auto",
              fontWeight: 500,
            }}
          >
            The most modern, interactive, and vibrant social media platform.{" "}
            <br />
            <span style={{ color: "#077ce8", fontWeight: 700 }}>
              Chat instantly
            </span>{" "}
            with friends,{" "}
            <span style={{ color: "#077ce8", fontWeight: 700 }}>
              share your moments
            </span>
            , and{" "}
            <span style={{ color: "#077ce8", fontWeight: 700 }}>
              discover new communities
            </span>
            .
            <br />
            <span style={{ color: "#22223b", fontWeight: 600 }}>
              Join Bondly today and be part of the future of social connection.
            </span>
          </p>
          <div
            style={{
              marginBottom: "2.5rem",
              display: "flex",
              gap: "1.5rem",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => navigate("/register")}
              style={{
                padding: "1.1rem 2.8rem",
                borderRadius: "30px",
                border: "none",
                background: "#077ce8",
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.3rem",
                cursor: "pointer",
                boxShadow: "0 2px 12px #077ce81a",
                transition: "background 0.2s",
              }}
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "1.1rem 2.8rem",
                borderRadius: "30px",
                border: "2px solid #077ce8",
                background: "#fff",
                color: "#077ce8",
                fontWeight: 800,
                fontSize: "1.3rem",
                cursor: "pointer",
                boxShadow: "0 2px 12px #077ce81a",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              Login
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: "2.5rem",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ opacity: 0.98 }}>
              <DoodleChatAnimated />
            </div>
            <div style={{ opacity: 0.98 }}>
              <DoodleFriendsAnimated />
            </div>
            <div style={{ opacity: 0.98 }}>
              <DoodleFeedAnimated />
            </div>
          </div>
          <ul
            style={{
              color: "#22223b",
              fontSize: "1.1rem",
              fontWeight: 500,
              margin: 0,
              padding: 0,
              listStyle: "none",
              lineHeight: 2,
              textAlign: "center",
            }}
          >
            <li>✅ Real-time chat & notifications</li>
            <li>✅ Personalized news feed</li>
            <li>✅ Find & follow new friends</li>
            <li>✅ Secure & private</li>
            <li>✅ 100% free to join</li>
          </ul>
        </div>
        <div
          style={{
            width: "100%",
            maxWidth: 700,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2.5rem",
            position: "relative",
          }}
        >
          <div
            style={{
              marginTop: "2rem",
              color: "#6c757d",
              fontSize: "1.1rem",
              textAlign: "center",
            }}
          >
            <span>
              🚀 Modern. Social.{" "}
              <span style={{ color: "#077ce8", fontWeight: 700 }}>Bondly</span>.
            </span>
            <br />
            <span style={{ color: "#077ce8" }}>
              Join the movement. Make your mark.
            </span>
          </div>
        </div>
      </main>
      <footer
        style={{
          textAlign: "center",
          color: "#b0b0b0",
          fontSize: "1rem",
          padding: "1.5rem 0 0.5rem 0",
        }}
      >
        &copy; {new Date().getFullYear()} Bondly Social Media. All rights
        reserved.
      </footer>
    </div>
  );
};

export default Home;
