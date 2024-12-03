import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Wallet from "./pages/wallet";

let hasAccount:boolean;

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key?.startsWith("acc")) {
      hasAccount = true;

      break;
  }
};

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      {!hasAccount ? <Route path="/" element={<Home />} /> : <Route path="/" element={<Wallet />} />}
      {/* <Route path="/wallet" element={<Wallet />} /> */}
    </Routes>
    </BrowserRouter>
  );
};

export default App;