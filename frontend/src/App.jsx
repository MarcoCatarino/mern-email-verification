import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Background } from "./components/ui/Background";

import { SignUp } from "./pages/SignUp";
import { LogIn } from "./pages/LogIn";
import { Home } from "./pages/Home";
import { VerifyEmail } from "./pages/VerifyEmail";

function App() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br
    from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden"
    >
      <Background />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/log-in" element={<LogIn />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
