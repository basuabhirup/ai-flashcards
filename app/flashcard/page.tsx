"use client";

import FlippableCard from "@/components/flippable-card";
import { Loader } from "@/components/loader";
import { db } from "@/config/firebase";
import { IFlashcard } from "@/util/interfaces";
import { SignedIn, useUser } from "@clerk/nextjs";
import { Button, Card, CardBody, Link } from "@nextui-org/react";
import { collection, doc, getDoc } from "firebase/firestore";
import { redirect, useSearchParams } from "next/navigation";
import { relative } from "path";
import { useEffect, useState } from "react";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [flashcards, setFlashcards] = useState<IFlashcard[]>([]);
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

  const searchParams = useSearchParams();
  const setName = searchParams.get("setName");

  const handleCardClick = (id: string) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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
    console.log(flipped);
  }, [flipped]);

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
              {`Flashcards Set for "${setName}"`}
            </h2>
            {flashcards.length > 0 && (
              <div className="flex w-full justify-center gap-x-4 gap-y-4 flex-wrap">
                {flashcards.map((card, index) => (
                  <div key={index}>
                    <FlippableCard
                      frontContent={card.front}
                      backContent={card.back}
                    />
                  </div>
                ))}
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
