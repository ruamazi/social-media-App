import { useState } from "react";
import useShowToast from "./useShowToast";

const usePrevieImg = () => {
  const [imageURL, setImgURL] = useState(null);
  const showToast = useShowToast();

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgURL(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file format", "Please select an image file", "error");
      setImgURL(null);
    }
  };
  return { handleImgChange, imageURL, setImgURL };
};

export default usePrevieImg;
