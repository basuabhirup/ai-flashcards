import { Spinner } from "@nextui-org/react";

export const Loader = () => {
  return (
    <section className="flex-grow w-full flex flex-col justify-center items-center pb-8 bg-white dark:bg-gray-900">
      <Spinner color="secondary" />
    </section>
  );
};
