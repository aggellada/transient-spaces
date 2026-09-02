import { CircleUser, Heart, MessageSquareMore } from "lucide-react";
import { usePostStore } from "../store/usePostStore";
import { useEffect, useRef, useState } from "react";
import PostModal from "./PostModal";
import SideNav from "./SideNav";
import RightSidebar from "./RightSidebar";
import { useAuthStore } from "../store/useAuthStore";
import Post from "./Post";

function Feed() {
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const { posts } = usePostStore();
  const { authUser } = useAuthStore();

  const postModalRef = useRef<HTMLDialogElement>(null);
  const loginModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (showLoginModal) {
      loginModalRef.current?.showModal();
    } else {
      loginModalRef.current?.close();
    }
  }, [showLoginModal]);

  useEffect(() => {
    if (showPostModal) {
      postModalRef.current?.showModal();
    } else {
      postModalRef.current?.close();
    }
  }, [showPostModal]);

  const handlePostModalClick = () => {
    if (!authUser) {
      return handleLoginModalClick();
    }
    setShowPostModal((prev) => !prev);
  };

  const handleLoginModalClick = () => {
    setShowLoginModal((prev) => !prev);
  };

  return (
    <>
      {authUser && showPostModal && (
        <PostModal ref={postModalRef} handlePostModalClick={handlePostModalClick} />
      )}
      <SideNav />
      <div className="w-full max-w-4xl p-8">
        <input
          type="text"
          className="w-full p-4 rounded-lg bg-[#232525] text-white mb-6"
          placeholder="What's on your mind?"
          onClick={handlePostModalClick}
        />
        {posts.map((post) => (
          <Post post={post} />
        ))}
      </div>
      <RightSidebar
        ref={loginModalRef}
        handleLoginModalClick={handleLoginModalClick}
        showLoginModal={showLoginModal}
      />
    </>
  );
}

export default Feed;
