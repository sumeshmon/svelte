<script>
  import Button from "../components/Button.svelte";
  import Play from "../components/Play.svelte";
  let showContent = false
  
</script>

{#if showContent}
  Hellow
{/if}
<!-- <button on:click={ () => {showContent=true}}> Show header</button>
<button on:click={ () => {showContent=false}}> Hide Header</button> -->

 <Play on:clickSumesh = { () => {showContent = true} }/>