import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const API_URL = "https://social-media-app-vercel-gamma.vercel.app";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const resp = await fetch(`${API_URL}/api/users/profile/${username}`);
        const data = await resp.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [username]);

  return { loading, user };
};

export default useGetUserProfile;
