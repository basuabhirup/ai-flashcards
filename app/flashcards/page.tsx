"use client";

import { Loader } from "@/components/loader";
import { db } from "@/config/firebase";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid2,
  Typography,
} from "@mui/material";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardSets, setFlashcardSets] = useState<{ name: string }[]>([]);
  const router = useRouter();

  const handleCardClick = (id?: string) => {
    router.push(`/flashcard?id=${id}`);
  };

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, "users"), user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcardSets || [];
        setFlashcardSets(collections);
      } else {
        await setDoc(docRef, { flashcardSets: [] });
      }
    }
    if (!!isLoaded) {
      getFlashcards();
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <Loader />;
  }

  if (!isSignedIn) {
    return redirect("/");
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          All Flashcard sets
        </Typography>
      </Box>
      <Grid2 container spacing={3} sx={{ mt: 4 }}>
        {flashcardSets.map((flashcardSet, index) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card>
              <CardActionArea
                onClick={() => handleCardClick(flashcardSet.name)}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    {flashcardSet.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}
