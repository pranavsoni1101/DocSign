import { extendTheme } from "@chakra-ui/react";
import '@fontsource-variable/open-sans'
import '@fontsource/roboto'
// Supports weights 100-900
import '@fontsource-variable/montserrat';

const theme = extendTheme({
  fonts: {
    heading: "Montserrat Variable, sans-serif",
    body: "Open Sans, sans-serif",
  },
  colors: {
    primary: {
      50: "#E6F6FF", // Light Blue
      100: "#BAE3FF",
      200: "#7CC4FA",
      300: "#47A3F3",
      400: "#2186EB",
      500: "#0967D2", // Salesforce Blue
      600: "#05539E",
      700: "#033C73",
      800: "#012749",
      900: "#001525", // Dark Blue
    },
    secondary: {
      50: "#E9F5F2", // Light Green
      100: "#BCE4D8",
      200: "#82CCA9",
      300: "#54B887",
      400: "#3A9D6D",
      500: "#227D51", // Salesforce Green
      600: "#185C39",
      700: "#0F3C21",
      800: "#05200D",
      900: "#001901", // Dark Green
    },
    accent: {
      50: "#F0E5F8", // Light Purple
      100: "#D0BDF3",
      200: "#A081EB",
      300: "#7A55E3",
      400: "#5B3FD7",
      500: "#4529D0", // Salesforce Purple
      600: "#311FA6",
      700: "#1E147B",
      800: "#0D0A50",
      900: "#030224", // Dark Purple
    },
    warning: {
      50: "#FFF4E5", // Light Yellow
      100: "#FFE3BA",
      200: "#FFCB7D",
      300: "#FFB13D",
      400: "#FF9F00",
      500: "#E85C00", // Salesforce Yellow
      600: "#B54400",
      700: "#812F00",
      800: "#4F1B00",
      900: "#1F0800", // Dark Yellow
    },
    gray: {
      50: "#F5F5F5", // Light Gray
      100: "#E0E0E0",
      200: "#BDBDBD",
      300: "#828282",
      400: "#4F4F4F",
      500: "#333333", // Dark Gray
      600: "#242424",
      700: "#181818",
      800: "#0C0C0C",
      900: "#000000", // Black
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "md",
      },
    },
    // You can define styles for other components here
  },
});

export default theme;
