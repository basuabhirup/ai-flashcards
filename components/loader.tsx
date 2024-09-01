import { Box, Container, Typography } from "@mui/material";

export const Loader = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h5" gutterBottom>
          Loading...
        </Typography>
      </Box>
    </Container>
  );
};
