import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import Home from "./pages/Home";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import ProfilePage from "./pages/ProfilePage";
import CreatePost from "./components/CreatePost";

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Container maxW={"620px"}>
      <Header />
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={user ? <ProfilePage /> : <Navigate to="/login" />}
        />

        <Route
          path="/:username"
          element={
            user ? (
              <>
                <UserPage /> <CreatePost />
              </>
            ) : (
              <UserPage />
            )
          }
        />
        <Route path="/:username/post/:pId" element={<PostPage />} />
      </Routes>
    </Container>
  );
}

export default App;
