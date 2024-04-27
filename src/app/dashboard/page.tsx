import HistoryCard from "@/components/dashboard/history-card";
import HotTopicsCard from "@/components/dashboard/hot-topics-card";
import QuizMeCard from "@/components/dashboard/quiz-me";
import RecentActivityCard from "@/components/dashboard/recent-activity-card";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {};

export const metadata = {
  title: "Dashboard | Quizzzy",
  description: "Quiz yourself on anything!",
};

const Dasboard = async (props: Props) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  return (
    <main className="p-8 mx-auto max-w-7xl mt-10">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
        {/* <DetailsDialog /> */}
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <HotTopicsCard />
        <RecentActivityCard />
      </div>
    </main>
  );
};

export default Dasboard;
