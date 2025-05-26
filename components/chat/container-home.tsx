"use client";

import { memo, useCallback, useEffect, useState } from "react";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";

import { SportingbetDot } from "../ui/dot";

import { useGlobalState } from "@/store/useState";

import Image from "next/image";

import useGetImageUrl from "@/hooks/use-get-image-url";

import ScrollingRow from "@/components/chat/scrolling-row";

const ContainerHome = ({ query }: { query: string }) => {
  const router = useRouter();
  const [input, setInput] = useState(query);

  const state = useGlobalState((state: any) => state.trending);
  const trendingArticle = state.trendingResults.data?.[0]?.value;
  const topQuestions = trendingArticle?.related_questions || [];
  const user_id = "123";

  const [debouncedInput, setDebouncedInput] = useState(input);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      router.push(`/chat/new?q=${encodeURIComponent(input)}&user_id=${user_id}`);
    },
    [input, router]
  );

  const handleSampleQuery = useCallback((text: string) => {
    setInput(text);
  }, []);

  const getInputPlaceholder = useCallback(() => {
    return "Busque por times, jogos ou odds...";
  }, []);

  const firstHalf = topQuestions.slice(0, Math.ceil(topQuestions.length / 2));
  const secondHalf = topQuestions.slice(Math.ceil(topQuestions.length / 2));

    return (
      <div className="flex flex-col h-screen bg-background pt-12 md:pt-0">
        <div className="flex-1 overflow-auto hide-scrollbar momentum-scroll pb-32 pt-4 md:pb-24">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4">
            {trendingArticle?.image_path ? (
              <div className="relative w-full overflow-hidden rounded-lg aspect-[3/2] max-w-[420px] mb-12">
                <Image
                  src={useGetImageUrl(trendingArticle)}
                  alt={trendingArticle?.title || "Imagem de destaque"}
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1000px"
                  quality={85}
                />
              </div>
            ) : (
              <div className="w-full max-w-[420px] mb-12 aspect-[3/2]" />
            )}
  
            <h1 className="text-center mb-4 sm:mb-6 flex items-center gap-3 justify-center">
              Qual vai ser a sua aposta?
              <SportingbetDot size={28} className="ml-1" />
            </h1>
  
            <div className="w-full max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={getInputPlaceholder()}
                  className="w-full h-12 pl-4 pr-12 rounded-lg bg-secondary/90 border-0"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
  
            <div className="mt-4 sm:mt-6 w-full max-w-xl mx-auto px-1">
              <div className="w-full relative flex flex-col gap-2 md:gap-3">
                <ScrollingRow questions={firstHalf} onSampleQuery={handleSampleQuery} />
                <ScrollingRow questions={secondHalf} onSampleQuery={handleSampleQuery} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default memo(ContainerHome);
