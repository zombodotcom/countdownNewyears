<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/snowflake-line.svg';
	import 'remixicon/fonts/remixicon.css';
	import { m } from '$lib/paraglide/messages';
	import Snowflakes from './Snowflakes.svelte';
	import { browser } from '$app/environment';

	let { children, data } = $props();

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>
		{m.nameShort()}
	</title>
</svelte:head>

<div class="relative m-0 flex h-full w-full grow flex-col p-0 text-white">
	<div class="absolute z-1 h-full w-full" style="background-color: {data.background}"></div>
	{#key data.snow}
		<Snowflakes snowLimit={data.snow} />
	{/key}
	<div class="z-10 flex w-full grow flex-col">
		{@render children?.()}
	</div>
</div>
