import Router from "./routes";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
