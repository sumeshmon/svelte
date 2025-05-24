<script>
  import Button from "../components/Button.svelte";
  import PlayButtonDispatcher from "../components/PlayButtonDispatcher.svelte";
  let showContent = false;
  function handleClickSasi(event) {
    showContent = true;
  }
  const names = ["Mohan Lal", "Mammooty", "Suresh Gopi"];
</script>

{#if showContent}
  Hellow
{/if} 
<!-- <button on:click={ () => {showContent=true}}> Show header</button>
<button on:click={ () => {showContent=false}}> Hide Header</button> -->

<!-- <Play on:clickSumesh = { () => {showContent = true} } on:clickBabu = { () => {showContent = false} }/> -->

<!-- using js function -->
<!-- <Play on:clickSasi={handleClickSasi}>Show events</Play> -->

<PlayButtonDispatcher
  on:clickSasi={(e) => {
    showContent = e.detail;
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
