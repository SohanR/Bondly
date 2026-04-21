// Animated SVG doodles for Bondly Home Page
// Use CSS animations for smooth effects
import React from "react";

export const DoodleChatAnimated = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="60" cy="60" rx="55" ry="40" fill="#e0e7ff">
      <animate
        attributeName="rx"
        values="55;45;55"
        dur="2s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="ry"
        values="40;50;40"
        dur="2s"
        repeatCount="indefinite"
      />
    </ellipse>
    <rect
      x="30"
      y="45"
      width="60"
      height="35"
      rx="12"
      fill="#fff"
      stroke="#077ce8"
      strokeWidth="2"
    />
    <ellipse cx="50" cy="62" rx="4" ry="4" fill="#077ce8">
      <animate
        attributeName="cy"
        values="62;66;62"
        dur="1.2s"
        repeatCount="indefinite"
      />
    </ellipse>
    <ellipse cx="60" cy="62" rx="4" ry="4" fill="#077ce8">
      <animate
        attributeName="cy"
        values="62;66;62"
        dur="1.4s"
        repeatCount="indefinite"
      />
    </ellipse>
    <ellipse cx="70" cy="62" rx="4" ry="4" fill="#077ce8">
      <animate
        attributeName="cy"
        values="62;66;62"
        dur="1.6s"
        repeatCount="indefinite"
      />
    </ellipse>
    <polygon
      points="60,80 65,90 55,90"
      fill="#fff"
      stroke="#077ce8"
      strokeWidth="2"
    >
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0 0;0 3;0 0"
        dur="2s"
        repeatCount="indefinite"
      />
    </polygon>
  </svg>
);

export const DoodleFriendsAnimated = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="60" cy="90" rx="40" ry="15" fill="#e0e7ff">
      <animate
        attributeName="rx"
        values="40;45;40"
        dur="2s"
        repeatCount="indefinite"
      />
    </ellipse>
    <circle cx="45" cy="60" r="15" fill="#fff" stroke="#077ce8" strokeWidth="2">
      <animate
        attributeName="r"
        values="15;18;15"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
    <circle cx="75" cy="60" r="15" fill="#fff" stroke="#077ce8" strokeWidth="2">
      <animate
        attributeName="r"
        values="15;18;15"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
    <ellipse cx="45" cy="80" rx="12" ry="6" fill="#e0e7ff">
      <animate
        attributeName="rx"
        values="12;15;12"
        dur="2s"
        repeatCount="indefinite"
      />
    </ellipse>
    <ellipse cx="75" cy="80" rx="12" ry="6" fill="#e0e7ff">
      <animate
        attributeName="rx"
        values="12;15;12"
        dur="2s"
        repeatCount="indefinite"
      />
    </ellipse>
  </svg>
);

export const DoodleFeedAnimated = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="30"
      y="30"
      width="60"
      height="60"
      rx="15"
      fill="#fff"
      stroke="#077ce8"
      strokeWidth="2"
    />
    <rect x="40" y="45" width="40" height="10" rx="4" fill="#e0e7ff">
      <animate
        attributeName="width"
        values="40;50;40"
        dur="2s"
        repeatCount="indefinite"
      />
    </rect>
    <rect x="40" y="60" width="30" height="8" rx="4" fill="#e0e7ff">
      <animate
        attributeName="width"
        values="30;38;30"
        dur="2s"
        repeatCount="indefinite"
      />
    </rect>
    <rect x="40" y="75" width="20" height="6" rx="3" fill="#e0e7ff">
      <animate
        attributeName="width"
        values="20;28;20"
        dur="2s"
        repeatCount="indefinite"
      />
    </rect>
  </svg>
);
