import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { lightTheme } from "./styles/theme";
import { GlobalStyle } from "./styles/global";
import { Router } from "./routes";

export function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <GlobalStyle />
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
