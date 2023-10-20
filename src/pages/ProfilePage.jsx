import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Textarea,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePrevieImg from "../hooks/usePrevieImg";
import useShowToast from "../hooks/useShowToast";

const ProfilePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [updating, setUpdating] = useState(false);
  const defaultPic =
    "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";
  const fileRef = useRef(null);
  const { handleImgChange, imageURL, setImgURL } = usePrevieImg();
  const [inputV, setInputV] = useState({
    username: user.username,
    name: user.name,
    bio: user.bio,
    password: "",
    email: user.email,
    profilePic: user.profilePic,
  });
  if (imageURL) {
    inputV.profilePic = imageURL;
  }

  const handleResetIMG = () => {
    setImgURL(null);
    setInputV((prev) => ({ ...prev, profilePic: defaultPic }));
  };
  const showToast = useShowToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    try {
      const resp = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputV),
      });
      const data = await resp.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Profile updated successfully", "success");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <form onSubmit={handleSubmit}>
        <Stack
          spacing={4}
          w={"450px"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          mb={8}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar size="xl" src={inputV.profilePic}>
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<AiOutlineClose size={13} />}
                    onClick={handleResetIMG}
                  />
                </Avatar>
              </Center>
              <Center w="full">
                <Button onClick={() => fileRef.current.click()} w="full">
                  Choose Picture
                </Button>
                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={handleImgChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Your name"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputV.name}
              onChange={(e) => setInputV({ ...inputV, name: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputV.username}
              onChange={(e) =>
                setInputV({ ...inputV, username: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Textarea
              placeholder="Tell us about yourself!"
              _placeholder={{ color: "gray.500" }}
              value={inputV.bio}
              onChange={(e) => setInputV({ ...inputV, bio: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={inputV.email}
              onChange={(e) => setInputV({ ...inputV, email: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              value={inputV.password}
              onChange={(e) =>
                setInputV({ ...inputV, password: e.target.value })
              }
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w={"full"}
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              isLoading={updating}
              type="submit"
              bg={"green.400"}
              color={"white"}
              w={"full"}
              _hover={{
                bg: "green.500",
              }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </form>
    </Flex>
  );
};

export default ProfilePage;
