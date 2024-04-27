import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

type Props = {};

const RecentActivityCard = async (props: Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  //   const games_count = await prisma.game.count({
  //     where: {
  //       userId: session.user.id,
  //     },
  //   });
  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <Link href="/history">Recent Activity</Link>
        </CardTitle>
        <CardDescription>You have played a total of quizzes.</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-scroll">
        {/* <HistoryComponent limit={10} userId={session.user.id} /> */}
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
