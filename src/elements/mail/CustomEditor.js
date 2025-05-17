import React, { forwardRef, useEffect, useRef } from "react";
import "quill-better-table/dist/quill-better-table.css";
import Quill from "quill";
import QuillBetterTable from "quill-better-table";
import ImageResize from "quill-image-resize-module-react";

// Register the image resize module
Quill.register("modules/imageResize", ImageResize);

const Editor = forwardRef(({ content, onContentChange }, ref) => {
  const editorRef = useRef(null);

  useEffect(() => {
    // Store the Quill instance in the global scope
    if (editorRef.current) {
      window.quill = editorRef.current.getEditor();
    }
  }, []);

  const modules = {
    toolbar: false, // Disable default toolbar as we are using a custom one
    imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize"],
    },
  };

  return (
    <div
      ref={(el) => {
        editorRef.current = el;
        if (ref) ref.current = el;
      }}
      theme="snow"
      modules={modules}
      value={content}
      onChange={onContentChange}
      placeholder=""
      className="editor"
    ></div>
  );
});

export default Editor;
