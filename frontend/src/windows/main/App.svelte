<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { Progress } from '$lib/components/ui/progress';
  import { Skeleton } from '$lib/components/ui/skeleton/index.js';
  import { Toaster } from '$lib/components/ui/sonner';
  import { events, os } from '@neutralinojs/lib';
  import { ModeWatcher, setMode } from 'mode-watcher';
  import { blur } from 'svelte/transition';
  import Sidebar from './sidebar/sidebar.svelte';
  import Code from './components/code.svelte';
  import Onboarding from './components/onboarding.svelte';
  import Updater from './components/updater.svelte';
  import FlagEditorPage from './components/flag-editor/flag-editor-page.svelte';
  import Dev from './pages/Dev.svelte';
  import FastFlags from './pages/FastFlags.svelte';
  import Support from './pages/Info.svelte';
  import Integrations from './pages/Integrations.svelte';
  import Misc from './pages/Misc.svelte';
  import Mods from './pages/Mods.svelte';
  import BehaviorPage from './pages/Behavior.svelte';
  import Roblox from './ts/roblox';
  import { sleep } from './ts/utils/';
  import { focusWindow } from './ts/window';
  import Appearance from './pages/Appearance.svelte';

  let currentPage: string;
  let flagErrorPopupClicked: boolean | null = null;
  const launchInfo = {
    launching: false,
    progress: 1,
    text: 'Launching...',
    isConnected: false,
    flagPopup: {
      show: false,
      title: '',
      description: '',
      code: '',
    },
  };

  // Handle flag error popups
  async function flagErrorPopup(title: string, description: string, code: string) {
    launchInfo.flagPopup = { title, description, code, show: true };
    flagErrorPopupClicked = null;

    while (flagErrorPopupClicked == null) {
      await sleep(100);
    }
    return flagErrorPopupClicked;
  }

  // Launch Roblox with proper handlers
  async function launchRobloxWithHandlers(url?: string) {
    await Roblox.launch(
      (value) => (launchInfo.isConnected = value),
      (value) => (launchInfo.launching = value),
      (value) => (launchInfo.progress = value),
      (value) => (launchInfo.text = value),
      flagErrorPopup,
      url
    );
  }

  // Handle deeplink checks
  async function checkDeeplink() {
    const urlArgument = window.NL_ARGS.find((arg) => arg.includes('--deeplink='));
    if (!urlArgument) return;

    const url = urlArgument.slice(11);
    if (url.startsWith('appleblox://')) {
      const command = url.slice(12).trim();
      if (command === 'launch') {
        console.info("[App] Launching Roblox from 'appleblox://launch'");
        await focusWindow();
        await launchRobloxWithHandlers();
      }
    } else if (url.startsWith('roblox:') || url.startsWith('roblox-player:')) {
      console.info('[App] Launching AppleBlox with Roblox URI.');
      await focusWindow();
      await launchRobloxWithHandlers(url);
    }
  }

  checkDeeplink();
  setMode('system');

  // Open links in default browser
  function openLink(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A' && target instanceof HTMLAnchorElement) {
      event.preventDefault();
      if (!target.href.includes('localhost')) os.open(target.href);
    }
  }

  document.addEventListener('click', openLink);

  // Listen for page change events
  events.on('ui:change_page', (evt: CustomEvent) => {
    const { id } = evt.detail;
    currentPage = id || currentPage;
  });
</script>

<main>
  <div>
    <!-- Not-rendered panels. Used to preload settings -->
    <Integrations render={false} />
    <FastFlags render={false} />
    <Misc render={false} />
    <Mods render={false} />
    <BehaviorPage render={false} />
  </div>

  <Onboarding />
  <Updater />
  <ModeWatcher track={true} />
  <Toaster richColors id="toaster" />

  <!-- Main Content Section -->
  {#if launchInfo.launching}
    <div class="h-full w-full flex justify-center items-center fixed top-0 left-0 flex-col" transition:blur={{ duration: 300 }} id="launch_div">
      <p class="font-bold text-2xl" id="launch_text">{launchInfo.text}</p>
      <Progress max={100} bind:value={launchInfo.progress} class="w-[60%]" id="launch_progress" />
    </div>
  {:else}
    <Sidebar bind:currentPage bind:isLaunched={launchInfo.isConnected} on:launchRoblox={launchRobloxWithHandlers} id="sidebar" />
    <div class="fixed overflow-y-scroll max-h-full top-0 left-48 w-[83%]">
      {#if currentPage === 'integrations'}
        <Integrations />
      {:else if currentPage === 'fastflags'}
        <FastFlags />
      {:else if currentPage === 'misc'}
        <Misc />
      {:else if currentPage === 'info'}
        <Support />
      {:else if currentPage === 'mods'}
        <Mods />
      {:else if currentPage === 'appearance'}
        <Appearance />
      {:else if currentPage === 'dev'}
        <Dev />
      {:else if currentPage === 'roblox'}
        <BehaviorPage />
      {:else if currentPage === 'flags_editor'}
        <FlagEditorPage />
      {:else}
        <div class="flex items-center m-32 space-x-4 opacity-30">
          <Skeleton class="h-12 w-12 rounded-full" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-[250px]" />
            <Skeleton class="h-4 w-[200px]" />
          </div>
        </div>
      {/if}
    </div>
  {/if}

  <!-- Flag Error Popup -->
  <AlertDialog.Root bind:open={launchInfo.flagPopup.show}>
    <AlertDialog.Content class="h-96 flex flex-col">
      <AlertDialog.Header class="flex-shrink-0">
        <AlertDialog.Title>{launchInfo.flagPopup.title}</AlertDialog.Title>
      </AlertDialog.Header>
      <AlertDialog.Description class="flex-grow">
        <div class="prose prose-sm max-w-none break-words whitespace-normal">
          {@html launchInfo.flagPopup.description}
        </div>
        <Code code={launchInfo.flagPopup.code} class="mt-7 overflow-y-scroll max-h-36" />
      </AlertDialog.Description>
      <AlertDialog.Footer class="flex-shrink-0">
        <AlertDialog.Cancel on:click={() => { flagErrorPopupClicked = false; launchInfo.flagPopup.show = false; }}>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action on:click={() => { flagErrorPopupClicked = true; launchInfo.flagPopup.show = false; }}>Ignore</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</main>
