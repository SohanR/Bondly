import { Grid, Stack } from "@mui/material";
import React from "react";

const GridLayout = (props) => {
  const { left, leftRail, right } = props;

  return (
    <Grid container spacing={2}>
      {leftRail && (
        <Grid item md={3} sx={{ display: { xs: "none", md: "block" } }}>
          <Stack
            spacing={2}
            sx={{
              position: "sticky",
              top: 88,
              maxHeight: "calc(100vh - 96px)",
              overflowY: "auto",
              pr: 0.5,
            }}
          >
            {leftRail}
          </Stack>
        </Grid>
      )}
      <Grid
        item
        xs={12}
        md={leftRail ? 6 : 8}
        sx={{
          maxHeight: { md: "calc(100vh - 88px)" },
          overflowY: { md: "auto" },
          pr: { md: 0.5 },
        }}
      >
        {left}
      </Grid>
      <Grid item md={leftRail ? 3 : 4} sx={{ display: { xs: "none", md: "block" } }}>
        <Stack
          sx={{
            position: "sticky",
            top: 88,
            maxHeight: "calc(100vh - 96px)",
            overflowY: "auto",
            pr: 0.5,
          }}
        >
          {right}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default GridLayout;
