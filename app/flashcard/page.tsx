"use client";

import { Loader } from "@/components/loader";
import { db } from "@/config/firebase";
import { IFlashcard } from "@/util/interfaces";
import { useUser } from "@clerk/nextjs";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Grid2,
  Typography,
} from "@mui/material";
import { collection, doc, getDoc } from "firebase/firestore";
import { redirect, useSearchParams } from "next/navigation";
import { relative } from "path";
import { useEffect, useState } from "react";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState<IFlashcard[]>([]);
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  const handleCardClick = (id: string) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;

      const docRef = doc(
        collection(doc(collection(db, "users"), user?.id), "flashcardSets"),
        search
      );

      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      }
    }
    if (!!isLoaded) {
      getFlashcard();
    }
  }, [isLoaded, search, user]);

  useEffect(() => {
    console.log(flipped);
  }, [flipped]);

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
          Flashcard set: {`"${search}"`}
        </Typography>
      </Box>
      <Grid2 container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card
              sx={{
                perspective: "1000px",
                backgroundColor: "transparent",
                border: "none",
                boxShadow: 0,
              }}
            >
              <CardActionArea
                onClick={() => handleCardClick(`${index}`)}
                sx={{
                  height: "300px",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s",
                  transform: flipped[`${index}`]
                    ? "rotateY(180deg)"
                    : "rotateY(0deg)",
                  borderRadius: "16px",
                }}
              >
                <CardContent
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    backfaceVisibility: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1.5px solid #ccc",
                    boxShadow: 2,
                  }}
                >
                  <Typography
                    variant="caption"
                    align="center"
                    component="div"
                    fontSize="1rem"
                  >
                    {flashcard.front}
                  </Typography>
                </CardContent>
                <CardContent
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1.5px solid #ccc",
                    boxShadow: 2,
                  }}
                >
                  <Typography variant="caption" align="center" component="div">
                    {flashcard.back}
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
