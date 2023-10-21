import { Avatar, Box, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import { Link as DomLink } from "react-router-dom";
import ActionBar from "./ActionBar";
import { useEffect, useState } from "react";
import moment from "moment";
import useShowToast from "../hooks/useShowToast";
import { AiOutlineDelete } from "react-icons/ai";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const SinglePost = ({ post }) => {
  const currentUser = useRecoilValue(userAtom);
  const [postOwner, setPostOwner] = useState();
  const { createdAt, postedBy } = post;
  const formatedDate = moment(createdAt).fromNow();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await fetch(`/api/users/profile/${postedBy}`);
        const data = await resp.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPostOwner(data);
      } catch (error) {
        showToast("Error", error, "error");
        setPostOwner(null);
      }
    };
    fetchUser();
  }, [postedBy]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post")) return;
      const resp = await fetch(`/api/posts/delete/${post._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resp.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", data.message, "success");
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  return (
    <>
      <Flex gap={"3"} mb={"4"} py={"5"}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <DomLink to={`/${postOwner?.username}`}>
            <Avatar
              size={"md"}
              name={postOwner?.name}
              src={postOwner?.profilePic}
            />
          </DomLink>
          <Box w={"1px"} h={"full"} bg="gray.light" my={"2"}></Box>
        </Flex>
        <Flex flex={"1"} flexDirection={"column"} gap={"2"}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex alignItems={"center"}>
              <Tooltip label={postOwner?.name} aria-label="A tooltip">
                <DomLink to={`/${postOwner?.username}`}>
                  <Text fontSize={"sm"} fontWeight={"bold"}>
                    @{postOwner?.username}
                  </Text>
                </DomLink>
              </Tooltip>

              {/* <Image w={"4"} h={"4"} ml={"1"} src="/verified.png" /> */}
            </Flex>
            <Flex alignItems={"center"} gap={"4"}>
              <Text textAlign={"center"} fontSize={"xs"} color={"gray.light"}>
                {formatedDate}
              </Text>
              {currentUser?._id === post?.postedBy && (
                <Tooltip label="Delete" placement="top">
                  <Text color={"red.300"} cursor={"pointer"} fontSize={"lg"}>
                    <AiOutlineDelete onClick={handleDeletePost} />
                  </Text>
                </Tooltip>
              )}
            </Flex>
          </Flex>
          <DomLink to={`/${postOwner?.username}/post/${post._id}`}>
            <Text fontSize={"sm"}>{post.text}</Text>
            {post.img && (
              <Box
                borderRadius={"6"}
                overflow={"hidden"}
                border={"1px solid"}
                borderColor={"gray.light"}
              >
                <Image src={post.img} w={"full"} />
              </Box>
            )}
          </DomLink>
          <Flex gap={"3"} my={"1"}>
            <ActionBar post={post} />
          </Flex>
        </Flex>
      </Flex>
      <div className="my-divider" />
    </>
  );
};

export default SinglePost;
