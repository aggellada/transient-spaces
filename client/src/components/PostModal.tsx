import { CircleUser, Loader2 } from "lucide-react";
import { usePostStore } from "../store/usePostStore";
import type { CreatePostDTO } from "../types/posts.types";
import { useLocationStore } from "../store/useLocationStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useRef } from "react";
import { useModalStore } from "../store/useModalStore";

function PostModal() {
  const { createPost, isCreatingPost } = usePostStore();
  const { placeId } = useLocationStore();
  const { authUser } = useAuthStore();

  const { closePostModal, isPostModalOpen } = useModalStore();

  const postModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = postModalRef.current;
    if (!dialog) return;

    if (isPostModalOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isPostModalOpen]);

  const submitCreatePostForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!placeId) {
      console.error("Cannot submit comment: placeId is missing.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown as CreatePostDTO;

    await createPost(data, placeId);
    closePostModal();
  };

  return (
    <dialog
      ref={postModalRef}
      className="m-auto w-full max-w-2xl max-h-70 h-full bg-[#161718] flex flex-col p-6 rounded-xl border border-[#2c2c2c] backdrop:bg-black/60"
      onClose={closePostModal}
    >
      <form className="w-full h-full flex flex-col" onSubmit={(e) => submitCreatePostForm(e)}>
        <div className="flex gap-2 text-white flex-1">
          <CircleUser className="size-10 shrink-0" />

          <div className="flex flex-col w-full">
            <span>{authUser?.first_name}</span>
            <input type="text" name="title" required />
            <textarea
              className="grow w-full bg-transparent resize-none outline-none mt-2"
              placeholder="What's on your mind?"
              name="description"
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            className="text-white p-4 py-2 w-24 bg-[#363737] rounded-md hover:bg-black transition hover:cursor-pointer"
            onClick={closePostModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-white w-24 flex justify-center items-center px-4 py-2 bg-[#FE6719] rounded-md hover:cursor-pointer"
            disabled={isCreatingPost}
          >
            {isCreatingPost ? <Loader2 className="animate-spin " /> : "Post"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default PostModal;
