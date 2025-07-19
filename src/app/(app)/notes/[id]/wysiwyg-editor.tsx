
"use client";

import React, { useState, useEffect } from 'react';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    // When the initial `value` (HTML) is received, convert it to Draft.js's ContentState
    const blocksFromHTML = convertFromHTML(value);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    // Create a new EditorState with this content
    const newEditorState = EditorState.createWithContent(contentState);
    setEditorState(newEditorState);
  }, []); // Run only once when the component mounts with the initial value

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    // Convert the new editor state to HTML and pass it up to the parent
    const html = stateToHTML(newEditorState.getCurrentContent());
    onChange(html);
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      wrapperClassName="wysiwyg-wrapper"
      editorClassName="wysiwyg-editor"
      toolbarClassName="wysiwyg-toolbar"
    />
  );
};

export default WysiwygEditor;
