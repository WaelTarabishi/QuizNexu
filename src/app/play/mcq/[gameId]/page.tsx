import MCQ from "@/components/games/mcq/mcq-game";
import prismadb from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
  params: {
    gameId: string;
  };
};

const MCQPage = async ({ params: { gameId } }: Props) => {
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
          options: true,
        },
      },
    },
  });
  if (!game || game.gameType === "open_ended") {
    return redirect("/quiz");
  }
  console.log(game);
  return <MCQ game={game} />;
};

export default MCQPage;
