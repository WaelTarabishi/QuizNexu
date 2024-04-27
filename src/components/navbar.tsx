import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ModeToggle } from "./theme-toggel";

const Navbar = async () => {
  const { userId } = auth();
  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-black z-[10] h-fit border-b border-zinc-300  py-2 ">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
            QuizNexus
          </p>
        </Link>
        <div className="flex items-center">
          <ModeToggle />
          {userId ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link href={"sign-in"}>Sign in</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
