"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!quillRef.current) {
      // Initialize Quill
      quillRef.current = new Quill(containerRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "table"],
            ["clean"],
          ],
        },
      });

      // Set initial value
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Listen for changes
      quillRef.current.on("text-change", () => {
        isInternalChange.current = true;
        onChange(quillRef.current?.root.innerHTML || "");
        isInternalChange.current = false;
      });
    }
  }, []); // Only run once on mount

  useEffect(() => {
    // Update Quill when value changes from outside
    if (quillRef.current && value !== quillRef.current.root.innerHTML && !isInternalChange.current) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className={className}>
      <div ref={containerRef} className="h-full" />
    </div>
  );
}
