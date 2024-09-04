"use client";

import { Loader } from "@/components/loader";
import { db } from "@/config/firebase";
import { SignedIn, useUser } from "@clerk/nextjs";
import { Button, Card, CardBody, Link } from "@nextui-org/react";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardSets, setFlashcardSets] = useState<{ name: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      setIsLoading(true);
      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcardSets || [];
        setFlashcardSets(collections);
      } else {
        await setDoc(docRef, { flashcardSets: [] });
      }
      setIsLoading(false);
    }
    if (!!isLoaded) {
      getFlashcards();
    }
  }, [isLoaded, user]);

  return (
    <>
      <section id="flashcards" className="flex-grow bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto flex flex-col justify-start items-center w-full text-center lg:py-16 lg:px-12">
          <div className="max-w-screen-md mb-8 lg:mb-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              My Flashcard Sets
            </h2>
            {(!isLoaded || isLoading) && (
              <div className="flex flex-col justify-center items-center min-h-[250px]">
                <Loader />
              </div>
            )}
            {flashcardSets.length > 0 && (
              <div className="flex w-full justify-center gap-x-4 gap-y-4 flex-wrap">
                {flashcardSets.map((set, index) => (
                  <Card
                    className="min-h-[150px] w-[150px] dark:bg-gray-800"
                    key={index}
                    as={Link}
                    href={`/flashcard?setName=${set.name}`}
                  >
                    <CardBody className="flex flex-col justify-center items-center text-center">
                      <p className="text-sm text-foreground-500 font-bold mb-4">
                        {set.name}
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
            {isLoaded && !isLoading && flashcardSets.length === 0 && (
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
