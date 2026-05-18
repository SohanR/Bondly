import { Grid, Stack } from "@mui/material";
import React from "react";

const GridLayout = (props) => {
  const { left, leftRail, right } = props;

  return (
    <Grid container spacing={2}>
      {leftRail && (
        <Grid item md={3} sx={{ display: { xs: "none", md: "block" } }}>
          <Stack spacing={2}>{leftRail}</Stack>
        </Grid>
      )}
      <Grid item xs={12} md={leftRail ? 6 : 8}>
        {left}
      </Grid>
      <Grid item md={leftRail ? 3 : 4} sx={{ display: { xs: "none", md: "block" } }}>
        {right}
      </Grid>
    </Grid>
  );
};

export default GridLayout;
