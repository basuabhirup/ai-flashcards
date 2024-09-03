"use client";

import { useState } from "react";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { IFlashcard } from "@/util/interfaces";
import { Loader } from "@/components/loader";
import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Save, SaveAll, Sparkles } from "lucide-react";

export default function Generate() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState<IFlashcard[]>([]);
  const [setName, setSetName] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return <Loader />;
  }

  if (!isSignedIn) {
    return redirect("/");
  }

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }
    setIsLoading(true);

    try {
      const userDocRef = doc(collection(db, "users"), user?.id);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, { flashcardSets: [{ name: setName }] });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      batch.set(setDocRef, { flashcards });

      await batch.commit();

      alert("Flashcards saved successfully!");
      onClose();
      setSetName("");
      router.push("/flashcards");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section id="generate" className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto flex flex-col justify-start items-center w-full min-h-[85vh] text-center lg:py-16 lg:px-12">
          <div className="max-w-screen-md mb-8 lg:mb-16">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              {flashcards.length < 1
                ? "Enter your subject or theme for flashcards"
                : `Generated flashcards for "${text}"`}
            </h2>

            {flashcards.length < 1 && (
              <>
                <Textarea
                  label="Topic"
                  placeholder="E.g., Key facts about the Solar System..."
                  className="w-full"
                  disabled={isLoading}
                  onChange={(e) => setText(e.target.value)}
                />

                <Button
                  isLoading={isLoading}
                  size="sm"
                  color="secondary"
                  startContent={!isLoading && <Sparkles />}
                  className="mt-6 px-4 py-6 text-md"
                  onClick={handleSubmit}
                >
                  {isLoading ? "Generating Flashcards" : "Generate Flashcards"}
                </Button>
              </>
            )}

            {flashcards.length > 0 && (
              <>
                <div className="flex w-full justify-center gap-x-4 gap-y-4 flex-wrap">
                  {flashcards.map((card, index) => (
                    <Card className="min-h-[200px] w-[180px]" key={index}>
                      <CardBody className="flex flex-col justify-center items-center text-center">
                        <p className="text-sm text-foreground-500 font-bold mb-4">
                          {card.front}
                        </p>
                        <p className="text-sm text-foreground-500">
                          {card.back}
                        </p>
                      </CardBody>
                    </Card>
                  ))}
                </div>
                <Button
                  isLoading={isLoading}
                  size="sm"
                  color="secondary"
                  startContent={!isLoading && <SaveAll />}
                  className="mt-6 px-4 py-6 text-md"
                  onPress={onOpen}
                >
                  {isLoading ? "Saving Flashcards" : "Save Flashcards"}
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Save Flashcards Set
              </ModalHeader>
              <ModalBody className="flex flex-col items-center px-6 py-8">
                <Input
                  type="text"
                  color="secondary"
                  autoFocus
                  label="Set Name"
                  fullWidth
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                />
                <Button
                  color="secondary"
                  startContent={!isLoading && <Save size={16} />}
                  className="mt-2 mb-4 ml-auto"
                  onClick={saveFlashcards}
                  isLoading={isLoading}
                >
                  {isLoading ? "Saving" : "Save"}
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
