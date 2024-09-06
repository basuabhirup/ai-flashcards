# AI Flashcards ✨

**AI Flashcards** is an AI-powered flashcard application designed to elevate learning with smart, efficient study tools. Built with cutting-edge technologies like Next.js, React, Firebase, and the OpenAI API, this application offers a seamless experience for students and professionals looking to enhance their study sessions.


https://github.com/user-attachments/assets/7b03a6c7-b8d0-4f66-ada4-fe4158485b1c


## Features

- **AI-Generated Flashcards:** Utilize OpenAI's powerful API to create flashcards automatically based on your inputs.
- **Secure User Authentication:** Powered by Clerk, ensuring a safe and personalized user experience.
- **Responsive Design:** A clean, mobile-friendly interface for studying on the go.

## Tech Stack 🛠️

- **Next.js:** Framework for server-rendered React applications.
- **React:** JavaScript library for building user interfaces.
- **Firebase:** Backend as a service for real-time data and authentication.
- **Clerk:** Authentication and user management.
- **OpenAI API:** Powering the AI-driven flashcard generation.

## Getting Started 🚀

### Prerequisites

- **Node.js** and **npm** installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ai-flashcards.git
   cd ai-flashcards
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of your project by copying the `.env.example` file and replacing the placeholders with your actual API keys and other environment variables:

   ```bash
   cp .env.example .env
   ```

### Environment Variables

Make sure to set up your environment variables correctly. Here is an example:

```bash
OPENAI_API_KEY="your-openai-api-key"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/generate"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/generate"
NEXT_PUBLIC_MONTHLY_FLASHCARDS_LIMIT="10"
```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Contributing 🤝

We welcome contributions! Please feel free to submit a pull request or open an issue if you have any ideas, suggestions, or bugs to report.

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements 🙌

- Thanks to the [OpenAI](https://openai.com) team for the powerful API that drives the AI flashcard generation.
- Big shoutout to [Clerk](https://clerk.dev) for seamless authentication and user management.

---

Happy studying with **AI Flashcards**! 🎉
