import { createGlobalStyle } from "styled-components";
import { theme } from "../constants/theme";

export const GlobalStyles = createGlobalStyle`
  /* CSS Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    font-family: ${theme.fonts.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    color: ${theme.colors.primary};
  }
`;
