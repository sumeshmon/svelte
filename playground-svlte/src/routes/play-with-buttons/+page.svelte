<script>
  import Button from "../components/Button.svelte";
  import PlayButtonDispatcher from "../components/PlayButtonDispatcher.svelte";
  let showContent = false;
  function handleClickSasi(event) {
    showContent = true;
  }
  const names = ["Mohan Lal", "Mammooty", "Suresh Gopi"];
  const stringify = JSON.stringify(names)
  const json = JSON.parse(stringify)
</script>
<!-- json parser test -->
 
<h5>{json}</h5>
{#if showContent}
  Hellow
{/if} 

<!-- <PlayButtonDispatcher 
  on:show = { () => showContent = true } 
  on:hide = { () => showContent = false }
/> -->

<PlayButtonDispatcher
  on:customClick = {(e) => {
    showContent = e.detail
  }}
/>

<hr />
<!-- loop -->
{#each ["Mohan Lal", "Mammooty", "Suresh Gopi"] as value, position}
  {#if position === 0 || position === names.length - 1}
    <button>{value}</button>
  {/if}
{/each}

<style>
  button {
    margin-right: 10px;
    padding: 5px;
    background-color: aquamarine;
  }
</style>
