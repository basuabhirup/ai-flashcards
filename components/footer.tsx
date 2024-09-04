import { Link } from "@nextui-org/react";
import { Sparkles } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="px-4 py-8 bg-gray-100 md:p-8 lg:p-10 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl text-center">
        <a
          href="#"
          className="flex justify-center items-center text-2xl font-semibold text-gray-900 dark:text-white mb-4"
        >
          <Sparkles className="mr-2" />
          AI Flashcards
        </a>
        {/* <p className="text-sm text-gray-500 dark:text-gray-400 my-4">
          <Link
            href="https://github.com/basuabhirup/ai-flashcards"
            className="inline-flex items-center text-foreground text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-5 h-5 mr-1" />
            Proudly Open-Source
          </Link>
        </p> */}
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024&nbsp;
          <Link
            href="https://github.com/basuabhirup/ai-flashcards"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-decoration-none"
          >
            Abhirup Basu
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};
