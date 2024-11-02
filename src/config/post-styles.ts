import githubStyle from "@/styles/github.css?raw";
import newspaperStyle from "@/styles/newspaper.css?raw";
import posterStyle from "@/styles/poster.css?raw";

export const markdownStyles = [
  { name: "github", css: githubStyle },
  { name: "newspaper", css: newspaperStyle },
  { name: "poster", css: posterStyle },
];

export const loadCSS: any = (name: string) =>
  markdownStyles.find((style) => style.name === name)?.css;
