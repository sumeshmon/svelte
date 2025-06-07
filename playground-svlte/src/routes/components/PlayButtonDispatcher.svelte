<script>
  import { text } from "@sveltejs/kit";
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher()
</script>
<!-- <button on:click><slot></slot></button> -->

<!-- <button on:click = { ()=> dispatch('show')}>Show content</button>
<button on:click = { () => dispatch('hide') }>Hide Contnet</button> -->

<button on:click = { () => dispatch('customClick', true)}>Show contnet</button>
<button on:click = { () => dispatch('customClick', false)}>Hide contnet</button>