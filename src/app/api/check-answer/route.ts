import { checkAnswerSchema } from "@/app/schemas/questions";
import prismadb from "@/lib/db";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();

    const { questionId, userInput } = checkAnswerSchema.parse(body);

    const question = await prisma?.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }
    if (question.questionType === "mcq") {
      const isCorrect =
        question.answer.toLowerCase().trim() === userInput.toLowerCase().trim();

      if (question.questionType === "mcq") {
        const isCorrect =
          question.answer.toLowerCase().trim() ===
          userInput.toLowerCase().trim();
        await prismadb.question.update({
          where: { id: questionId },
          data: { isCorrect },
        });
        return NextResponse.json({
          isCorrect,
        });
      }
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
  }
}
