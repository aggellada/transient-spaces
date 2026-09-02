import { Loader2, Lollipop, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import type { LoginUserDTO } from "../types/user.types";
import { useEffect } from "react";

interface LoginModalProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  handleLoginModalClick: () => void;
}

function LoginModal({ ref, handleLoginModalClick }: LoginModalProps) {
  const { login, isLoggingIn, authUser, loginError } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      handleLoginModalClick();
    }
  }, [authUser]);

  const submitLoginForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown as LoginUserDTO;

    await login(data);
  };
  return (
    <dialog
      className="m-auto w-full max-w-md max-h-90 h-full bg-[#161718] flex flex-col p-6 rounded-xl border border-[#2c2c2c] backdrop:bg-black/60"
      ref={ref}
      onClose={handleLoginModalClick}
    >
      <div className="flex w-full h-full items-center text-white flex-col gap-1 relative">
        <X
          className="absolute right-0 top-0 text-[#2c2c2c] hover:text-white transition hover:cursor-pointer"
          onClick={handleLoginModalClick}
        />
        <Lollipop className="text-[#FE6719] size-12 bg-[#FE6719]/20 p-1 rounded-lg mb-4 " />
        <h1>Sign in to name</h1>
        <p className="text-[#FE6719]">
          <span className="text-[#7e7e7e]">First time here?</span> Create account
        </p>
        <form className="flex flex-col w-full gap-4 mt-4" onSubmit={submitLoginForm}>
          <input
            type="text"
            className="p-2 border border-[#2c2c2c] rounded-md "
            name="username"
            placeholder="Your username"
            required
          />
          <input
            type="password"
            name="password"
            className="p-2 border border-[#2c2c2c] rounded-md"
            placeholder="Your password"
            required
          />
          {loginError && <span className="text-red-500 flex justify-end">{loginError}</span>}
          <button
            type="submit"
            className="bg-[#FE6719] p-2 rounded-lg hover:bg-[#ff874b] transition hover:cursor-pointer flex items-center justify-center"
          >
            {isLoggingIn ? <Loader2 className="animate-spin" /> : "Continue"}
          </button>
        </form>
      </div>
    </dialog>
  );
}

export default LoginModal;
