import { Loader2 } from "lucide-react";
import { useLocationStore } from "../store/useLocationStore";
import { usePostStore } from "../store/usePostStore";

interface DeleteModalProps {
  postId: string;
  ref: React.RefObject<HTMLDialogElement | null>;
  handleDeleteModalClick: () => void;
}

function DeleteModal({ ref, postId, handleDeleteModalClick }: DeleteModalProps) {
  const { deletePost, isDeletingPost } = usePostStore();
  const { placeId } = useLocationStore();

  const handleDeletePost = async (e: React.MouseEvent<HTMLButtonElement>, postId: string) => {
    e.preventDefault();

    if (!placeId) {
      console.error("Cannot create post: You are not in a transient place.");
      return;
    }

    await deletePost(postId);
    handleDeleteModalClick();
  };

  return (
    <dialog ref={ref} className="m-auto backdrop:bg-black/60">
      <h1>Are you sure you want to delete this post?</h1>
      <div className="flex gap-4">
        <button onClick={handleDeleteModalClick}>Cancel</button>
        {isDeletingPost ? (
          <Loader2 className="animate-spin" />
        ) : (
          <button onClick={(e) => handleDeletePost(e, postId)}>Delete</button>
        )}
      </div>
    </dialog>
  );
}

export default DeleteModal;
