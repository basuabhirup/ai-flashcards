import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Grid2, Toolbar, Typography } from "@mui/material";

export default function Home() {
  return (
    <main>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <ClerkLoaded>
            <SignedOut>
              <SignInButton mode="modal">
                <Button color="inherit">Login</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button color="inherit">Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </ClerkLoaded>
        </Toolbar>
      </AppBar>
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
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
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid2 container spacing={4}>
          {/* Feature items */}
        </Grid2>
      </Box>
    </main>
  );
}
