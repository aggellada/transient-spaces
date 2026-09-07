import { useEffect } from "react";
import { usePostStore } from "./store/usePostStore";
import { useLocationStore } from "./store/useLocationStore";

import { Navigate, Route, Routes } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import SignUpPage from "./pages/auth/SignUpPage";
import PostPage from "./pages/post/PostPage";
import FeedPage from "./pages/home/FeedPage";
import LoginModal from "./components/LoginModal";
import { useModalStore } from "./store/useModalStore";
import PostModal from "./components/PostModal";

function App() {
  const { getAllPosts } = usePostStore();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { syncUserLocation, isSyncing, placeId } = useLocationStore();
  const { isLoginModalOpen, isPostModalOpen } = useModalStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    syncUserLocation(14.6503, 121.0747);
  }, [syncUserLocation, authUser]);

  useEffect(() => {
    if (placeId) {
      getAllPosts(placeId);
    }
  }, [getAllPosts, placeId, authUser]);

  if (isSyncing) return <h1>Syncing user location...</h1>;

  return (
    <div className="w-full min-h-screen flex bg-[#161718] justify-between">
      {<LoginModal />}
      {isPostModalOpen && <PostModal />}
      <Routes>
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />} />
        <Route path="/" element={<FeedPage />} />
        <Route path="/posts/:id" element={<PostPage />} />
      </Routes>
    </div>
  );
}

export default App;
