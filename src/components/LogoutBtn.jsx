import { Text, Tooltip } from "@chakra-ui/react";
import { IoMdLogOut } from "react-icons/io";
import useLogout from "../hooks/useLogout";

const LogoutBtn = () => {
  const logout = useLogout();
  return (
    <Tooltip label="تسجيل الخروج" aria-label="A tooltip">
      <Text cursor={"pointer"} fontSize={30} color={"inherit"} onClick={logout}>
        <IoMdLogOut />
      </Text>
    </Tooltip>
  );
};

export default LogoutBtn;
