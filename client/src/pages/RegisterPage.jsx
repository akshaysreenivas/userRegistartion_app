import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Register from "../components/register/Register";

function RegisterPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (token) return navigate("/");
  }, [navigate]);

  return <Register />;
}

export default RegisterPage;
