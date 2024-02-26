// chakra-theme.js

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: {
      50: "#FFF7E0",
      100: "#FFEABF",
      200: "#FFDE9D",
      300: "#FFD17B",
      400: "#FFC45A",
      500: "#FFB738", // Orange
      600: "#E69E2F",
      700: "#BF8327",
      800: "#99681E",
      900: "#734D16",
    },
    secondary: {
      // Add secondary colors here if needed
    },
    gray: {
      50: "#FFFFFF",
      100: "#F2F2F2",
      200: "#CCCCCC", // Light Gray
      300: "#999999",
      400: "#666666",
      500: "#333333", // Dark Gray
      600: "#1A1A1A",
      700: "#000000",
    },
  },
  components: {
    Button: {
      // Define default props for Button component
      baseStyle: {
        // fontWeight: "bold",
        borderRadius: "md",
      },
      // Define variant styles
      variants: {
        // Add different button variants here
      },
    },
    // You can define styles for other components here
  },
});

export default theme;
