import { Flex, Image, useColorMode } from "@chakra-ui/react";
import { Link as DomLink } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import LogoutBtn from "./LogoutBtn";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);

  return (
    <Flex mt={"6"} mb={"8"} justifyContent={user ? "space-between" : "center"}>
      {user && (
        <Flex alignItems={"center"} gap={5}>
          <DomLink to="/">
            <AiOutlineHome size={30} />
          </DomLink>
          <DomLink to={`/${user.username}`}>
            <RxAvatar size={30} />
          </DomLink>
        </Flex>
      )}

      <Image
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        alt="logo"
        cursor={"pointer"}
        w={"6"}
        onClick={toggleColorMode}
      />
      {user && <LogoutBtn />}
    </Flex>
  );
};

export default Header;
