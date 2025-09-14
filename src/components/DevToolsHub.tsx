"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowDown, FiX } from "react-icons/fi";
import { toolsData } from "./DevToolsData";
import { CodeBlock } from "./DevToolsComponents";

// Component for global styles
const GlobalStyles: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #0f172a;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Inter', sans-serif;
      }
      
      .hljs {
        background: #1e293b;
        border-radius: 0.5rem;
        padding: 1rem;
        margin: 1rem 0;
      }
      
      .hljs-comment,
      .hljs-quote {
        color: #94a3b8;
        font-style: italic;
      }
      
      .hljs-keyword,
      .hljs-selector-tag,
      .hljs-subst {
        color: #3b82f6;
        font-weight: bold;
      }
      
      .hljs-number,
      .hljs-literal,
      .hljs-variable,
      .hljs-template-variable,
      .hljs-tag .hljs-attr {
        color: #38bdf8;
      }
      
      .hljs-string,
      .hljs-doctag {
        color: #7dd3fc;
      }
      
      .hljs-title,
      .hljs-section,
      .hljs-selector-id {
        color: #0ea5e9;
        font-weight: bold;
      }
      
      .hljs-subst {
        font-weight: normal;
      }
      
      .hljs-type,
      .hljs-class .hljs-title {
        color: #f59e0b;
        font-weight: bold;
      }
      
      .hljs-tag,
      .hljs-name,
      .hljs-attribute {
        color: #22d3ee;
        font-weight: normal;
      }
      
      .hljs-regexp,
      .hljs-link {
        color: #fb923c;
      }
      
      .hljs-symbol,
      .hljs-bullet {
        color: #a78bfa;
      }
      
      .hljs-built_in,
      .hljs-builtin-name {
        color: #f472b6;
      }
      
      .hljs-meta {
        color: #94a3b8;
        font-weight: bold;
      }
      
      .hljs-deletion {
        background: #b91c1c;
        color: white;
        padding: 2px;
        border-radius: 2px;
      }
      
      .hljs-addition {
        background: #1e40af;
        color: white;
        padding: 2px;
        border-radius: 2px;
      }
      
      .hljs-emphasis {
        font-style: italic;
      }
      
      .hljs-strong {
        font-weight: bold;
      }
    `}} />
  );
};

// Header component
const Header: React.FC<{ feedY: number }> = ({ feedY }) => {
  return (
    <motion.header
      className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1634249171878-05944b5f36e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] opacity-20 bg-cover bg-center"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-slate-700/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-slate-700/10 rounded-full blur-[80px]"></div>
        <div className="absolute top-1/3 left-1/3 w-[150px] h-[150px] border border-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/2 w-[200px] h-[200px] border border-cyan-500/20 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute top-2/3 right-1/4 w-[180px] h-[180px] border border-blue-500/15 rounded-full animate-pulse opacity-60"></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/70"></div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="inline-block mb-6 flex flex-col items-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <span className="bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full text-sm font-medium tracking-wider">
                Introducing DevTools Hub
              </span>
            </div>

            <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 leading-tight mb-4 tracking-tight">
              Discover the Best <span className="text-blue-400">Developer Tools</span>
            </h1>

            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-6 rounded-full"></div>

            <p className="text-slate-300 text-xl mb-8 max-w-2xl font-light leading-relaxed">
              Explore our curated collection of developer tools, each handpicked to help you build better software.
              Learn how to use them effectively and stay up-to-date with the latest in tech.
            </p>
          </div>
          <div className="flex justify-center">
            <motion.button
              className="relative bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-xl hover:bg-white/20 transition-all duration-300 shadow-lg shadow-slate-900/50 flex items-center text-lg font-medium group mt-8"
              onClick={() => window.scrollTo({ top: feedY - 80, behavior: "smooth" })}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-3">Start Exploring</span>
              <motion.div
                className="relative"
                animate={{ y: [0, 5, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              >
                <FiArrowDown className="text-xl relative top-0" />
              </motion.div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

// Footer component
const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800/50 py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-slate-400 text-sm">
          © {new Date().getFullYear()} DevTools Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

// Main component
const DevToolsHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filteredTools, setFilteredTools] = useState(toolsData);
  const [activeTool, setActiveTool] = useState<typeof toolsData[0] | null>(null);
  const [isToolModalOpen, setIsToolModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedY, setFeedY] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  
  // Get unique categories from the tools data
  const categories = Array.from(new Set(toolsData.map(tool => tool.category)));
  
  // Initialize with all tools when component mounts
  useEffect(() => {
    setFilteredTools([...toolsData]);
  }, []);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const toolsFeed = document.getElementById("tools-feed");
    if (toolsFeed) {
      const rect = toolsFeed.getBoundingClientRect();
      setFeedY(rect.top + window.scrollY);
    }
  }, []);
  
  // Simple direct filtering function
  const filterTools = (category: string) => {
    if (category === "All") {
      return toolsData;
    }
    return toolsData.filter(tool => tool.category === category);
  };
  
  // Category change handler
  const handleCategoryChange = (category: string): void => {
    // Show loading state
    setIsLoading(true);
    
    // Update selected category
    setSelectedCategory(category);
    
    // Set a short timeout to allow loading state to be visible
    setTimeout(() => {
      // Apply filtering and update state
      setFilteredTools(filterTools(category));
      setIsLoading(false);
    }, 300);
  };
  
  // Select dropdown handler
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    handleCategoryChange(e.target.value);
  };

  // Tool click handler
  const handleToolClick = (tool: typeof toolsData[0]): void => {
    setActiveTool(tool);
    setIsToolModalOpen(true);
  };

  // Modal close handler
  const handleCloseModal = (): void => {
    setIsToolModalOpen(false);
    setActiveTool(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape" && isToolModalOpen) {
        handleCloseModal();
      }
    };
    if (isToolModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isToolModalOpen]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 12 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const renderToolDescription = (description: string) => {
    try {
      const parts = description.split(/```([\s\S]*?)```/);
      return parts.map((part, index) => {
        if (index % 2 === 0) {
          return part ? (
            <div key={`text-${index}`} className="whitespace-pre-line mb-2">
              {part}
            </div>
          ) : null;
        } 
        else {
          let language = 'javascript';
          let code = part;
          
          const firstLineBreakIndex = part.indexOf('\n');
          if (firstLineBreakIndex !== -1) {
            const firstLine = part.substring(0, firstLineBreakIndex).trim();
            if (/^[a-zA-Z0-9]+$/.test(firstLine)) {
              language = firstLine;
              code = part.substring(firstLineBreakIndex + 1);
            }
          }
          
          return code ? (
            <CodeBlock 
              key={`code-${index}`} 
              code={code} 
              language={language}
            />
          ) : null;
        }
      });
    } catch (error) {
      console.error("Error parsing description:", error);
      return (
        <div className="whitespace-pre-line text-slate-300 leading-relaxed">
          {description}
        </div>
      );
    }
  };

  // Import CategoryFilters and ToolsList from dedicated components
  const CategoryFilters = React.lazy(() => import('./DevToolsComponents').then(module => ({ default: module.CategoryFilters })));
  const ToolsList = React.lazy(() => import('./DevToolsComponents').then(module => ({ default: module.ToolsList })));
  const ToolModal = React.lazy(() => import('./DevToolsComponents').then(module => ({ default: module.ToolModal })));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white font-sans">
      <GlobalStyles />
      <Header feedY={feedY} />

      <main className="px-4 py-16 max-w-7xl mx-auto" id="tools-feed">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Browse by Category</h2>
          <React.Suspense fallback={<div>Loading filters...</div>}>
            <CategoryFilters 
              categories={categories}
              selectedCategory={selectedCategory}
              handleCategoryChange={handleCategoryChange}
              handleSelectChange={handleSelectChange}
            />
          </React.Suspense>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          key={selectedCategory}
        >
          <React.Suspense fallback={<div>Loading tools...</div>}>
            <ToolsList
              isLoading={isLoading}
              filteredTools={filteredTools}
              handleToolClick={handleToolClick}
              handleCategoryChange={handleCategoryChange}
              item={item}
            />
          </React.Suspense>
        </motion.div>
      </main>

      <AnimatePresence>
        {isToolModalOpen && activeTool && isMounted && (
          <React.Suspense fallback={<div>Loading modal...</div>}>
            <ToolModal
              activeTool={activeTool}
              handleCloseModal={handleCloseModal}
              modalVariants={modalVariants}
              backdropVariants={backdropVariants}
              renderToolDescription={renderToolDescription}
            />
          </React.Suspense>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default DevToolsHub;