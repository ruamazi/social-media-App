import {
  Avatar,
  Box,
  Flex,
  VStack,
  Text,
  MenuButton,
  Menu,
  Portal,
  MenuList,
  MenuItem,
  Button,
  Link,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as DomLink } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom); //logged-in user
  const [isFollowing, setIsFollowing] = useState(
    user && user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();

  function copyUrl() {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast("Success", "URL Copied to clipboard", "success");
    });
  }

  const handleFollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }
    if (updating) return;
    setUpdating(true);
    try {
      const resp = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await resp.json();
      if (data.error) {
        showToast("Error", data.error, "error");
      }
      if (isFollowing) {
        user.followers.pop();
      } else {
        user.followers.push(currentUser?._id); //only on client side
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <VStack gap={"4"} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text
            fontSize={"2x1"}
            fontWeight={"bold"}
            textTransform={"capitalize"}
          >
            {user?.name}
          </Text>
          <Flex gap={"2"} alignItems={"center"}>
            <Text fontSize={"sm"}>@{user?.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={"1"}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user?.profilePic && (
            <Avatar
              name={user?.name}
              src={user?.profilePic || ""}
              size={{ base: "lg", md: "xl" }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user?.bio}</Text>
      {currentUser?._id === user?._id && (
        <DomLink to="/profile">
          <Button>Update Profile</Button>
        </DomLink>
      )}
      {currentUser?._id !== user?._id && (
        <Button isLoading={updating} onClick={handleFollow}>
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex width={"full"} justifyContent={"space-between"}>
        <Flex gap={"2"} alignItems={"center"}>
          <Text color={"gray.light"}>{user?.followers.length} followers</Text>
          <Box
            bg={"gray.light"}
            width={"1"}
            height={"1"}
            borderRadius={"50%"}
          />
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={"24"} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={"24"} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={"1"}
          fontWeight={"bold"}
          borderBottom={"1px solid white"}
          justifyContent={"center"}
          cursor={"pointer"}
          pb={"3"}
        >
          <Text>Threads</Text>
        </Flex>
        <Flex
          flex={"1"}
          fontWeight={"bold"}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          cursor={"pointer"}
          pb={"3"}
          color={"gray"}
        >
          <Text>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
