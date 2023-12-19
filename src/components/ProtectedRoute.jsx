import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../Stores/AuthStore";

function ProtectedRoute({ children }) {
  const authorized = authStore(function (state) {
    return state.authorized;
  });

  const navigate = useNavigate();

  useEffect(function () {
    if (!authorized) navigate("/");
  });

  return authorized ? children : null;
}

export default ProtectedRoute;
