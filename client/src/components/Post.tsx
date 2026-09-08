import { CircleUser, Heart, MessageSquareMore } from "lucide-react";
import type { PostDTO } from "../types/posts.types";
import { usePostStore } from "../store/usePostStore";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import DeleteModal from "./DeleteModal";
import { useNavigate } from "react-router";
import { useModalStore } from "../store/useModalStore";

interface PostProps {
  post: PostDTO;
}

function Post({ post }: PostProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { likePost, unlikePost } = usePostStore();
  const { authUser } = useAuthStore();
  const { openLoginModal } = useModalStore();

  const navigate = useNavigate();

  const deleteModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (showDeleteModal) {
      deleteModalRef.current?.showModal();
    } else {
      deleteModalRef.current?.close();
    }
  }, [showDeleteModal]);

  const handleCommentsClick = (postId: string) => {
    navigate(`/posts/${postId}`);
  };

  const handleLikePost = (postId: string) => {
    if (!authUser) {
      openLoginModal();
      return;
    }

    likePost(postId);
  };

  const handleUnlikePost = (postId: string) => {
    unlikePost(postId);
  };

  const handleDeleteModalClick = () => {
    setShowDeleteModal((prev) => !prev);
  };

  console.log(post, authUser?.profile_id);

  return (
    <>
      {showDeleteModal && (
        <DeleteModal ref={deleteModalRef} postId={post.id} handleDeleteModalClick={handleDeleteModalClick} />
      )}
      <div className="w-full text-white flex gap-4 border-b pb-10 pt-6 border-[#777777]">
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
              <span className="text-[#FE6719] text-sm ">Subscribe</span>
              <span className="text-[#777777]">...</span>
              {post.creator_id === authUser?.profile_id && (
                <span className="text-[#777777]" onClick={handleDeleteModalClick}>
                  X
                </span>
              )}
            </div>
          </div>
          <div className="w-full mb-4">
            <p>{post.description}</p>
          </div>
          <div className="w-full flex gap-8">
            <button
              className={`flex gap-2 text-[#777777] ${!post.is_liked_by_user && "hover:text-red-500"} ${post.is_liked_by_user && "text-red-500"} hover:cursor-pointer`}
              onClick={
                post.is_liked_by_user ? () => handleUnlikePost(post.id) : () => handleLikePost(post.id)
              }
            >
              <Heart className={` `} />
              <span>{post.like_count}</span>
            </button>
            <div className="flex gap-2 text-[#777777]" onClick={() => handleCommentsClick(post.id)}>
              <MessageSquareMore />
              <span>{post.comments_count}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
