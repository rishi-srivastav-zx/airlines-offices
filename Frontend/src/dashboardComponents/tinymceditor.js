"use client";

import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCEEditor = ({
    value,
    onChange,
    disabled = false,
    height = 500,
    placeholder = "Start writing your content...",
}) => {
    const editorRef = useRef(null);

    return (
        <div className="tinymce-wrapper">
            <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={value}
                disabled={disabled}
                init={{
                    height: height,
                    menubar: true,
                    plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "code",
                        "help",
                        "wordcount",
                        "emoticons",
                        "codesample",
                        "quickbars",
                    ],
                    toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor backcolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | link image media | code | help",
                    content_style:
                        'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
                    placeholder: placeholder,
                    branding: false,
                    promotion: false,
                    skin: "oxide",
                    content_css: "default",
                    image_advtab: true,
                    image_caption: true,
                    quickbars_selection_toolbar:
                        "bold italic | quicklink h2 h3 blockquote",
                    quickbars_insert_toolbar: "quickimage quicktable",
                    toolbar_mode: "sliding",
                    contextmenu: "link image table",
                    link_assume_external_targets: true,
                    link_default_protocol: "https",
                }}
                onEditorChange={(content) => onChange(content)}
            />
        </div>
    );
};

export default TinyMCEEditor;
