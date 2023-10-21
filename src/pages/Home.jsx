import { Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import SinglePost from "../components/SinglePost";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const API_URL = "https://social-media-app-vercel-gamma.vercel.app";

const Home = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getFeedPosts = async () => {
      setIsLoading(true);
      setPosts([]);
      try {
        const resp = await fetch(API_URL + "/api/posts/feed");
        const data = await resp.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setIsLoading(false);
      }
    };
    getFeedPosts();
  }, [setPosts]);

  return (
    <>
      {isLoading && (
        <Flex justifyContent={"center"}>
          <Spinner mt={10} size={"xl"} />
        </Flex>
      )}
      {!isLoading && posts.length === 0 && (
        <Flex justifyContent={"center"}>
          <Text mt={10} fontSize={"xl"}>
            Follow some users to see thier posts
          </Text>
        </Flex>
      )}
      {posts && posts.map((p) => <SinglePost post={p} key={p._id} />)}
    </>
  );
};

export default Home;
