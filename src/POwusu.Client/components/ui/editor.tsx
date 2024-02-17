import React, { FunctionComponent, memo, MutableRefObject, ReactElement, ReactNode, useCallback, useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";

import "@/styles/editor.css";

import RendererComponent, { ConfigProp, DataProp, RenderersProp } from "editorjs-blocks-react-renderer";
import { truncate } from "lodash";
import ReactDOMServer from "react-dom/server";

const DEFAULT_ID = "editorjs";

// react-editor-js
// source: https://github.com/natterstefan/react-editor-js/tree/master
export interface EditorProps extends EditorJS.EditorConfig {
  children?: ReactElement;
  /**
   * Element id where Editor will be append
   * @deprecated property will be removed in next major release,
   * use holder instead
   */
  holderId?: string;
  /**
   * Element id where Editor will be append
   */
  holder?: string;
  /**
   * reinitialize editor.js when component did update
   */
  reinitializeOnPropsChange?: boolean;
  /**
   * returns the editorjs instance
   */
  editorInstance?: (instance: EditorJS) => void;
}

/**
 * EditorJs wraps editor.js in a React component and providing an API to be able
 * to interact with the editor.js instance.
 */
const EditorComponent = (props: EditorProps) => {
  const { holderId: deprecatedId, holder: customHolderId, editorInstance, reinitializeOnPropsChange, children, tools, ...otherProps } = props;

  const instance: MutableRefObject<EditorJS | null> = useRef(null);
  const holderId = deprecatedId || customHolderId || DEFAULT_ID;

  /**
   * initialise editorjs with default settings
   */
  const initEditor = useCallback(async () => {
    if (!instance.current) {
      const Header = (await import("@editorjs/header")).default;
      const Embed = (await import("@editorjs/embed")).default;
      const Table = (await import("@editorjs/table")).default;
      const List = (await import("@editorjs/list")).default;
      const Code = (await import("@editorjs/code")).default;
      const LinkTool = (await import("@editorjs/link")).default;
      const InlineCode = (await import("@editorjs/inline-code")).default;
      const RawTool = (await import("@editorjs/raw")).default;

      instance.current = new EditorJS({
        tools: {
          header: Header,
          linkTool: LinkTool,
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
          raw: RawTool,
          ...tools
        },
        holder: holderId,
        ...otherProps
      });
    }

    // callback returns current editorjs instance once it is ready
    if (editorInstance) {
      await instance.current.isReady;
      editorInstance(instance.current);
    }
  }, [editorInstance, holderId, otherProps, tools]);

  /**
   * destroy current editorjs instance
   */
  const destroyEditor = useCallback(async () => {
    if (!instance.current) {
      return true;
    }

    await instance.current.isReady;
    instance.current.destroy();
    instance.current = null;
    return true;
  }, [instance]);

  /**
   * initEditor on mount and destroy it on unmount
   */
  useEffect(() => {
    initEditor();
    return (): void => {
      destroyEditor();
    };
  }, []); // eslint-disable-line

  /**
   * when props change and reinitializeOnPropsChange is true, the component will
   * first destroy and then init EditorJS again.
   */
  useEffect(() => {
    const doEffect = async () => {
      if (!reinitializeOnPropsChange) {
        return;
      }

      await destroyEditor();
      initEditor();
    };

    doEffect();
  }, [destroyEditor, initEditor, instance, reinitializeOnPropsChange]);

  return children || <div id={holderId} />;
};
const Editor = memo(EditorComponent);

export interface RendererProps {
  data: DataProp;
  config?: ConfigProp | undefined;
  renderers?: RenderersProp | undefined;
}

const Renderer = (props: RendererProps) => {
  return <RendererComponent {...props} />;
};

const renderHtml = (data: OutputData) => {
  return ReactDOMServer.renderToString(<Renderer data={data as DataProp || { blocks: [], time: 0, version: "" }} />);
};

const stripHtml = (html: string) => {
  if (html === undefined || html === null) {
    throw new Error("Html cannot be undefined or null");
  }

  const doc = new DOMParser().parseFromString(html, "text/html");

  if (!doc || !doc.body || !doc.body.childNodes) {
    return html;
  }

  const textNodes: Node[] = [];

  function getTextNodes(node: Node, textNodes: Node[]): void {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
    } else {
      node.childNodes.forEach((childNode) => {
        getTextNodes(childNode, textNodes);
      });
    }
  }

  getTextNodes(doc.body, textNodes);

  return textNodes.map((node) => node.textContent?.trim() || "").join("\n");
};

const getTextReadingDuration = (text: string) => {
  if (text === undefined || text === null) {
    throw new Error("Text cannot be undefined or null");
  }

  const wordCount: number = (() => {
    let wordCount: number = 0;
    let index: number = 0;

    // Skip whitespace until the first word
    while (index < text.length && /\s/.test(text[index])) {
      index++;
    }

    while (index < text.length) {
      // Check if the current character is part of a word
      while (index < text.length && !/\s/.test(text[index])) {
        index++;
      }

      wordCount++;

      // Skip whitespace until the next word
      while (index < text.length && /\s/.test(text[index])) {
        index++;
      }
    }

    return wordCount;
  })();

  // Slow = 100 wpm, Average = 130 wpm, Fast = 160 wpm.
  const wordsPerMinute: number = 70;
  const wordsTotalSeconds: number = wordCount / (wordsPerMinute / 60);
  const wordsTotalTicks: number = Math.round((wordsTotalSeconds * Math.pow(10, 9)) / 100);

  return wordsTotalTicks;
};

export interface OutputInfo {
  content: { html: string; text: string };
  readingDuration: number;
  summary: string;
}

const getEditorInfo = (data: OutputData) => {
  const contentHtml = renderHtml(data);
  const contentText = stripHtml(contentHtml);
  const readingDuration = getTextReadingDuration(contentText);
  const summary = truncate(contentText, { length: 128 });

  return {
    content: { html: contentHtml, text: contentText },
    readingDuration,
    summary
  };
};

export { Editor, Renderer, getEditorInfo };
