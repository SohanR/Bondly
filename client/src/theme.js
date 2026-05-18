import { createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    MuiCard: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...{
            padding: theme.spacing(2),
            borderWidth: "1.5px",
          },
        }),
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.up("sm")]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
          },
          [theme.breakpoints.up("lg")]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
          },
        }),
      },
    },
  },
});

export default theme;
