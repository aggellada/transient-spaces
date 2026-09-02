import { House, Lollipop, Menu, MessagesSquare, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function SideNav() {
  const { authUser, logout } = useAuthStore();

  const submitLogoutForm = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    logout();
  };

  return (
    <div className="w-full max-w-3xs bg-[#161718] text-gray-300 sticky top-0 h-screen flex flex-col justify-between">
      <div className="flex flex-col p-8 gap-8">
        <Lollipop className="size-10 text-[#FE6719]" />
        <ul className="flex flex-col gap-8">
          <li className="flex gap-4">
            <House />
            <span>Home</span>
          </li>
          <li className="flex gap-4">
            <MessagesSquare />
            <span>Chats</span>
          </li>
          <li className="flex gap-4">
            <User />
            <span>Profile</span>
          </li>
        </ul>
      </div>
      <div className="p-8">
        {authUser && (
          <form onSubmit={submitLogoutForm}>
            <button>Logout</button>
          </form>
        )}
        <div className="flex gap-4 items-center hover:cursor-pointer rounded-md hover:bg-gray-700 p-2">
          <Menu className="size-5" />
          <button className="text-md hover:cursor-pointer">More</button>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
