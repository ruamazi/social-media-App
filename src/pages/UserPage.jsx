import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import SinglePost from "../components/SinglePost";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const [userPosts, setUserPosts] = useRecoilState(postsAtom);
  const [fetchingUserPosts, setFetchingUserPosts] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getUserPosts = async () => {
      setFetchingUserPosts(true);
      try {
        const resp = await fetch(`/api/posts/user/${username}`);
        const data = await resp.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUserPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUserPosts([]);
      } finally {
        setFetchingUserPosts(false);
      }
    };
    getUserPosts();
  }, [username, setUserPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && !loading) {
    return (
      <Flex justifyContent={"center"}>
        <h1>User not found!</h1>
      </Flex>
    );
  }

  return (
    <>
      <UserHeader user={user} />
      {!fetchingUserPosts && userPosts?.length === 0 && (
        <Flex justifyContent={"center"} my={12}>
          There is no posts.
        </Flex>
      )}
      {fetchingUserPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"lg"} />
        </Flex>
      )}
      {userPosts?.map((p) => (
        <SinglePost key={p._id} post={p} />
      ))}
    </>
  );
};

export default UserPage;
