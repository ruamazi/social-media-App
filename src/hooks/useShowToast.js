import { useToast } from "@chakra-ui/react";

const useShowToast = () => {
  const toast = useToast();
  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: 2500,
    });
  };

  return showToast;
};

export default useShowToast;
