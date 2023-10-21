import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "./useShowToast";
import { useNavigate } from "react-router-dom";

const API_URL = "https://social-media-app-vercel-gamma.vercel.app";

const useLogout = () => {
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const resp = await fetch(API_URL + "/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resp.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return logout;
};

export default useLogout;
