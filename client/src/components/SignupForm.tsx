import { Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import type { CreateUserDTO } from "../types/user.types";

function SignupForm() {
  const { signup, isSigningUp } = useAuthStore();

  const submitSignupForm = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as unknown as CreateUserDTO;

    signup(data);
  };

  return (
    <form className="w-full flex flex-col gap-2 mt-6" onSubmit={(e) => submitSignupForm(e)}>
      <label>First Name</label>
      <input className="p-2 border border-[#2c2c2c] rounded-md " type="text" name="first_name" required />
      <label>Last name</label>
      <input className="p-2 border border-[#2c2c2c] rounded-md " type="text" name="last_name" required />
      <label>Username</label>
      <input className="p-2 border border-[#2c2c2c] rounded-md " type="text" name="username" required />
      <label>Email</label>
      <input className="p-2 border border-[#2c2c2c] rounded-md " type="text" name="email" required />
      <label>Password</label>
      <input className="p-2 border border-[#2c2c2c] rounded-md " type="password" name="password" required />
      <button className="p-2 bg-[#FE6719] rounded-md mt-2 flex items-center justify-center">
        {isSigningUp ? <Loader2 className="animate-spin" /> : "Sign up"}
      </button>
    </form>
  );
}

export default SignupForm;
