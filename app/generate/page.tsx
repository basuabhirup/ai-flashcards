"use client";

import { useState, useEffect } from "react";
import { collection, doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { IFlashcard } from "@/util/interfaces";
import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Save, SaveAll, Sparkles, Edit, Trash } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY_PREFIX = "aiFlashGenerated";
const PROMPT_STORAGE_KEY = `${STORAGE_KEY_PREFIX}Prompt`;
const FLASHCARDS_STORAGE_KEY = `${STORAGE_KEY_PREFIX}Flashcards`;

export default function Generate() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState<IFlashcard[]>([]);
  const [setName, setSetName] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, isSignedIn, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const [editingCard, setEditingCard] = useState<IFlashcard | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);

  useEffect(() => {
    const storedPrompt = localStorage.getItem(PROMPT_STORAGE_KEY);
    const storedFlashcards = localStorage.getItem(FLASHCARDS_STORAGE_KEY);
    if (storedPrompt) {
      setText(storedPrompt);
    }
    if (storedFlashcards) {
      setFlashcards(JSON.parse(storedFlashcards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PROMPT_STORAGE_KEY, text);
  }, [text]);

  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(flashcards));
    }
  }, [flashcards]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter your text to generate flashcards.");
      return;
    }
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setIsLoading(true);

    try {
      const userDocRef = doc(collection(db, "users"), user?.id);
      const generatedFlashcardsRef = collection(
        userDocRef,
        "generatedFlashcards"
      );

      // Get the user's document to check their usage
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data() || {};
      const currentMonth = new Date().getMonth();
      const lastGenerationMonth = userData.lastGenerationMonth || -1;
      let monthlyCount = userData.monthlyGenerationCount || 0;

      // Reset the count if it's a new month
      if (currentMonth !== lastGenerationMonth) {
        monthlyCount = 0;
      }

      // Check if the user has exceeded the monthly limit
      const MONTHLY_LIMIT = process.env.NEXT_PUBLIC_MONTHLY_FLASHCARDS_LIMIT
        ? parseInt(process.env.NEXT_PUBLIC_MONTHLY_FLASHCARDS_LIMIT)
        : 10;
      if (monthlyCount >= MONTHLY_LIMIT) {
        toast.error(
          `You have reached your monthly limit (${MONTHLY_LIMIT} cards / month) for flashcard generation.`
        );
        setIsLoading(false);
        return;
      }

      // Make the API call to generate flashcards
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();

      // Update Firestore in a batch
      const batch = writeBatch(db);

      // Add the generated flashcards to the user's generatedFlashcards subcollection
      const newFlashcardDoc = doc(generatedFlashcardsRef);
      batch.set(newFlashcardDoc, {
        prompt: text,
        generatedFlashcards: data,
        timestamp: new Date(),
      });

      // Update user's usage data
      batch.set(
        userDocRef,
        {
          monthlyGenerationCount: monthlyCount + 1,
          lastGenerationMonth: currentMonth,
          lastGenerationTimestamp: new Date(),
        },
        { merge: true }
      );

      await batch.commit();

      setFlashcards(data);
      localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error generating flashcards:", error);
      toast.error(
        "An error occurred while generating flashcards. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcards set.");
      return;
    }
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setIsLoading(true);

    try {
      const userDocRef = doc(collection(db, "users"), user?.id);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);
      const currentTimestamp = new Date();

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const updatedSets = [
          ...(userData.flashcardSets || []),
          { name: setName, timestamp: currentTimestamp },
        ];
        batch.update(userDocRef, { flashcardSets: updatedSets });
      } else {
        batch.set(userDocRef, {
          flashcardSets: [{ name: setName, timestamp: currentTimestamp }],
        });
      }

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      batch.set(setDocRef, {
        flashcards,
        createdAt: currentTimestamp,
      });

      await batch.commit();

      toast.success("Flashcards saved successfully!");
      onClose();
      setSetName("");
      localStorage.removeItem(PROMPT_STORAGE_KEY);
      localStorage.removeItem(FLASHCARDS_STORAGE_KEY);
      router.push("/flashcards");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      toast.error(
        "An error occurred while saving flashcards. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCard = (card: IFlashcard, index: number) => {
    setEditingCard(card);
    setEditingIndex(index);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingCard && editingIndex !== null) {
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[editingIndex] = editingCard;
      setFlashcards(updatedFlashcards);
      localStorage.setItem(
        FLASHCARDS_STORAGE_KEY,
        JSON.stringify(updatedFlashcards)
      );
    }
    setIsEditModalOpen(false);
    setEditingCard(null);
    setEditingIndex(null);
  };

  const handleDiscard = () => {
    setIsDiscardModalOpen(true);
  };

  const confirmDiscard = () => {
    setFlashcards([]);
    setText("");
    localStorage.removeItem(PROMPT_STORAGE_KEY);
    localStorage.removeItem(FLASHCARDS_STORAGE_KEY);
    setIsDiscardModalOpen(false);
  };

  return (
    <>
      <section id="generate" className="flex-grow bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto flex flex-col justify-start items-center w-full text-center lg:py-16 lg:px-12">
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
                  autoFocus
                  placeholder="E.g., Key facts about the Solar System..."
                  className="w-full"
                  disabled={isLoading || !isLoaded}
                  value={text}
                  onChange={(e) => isSignedIn && setText(e.target.value)}
                  {...(!isSignedIn && {
                    onClick: () => openSignIn(),
                    onKeyDown: () => openSignIn(),
                  })}
                />

                <Button
                  isLoading={isLoading}
                  size="sm"
                  color="secondary"
                  startContent={!isLoading && <Sparkles />}
                  className="mt-6 px-4 py-6 text-md"
                  onClick={handleSubmit}
                  disabled={!isLoaded}
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
                        <Button
                          size="sm"
                          isIconOnly
                          startContent={<Edit size={16} />}
                          className="absolute top-1 right-1 bg-transparent"
                          onClick={() => handleEditCard(card, index)}
                        />
                      </CardBody>
                    </Card>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    size="sm"
                    color="secondary"
                    startContent={<SaveAll />}
                    className="px-4 py-6 text-md"
                    onPress={onOpen}
                  >
                    Save Flashcards
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    startContent={<Trash />}
                    className="px-4 py-6 text-md"
                    onClick={handleDiscard}
                  >
                    Discard
                  </Button>
                </div>
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

      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={() => setIsEditModalOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Flashcard
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Front"
                  value={editingCard?.front || ""}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard!, front: e.target.value })
                  }
                />
                <Input
                  label="Back"
                  value={editingCard?.back || ""}
                  onChange={(e) =>
                    setEditingCard({ ...editingCard!, back: e.target.value })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={handleSaveEdit}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isDiscardModalOpen}
        onOpenChange={() => setIsDiscardModalOpen(false)}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Discard Flashcards
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to discard these flashcards? This action
                  cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onClick={confirmDiscard}>
                  Discard
                </Button>
                <Button
                  // color="secondary"
                  // variant="flat"
                  onClick={() => setIsDiscardModalOpen(false)}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
