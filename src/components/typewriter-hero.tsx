import { TypewriterEffectSmooth } from "@/components/typewriter";

export function TypewriterHero() {
  const words = [
    {
      text: "Write",
    },
    {
      text: "Markdown",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "And",
    },
    {
      text: "Post",
      className: "text-blue-500 dark:text-blue-500",
    },
    {
      text: "Everywhere.",
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <TypewriterEffectSmooth className="" cursorClassName="" words={words} />
    </div>
  );
}
