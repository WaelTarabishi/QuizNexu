import prismadb from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export default function Home() {
  const { userId } = auth();

  console.log(userId, "this is user");
  return <div></div>;
}
