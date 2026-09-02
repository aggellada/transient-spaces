import { Lollipop, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router";

interface RightSidebarProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  handleLoginModalClick: () => void;
  showLoginModal: boolean;
}
function RightSidebar({ ref, handleLoginModalClick, showLoginModal }: RightSidebarProps) {
  const { authUser } = useAuthStore();

  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <>
      {showLoginModal && <LoginModal ref={ref} handleLoginModalClick={handleLoginModalClick} />}
      <div className="w-full max-w-sm bg-[#161718] p-8 text-gray-300 flex flex-col gap-6 sticky top-0 h-screen">
        <div className="relative">
          <Search className="absolute left-4 top-2.5 text" />
          <input
            type="text"
            className="w-full bg-[#1B1C1D] p-2 pl-12 rounded-2xl border-[#2F3031] border-2"
            placeholder="Search transient place"
          />
        </div>
        {!authUser && (
          <div className="w-full bg-[#1B1C1D] p-4 rounded-2xl border-[#2F3031] border-2 flex justify-center items-center flex-col text-center gap-2 ">
            <Lollipop className="size-10 text-[#FE6719]" />
            <h1 className="font-bold text-2xl">Log in or sign up</h1>
            <p>Join the most interesting and insightful discussions.</p>
            <button className="bg-[#FE6719] text-white w-full p-2 rounded-lg" onClick={handleSignupClick}>
              Sign up
            </button>
            <button className="bg-[#363737] text-white w-full p-2 rounded-lg" onClick={handleLoginModalClick}>
              Log in
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default RightSidebar;
