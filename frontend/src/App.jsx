import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Signup from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import InterviewPrep from "./pages/InterviewPrep.jsx";
import Navbar from "./components/Navbar.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/interview/:id" element={<InterviewPrep />} />
    </Routes>
    </>
  );
};

export default App;
