import githubStyle from "@/styles/github.css?raw";
import newspaperStyle from "@/styles/newspaper.css?raw";
import posterStyle from "@/styles/poster.css?raw";
import slimStyle from "@/styles/slim.css?raw";

export const markdownStyles = [
  { name: "github", css: githubStyle },
  { name: "newspaper", css: newspaperStyle },
  { name: "poster", css: posterStyle },
  { name: "slim", css: slimStyle },
];

export const loadCSS: any = (name: string) =>
  markdownStyles.find((style) => style.name === name)?.css;
