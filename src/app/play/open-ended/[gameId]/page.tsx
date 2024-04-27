// import OpenEnded from "@/components/OpenEnded";
import prismadb from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    gameId: string;
  };
};

const OpenEndedPage = async ({ params: { gameId } }: Props) => {
  const { userId } = auth();
  if (!userId) redirect("/");

  const game = await prismadb.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          answer: true,
        },
      },
    },
  });
  if (!game || game.gameType === "mcq") {
    return redirect("/quiz");
  }
  //   return <OpenEnded game={game} />;
};

export default OpenEndedPage;
