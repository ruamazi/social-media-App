import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { GrFormViewHide, GrFormView } from "react-icons/gr";
import { Link } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const showToast = useShowToast();
  const setUser = useSetRecoilState(userAtom);

  const [inputV, setInputV] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
  });

  const BACKEND_URL = "/api/users/signup";

  const handleSubmit = async () => {
    try {
      const resp = await fetch(BACKEND_URL, {
        method: "POST",
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
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setInputV({ ...inputV, name: e.target.value })
                    }
                    value={inputV.name}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    onChange={(e) =>
                      setInputV({ ...inputV, username: e.target.value })
                    }
                    value={inputV.username}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) =>
                  setInputV({ ...inputV, email: e.target.value })
                }
                value={inputV.email}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setInputV({ ...inputV, password: e.target.value })
                  }
                  value={inputV.password}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    color={"red.400"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    <span>
                      {showPassword ? <GrFormView /> : <GrFormViewHide />}
                    </span>
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleSubmit}
              >
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text
                align={"center"}
                display={"flex"}
                justifyContent={"center"}
                gap={"4"}
              >
                You have an account?
                <Link
                  style={{ color: "gray", textDecoration: "underline" }}
                  to={"/login"}
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignupPage;
