import { useLocationStore } from "../store/useLocationStore";
import { usePostStore } from "../store/usePostStore";

interface DeleteModalProps {
  postId: string;
  ref: React.RefObject<HTMLDialogElement | null>;
  handleDeleteModalClick: () => void;
}

function DeleteModal({ ref, postId, handleDeleteModalClick }: DeleteModalProps) {
  const { deletePost } = usePostStore();
  const { placeId } = useLocationStore();

  const handleDeletePost = async (postId: string) => {
    if (placeId) {
      await deletePost(postId, placeId);
      handleDeleteModalClick();
    } else {
      console.error("Cannot create post: You are not in a transient place.");
    }
  };

  return (
    <dialog ref={ref} className="m-auto backdrop:bg-black/60">
      <form>
        <h1>Are you sure you want to delete this post?</h1>
        <div className="flex gap-4">
          <button onClick={handleDeleteModalClick}>Cancel</button>
          <button onClick={() => handleDeletePost(postId)}>Delete</button>
        </div>
      </form>
    </dialog>
  );
}

export default DeleteModal;
