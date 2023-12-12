import { useContext, useEffect } from "react";
import { UserData } from "./ContextProvider";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { authorized } = useContext(UserData);
  const navigate = useNavigate();
  useEffect(function () {
    if (!authorized) navigate("/");
  });

  return authorized ? children : null;
}

export default ProtectedRoute;
