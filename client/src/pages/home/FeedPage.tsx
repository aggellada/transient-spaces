import { usePostStore } from "../../store/usePostStore";
import PostModal from "../../components/PostModal";
import SideNav from "../../components/SideNav";
import RightSidebar from "../../components/RightSidebar";
import { useAuthStore } from "../../store/useAuthStore";
import Post from "../../components/Post";
import { useModalStore } from "../../store/useModalStore";
import FeedPageSkeleton from "../../components/skeleton/FeedPageSkeleton";

function FeedPage() {
  const { posts, isGettingAllPosts } = usePostStore();
  const { authUser } = useAuthStore();
  const { openLoginModal, isPostModalOpen, openPostModal } = useModalStore();

  const handlePostModalClick = () => {
    if (!authUser) {
      return openLoginModal();
    }
    openPostModal();
  };

  return (
    <>
      {authUser && isPostModalOpen && <PostModal />}
      <SideNav />
      <div className="w-full max-w-4xl p-8">
        <input
          type="text"
          className="w-full p-4 rounded-lg bg-[#232525] text-white mb-6"
          placeholder="What's on your mind?"
          onClick={handlePostModalClick}
        />
        {isGettingAllPosts && <FeedPageSkeleton />}
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
      <RightSidebar />
    </>
  );
}

export default FeedPage;
