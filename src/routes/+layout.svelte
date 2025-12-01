<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import 'remixicon/fonts/remixicon.css';
	import { m } from '$lib/paraglide/messages';
	import Snowflakes from './Snowflakes.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>
		{m.nameShort()}
	</title>
</svelte:head>

<div class="text-white relative flex w-full grow flex-col overflow-x-hidden overflow-y-hidden h-full m-0 p-0">
	<div class="w-full h-full absolute z-1" style="background-color: {data.background}"></div>
	<Snowflakes />
	<div class="z-10 flex w-full grow flex-col overflow-x-hidden overflow-y-hidden">
		{@render children?.()}
	</div>
</div>
