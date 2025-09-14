import React from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

// Tool data interface
export interface Tool {
  id: number;
  title: string;
  description: string;
  category: string;
  link: string;
  image: string;
  creator: string;
  creatorPhotoUrl: string;
  longDescription: string;
}

// Code block for displaying code snippets
export const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const lang = language.replace(/^\s*/, '').split(' ')[0] || 'javascript';

  const sanitizedCode = code.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  return (
    <div className="relative rounded-lg overflow-hidden my-4">
      <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-slate-400 ml-4">{lang}</div>
      </div>
      <pre className="bg-slate-900 pt-10 pb-4 px-4 overflow-x-auto text-sm">
        <code className={`language-${lang}`} dangerouslySetInnerHTML={{ __html: sanitizedCode }} />
      </pre>
    </div>
  );
};

// Category filters component
export const CategoryFilters: React.FC<{
  categories: string[];
  selectedCategory: string;
  handleCategoryChange: (category: string) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ categories, selectedCategory, handleCategoryChange, handleSelectChange }) => {
  return (
    <>
      <div className="block md:hidden w-full mb-4">
        <select
          value={selectedCategory}
          onChange={handleSelectChange}
          className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter by category"
        >
          <option value="All">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden md:flex flex-wrap gap-3">
        <motion.button
          key="All"
          className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
            selectedCategory === "All"
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
          onClick={() => handleCategoryChange("All")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All Categories
        </motion.button>
        
        {categories.map((category) => (
          <motion.button
            key={category}
            className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              selectedCategory === category
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
            onClick={() => handleCategoryChange(category)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </>
  );
};

// Component for the list of tools
export const ToolsList: React.FC<{
  isLoading: boolean;
  filteredTools: Tool[];
  handleToolClick: (tool: Tool) => void;
  handleCategoryChange: (category: string) => void;
  item: any;
}> = ({ isLoading, filteredTools, handleToolClick, handleCategoryChange, item }) => {
  if (isLoading) {
    return (
      <motion.div 
        className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center min-h-[400px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </motion.div>
    );
  }
  
  if (filteredTools.length === 0) {
    return (
      <motion.div 
        className="col-span-1 md:col-span-2 lg:col-span-3 p-8 bg-slate-800/50 rounded-xl text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-xl font-medium text-white mb-2">No tools found</h3>
        <p className="text-slate-400">
          No tools match the selected category. Try selecting a different category.
        </p>
        <button
          onClick={() => handleCategoryChange("All")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          View All Tools
        </button>
      </motion.div>
    );
  }

  return (
    <>
      {filteredTools.map((tool) => (
        <motion.div
          key={tool.id}
          variants={item}
          className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
          onClick={() => handleToolClick(tool)}
        >
          <div className="relative h-64 overflow-hidden">
            <img
              src={tool.image}
              alt={tool.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="bg-blue-500/90 text-white px-6 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                View Details
              </span>
            </div>
            <div className="absolute top-4 left-4 bg-blue-500/90 text-white px-3 py-1 rounded-lg text-xs font-medium z-10">
              {tool.category}
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-3">{tool.title}</h3>
            <p className="text-slate-300 mb-4 line-clamp-2">{tool.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img
                    src={tool.creatorPhotoUrl}
                    alt={tool.creator}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-slate-400 text-sm">{tool.creator}</span>
              </div>
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-300 transition-colors flex items-center cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Site
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

// Modal component for displaying tool details
export const ToolModal: React.FC<{
  activeTool: Tool;
  handleCloseModal: () => void;
  modalVariants: any;
  backdropVariants: any;
  renderToolDescription: (description: string) => React.ReactNode;
}> = ({ activeTool, handleCloseModal, modalVariants, backdropVariants, renderToolDescription }) => {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCloseModal}
      ></motion.div>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={backdropVariants}
      >
        <motion.div
          className="bg-slate-800 text-white w-full max-w-2xl rounded-xl shadow-2xl z-50 relative border border-slate-700 my-8 max-h-[85vh] flex flex-col"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer z-10"
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            <FiX className="text-xl" />
          </button>

          <div className="relative h-48 overflow-hidden rounded-t-xl">
            <img
              src={activeTool.image}
              alt={activeTool.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <span className="bg-blue-500/90 text-white px-3 py-1 rounded-lg text-xs font-medium inline-block mb-2">
                {activeTool.category}
              </span>
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{activeTool.title}</h2>
            </div>
          </div>

          <div className="p-4 overflow-y-auto">
            <div className="flex items-center mb-4 bg-slate-700/50 p-3 rounded-lg">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                <img
                  src={activeTool.creatorPhotoUrl}
                  alt={activeTool.creator}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-sm">{activeTool.creator}</p>
                <p className="text-slate-400 text-xs">Creator</p>
              </div>
              <div className="ml-auto">
                <a
                  href={activeTool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-xs font-medium"
                >
                  Official Website
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2 text-blue-300">Overview</h3>
              <p className="text-slate-300 leading-relaxed text-sm">{activeTool.description}</p>
            </div>

            <div className="prose prose-invert max-w-none text-sm">
              <h3 className="text-md font-semibold mb-2 text-blue-300">Key Features</h3>
              <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50 mb-4">
                {renderToolDescription(activeTool.longDescription)}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-700 mt-auto">
            <div className="flex space-x-3">
              <button
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium cursor-pointer text-sm"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <a
                href={activeTool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium cursor-pointer text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                Visit Website
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}; 