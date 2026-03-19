import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import VerifyEmail from "../components/VerifyEmail";
import Loading from "./Loading";

function UserProtectedWrapper({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/user/profile`, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const user = response.data.user;
          setUser(user);
          localStorage.setItem(
            "userData",
            JSON.stringify({ type: "user", data: user })
          );
          setIsVerified(user.emailVerified);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        navigate("/login");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) return <Loading />;

  if (isVerified === false) {
    return <VerifyEmail user={user} role={"user"} />;
  }

  return <>{children}</>;
}


export default UserProtectedWrapper;
