import { Tool } from './DevToolsComponents';

export const toolsData: Tool[] = [
  {
    id: 1,
    title: "Redux Toolkit",
    description: "A toolset for efficient Redux development",
    category: "State Management",
    link: "https://redux-toolkit.js.org/",
    image:
      "https://images.unsplash.com/photo-1634249171878-05944b5f36e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "Mark Erikson",
    creatorPhotoUrl: "https://avatars.githubusercontent.com/u=495480",
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
    image:
      "https://images.unsplash.com/photo-1665686310934-100fb4332e47?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "Tanner Linsley",
    creatorPhotoUrl: "https://avatars.githubusercontent.com/u=5580297",
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
    image:
      "https://images.unsplash.com/photo-1722547252727-6b7e75c03e12?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "Colin McDonnell",
    creatorPhotoUrl: "https://avatars.githubusercontent.com/u=191564",
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
    image:
      "https://images.unsplash.com/photo-1692702671951-9ac29f22dbef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "Evan You",
    creatorPhotoUrl: "https://avatars.githubusercontent.com/u=499550",
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
    image:
      "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "Adam Wathan",
    creatorPhotoUrl: "https://avatars.githubusercontent.com/u=4323180",
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
    image:
      "https://images.unsplash.com/photo-1642620708770-9549467218ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "Vercel",
    creatorPhotoUrl: "https://avatars.githubusercontent.com/u=14985020",
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
    image:
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "Microsoft",
    creatorPhotoUrl: "https://avatars.githubusercontent.com/u=6154722",
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
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "Microsoft",
    creatorPhotoUrl: "https://avatars.githubusercontent.com/u=6154722",
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