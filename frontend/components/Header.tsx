import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";

const Header = () => {
  return (
    <header className="border-b border-gray-800 bg-gray-900">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Image src={'/icon.svg'} alt="PrepPilot Icon" width={32} height={32} />
          <h1 className="text-2xl font-semibold font-mono">PrepPilot</h1>
          <span className="px-2 py-0.5 text-xs font-medium bg-green-600 text-white rounded-full">
            v1.0
          </span>
        </div>
        <div className="flex justify-center items-center">
          <SignedOut>
            <div className="flex justify-center items-center gap-3">
              <SignInButton>
                <button className="text-xs cursor-pointer ">Sign In</button>
              </SignInButton>
              <SignUpButton>
                <button className="text-xs border-1 border-white p-1 rounded-sm cursor-pointer hidden md:block">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
