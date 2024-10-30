import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";

import DefaultLayout from "@/layouts/default";
import ResizableSplitPane from "@/components/resizable-split-pane";
import { defaultMarkdown } from "@/config/data";
import inlineStyles from "@/lib/inline-styles";
import { getCssUrl, markdownStyles } from "@/config/md-styles";
import { copyHtmlWithStyle } from "@/lib/copy-html";
import { replaceImgSrc } from "@/lib/image-store";
import { TypewriterHero } from "@/components/typewriter-hero";
import { MarkdownEditor } from "@/components/markdown-editor.tsx";
import { useTranslation } from "react-i18next";

// Move marked configuration to a separate constant
const markedInstance = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";

      return hljs.highlight(code, { language }).value;
    },
  }),
);

// Helper functions
const wrapWithContainer = (htmlString: string) => {
  return `<div style="margin: 0; padding: 32px; background-color: #e5e5e5">
      <div class="article" style="max-width: 960px;margin: 0 auto;">${htmlString}</div>
    </div>`;
};

const fetchAndInlineStyles = async (
  html: string,
  styleName: string,
): Promise<string> => {
  const styleUrl = getCssUrl(styleName);

  if (!styleUrl) throw new Error("Style URL is undefined");

  const cssResponse = await fetch(styleUrl);
  const cssContent = await cssResponse.text();

  return inlineStyles(html, cssContent);
};

export default function IndexPage() {
  const { i18n, t } = useTranslation();

  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [html, setHtml] = useState("");
  const [inlineStyledHTML, setInlineStyledHTML] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(markdownStyles[0].name);

  // @ts-ignore
  const [showRenderedHTML, setShowRenderedHTML] = useState(true);

  // Parse markdown to HTML
  useEffect(() => {
    const parseMarkdown = async () => {
      const parsedHTML = await markedInstance.parse(markdown);

      setHtml(wrapWithContainer(replaceImgSrc(parsedHTML)));
    };

    parseMarkdown();
  }, [markdown]);

  // Apply inline styles
  useEffect(() => {
    const applyInlineStyles = async () => {
      try {
        const inlinedHtml = await fetchAndInlineStyles(html, selectedStyle);

        setInlineStyledHTML(inlinedHtml);
      } catch (error) {
        console.error("Error applying inline styles:", error);
      }
    };

    if (html) {
      applyInlineStyles();
    }
  }, [html, selectedStyle]);

  // UI Components
  const LeftContent = (
    <div className="p-4">
      <MarkdownEditor value={markdown} onChange={setMarkdown} />
    </div>
  );

  const RightContent = (
    <div className="p-4">
      {showRenderedHTML ? (
        <>
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css"
            rel="stylesheet"
          />
          <div
            dangerouslySetInnerHTML={{ __html: inlineStyledHTML }}
            id="markdown-body"
          />
        </>
      ) : (
        inlineStyledHTML
      )}
    </div>
  );

  return (
    <DefaultLayout>
      <TypewriterHero />
      <div className="flex gap-4 items-center mb-4">
        <Select
          disallowEmptySelection={true}
          label="Select style"
          selectedKeys={[selectedStyle]}
          onChange={(e) => setSelectedStyle(e.target.value)}
        >
          {markdownStyles.map((style) => (
            <SelectItem key={style.name} value={style.name}>
              {style.name}
            </SelectItem>
          ))}
        </Select>
        <Button
          className="h-[56px] light:bg-black light:text-white dark:bg-white dark:text-black"
          onClick={() => {
            copyHtmlWithStyle("markdown-body");
            toast.success(`Content copied`, {
              description: "You can paste into your email",
              duration: 4000,
              position: "top-center",
            });
          }}
        >
          {t("toolbar.copy")}
        </Button>
        {/*<Switch*/}
        {/*  isSelected={showRenderedHTML}*/}
        {/*  onValueChange={setShowRenderedHTML}*/}
        {/*>*/}
        {/*  Render HTML*/}
        {/*</Switch>*/}
      </div>
      <ResizableSplitPane
        initialLeftWidth={40}
        leftPane={LeftContent}
        maxLeftWidth={70}
        minLeftWidth={30}
        rightPane={RightContent}
      />
    </DefaultLayout>
  );
}
