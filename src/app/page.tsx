import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prismadb from "@/lib/db";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = auth();
  if (userId) {
    // Check if the user already exists in the database
    const existingUser = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      // If the user doesn't exist, create a new user record in the database
      await prismadb.user.create({
        data: {
          id: userId,
        },
      });
    }

    redirect("/dashboard");
  }
  if (!userId) {
    return (
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle>Welcome to QuizNexu 🔥!</CardTitle>
            <CardDescription>
              Quizzzy is a platform for creating quizzes using AI!. Get started
              by loggin in below!
            </CardDescription>
            <Link
              href={"/sign-in"}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  className: "dark:bg-zinc-950  dark:hover:bg-zinc-900  ",
                })
              )}>
              Sign in{" "}
            </Link>
          </CardHeader>
        </Card>
      </div>
    );
  }
}
