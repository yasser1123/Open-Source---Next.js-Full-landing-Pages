"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowDown, FiX } from "react-icons/fi";
import Image from "next/image";

interface Tool {
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

const tools: Tool[] = [
{
id: 1,
title: "Redux Toolkit",
description: "A toolset for efficient Redux development",
category: "State Management",
link: "https://redux-toolkit.js.org/",
image: "https://placehold.co/600x400/2563eb/FFFFFF?text=Redux+Toolkit",
creator: "Mark Erikson",
creatorPhotoUrl: "https://placehold.co/100/2563eb/FFFFFF?text=ME",
longDescription: `Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development. It includes utilities like configureStore, createReducer, createAction, and createSlice that simplify most Redux tasks. Key features include:
- Automatic setup of Redux DevTools
- Simplified store configuration
- Immutable update logic with Immer
- Good TypeScript support
- Reduced boilerplate code
Example of creating a counter slice:
\`\`\`javascript
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1; },
    decrement: state => { state.value -= 1; },
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
\`\`\`

Best practices:
1. Always use configureStore instead of createStore
2. Organize code with feature-based folder structure
3. Use createSlice for reducer logic
4. Set up TypeScript types for state and actions
5. Use the React Redux hooks (useSelector, useDispatch)
6. Keep action types consistent across features
7. Use selector functions to encapsulate state access
8. Handle async operations with createAsyncThunk`,
},
{
id: 2,
title: "React Query",
description: "Data fetching and caching for React",
category: "Data Fetching",
link: "https://react-query.tanstack.com/",
image: "https://placehold.co/600x400/06b6d4/FFFFFF?text=React+Query",
creator: "Tanner Linsley",
creatorPhotoUrl: "https://placehold.co/100/06b6d4/FFFFFF?text=TL",
longDescription: `React Query is a powerful data fetching and state management library for React applications. It handles caching, background synchronization, and stale times out of the box. Key features include:
- Automatic caching of query results
- Background data synchronization
- Stale-while-revalidate caching strategy
- Pagination and infinite scrolling support
- Request deduplication
- Cancelation of stale requests
- Optimistic updates support
Basic usage example:
\`\`\`javascript
import { useQuery } from 'react-query';

function Example() {
  const { data, error, isLoading } = useQuery(
    'todos', 
    async () => {
      const response = await fetch('/api/todos');
      return response.json();
    }
  );
  
  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error: {error.message}</span>;
  
  return (
    <ul>
      {data.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

Best practices:
1. Use meaningful query keys that uniquely identify data
2. Set appropriate staleTime and cacheTime values
3. Use pagination or infinite queries for large datasets
4. Implement optimistic updates for better UX
5. Use dependent queries when data depends on previous queries
6. Set up global configuration for consistent behavior
7. Use the QueryClientProvider at the root of your app
8. Consider using prefetching for anticipated data needs`,
},
{
id: 3,
title: "Zod",
description: "TypeScript-first schema validation",
category: "Validation",
link: "https://zod.dev/",
image: "https://placehold.co/600x400/a855f7/FFFFFF?text=Zod",
creator: "Colin McDonnell",
creatorPhotoUrl: "https://placehold.co/100/a855f7/FFFFFF?text=CM",
longDescription: `Zod is a TypeScript-first schema declaration and validation library. It allows you to define data schemas and validate them at runtime, providing strong type safety throughout your application. Key features include:
- Type inference from schemas
- Runtime validation of data
- Support for complex data structures
- Custom error messages
- Integration with TypeScript for type safety
- Support for parsing and transforming data
Basic schema example:
\`\`\`javascript
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(3),
  age: z.number().min(18),
  email: z.string().email(),
});

// TypeScript type inferred from schema
type User = z.infer<typeof UserSchema>;

// Validate data
const result = UserSchema.safeParse({
  name: 'John',
  age: 25,
  email: 'john@example.com',
});

if (result.success) {
  console.log(result.data); // validated data
} else {
  console.error(result.error); // validation errors
}
\`\`\`

Best practices:
1. Use Zod schemas for all external data validation
2. Keep schemas in a centralized location for reuse
3. Use meaningful error messages for better debugging
4. Take advantage of TypeScript inference for type safety
5. Use discriminated unions for complex data structures
6. Implement schema validation for form data
7. Use Zod for API request/response validation
8. Consider using Zod with React Hook Form for form validation`,
},
{
id: 4,
title: "Vite",
description: "Next-generation front-end build tool",
category: "Build Tools",
link: "https://vitejs.dev/",
image: "https://placehold.co/600x400/10b981/FFFFFF?text=Vite",
creator: "Evan You",
creatorPhotoUrl: "https://placehold.co/100/10b981/FFFFFF?text=EY",
longDescription: `Vite is a modern front-end build tool that provides a faster and leaner development experience for web projects. It consists of two major parts:
1. A development server that serves source files over native ES modules
2. A production build command that bundles code with Rollup
Key features include:
- Lightning-fast hot module replacement (HMR)
- Native ES module support
- Optimized production builds
- Built-in support for TypeScript, JSX, CSS, and more
- Rich plugin ecosystem
- Support for multiple frameworks (React, Vue, Svelte, etc.)

Creating a new Vite project:
\`\`\`bash
npm create vite@latest
\`\`\`

Example vite.config.js for React:
\`\`\`javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
\`\`\`

Best practices:
1. Use Vite for new projects instead of create-react-app
2. Take advantage of native ES module imports
3. Use the built-in TypeScript support
4. Optimize images and assets in the build process
5. Use environment variables for configuration
6. Implement code splitting for better performance
7. Use the Vite plugin ecosystem for additional features
8. Consider using Vite's library mode for component libraries`,
},
{
id: 5,
title: "Tailwind CSS",
description: "Utility-first CSS framework for rapid UI development",
category: "UI Framework",
link: "https://tailwindcss.com/",
image: "https://placehold.co/600x400/0ea5e9/FFFFFF?text=Tailwind+CSS",
creator: "Adam Wathan",
creatorPhotoUrl: "https://placehold.co/100/0ea5e9/FFFFFF?text=AW",
longDescription: `Tailwind CSS is a utility-first CSS framework packed with predefined classes that can be composed to build any design, directly in your markup. Key features include:
- Utility-first approach for styling
- Responsive design out of the box
- JIT (Just-in-Time) compiler for minimal CSS
- Highly customizable via configuration
- Plugin system for extending functionality
- Dark mode support
- Built-in support for modern CSS features
- Responsive variants for different screen sizes

Basic usage example:
\`\`\`html
<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
  <div class="shrink-0">
    <img class="h-12 w-12" src="/img/logo.svg" alt="Logo">
  </div>
  <div>
    <div class="text-xl font-medium text-black">Tailwind CSS</div>
    <p class="text-slate-500">UI framework with utility classes</p>
  </div>
</div>
\`\`\`

Best practices:
1. Use utility classes instead of writing custom CSS
2. Leverage the @apply directive for reusable components
3. Customize the theme in tailwind.config.js
4. Use variants like hover: and focus: for interactive states
5. Organize components with consistent class order
6. Use Prettier with the Tailwind plugin for class sorting
7. Extract component classes for reusable elements
8. Use arbitrary values for one-off styles with brackets notation`,
},
{
id: 6,
title: "Next.js",
description: "React framework for production-grade applications",
category: "Framework",
link: "https://nextjs.org/",
image: "https://placehold.co/600x400/171717/FFFFFF?text=Next.js",
creator: "Vercel",
creatorPhotoUrl: "https://placehold.co/100/171717/FFFFFF?text=V",
longDescription: `Next.js is a React framework that provides a complete solution for building production-ready web applications. Key features include:
- Server-side rendering (SSR) for improved SEO and performance
- Static site generation (SSG) for blazing-fast pages
- Incremental static regeneration (ISR) for dynamic content
- API routes for building backend functionality
- File-system based routing
- Image optimization and font optimization
- Zero configuration by default
- TypeScript support
- Middleware for request processing
- Edge runtime support

Basic page example:
\`\`\`jsx
// pages/index.js
import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>My Next.js App</title>
        <meta name="description" content="Built with Next.js" />
      </Head>

      <main>
        <h1>Welcome to Next.js!</h1>
      </main>
    </div>
  )
}
\`\`\`

Best practices:
1. Use getStaticProps for static content
2. Use getServerSideProps only when necessary
3. Implement ISR for dynamic but cacheable content
4. Optimize images with next/image component
5. Use next/link for client-side navigation
6. Implement proper meta tags for SEO
7. Use the App Router for newer projects
8. Leverage middleware for auth and analytics`,
},
{
id: 7,
title: "TypeScript",
description: "JavaScript with syntax for types",
category: "Language",
link: "https://www.typescriptlang.org/",
image: "https://placehold.co/600x400/3178c6/FFFFFF?text=TypeScript",
creator: "Microsoft",
creatorPhotoUrl: "https://placehold.co/100/3178c6/FFFFFF?text=MS",
longDescription: `TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. Key features include:
- Static type checking
- Type inference
- Interface definitions
- Generics
- Union and intersection types
- TypeScript compiler (tsc)
- IDE integration and code intelligence
- JavaScript superset (all JS is valid TS)
- Gradual typing for incremental adoption
- Declaration files for type definitions

Basic example:
\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

function createUser(userData: Omit<User, 'id'>): User {
  return {
    id: Math.floor(Math.random() * 1000),
    ...userData
  };
}

const user = createUser({
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true
});

console.log(user);
\`\`\`

Best practices:
1. Enable strict mode in tsconfig.json
2. Use interfaces for object shapes
3. Define function parameter and return types
4. Leverage type inference where possible
5. Use union types for variables with multiple types
6. Create utility types for common patterns
7. Implement proper error handling with type guards
8. Use declaration merging for extending existing types`,
},
{
id: 8,
title: "Playwright",
description: "Reliable end-to-end testing for modern web apps",
category: "Testing",
link: "https://playwright.dev/",
image: "https://placehold.co/600x400/2ecc71/FFFFFF?text=Playwright",
creator: "Microsoft",
creatorPhotoUrl: "https://placehold.co/100/2ecc71/FFFFFF?text=MS",
longDescription: `Playwright is a framework for web testing and automation that allows you to automate Chromium, Firefox, and WebKit browsers. Key features include:
- Multi-browser support out of the box
- Auto-wait capabilities for elements
- Headless and headed mode
- Mobile emulation
- Network interception
- Screenshot and video recording
- Web-first assertions
- Test parallelization
- Playwright Test Runner with fixtures
- Codegen for test recording
- API testing support

Basic test example:
\`\`\`typescript
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/.*intro/);
});
\`\`\`

Best practices:
1. Use page fixtures for browser context
2. Implement test isolation for reliability
3. Use data-testid attributes for element selection
4. Record videos for failed tests
5. Group tests logically with describe blocks
6. Extract common operations into helper functions
7. Set up CI/CD pipeline integration
8. Implement visual testing for UI regressions`,
}
];

const categories = Array.from(new Set(tools.map(tool => tool.category)));
const GlobalStyles = () => {
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

// const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
//   const lang = language.replace(/^\s*/, '').split(' ')[0] || 'javascript';

//   const sanitizedCode = code.replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#039;');
  
//   return (
//     <div className="relative rounded-lg overflow-hidden my-4">
//       <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-4">
//         <div className="flex space-x-2">
//           <div className="w-3 h-3 rounded-full bg-red-500"></div>
//           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//           <div className="w-3 h-3 rounded-full bg-green-500"></div>
//         </div>
//         <div className="text-xs text-slate-400 ml-4">{lang}</div>
//       </div>
//       <pre className="bg-slate-900 pt-10 pb-4 px-4 overflow-x-auto text-sm">
//         <code className={`language-${lang}`} dangerouslySetInnerHTML={{ __html: sanitizedCode }} />
//       </pre>
//     </div>
//   );
// };

const HomePage = (): JSX.Element => {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
    const [activeTool, setActiveTool] = useState<Tool | null>(null);
    const [isToolModalOpen, setIsToolModalOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [_isLoaded, setIsLoaded] = useState<boolean>(false);
    const [feedY, setFeedY] = useState<number>(0);
    const [isMounted, setIsMounted] = useState(false);
    

  // Initialize with all tools when component mounts
  useEffect(() => {
    setFilteredTools([...tools]);
  }, []);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleLoad = (): void => {
      setIsLoaded(true);
    };
    
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
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
      return tools;
    }
    return tools.filter(tool => tool.category === category);
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
  const handleToolClick = (tool: Tool): void => {
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

  const _container = {
    hidden: { opacity: 0.5 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const _item = {
    hidden: { scale: 0.95 },
    show: { 
      scale: 1, 
      transition: { type: "spring", damping: 12 } 
    },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white font-sans">
      <GlobalStyles />

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

          <div className="absolute top-1/3 left-1/3 w-[150px] h-[150px] border border-blue-500/20 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/2 w-[200px] h-[200px] border border-cyan-500/20 rounded-full animate-pulse-slow opacity-70"></div>
          <div className="absolute top-2/3 right-1/4 w-[180px] h-[180px] border border-blue-500/15 rounded-full animate-pulse-slow opacity-60"></div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/70"></div>

        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="mb-6 flex flex-col items-center">
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
                    repeat: Number.POSITIVE_INFINITY,
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

      <main className="px-4 py-16 max-w-7xl mx-auto" id="tools-feed">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">Browse by Category</h2>
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
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          key={selectedCategory}
        >
          {isLoading ? (
            <motion.div 
              className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center min-h-[400px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </motion.div>
          ) : filteredTools.length === 0 ? (
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
          ) : (
            <>
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                  onClick={() => handleToolClick(tool)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={tool.image}
                      alt={tool.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-black/20 opacity-60 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-blue-500/90 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 group-hover:scale-110">
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
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {isToolModalOpen && activeTool && isMounted && (
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
                  <Image
                    src={activeTool.image}
                    alt={activeTool.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-blue-500/90 text-white px-3 py-1 rounded-lg text-xs font-medium inline-block mb-2">
                      {activeTool.category}
                    </span>
                    <h2 className="text-2xl font-bold text-white drop-shadow-lg">{activeTool.title}</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-slate-300 mb-4">{activeTool.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Created by {activeTool.creator}</span>
                    <a
                      href={activeTool.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-800/50 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} DevTools Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
