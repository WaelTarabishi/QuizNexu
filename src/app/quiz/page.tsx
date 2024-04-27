import React from "react";

// import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import QuizCreation from "@/components/dashboard/form/quiz-creation";

export const metadata = {
  title: "Quiz | QuizNexus",
  description: "Quiz yourself on anything!",
};

interface Props {
  searchParams: {
    topic?: string;
  };
}

const Quiz = async ({ searchParams }: Props) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  return <QuizCreation topic={searchParams.topic ?? ""} />;
};

export default Quiz;
