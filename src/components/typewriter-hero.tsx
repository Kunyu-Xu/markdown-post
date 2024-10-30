import { TypewriterEffectSmooth } from "@/components/typewriter";

export function TypewriterHero() {
  const words = [
    {
      text: "Markdown",
    },
    {
      text: "To",
    },
    {
      text: "Image,",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "Email,",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "and more.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="flex justify-center items-center px-4">
      <TypewriterEffectSmooth className="" cursorClassName="" words={words} />
    </div>
  );
}
