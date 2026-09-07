import { Lollipop } from "lucide-react";
import SignupForm from "../../components/SignupForm";
import { useModalStore } from "../../store/useModalStore";

function SignUpPage() {
  const { openLoginModal } = useModalStore();
  return (
    <div className="w-full h-screen flex justify-center items-center text-white bg-[#131414]">
      <div className="w-full h-fit p-8 max-w-md rounded-lg flex justify-center items-center flex-col ">
        <Lollipop className="text-[#FE6719] size-12 bg-[#FE6719]/20 p-1 rounded-lg mb-4 " />
        <h1 className="font-bold text-2xl">Create your account</h1>
        <p className="text-[#FE6719]">
          <span className="text-[#7e7e7e]">Already have an account?</span>{" "}
          <span onClick={openLoginModal}>Sign in</span>
        </p>
        <SignupForm />
      </div>
    </div>
  );
}

export default SignUpPage;
