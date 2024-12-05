<script lang="ts">
    let name: string | undefined;
</script>

{#if name}
    <h2>{name}</h2>
{/if}

<form action="">
    <input type="text" placeholder="{name}" bind:value={name}>

</form>