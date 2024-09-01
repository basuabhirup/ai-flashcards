import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2,
  Typography,
} from "@mui/material";
import {
  AutoStories,
  Spellcheck,
  CloudUpload,
  BarChart,
} from "@mui/icons-material";

const features = [
  {
    icon: <AutoStories fontSize="large" />,
    title: "AI-Generated Flashcards",
    description:
      "Instantly create flashcards from your text using advanced AI technology.",
  },
  {
    icon: <Spellcheck fontSize="large" />,
    title: "Smart Review System",
    description:
      "Optimize your learning with our intelligent spaced repetition algorithm.",
  },
  {
    icon: <CloudUpload fontSize="large" />,
    title: "Cloud Sync",
    description: "Access your flashcards from any device, anytime, anywhere.",
  },
  {
    icon: <BarChart fontSize="large" />,
    title: "Progress Tracking",
    description:
      "Monitor your learning progress with detailed statistics and insights.",
  },
];

export default function Home() {
  return (
    <main>
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to AI Flashcards App
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <ClerkLoading>
          <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
            Get Started
          </Button>
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 2 }}
              href="/generate"
            >
              Get Started
            </Button>
          </SignedIn>
          <SignedOut>
            <SignUpButton mode="modal">
              <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }}>
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
        </ClerkLoaded>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
          Learn More
        </Button>
      </Box>
      <Box sx={{ my: 6, padding: "3rem" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid2 container spacing={4}>
          {features.map((feature, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card>
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    align="center"
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </main>
  );
}
