<script>
  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
</script>

<div class="m-5 rounded border border-dashed w-[300px]">
  <div class="flex flex-col gap-1 p-5 rounded">
    <Input type="text" placeholder="Company" />
    <Input type="text" placeholder="Role" />
    <Input type="text" placeholder="Location" />
    <Input type="text" placeholder="Link" />
    <Button
      variant="default"
      on:click={() => {
        alert("added to dashboard");
      }}
    >
      Add to Dashboard
    </Button>
  </div>
</div>