"use client";

import { useState, useRef, useEffect } from "react";
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineUnderline,
  AiOutlineStrikethrough,
  AiOutlineOrderedList,
  AiOutlineUnorderedList,
  AiOutlineArrowRight as AiOutlineIndent,
  AiOutlineArrowLeft as AiOutlineOutdent,
  AiOutlineAlignLeft,
  AiOutlineAlignCenter,
  AiOutlineAlignRight,
  AiOutlineCode,
  AiOutlineClear,
  AiOutlineCopy,
  AiOutlineScissor as AiOutlineCut,
} from "react-icons/ai";
import { TbHighlight } from "react-icons/tb";
import { BiColorFill } from "react-icons/bi";
import { MdSave } from "react-icons/md";

const fontOptions = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Impact",
  "Comic Sans MS",
  "Brush Script MT",
];

const fontSizeOptions = Array.from({ length: 20 }, (_, i) => i + 1);

const colorOptions = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#800000",
  "#008000",
  "#000080",
  "#808000",
  "#800080",
  "#008080",
  "#C0C0C0",
  "#808080",
  "#999999",
  "#666666",
  "#333333",
];

interface BlogEditorProps {}

const BlogEditor: React.FC<BlogEditorProps> = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [fontFamily, setFontFamily] = useState<string>(fontOptions[0]);
  const [fontSize, setFontSize] = useState<number>(18);
  const [textColor, setTextColor] = useState<string>(colorOptions[0]);
  const [highlightColor, setHighlightColor] = useState<string>(colorOptions[2]);
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [isCode, setIsCode] = useState<boolean>(false);
  const [listType, setListType] = useState<string | null>(null);
  const [indentLevel, setIndentLevel] = useState<number>(0);
  const [textAlign, setTextAlign] = useState<string>("left");
  const [wordCount, setWordCount] = useState<number>(0);
  const [saved, setSaved] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<{
    start: number;
    end: number;
    text: string;
  } | null>(null);

  const [showFontFamilyDropdown, setShowFontFamilyDropdown] =
    useState<boolean>(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] =
    useState<boolean>(false);
  const [showFormattingBar, setShowFormattingBar] = useState<boolean>(false);
  const [formattingBarPosition, setFormattingBarPosition] =
    useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [currentStyles, setCurrentStyles] = useState<Record<string, string>>({
    fontFamily,
    fontSize: `${fontSize}px`,
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    color: textColor,
    backgroundColor: "transparent",
    textAlign: "left",
    marginLeft: "0px",
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    updateWordCount(newContent);
  };

  const updateWordCount = (htmlContent: string) => {
    const text = htmlContent.replace(/<[^>]+>/g, "").trim();
    const wordCount = text === "" ? 0 : text.split(/\s+/).length;
    setWordCount(wordCount);
  };

  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
    
    // Directly modify document selection with the font
    if (contentRef.current) {
      contentRef.current.focus();
      document.execCommand('fontName', false, font);
    }
    
    setShowFontFamilyDropdown(false);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    
    // Get current selection
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && contentRef.current) {
      // Save the current selection
      const range = selection.getRangeAt(0);
      
      // Check if there's actually text selected
      if (!selection.isCollapsed) {
        try {
          // Create a span with the desired font size
          const span = document.createElement('span');
          span.style.fontSize = `${size}px`;
          
          // Clone the range to avoid modification issues
          const clonedRange = range.cloneRange();
          
          // First extract the contents to preserve selection
          const fragment = clonedRange.extractContents();
          
          // Put the extracted content into our styled span
          span.appendChild(fragment);
          
          // Insert the span back into the document
          clonedRange.insertNode(span);
          
          // Update content state after modification
          const newContent = contentRef.current.innerHTML;
          setContent(newContent);
          updateWordCount(newContent);
          
          // Close the dropdown
          setShowFontSizeDropdown(false);
          
          // Restore focus to editor
          contentRef.current.focus();
        } catch (e) {
          console.error('Error applying font size to selection', e);
        }
      } else {
        // No selection, apply to future typing
        document.execCommand('fontSize', false, '7'); // Apply any size to create a font tag
        
        // Find the font element that was just created
        const fonts = contentRef.current.getElementsByTagName('font');
        if (fonts.length > 0) {
          // Get the most recently added font element
          const fontElement = fonts[fonts.length - 1];
          // Set the actual size we want using CSS
          fontElement.style.fontSize = `${size}px`;
          // Remove the size attribute which might conflict
          fontElement.removeAttribute('size');
        }
        
        setShowFontSizeDropdown(false);
      }
    }
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    handleFormatting('foreColor', color);
  };

  const handleHighlightColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setHighlightColor(color);
    handleFormatting('hiliteColor', color);
  };

  const handleBoldClick = (isSelection = false) => {
    handleFormatting('bold');
    if (!isSelection) {
      setIsBold(!isBold);
    }
  };

  const handleItalicClick = (isSelection = false) => {
    handleFormatting('italic');
    if (!isSelection) {
      setIsItalic(!isItalic);
    }
  };

  const handleUnderlineClick = (isSelection = false) => {
    handleFormatting('underline');
    if (!isSelection) {
      setIsUnderline(!isUnderline);
    }
  };

  const handleStrikethroughClick = (isSelection = false) => {
    handleFormatting('strikeThrough');
    if (!isSelection) {
      setIsStrikethrough(!isStrikethrough);
    }
  };

  const handleHighlightClick = () => {
    handleFormatting('hiliteColor', highlightColor);
  };

  const handleCodeClick = () => {
    const newIsCode = !isCode;
    setIsCode(newIsCode);
    setCurrentStyles({ 
      ...currentStyles, 
      fontFamily: newIsCode ? "Courier New" : fontFamily 
    });
    
    if (newIsCode) {
      document.execCommand("fontName", false, "Courier New");
    } else {
      document.execCommand("fontName", false, fontFamily);
    }
  };

  const handleListClick = (type: string) => {
    const newListType = listType === type ? null : type;
    setListType(newListType);
    
    if (type === "ul") {
      document.execCommand("insertUnorderedList", false);
    } else if (type === "ol") {
      document.execCommand("insertOrderedList", false);
    }
  };

  const handleIndentClick = () => {
    const newIndentLevel = indentLevel + 1;
    setIndentLevel(newIndentLevel);
    setCurrentStyles({ 
      ...currentStyles, 
      marginLeft: `${newIndentLevel * 20}px` 
    });
    document.execCommand("indent", false);
  };

  const handleOutdentClick = () => {
    if (indentLevel > 0) {
      const newIndentLevel = indentLevel - 1;
      setIndentLevel(newIndentLevel);
      setCurrentStyles({ 
        ...currentStyles, 
        marginLeft: `${newIndentLevel * 20}px` 
      });
      document.execCommand("outdent", false);
    }
  };

  const handleAlignClick = (align: string) => {
    setTextAlign(align);
    setCurrentStyles({ ...currentStyles, textAlign: align });
    
    if (align === "left") {
      document.execCommand("justifyLeft", false);
    } else if (align === "center") {
      document.execCommand("justifyCenter", false);
    } else if (align === "right") {
      document.execCommand("justifyRight", false);
    }
  };

  const handleClearClick = () => {
    setContent("");
    setWordCount(0);
    if (contentRef.current) {
      contentRef.current.innerHTML = "";
    }
  };

  const handleCopyClick = () => {
    if (selectionRef.current && selectionRef.current.text) {
      navigator.clipboard.writeText(selectionRef.current.text);
    }
  };

  const handleCutClick = () => {
    if (selectionRef.current && selectionRef.current.text) {
      navigator.clipboard.writeText(selectionRef.current.text);
      document.execCommand("cut", false);
      
      // Update content and word count after cut
      if (contentRef.current) {
        const newContent = contentRef.current.innerHTML;
        setContent(newContent);
        updateWordCount(newContent);
      }
    }
  };

  const handleSaveClick = () => {
    const blogPost = {
      title,
      content,
      wordCount,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem("blogPost", JSON.stringify(blogPost));
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  // Apply current styles to the editor
  const applyCurrentStyles = () => {
    if (contentRef.current) {
      Object.entries(currentStyles).forEach(([property, value]) => {
        contentRef.current!.style[property as any] = value;
      });
    }
  };

  useEffect(() => {
    // Apply styles to the editor element
    applyCurrentStyles();
  }, [currentStyles]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (
        selection && 
        selection.rangeCount > 0 && 
        !selection.isCollapsed && 
        contentRef.current && 
        contentRef.current.contains(selection.anchorNode)
      ) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString().trim();
        
        if (selectedText !== "") {
          const rect = range.getBoundingClientRect();
          if (rect.width > 0) {
            setFormattingBarPosition({
              top: rect.top - 50,
              left: rect.left + rect.width / 2,
            });

            selectionRef.current = {
              start: range.startOffset,
              end: range.endOffset,
              text: selectedText,
            };

            setShowFormattingBar(true);
            return;
          }
        }
      }
      
      setShowFormattingBar(false);
      selectionRef.current = null;
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mouseup", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mouseup", handleSelectionChange);
    };
  }, []);

  useEffect(() => {
    const savedPost = localStorage.getItem("blogPost");
    if (savedPost) {
      const blogPost = JSON.parse(savedPost);
      setTitle(blogPost.title);
      setContent(blogPost.content);
      setWordCount(blogPost.wordCount);
    }
    
    // Initialize editor's content with proper styling
    if (contentRef.current) {
      contentRef.current.focus();
      applyCurrentStyles();
    }
  }, []);

  // Handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showFontFamilyDropdown || showFontSizeDropdown) {
        const target = e.target as HTMLElement;
        if (!target.closest(".font-dropdown")) {
          setShowFontFamilyDropdown(false);
          setShowFontSizeDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFontFamilyDropdown, showFontSizeDropdown]);

  // Completely replace the content handling approach
  useEffect(() => {
    if (contentRef.current) {
      // Basic initialization of the editor
      contentRef.current.innerHTML = content;
      
      // Set default font size
      document.execCommand('fontSize', false, '4'); // Size 4 is roughly 18px
      
      // Handler to update content and word count
      const handleEditorChange = () => {
        if (contentRef.current) {
          const newContent = contentRef.current.innerHTML;
          setContent(newContent);
          updateWordCount(newContent);
        }
      };
      
      // Handle paste event to preserve plain text
      const handlePaste = (e: ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData?.getData('text/plain') || '';
        document.execCommand('insertText', false, text);
      };
      
      contentRef.current.addEventListener('input', handleEditorChange);
      contentRef.current.addEventListener('paste', handlePaste);
      
      return () => {
        if (contentRef.current) {
          contentRef.current.removeEventListener('input', handleEditorChange);
          contentRef.current.removeEventListener('paste', handlePaste);
        }
      };
    }
  }, []);

  // Separate event handler for formatting buttons
  const handleFormatting = (command: string, value: string = '') => {
    if (contentRef.current) {
      // Focus the editor
      contentRef.current.focus();
      
      // Apply the formatting command
      document.execCommand(command, false, value);
      
      // Update the UI state based on selection formatting
      updateSelectionState();
    }
  };
  
  // Update formatting buttons state based on current selection
  const updateSelectionState = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && contentRef.current) {
      // Don't update global state when only formatting selected text
      if (selectionRef.current?.text) {
        return;
      }
      
      try {
        // Only update global state when we're applying formatting to the whole document
        setIsBold(document.queryCommandState('bold'));
        setIsItalic(document.queryCommandState('italic'));
        setIsUnderline(document.queryCommandState('underline'));
        setIsStrikethrough(document.queryCommandState('strikeThrough'));
      } catch (e) {
        console.error('Error updating selection state', e);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-2 px-2 sm:py-6 sm:px-4">
      <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-4 sm:p-6 text-white">
          <h1 className="text-xl sm:text-2xl font-bold mb-3">Create Your Blog Post</h1>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full text-xl sm:text-2xl font-bold bg-transparent border-b-2 border-white/50 focus:border-white focus:outline-none transition-all placeholder-white/70 pb-2"
              placeholder="Enter an engaging title..."
            />
          </div>
        </div>
        
        <div className="bg-white p-3 sm:p-4">
          <div className="flex justify-center mb-4">
            <div className="flex flex-wrap gap-2 bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm overflow-visible max-w-full">
              <div className="relative font-dropdown" style={{ zIndex: 50 }}>
                <button
                  className="flex items-center min-w-[100px] px-3 py-2 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 shadow-sm transition-all"
                  onClick={() => setShowFontFamilyDropdown(!showFontFamilyDropdown)}
                >
                  <span className="mr-2 truncate">{fontFamily}</span>
                  <span className="text-gray-400">&#9662;</span>
                </button>
                {showFontFamilyDropdown && (
                  <div 
                    className="absolute mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto" 
                    style={{ zIndex: 9999, left: '0', top: '100%' }}
                  >
                    {fontOptions.map((font) => (
                      <div
                        key={font}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                        style={{ fontFamily: font }}
                        onClick={() => handleFontFamilyChange(font)}
                      >
                        {font}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative font-dropdown" style={{ zIndex: 49 }}>
                <button
                  className="flex items-center min-w-[60px] px-3 py-2 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 shadow-sm transition-all"
                  onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
                >
                  <span className="mr-2">{fontSize}</span>
                  <span className="text-gray-400">&#9662;</span>
                </button>
                {showFontSizeDropdown && (
                  <div 
                    className="absolute mt-1 w-20 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto" 
                    style={{ zIndex: 9998, left: '0', top: '100%' }}
                  >
                    {fontSizeOptions.map((size) => (
                      <div
                        key={size}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors text-center"
                        onClick={() => handleFontSizeChange(size)}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="flex items-center px-3 py-2 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 shadow-sm transition-all">
                  <span className="mr-2 text-sm">Text</span>
                  <input
                    type="color"
                    value={textColor}
                    onChange={handleTextColorChange}
                    className="w-6 h-6 cursor-pointer"
                    title="Text Color"
                    aria-label="Choose text color"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center px-3 py-2 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 shadow-sm transition-all">
                  <span className="mr-2 text-sm">Highlight</span>
                  <input
                    type="color"
                    value={highlightColor}
                    onChange={handleHighlightColorChange}
                    className="w-6 h-6 cursor-pointer"
                    title="Highlight Color"
                    aria-label="Choose highlight color"
                  />
                </div>
              </div>

              <button
                className={`flex items-center px-3 py-2 ${
                  isBold ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white hover:bg-gray-100 border-gray-200"
                } rounded-lg border shadow-sm transition-all`}
                onClick={() => handleBoldClick(false)}
                title="Bold"
                aria-label="Bold text"
              >
                <AiOutlineBold />
              </button>
              <button
                className={`flex items-center px-3 py-2 ${
                  isItalic ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white hover:bg-gray-100 border-gray-200"
                } rounded-lg border shadow-sm transition-all`}
                onClick={() => handleItalicClick(false)}
                title="Italic"
                aria-label="Italic text"
              >
                <AiOutlineItalic />
              </button>
              <button
                className={`flex items-center px-3 py-2 ${
                  isUnderline ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white hover:bg-gray-100 border-gray-200"
                } rounded-lg border shadow-sm transition-all`}
                onClick={() => handleUnderlineClick(false)}
                title="Underline"
                aria-label="Underline text"
              >
                <AiOutlineUnderline />
              </button>
              <button
                className={`flex items-center px-3 py-2 ${
                  isStrikethrough ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white hover:bg-gray-100 border-gray-200"
                } rounded-lg border shadow-sm transition-all`}
                onClick={() => handleStrikethroughClick(false)}
                title="Strikethrough"
                aria-label="Strikethrough text"
              >
                <AiOutlineStrikethrough />
              </button>
            </div>
          </div>
          
          <div className="flex justify-center mb-4">
            <div className="flex flex-wrap gap-2 bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm overflow-x-auto max-w-full">
              <button
                className={`flex items-center px-3 py-2 ${
                  listType === "ul" ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white hover:bg-gray-100 border-gray-200"
                } rounded-lg border shadow-sm transition-all`}
                onClick={() => handleListClick("ul")}
                title="Bullet List"
                aria-label="Bullet list"
              >
                <AiOutlineUnorderedList />
              </button>
              <button
                className={`flex items-center px-3 py-2 ${
                  listType === "ol" ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white hover:bg-gray-100 border-gray-200"
                } rounded-lg border shadow-sm transition-all`}
                onClick={() => handleListClick("ol")}
                title="Ordered List"
                aria-label="Ordered list"
              >
                <AiOutlineOrderedList />
              </button>
              <button
                className="flex items-center px-3 py-2 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 shadow-sm transition-all"
                onClick={handleIndentClick}
                title="Indent"
                aria-label="Indent"
              >
                <AiOutlineIndent />
              </button>
              <button
                className="flex items-center px-3 py-2 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 shadow-sm transition-all"
                onClick={handleOutdentClick}
                title="Outdent"
                aria-label="Outdent"
              >
                <AiOutlineOutdent />
              </button>
              <button
                className={`flex items-center px-3 py-2 ${
                  textAlign === "left" ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white hover:bg-gray-100 border-gray-200"
                } rounded-lg border shadow-sm transition-all`}
                onClick={() => handleAlignClick("left")}
                title="Left Align"
                aria-label="Left align text"
              >
                <AiOutlineAlignLeft />
              </button>
              <button
                className={`flex items-center px-3 py-2 ${
                  textAlign === "center" ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white hover:bg-gray-100 border-gray-200"
                } rounded-lg border shadow-sm transition-all`}
                onClick={() => handleAlignClick("center")}
                title="Center Align"
                aria-label="Center align text"
              >
                <AiOutlineAlignCenter />
              </button>
              <button
                className={`flex items-center px-3 py-2 ${
                  textAlign === "right" ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-white hover:bg-gray-100 border-gray-200"
                } rounded-lg border shadow-sm transition-all`}
                onClick={() => handleAlignClick("right")}
                title="Right Align"
                aria-label="Right align text"
              >
                <AiOutlineAlignRight />
              </button>
              <button
                className="flex items-center px-3 py-2 bg-white hover:bg-gray-100 rounded-lg border border-gray-200 shadow-sm transition-all"
                onClick={handleClearClick}
                title="Clear"
                aria-label="Clear text"
              >
                <AiOutlineClear />
              </button>
              <button
                className="flex items-center px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
                onClick={handleSaveClick}
                title="Save"
                aria-label="Save blog"
              >
                <MdSave className="mr-1" /> Save
              </button>
            </div>
          </div>

          <div className="relative mb-4">
            <div
              ref={contentRef}
              contentEditable
              className="prose max-w-none min-h-[200px] sm:min-h-[250px] p-4 bg-white rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
              style={{ fontSize: '18px' }}
              data-placeholder="Start writing your blog post..."
            ></div>
            
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full shadow-sm">
              {wordCount} words
            </div>
          </div>
        </div>

        {showFormattingBar && (
          <div
            className="fixed z-40 flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg shadow-xl"
            style={{
              top: `${formattingBarPosition.top}px`,
              left: `${formattingBarPosition.left}px`,
              transform: "translateX(-50%)",
            }}
          >
            <button
              className="flex items-center p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              onClick={handleCopyClick}
              title="Copy"
              aria-label="Copy text"
            >
              <AiOutlineCopy />
            </button>
            <button
              className="flex items-center p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              onClick={handleCutClick}
              title="Cut"
              aria-label="Cut text"
            >
              <AiOutlineCut />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button
              className="flex items-center p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => handleBoldClick(true)}
              title="Bold"
              aria-label="Bold text"
            >
              <AiOutlineBold />
            </button>
            <button
              className="flex items-center p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => handleItalicClick(true)}
              title="Italic"
              aria-label="Italic text"
            >
              <AiOutlineItalic />
            </button>
            <button
              className="flex items-center p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => handleUnderlineClick(true)}
              title="Underline"
              aria-label="Underline text"
            >
              <AiOutlineUnderline />
            </button>
            <button
              className="flex items-center p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => handleStrikethroughClick(true)}
              title="Strikethrough"
              aria-label="Strikethrough text"
            >
              <AiOutlineStrikethrough />
            </button>
            <button
              className="flex items-center p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              onClick={handleHighlightClick}
              title="Highlight"
              aria-label="Highlight text"
            >
              <TbHighlight />
            </button>
          </div>
        )}

        {saved && (
          <div className="fixed bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Post saved successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogEditor;