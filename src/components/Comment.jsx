import { Avatar, Divider, Flex, Text, Tooltip } from "@chakra-ui/react";
import ActionBar from "./ActionBar";
import moment from "moment";
import { Link as DomLink } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const Comment = ({ reply, lastReply, postOwnerId, postId }) => {
  const { createdAt, username, userProfilePic, text } = reply;
  const user = useRecoilValue(userAtom);

  const formatedDate = moment(createdAt).fromNow();
  const showToast = useShowToast();

  const handleDeleteComment = async () => {
    try {
      const resp = await fetch(`/api/posts/delete/${postId}/${reply._id}`, {
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
      showToast("Success", "Comment deleted.", "success");
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  if (!reply) return;
  return (
    <>
      <Flex gap={"4"} py={"2"} my={"2"} w={"full"}>
        <DomLink to={`/${username}`}>
          <Avatar src={userProfilePic} size={"sm"} />
        </DomLink>

        <Flex gap={"1"} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <DomLink to={`/${username}`}>
              <Text fontWeight={"bold"} fontSize={"sm"}>
                @{username}
              </Text>
            </DomLink>

            <Flex gap={"2"} alignItems={"center"}>
              <Text color={"gray.light"} fontSize={"xs"}>
                {formatedDate}
              </Text>
              {(user?.username === username || user?._id === postOwnerId) && (
                <>
                  <Divider orientation="vertical" />
                  <Tooltip label="Delete" placement="top">
                    <Text color={"red.300"} cursor={"pointer"} fontSize={"lg"}>
                      <AiOutlineDelete onClick={handleDeleteComment} />
                    </Text>
                  </Tooltip>
                </>
              )}
            </Flex>
          </Flex>
          <Text>{text}</Text>
          {/* <ActionBar /> */}
        </Flex>
      </Flex>
      {!lastReply && <Divider />}
    </>
  );
};

export default Comment;
