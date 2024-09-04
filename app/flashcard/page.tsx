"use client";

import FlippableCard from "@/components/flippable-card";
import { Loader } from "@/components/loader";
import { db } from "@/config/firebase";
import { IFlashcard } from "@/util/interfaces";
import { SignedIn, useUser } from "@clerk/nextjs";
import { Button, Link, Progress } from "@nextui-org/react";
import { collection, doc, getDoc } from "firebase/firestore";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Flashcard() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<IFlashcard[]>([]);
  const [currIndex, setCurrIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  const searchParams = useSearchParams();
  const setName = searchParams.get("setName");

  const handlePrev = () => {
    if (currIndex > 0) {
      setDirection(-1);
      setCurrIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currIndex < flashcards.length - 1) {
      setDirection(1);
      setCurrIndex((prev) => prev + 1);
    } else {
      router.push("/flashcards");
    }
  };

  const variants = useMemo(
    () => ({
      enter: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
      }),
      center: {
        x: 0,
        opacity: 1,
      },
      exit: (direction: number) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
      }),
    }),
    [direction]
  );

  useEffect(() => {
    async function getFlashcard() {
      if (!setName || !user) return;

      setIsLoading(true);
      const docRef = doc(
        collection(doc(collection(db, "users"), user?.id), "flashcardSets"),
        setName
      );

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      }
      setIsLoading(false);
    }
    if (!!isLoaded) {
      getFlashcard();
    }
  }, [isLoaded, setName, user]);

  useEffect(() => {
    setDirection(0);
  }, [currIndex]);

  if (!isLoaded || isLoading) {
    return <Loader />;
  }

  if (!isSignedIn) {
    return redirect("/");
  }

  return (
    <>
      <section className="flex-grow bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto flex flex-col justify-start items-center w-full text-center lg:py-16 lg:px-12">
          <div className="max-w-screen-md mb-8 lg:mb-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              {setName}
            </h2>
            {flashcards.length > 0 && (
              <div className="flex flex-col w-full my-8 justify-center items-center gap-6">
                <Progress
                  color="secondary"
                  aria-label="Progress"
                  value={((currIndex + 1) * 100) / flashcards.length}
                />
                <div className="relative w-[240px] h-[320px]">
                  <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="popLayout"
                  >
                    <motion.div
                      key={currIndex}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.25 },
                      }}
                      className="absolute w-full h-full"
                    >
                      <FlippableCard
                        frontContent={flashcards[currIndex].front}
                        backContent={flashcards[currIndex].back}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex w-[270px] justify-between items-center my-8">
                  <Button
                    isIconOnly
                    as={Link}
                    size="lg"
                    color="secondary"
                    aria-label="Previous"
                    isDisabled={currIndex < 1}
                    onClick={handlePrev}
                  >
                    <ArrowLeft />
                  </Button>
                  <Button
                    isIconOnly
                    as={Link}
                    size="lg"
                    color="secondary"
                    aria-label="Next"
                    onClick={handleNext}
                  >
                    <ArrowRight />
                  </Button>
                </div>
              </div>
            )}
            {isLoaded && !isLoading && flashcards.length === 0 && (
              <>
                <div className="flex w-full justify-center text-sm pt-8">
                  No flashcards to display..
                </div>
                <SignedIn>
                  <Button
                    color="secondary"
                    className="mt-6 inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg"
                    as={Link}
                    href="/generate"
                  >
                    Generate Flashcards
                  </Button>
                </SignedIn>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
