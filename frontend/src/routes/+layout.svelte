<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="content rounded">
	{@render children()}
</div>