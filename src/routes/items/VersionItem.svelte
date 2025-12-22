<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		version,
		date,
		children
	}: {
		version: string;
		date: string;
		children: Snippet;
	} = $props();
</script>

<div class="flex w-full max-w-full min-w-full flex-col gap-0 text-white">
	<div class="flex flex-row items-center gap-2">
		<h2 class="text-xl">FestIES {version}</h2>
		<p class="italic opacity-50">{date}</p>
	</div>
	<ul class="list-inside list-disc">
		{@render children()}
	</ul>
</div>
