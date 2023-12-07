import { useContext, useEffect } from "react";
import { UserData } from "./ContextProvider";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { loggedIn } = useContext(UserData);
  const navigate = useNavigate();
  useEffect(function () {
    if (!loggedIn) navigate("/");
  });

  return loggedIn ? children : null;
}

export default ProtectedRoute;
