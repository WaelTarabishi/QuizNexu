import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { quizCreationSchema } from "@/app/schemas/forms/quiz";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/db";

export async function POST(req: Request, res: Response) {
  try {
    const { userId } = auth();

    if (!userId) {
      console.log("Unauthorized user:", userId);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Request body:", req.body);
    const body = await req.json();
    console.log("Parsed request body:", body);

    const { topic, type, amount } = quizCreationSchema.parse(body);
    console.log("Parsed quiz data:", { topic, type, amount });

    const game = await prismadb.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId,
        topic,
      },
    });
    console.log("Created game:", game);

    await prismadb.topicCount.upsert({
      where: { topic },
      create: {
        topic,
        count: 1,
      },
      update: {
        count: {
          increment: 1,
        },
      },
    });

    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });
    console.log("Received questions data:", data);

    if (type === "mcq") {
      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };

      const manyData = data.questions.map((question: mcqQuestion) => {
        const options = [
          question.option1,
          question.option2,
          question.option3,
          question.answer,
        ].sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: "mcq",
        };
      });
      console.log("Prepared MCQ questions data:", manyData);

      await prismadb.question.createMany({
        data: manyData,
      });
      console.log("Created MCQ questions in database");
    } else if (type === "open_ended") {
      type openQuestion = {
        question: string;
        answer: string;
      };
      await prismadb.question.createMany({
        data: data.questions.map((question: openQuestion) => {
          return {
            question: question.question,
            answer: question.answer,
            gameId: game.id,
            questionType: "open_ended",
          };
        }),
      });
      console.log("Created open-ended questions in database");
    }

    return NextResponse.json({ gameId: game.id }, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.issues);
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        {
          status: 500,
        }
      );
    }
  }
}
