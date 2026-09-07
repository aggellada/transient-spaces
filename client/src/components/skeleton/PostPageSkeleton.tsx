import { useParams } from "react-router";
import SideNav from "../../components/SideNav";
import { useEffect } from "react";
import { usePostStore } from "../../store/usePostStore";
import { CircleUser, Heart, MessageSquareMore } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useModalStore } from "../../store/useModalStore";
import CommentModal from "../../components/CommentModal";

function PostPageSkeleton() {
  const { id } = useParams();

  const { getPost, post, resetPost } = usePostStore();
  const { authUser } = useAuthStore();
  const { openCommentModal } = useModalStore();

  useEffect(() => {
    if (id) {
      getPost(id);
    }

    return () => {
      resetPost();
    };
  }, [id, getPost, resetPost]);

  const handleCommentClick = () => {
    openCommentModal();
  };

  // --- SKELETON UI ---
  // If the post hasn't loaded yet, show this animated placeholder
  if (!post) {
    return (
      <>
        <SideNav />
        <div className="w-full max-w-2xl h-screen">
          <div className="w-full text-white">
            {/* Skeleton Header */}
            <div className="w-full flex gap-4 pb-4 pt-6">
              <div className="size-10 rounded-full bg-[#232525] animate-pulse shrink-0" />
              <div className="w-full flex flex-col justify-center">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <div className="h-4 w-32 bg-[#232525] rounded animate-pulse" />
                    <div className="h-4 w-12 bg-[#232525] rounded animate-pulse" />
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="h-8 w-20 bg-[#232525] rounded-lg animate-pulse" />
                    <div className="h-4 w-4 bg-[#232525] rounded animate-pulse" />
                    <div className="h-4 w-4 bg-[#232525] rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Skeleton Body Text (3 lines) */}
            <div className="w-full mb-4 flex flex-col gap-2 pt-2">
              <div className="h-4 w-full bg-[#232525] rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-[#232525] rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-[#232525] rounded animate-pulse" />
            </div>

            {/* Skeleton Action Icons */}
            <div className="w-full flex gap-8 border-b pb-4 border-[#777777] mt-6">
              <div className="h-6 w-12 bg-[#232525] rounded animate-pulse" />
              <div className="h-6 w-12 bg-[#232525] rounded animate-pulse" />
            </div>

            {/* Skeleton Stats */}
            <div className="flex gap-4 py-4 border-b border-[#777777] mb-6">
              <div className="h-5 w-16 bg-[#232525] rounded animate-pulse" />
              <div className="h-5 w-24 bg-[#232525] rounded animate-pulse" />
            </div>
          </div>

          {/* Skeleton Comment Input (Matches layout if logged in) */}
          {authUser && <div className="w-full h-14 rounded-lg bg-[#232525] animate-pulse mb-6" />}
        </div>
        <div className="w-full max-w-sm "></div>
      </>
    );
  }

  // --- ACTUAL UI ---
  return (
    <>
      <CommentModal />
      <SideNav />
      <div className="w-full max-w-2xl h-screen">
        <div className="w-full text-white">
          <div className="w-full text-white flex gap-4 pb-4 pt-6">
            <CircleUser className="size-10" />
            <div className="w-full flex flex-col">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <h1 className="font-bold text-md">
                    {post.creator_first_name} {post.creator_last_name}
                  </h1>
                  <span className="text-[#777777]">5d ago</span>
                </div>
                <div className="flex gap-4">
                  <span className="p-2 text-white bg-[#FE6719] rounded-lg text-sm font-semibold hover:cursor-pointer hover:bg-[#ff874b] transition">
                    Subscribe
                  </span>
                  <span className="text-[#777777] hover:cursor-pointer">...</span>
                  <span className="text-[#777777] hover:cursor-pointer">X</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mb-4">
            <p>{post.description}</p>
          </div>
          <div className="w-full flex gap-8 border-b pb-4 border-[#777777]">
            <button
              className="flex gap-2 text-[#777777] hover:cursor-pointer disabled:opacity-50"
              disabled={!authUser}
            >
              <Heart className={post.is_liked_by_user ? "fill-red-500 text-red-500" : ""} />
              <span>{post.like_count}</span>
            </button>
            <div className="flex gap-2 text-[#777777] hover:cursor-pointer" onClick={handleCommentClick}>
              <MessageSquareMore />
              <span>{post.comments_count}</span>
            </div>
          </div>
          <div className="flex gap-4 py-4 border-b border-[#777777] mb-6">
            <button
              className="flex gap-2 text-[#777777] hover:cursor-pointer disabled:opacity-50"
              disabled={!authUser}
            >
              <span>{post.like_count} Likes</span>
            </button>
            <div className="flex gap-2 text-[#777777]">
              <span>{post.comments_count} Comments</span>
            </div>
          </div>
        </div>

        {authUser && (
          <input
            type="text"
            className="w-full p-4 rounded-lg bg-[#232525] text-white mb-6 outline-none focus:ring-1 focus:ring-[#FE6719] transition"
            placeholder="Leave a comment"
            onClick={handleCommentClick}
            readOnly // Prevents the keyboard from popping up on mobile since it opens a modal anyway
          />
        )}
      </div>
      <div className="w-full max-w-sm "></div>
    </>
  );
}

export default PostPageSkeleton;
