import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { useTranslation } from "react-i18next";

import DefaultLayout from "@/layouts/default";
import ResizableSplitPane from "@/components/resizable-split-pane";
import inlineStyles from "@/lib/inline-styles";
import { loadCSS, markdownStyles } from "@/config/post-styles.ts";
import { replaceImgSrc } from "@/lib/image-store";
import { TypewriterHero } from "@/components/typewriter-hero";
import { MarkdownEditor } from "@/components/markdown-editor.tsx";
import welcomeMarkdownZh from "@/data/welcome-zh.md?raw";
import welcomeMarkdownEn from "@/data/welcome-en.md?raw";
import CopyButtonGroup from "@/components/copy-button-group.tsx";
import DownloadButtonGroup from "@/components/download-button-group.tsx";
import Toolbar from "@/components/toolbar.tsx";

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

export default function IndexPage() {
  const { i18n, t } = useTranslation();

  const [markdown, setMarkdown] = useState(welcomeMarkdownZh);

  const [html, setHtml] = useState("");
  const [inlineStyledHTML, setInlineStyledHTML] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(markdownStyles[0].name);

  // @ts-ignore
  const [showRenderedHTML, setShowRenderedHTML] = useState(true);

  useEffect(() => {
    setMarkdown(i18n.language === "zh" ? welcomeMarkdownZh : welcomeMarkdownEn);
  }, [i18n.language]);

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
    if (html) {
      const cssContent = loadCSS(selectedStyle) as string;

      setInlineStyledHTML(inlineStyles(html, cssContent));
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
      <Toolbar
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        markdownStyles={markdownStyles}
      />
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
