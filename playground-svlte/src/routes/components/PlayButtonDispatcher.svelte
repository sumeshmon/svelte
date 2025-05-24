<script>
  import { text } from "@sveltejs/kit";
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher()
</script>
<!-- using js function -->
<!-- <button on:click={() => dispatch('clickSasi', false)}>
  <slot></slot>
</button> -->


<!-- method 1 --> 
<!-- <button on:click ><slot></slot></button> -->


<!-- method 2 -->
<!-- <button on:click={ ()=> dispatch('clickSumesh') }>Show header</button>

<button on:click  = { () => dispatch('clickBabu')}>Hide Header</button> -->

<!-- method 3 -->

<button on:click = { () => dispatch('clickSasi',true)}>Show Header</button>
<button on:click = { () => dispatch('clickSasi',false)}>Hide Header</button>
