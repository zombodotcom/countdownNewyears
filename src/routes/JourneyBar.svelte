<script lang="ts">
	import JourneyBarMessage from "./JourneyBarMessage.svelte";

	let { locale } = $props();
</script>

<div class="grow flex w-full flex-row gap-2 bg-black/20 rounded-t-4xl min-h-30 max-h-30 h-30 justify-center items-center">
    <!-- TODO add different effects: train passing by, vehicle passing by, houses sprining up and lighting up their windows, couples on a walk? -->
	<JourneyBarMessage {locale} />
</div>