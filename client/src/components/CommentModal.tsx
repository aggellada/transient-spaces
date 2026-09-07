import { useEffect, useRef } from "react";
import { useModalStore } from "../store/useModalStore";
import { Loader2, UserCircle } from "lucide-react";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import { useParams } from "react-router";
import type { CreateCommentDTO } from "../types/posts.types";

function CommentModal() {
  const { id } = useParams();

  const commentModalRef = useRef<HTMLDialogElement>(null);

  const { isCommentModalOpen, closeCommentModal } = useModalStore();
  const { post, commentPost, isCommenting } = usePostStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (isCommentModalOpen) {
      commentModalRef.current?.showModal();
    } else {
      commentModalRef.current?.close();
    }
  }, [isCommentModalOpen]);

  const submitCommentForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) {
      console.error("Cannot submit comment: Post ID is missing.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown as CreateCommentDTO;

    if (!authUser) return;

    await commentPost(id, data, authUser);
    closeCommentModal();
  };

  return (
    <dialog
      ref={commentModalRef}
      className="m-auto backdrop:bg-black/50 w-full max-w-2xl h-90 rounded-xl p-4 bg-[#161718] text-white"
      onClose={closeCommentModal}
    >
      <div className="flex flex-col w-full h-full">
        <div className="w-full flex justify-between mb-4 ">
          <div className="flex gap-2">
            <UserCircle className="size-8" />
            <div className="flex flex-col">
              <h1>
                {post?.creator_first_name} {post?.creator_last_name}
              </h1>
              <h1>{post?.description}</h1>
            </div>
          </div>
          <span>7d</span>
        </div>
        <div className="w-full flex justify-between flex-1 min-h-0">
          <div className="flex gap-2 w-full h-full">
            <UserCircle className="size-8" />
            <div className="flex flex-col w-full">
              <h1>{authUser?.first_name}</h1>
              <form id="comment-form" onSubmit={(e) => submitCommentForm(e)}>
                <textarea
                  className="w-full grow bg-transparent outline-none resize-none text-lg placeholder-gray-500"
                  placeholder="Post your reply..."
                  name="content"
                />
              </form>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end items-center gap-4 shrink-0">
          <button
            onClick={closeCommentModal}
            className="text-white hover:bg-white/20 bg-white/10 hover:cursor-pointer px-4 py-2 rounded-md transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#FE6719] hover:bg-[#ff874b] hover:cursor-pointer text-white px-5 py-2 rounded-md font-bold transition"
            form="comment-form"
            disabled={isCommenting}
          >
            {isCommenting ? <Loader2 className="animate-spin" /> : "Post"}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default CommentModal;
