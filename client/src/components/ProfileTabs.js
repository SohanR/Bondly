import { Card, Tab, Tabs } from "@mui/material";
import React from "react";
import { MdChatBubbleOutline, MdFavoriteBorder, MdViewStream } from "react-icons/md";

const ProfileTabs = (props) => {
  const handleChange = (e, newValue) => {
    props.setTab(newValue);
  };

  return (
    <Card sx={{ borderRadius: 3, p: 0.75 }}>
      <Tabs
        value={props.tab}
        onChange={handleChange}
        variant="fullWidth"
        TabIndicatorProps={{ sx: { display: "none" } }}
        sx={{
          minHeight: 0,
          "& .MuiTab-root": {
            minHeight: 42,
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 800,
            color: "text.secondary",
          },
          "& .Mui-selected": {
            color: "primary.main",
            backgroundColor: "rgba(25, 118, 210, 0.1)",
          },
        }}
      >
        <Tab icon={<MdViewStream />} iconPosition="start" label="Posts" value="posts" />
        <Tab icon={<MdFavoriteBorder />} iconPosition="start" label="Liked" value="liked" />
        <Tab
          icon={<MdChatBubbleOutline />}
          iconPosition="start"
          label="Comments"
          value="comments"
        />
      </Tabs>
    </Card>
  );
};

export default ProfileTabs;
