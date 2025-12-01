<script lang="ts">
	import JourneyBarMessage from './JourneyBarMessage.svelte';

	let { locale } = $props();
</script>

<div
	class="flex w-full grow flex-row items-center justify-center gap-2 rounded-t-4xl bg-black/20 p-5"
>
	<!-- TODO add different effects: train passing by, vehicle passing by, houses sprining up and lighting up their windows, couples on a walk? -->
	<JourneyBarMessage {locale} />
</div>
