import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
}

export default function AdminRoute({
  children,
}: Props) {
  const {
    isAuthenticated,
    user,
  } = useAuth();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    user?.role !== "ADMIN"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <>{children}</>;
}