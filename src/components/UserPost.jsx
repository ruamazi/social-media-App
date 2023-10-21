import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import ActionBar from "./ActionBar";
import { useState } from "react";

const UserPost = () => {
  const [liked, setLiked] = useState(false);
  return (
    <Link to="/username/post/1">
      <Flex gap={"3"} mb={"4"} py={"5"}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar size={"md"} name="zuc" src="/zuck-avatar.png" />
          <Box w={"1px"} h={"full"} bg="gray.light" my={"2"}></Box>
          <Box position={"relative"} w={"full"}>
            <Avatar
              size={"xs"}
              name="user1"
              src="/zuck-avatar.png"
              position={"absolute"}
              top={"0px"}
              left={"15px"}
              padding={"2px"}
            />
            <Avatar
              size={"xs"}
              name="user1"
              src="/zuck-avatar.png"
              position={"absolute"}
              bottom={"0px"}
              left={"4px"}
              padding={"2px"}
            />
            <Avatar
              size={"xs"}
              name="user1"
              src="/zuck-avatar.png"
              position={"absolute"}
              bottom={"0px"}
              right={"-5px"}
              padding={"2px"}
            />
          </Box>
        </Flex>
        <Flex flex={"1"} flexDirection={"column"} gap={"2"}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                markzucklbard
              </Text>
              {/* <Image w={"4"} h={"4"} ml={"1"} src="/verified.png" /> */}
            </Flex>
            <Flex alignItems={"center"} gap={"4"}>
              <Text fontStyle={"sm"} color={"gray.light"}>
                id
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>This is my firs post here!</Text>
          <Box
            borderRadius={"6"}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Image src="/post1.png" w={"full"} />
          </Box>
          <Flex gap={"3"} my={"1"}>
            <ActionBar liked={liked} setLiked={setLiked} />
          </Flex>
          <Flex gap={"2"} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"sm"}>
              5 replies
            </Text>
            <Box
              width={"1"}
              height={"1"}
              borderRadius={"50%"}
              bg={"gray.light"}
            />
            <Text color={"gray.light"} fontSize={"sm"}>
              56 likes
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserPost;
