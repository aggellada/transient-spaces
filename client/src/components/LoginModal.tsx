import { Loader2, Lollipop, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import type { LoginUserDTO } from "../types/user.types";
import { useEffect, useRef } from "react";
import { useModalStore } from "../store/useModalStore";

function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useModalStore();
  const { login, isLoggingIn, authUser, loginError } = useAuthStore();

  const loginModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (authUser && isLoginModalOpen) {
      closeLoginModal();
    }
  }, [authUser, isLoginModalOpen, closeLoginModal]);

  useEffect(() => {
    const dialog = loginModalRef.current;
    if (!dialog) return;

    if (isLoginModalOpen && !authUser) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isLoginModalOpen, authUser]);

  const submitLoginForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown as LoginUserDTO;

    await login(data);
  };

  return (
    <dialog
      className="m-auto w-full max-w-md bg-[#161718] p-6 rounded-xl border border-[#2c2c2c] backdrop:bg-black/60"
      ref={loginModalRef}
      onClose={closeLoginModal}
    >
      <div className="flex w-full h-full items-center text-white flex-col gap-1 relative">
        <X
          className="absolute right-0 -top-2 text-[#2c2c2c] hover:text-white transition hover:cursor-pointer"
          onClick={closeLoginModal}
        />
        <Lollipop className="text-[#FE6719] size-12 bg-[#FE6719]/20 p-1 rounded-lg mb-4" />
        <h1>Sign in to Commulink</h1>
        <p className="text-[#FE6719]">
          <span className="text-[#7e7e7e]">First time here?</span> Create account
        </p>

        <form className="flex flex-col w-full gap-4 mt-4" onSubmit={submitLoginForm}>
          <input
            type="text"
            className="p-2 border border-[#2c2c2c] rounded-md outline-none focus:border-[#FE6719] transition bg-transparent"
            name="username"
            placeholder="Your username"
            required
          />
          <input
            type="password"
            name="password"
            className="p-2 border border-[#2c2c2c] rounded-md outline-none focus:border-[#FE6719] transition bg-transparent"
            placeholder="Your password"
            required
          />

          {loginError && (
            <span className="text-red-500 text-sm flex justify-center text-center">{loginError}</span>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="bg-[#FE6719] p-2 rounded-lg hover:bg-[#ff874b] transition hover:cursor-pointer flex items-center justify-center disabled:opacity-50 mt-2"
          >
            {isLoggingIn ? <Loader2 className="animate-spin" /> : "Continue"}
          </button>
        </form>
      </div>
    </dialog>
  );
}

export default LoginModal;
