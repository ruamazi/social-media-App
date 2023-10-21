import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { MdOutlineCreate } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import usePrevieImg from "../hooks/usePrevieImg";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import userAtom from "../atoms/userAtom";

const maxChar = 500;

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const [remainChar, setRemainChar] = useState(maxChar);
  const [loading, setLoading] = useState(false);
  const finalRef = useRef(null);
  const imgRef = useRef(null);
  const { handleImgChange, imageURL, setImgURL } = usePrevieImg();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const user = useRecoilValue(userAtom);
  const { username } = useParams(userAtom);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > maxChar) {
      const truncatedText = inputText.slice(0, maxChar);
      setPostText(truncatedText);
      setRemainChar(0);
    } else {
      setPostText(inputText);
      setRemainChar(maxChar - inputText.length);
    }
  };

  const handleSubmitPost = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/posts/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: postText, img: imageURL }),
      });
      const data = await resp.json();
      if (data.errir) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post created successfully.", "success");
      onClose();
      setPostText("");
      setImgURL("");
      if (username === user.username) {
        setPosts([data, ...posts]);
      }
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Button
        onClick={onOpen}
        position={"fixed"}
        bottom={10}
        right={10}
        rightIcon={<MdOutlineCreate />}
        bg={useColorModeValue("gray.300", "gray.dark")}
        size={{ base: "sm", sm: "md" }}
      >
        Create
      </Button>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Share with us your thoughts"
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"end"}
                m={"1"}
              >
                {remainChar}/{maxChar}
              </Text>
              <input
                type="file"
                hidden
                ref={imgRef}
                onChange={handleImgChange}
              />
              <LuImagePlus
                size={22}
                cursor={"pointer"}
                style={{ marginLeft: "5px" }}
                onClick={() => imgRef.current.click()}
              />
            </FormControl>
            {imageURL && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imageURL} alt="Selected Image" />
                <CloseButton
                  onClick={() => setImgURL("")}
                  position={"absolute"}
                  bg={"gray.800"}
                  left={2}
                  top={2}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={loading}
              colorScheme="blue"
              onClick={handleSubmitPost}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
