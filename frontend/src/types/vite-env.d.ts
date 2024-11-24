/// <reference types="svelte" />
/// <reference types="vite/client" />

// Declares modules for .svelte files to be treated as Svelte components
declare module '*.svelte' {
  import { SvelteComponent } from 'svelte';
  const component: SvelteComponent;
  export default component;
}

// Declares modules for .icns files (macOS icon files) as strings
declare module '*.icns' {
  const src: string;
  export default src;
}
