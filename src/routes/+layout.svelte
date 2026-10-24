
<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main>
	{@render children()}
</main>

<style>
	main {
		min-height: 100dvh;
		width: 100%;
	}
</style>
