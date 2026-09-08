import { useParams } from "react-router";
import SideNav from "../../components/SideNav";
import { useEffect } from "react";
import { usePostStore } from "../../store/usePostStore";
import { CircleUser, Heart, MessageSquareMore } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useModalStore } from "../../store/useModalStore";
import CommentModal from "../../components/CommentModal";
import PostPageSkeleton from "../../components/skeleton/PostPageSkeleton";
import RightSidebar from "../../components/RightSidebar";

function PostPage() {
  const { id } = useParams();

  const { getPost, post, resetPost, isGettingPost, deleteComment } = usePostStore();
  const { authUser } = useAuthStore();
  const { openCommentModal } = useModalStore();

  useEffect(() => {
    if (id) {
      getPost(id);
    }

    return () => {
      resetPost();
    };
  }, [id]);

  const handleCommentClick = () => {
    openCommentModal();
  };

  const handleDeleteComment = (commentId: string) => {
    if (!post) return;
    deleteComment(commentId, post.id);
  };

  console.log(post);

  if (isGettingPost) return <PostPageSkeleton />;

  return (
    <>
      <CommentModal />
      <SideNav />
      <div className="w-full max-w-2xl min-h-screen">
        <div className="w-full text-white">
          <div className="w-full text-white flex gap-4 pb-4 pt-6">
            <CircleUser className="size-10" />
            <div className="w-full flex flex-col">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <h1 className="font-bold text-md">
                    {post?.creator_first_name} {post?.creator_last_name}
                  </h1>
                  <span className="text-[#777777]">5d ago</span>
                </div>
                <div className="flex gap-4">
                  <span className="p-2 text-white bg-[#FE6719] rounded-lg text-sm font-semibold ">
                    Subscribe
                  </span>
                  <span className="text-[#777777]">...</span>
                  <span className="text-[#777777]">Delete</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mb-4">
            <p>{post?.description}</p>
          </div>
          <div className="w-full flex gap-8 border-b pb-4 border-[#777777]">
            <button className={`flex gap-2 text-[#777777] hover:cursor-pointer`} disabled={!authUser}>
              <Heart className={` `} />
              <span>{post?.like_count}</span>
            </button>
            <div className="flex gap-2 text-[#777777]">
              <MessageSquareMore />
              <span>{post?.comments_count}</span>
            </div>
          </div>
          <div className="flex gap-4 py-4 border-b border-[#777777] mb-6">
            <button className={`flex gap-2 text-[#777777] hover:cursor-pointer`} disabled={!authUser}>
              <span>{post?.like_count} Likes</span>
            </button>
            <div className="flex gap-2 text-[#777777] ">
              <span>{post?.comments_count} Comments</span>
            </div>
          </div>
        </div>
        {authUser && (
          <input
            type="text"
            className="w-full p-4 rounded-lg bg-[#232525] text-white mb-6"
            placeholder="Leave a comment"
            onClick={handleCommentClick}
            disabled={!authUser}
          />
        )}
        <div className="w-full text-white">
          {post?.post_comments.map((comment) => (
            <div key={comment.comment_id} className="w-full text-white flex gap-4 pb-4 pt-6">
              <CircleUser className="size-10" />
              <div className="w-full">
                <div className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <h1 className="font-bold text-md">
                        {comment?.comment_creator_first_name} {comment?.comment_creator_last_name}
                      </h1>
                      <span className="text-[#777777]">5d ago</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-[#777777]">...</span>
                      {authUser?.profile_id === comment.comment_creator_profile_id && (
                        <span
                          className="text-[#777777]"
                          onClick={() => handleDeleteComment(comment.comment_id)}
                        >
                          X
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p>{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-sm ">{!authUser && <RightSidebar />}</div>
    </>
  );
}

export default PostPage;
