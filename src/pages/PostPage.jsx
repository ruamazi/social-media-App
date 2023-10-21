import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { BiDownload } from "react-icons/bi";
import ActionBar from "../components/ActionBar";
import { useEffect } from "react";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiOutlineDelete } from "react-icons/ai";
import postsAtom from "../atoms/postsAtom";
import { Link as DomLink } from "react-router-dom";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { pId } = useParams();
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const post = posts[0]; //current post
  const formatedDate = moment(post?.createdAt).fromNow();
  useEffect(() => {
    const getPost = async () => {
      try {
        const resp = await fetch(`/api/posts/get-post/${pId}`);
        const data = await resp.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };
    getPost();
  }, [pId, posts, setPosts]);

  async function handleDeletePost() {
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
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error, "error");
    }
  }

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user) return null;
  if (!post) return null;
  return (
    <Flex flexDir={"column"} mb={41}>
      <Flex justifyContent={"space-between"}>
        <DomLink to={`/${user.username}`}>
          <Flex alignItems={"center"} gap={"2"}>
            <Avatar src={user.profilePic} size={"md"} name={user.name} />
            <Tooltip label={user.name} aria-label="A tooltip">
              <Flex alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>
                  @{user.username}
                </Text>
                {/* <Image src="/verified.png" w={"4"} h={"4"} ml={"2"} /> */}
              </Flex>
            </Tooltip>
            <Flex w={1} h={1} bg={"gray.light"} borderRadius={"50%"} />
            <Text color={"gray.light"} fontSize={"xs"}>
              {user.followers?.length}{" "}
              {user.followers?.length === 1 ? "Follower" : "Followers"}
            </Text>
          </Flex>
        </DomLink>

        <Flex gap={"2"} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            {formatedDate}
          </Text>

          {currentUser?._id === post.postedBy && (
            <>
              <Divider orientation="vertical" />
              <Tooltip label="Delete" placement="top">
                <Text color={"red.300"} cursor={"pointer"} fontSize={"lg"}>
                  <AiOutlineDelete onClick={handleDeletePost} />
                </Text>
              </Tooltip>
            </>
          )}
        </Flex>
      </Flex>
      <Text my={"4"}>{post.text}</Text>
      {post.img && (
        <Box
          borderRadius={"6"}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={post?.img} w={"full"} />
        </Box>
      )}

      <Flex gap={"3"} my={"3"}>
        <ActionBar post={post} />
      </Flex>

      <Divider my={"4"} />
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Flex gap={"2"} alignItems={"center"}>
          <BiDownload style={{ color: "gray" }} />
          <Text fontSize={"sm"} color={"gray.light"}>
            Get the APP to like, reply and post.
          </Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={"4"} />
      {post.replies?.map((r, i) => (
        <Comment
          postId={post._id}
          postOwnerId={post.postedBy}
          key={i}
          reply={r}
          lastReply={r._id === post.replies[post.replies.length - 1]._id}
        />
      ))}
    </Flex>
  );
};

export default PostPage;
