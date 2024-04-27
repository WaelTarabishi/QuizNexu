"use client";

import { Game, Question } from "@prisma/client";
import { BarChart, Loader2, Timer } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Button, buttonVariants } from "../../ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import MCQCounter from "./mcq-counter";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { checkAnswerSchema } from "@/app/schemas/questions";
import toast from "react-hot-toast";
import { cn, formatTimeDelta } from "@/lib/utils";
import Link from "next/link";
import { differenceInSeconds } from "date-fns";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
};

const MCQ = ({ game }: Props) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [now, setNow] = useState(new Date());

  const [choices, setChoices] = useState([
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
  ]);
  const [stats, setStats] = useState({
    correct_answers: 0,
    wrong_answers: 0,
  });
  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { mutate: checkAnswer, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice],
      };
      const response = await axios.post("/api/check-answer", payload);
      return response.data;
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const handleNext = useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          toast.success("Correct!");
          setStats((stats) => ({
            ...stats,
            correct_answers: stats.correct_answers + 1,
          }));
        } else {
          toast.error("Wrong.");
          setStats((stats) => ({
            ...stats,
            wrong_answers: stats.wrong_answers + 1,
          }));
        }
        if (questionIndex === game.questions.length - 1) {
          setQuestionIndex((prev) => prev + 1);
          setHasEnded(true);
        } else {
          setQuestionIndex((prev) => prev + 1);
        }
      },
    });
  }, [checkAnswer, game.questions.length, questionIndex, toast]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key === "1") {
        setSelectedChoice(0);
      } else if (key === "2") {
        setSelectedChoice(1);
      } else if (key === "3") {
        setSelectedChoice(2);
      } else if (key === "4") {
        setSelectedChoice(3);
      } else if (key === "Enter") {
        handleNext();
      } else if (key === "ArrowUp") {
        setSelectedChoice((prevChoice) => Math.max(0, prevChoice - 1));
      } else if (key === "ArrowDown") {
        setSelectedChoice((prevChoice) =>
          Math.min(choices.length - 1, prevChoice + 1)
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, setSelectedChoice, choices]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You Completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "mt-2"
          )}>
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          {/* topic */}
          <p>
            <span className="text-slate-400">Topic: </span> &nbsp;
            <span className="px-4 py-2 text-white rounded-lg bg-slate-800 ">
              {game.topic}
            </span>
          </p>
          <div className="flex self-start mt-3 text-slate-400">
            <Timer className="mr-2" />
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
          </div>
        </div>
        <MCQCounter
          correct_answers={stats.correct_answers}
          wrong_answers={stats.wrong_answers}
        />
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center justify-center">
          <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
            <div>{questionIndex + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-2xl ">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4  ">
        {options.map((option, index) => {
          return (
            <Button
              key={`${option}-${index}`}
              variant={selectedChoice === index ? "default" : "outline"}
              className={`justify-start w-full py-8 mb-4 ease-linear `}
              onClick={() => {
                handleNext();
              }}
              onMouseEnter={() => {
                setSelectedChoice(index);
              }}>
              <div className="flex items-center justify-start">
                <div className="p-2 px-3 mr-5 border rounded-md dark:border-white ">
                  {index + 1}
                </div>
                <div className="text-start">
                  {isLoading ? (
                    <div className="w-full flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-zinc-500 animate-spin" />
                    </div>
                  ) : (
                    option
                  )}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MCQ;
