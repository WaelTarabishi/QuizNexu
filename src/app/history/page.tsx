import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LucideLayoutDashboard } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import HistoryComponent from "./_component/history";

type Props = {};

const History = async (props: Props) => {
  const { userId } = auth();
  if (!userId) redirect("/");
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full px-20 my-10 ">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">History</CardTitle>
            <Link className={buttonVariants()} href="/dashboard">
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </CardHeader>
        <CardContent className="max-h-[75vh] overflow-scroll">
          <HistoryComponent limit={100} userId={userId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
