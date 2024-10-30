export const markdownStyles = [
  { name: "Default", cssUrl: "/css/github.css" },
  { name: "Github", cssUrl: "/css/github.css" },
  { name: "Newspaper", cssUrl: "/css/newspaper.css" },
  { name: "Poster", cssUrl: "/css/poster.css" },
];

export const getCssUrl = (name: string) =>
  markdownStyles.find((style) => style.name === name)?.cssUrl;
