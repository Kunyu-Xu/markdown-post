import { useEffect, useState } from "react";
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
import Toolbar from "@/components/toolbar.tsx";
import {
  defaultLayoutSetting,
  LayoutSetting,
} from "@/components/layout-setting-menu.tsx";

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
  {
    breaks: true,
  },
);

// Helper functions
const wrapWithContainer = (
  htmlString: string,
  layoutSetting: LayoutSetting,
) => {
  return `<div style="margin: 0; padding: ${layoutSetting.containerPadding}px; background-color: ${layoutSetting.containerBgColor}">
      <div class="article" style="max-width: 960px;margin: 0 auto;">${htmlString}</div>
    </div>`;
};

export default function IndexPage() {
  const { i18n, t } = useTranslation();

  const [markdown, setMarkdown] = useState(welcomeMarkdownZh);
  const [layoutSetting, setLayoutSetting] =
    useState<LayoutSetting>(defaultLayoutSetting);
  const [isModified, setIsModified] = useState(false);

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

      console.log(parsedHTML);

      setHtml(wrapWithContainer(replaceImgSrc(parsedHTML), layoutSetting));
    };

    parseMarkdown();
  }, [markdown, layoutSetting]);

  // Apply inline styles
  useEffect(() => {
    if (html) {
      const cssContent = loadCSS(selectedStyle) as string;

      setInlineStyledHTML(inlineStyles(html, cssContent));
    }
  }, [html, selectedStyle]);

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
    setIsModified(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    if (isModified) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isModified]);

  // UI Components
  const LeftContent = (
    <div className="p-4">
      <MarkdownEditor value={markdown} onChange={handleMarkdownChange} />
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
        layoutSetting={layoutSetting}
        setLayoutSetting={setLayoutSetting}
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
