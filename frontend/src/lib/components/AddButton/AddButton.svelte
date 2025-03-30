<script>
    import Button from "$lib/components/ui/button/button.svelte";
    export let apply;
</script>

<div>
    <Button
        variant="default"
        on:click={() => {
            alert("Add button clicked!");
        }}
    >
        Add
    </Button>
</div>