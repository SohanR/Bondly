import { Box, MenuItem, Select, Typography } from "@mui/material";
import React from "react";
import { MdTune } from "react-icons/md";
import HorizontalStack from "./util/HorizontalStack";

const SortBySelect = ({ onSortBy, sortBy, sorts }) => {
  return (
    <HorizontalStack
      spacing={1}
      sx={{
        borderRadius: 999,
        px: 1.25,
        py: 0.75,
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          display: {
            xs: "none",
            sm: "inline-flex",
          },
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
          backgroundColor: "rgba(25, 118, 210, 0.08)",
        }}
      >
        <MdTune />
      </Box>
      <Typography
        color="text.secondary"
        variant="caption"
        sx={{
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 0,
          display: {
            xs: "none",
            sm: "block",
          },
        }}
      >
        Sort
      </Typography>
      <Select
        size="small"
        value={sorts[sortBy]}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 1,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 18px 48px rgba(15, 23, 42, 0.18)",
              overflow: "hidden",
              "& .MuiList-root": {
                py: 0.75,
              },
              "& .MuiMenuItem-root": {
                mx: 0.75,
                my: 0.25,
                borderRadius: 2,
                fontWeight: 700,
                minHeight: 42,
                transition:
                  "background-color 140ms ease, color 140ms ease, transform 140ms ease",
              },
              "& .MuiMenuItem-root:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                color: "primary.main",
              },
              "& .MuiMenuItem-root.Mui-selected": {
                backgroundColor: "rgba(25, 118, 210, 0.12)",
                color: "primary.main",
              },
              "& .MuiMenuItem-root.Mui-selected:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.16)",
              },
            },
          },
        }}
        sx={{
          minWidth: { xs: 132, sm: 150 },
          fontWeight: 700,
          ".MuiOutlinedInput-notchedOutline": {
            border: 0,
          },
          ".MuiSelect-select": {
            py: 0.5,
            pl: 0.5,
          },
        }}
        onChange={onSortBy}
      >
        {Object.keys(sorts).map((sortName, i) => (
          <MenuItem value={sorts[sortName]} key={i}>
            {sorts[sortName]}
          </MenuItem>
        ))}
      </Select>
    </HorizontalStack>
  );
};

export default SortBySelect;
