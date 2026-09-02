import { CircleUser, Heart, MessageSquareMore } from "lucide-react";
import type { PostDTO } from "../types/posts.types";
import { usePostStore } from "../store/usePostStore";
import { useState } from "react";

interface PostProps {
  post: PostDTO;
}

function Post({ post }: PostProps) {
  const [isLikedByUser, setIsLikedByUser] = useState(post.is_liked_by_user);
  const [likesCount, setLikesCount] = useState(post.like_count);

  const { likePost, unlikePost } = usePostStore();

  const handleLikePost = (postId: string) => {
    setIsLikedByUser(true);
    setLikesCount((prev) => prev + 1);
    likePost(postId);
  };

  const handleUnlikePost = (postId: string) => {
    setIsLikedByUser(false);
    setLikesCount((prev) => prev - 1);
    unlikePost(postId);
  };

  return (
    <div key={post.id} className="w-full text-white flex gap-4 border-b pb-10 pt-6 border-[#777777]">
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
            <span className="text-[#777777]">X</span>
          </div>
        </div>
        <div className="w-full mb-4">
          <p>{post.description}</p>
        </div>
        <div className="w-full flex gap-8">
          <div
            className={`flex gap-2 text-[#777777] ${!isLikedByUser && "hover:text-red-500"} ${isLikedByUser && "text-red-500"} hover:cursor-pointer`}
            onClick={isLikedByUser ? () => handleUnlikePost(post.id) : () => handleLikePost(post.id)}
          >
            <Heart className={` `} />
            <span>{likesCount}</span>
          </div>
          <div className="flex gap-2 text-[#777777]">
            <MessageSquareMore />
            <span>{post.comments_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
