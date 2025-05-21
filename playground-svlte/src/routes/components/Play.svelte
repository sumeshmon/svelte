<script>
  import { text } from "@sveltejs/kit";
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher()
</script>

<!-- <button on:click ><slot></slot></button> -->

<button on:click={ ()=> dispatch('clickSumesh') }>Show header</button>