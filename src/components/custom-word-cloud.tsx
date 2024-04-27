"use client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import D3WordCloud from "react-d3-cloud";

type Props = {
  formattedTopics: { text: string; value: number }[];
};

const data = [
  {
    text: "hello",
    value: 2,
  },
  {
    text: "Data",
    value: 10,
  },
  {
    text: "GGGG",
    value: 29,
  },
  {
    text: "FFFF",
    value: 49,
  },
  {
    text: "TTTT",
    value: 40,
  },
  {
    text: "DDDD",
    value: 20,
  },
  {
    text: "SSSSS",
    value: 10,
  },
];

const fontSizeMapper = (word: { value: number }) =>
  Math.log2(word.value) * 5 + 16;

const WordCloud = () => {
  const theme = useTheme();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) return null;
  return (
    <>
      <D3WordCloud
        data={data}
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === "dark" ? "white" : "black"}
        onWordClick={(e, d) => {
          router.push("/quiz?topic=" + d.text);
        }}
      />
    </>
  );
};

export default WordCloud;
