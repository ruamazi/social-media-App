import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
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
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

const LoginPage = () => {
  const [inputV, setInputV] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const handleLogin = async () => {
    setLoading(true);
    const BACKEND_URL = "/api/users/login";
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Login
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.dark")}
          boxShadow={"lg"}
          p={8}
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                onChange={(e) =>
                  setInputV({ ...inputV, username: e.target.value })
                }
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
                isLoading={loading}
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleLogin}
              >
                Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text
                align={"center"}
                display={"flex"}
                justifyContent={"center"}
                gap={"4"}
              >
                Dont have an account ?
                <Link
                  style={{ color: "gray", textDecoration: "underline" }}
                  to="/signup"
                >
                  Sign up
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginPage;
