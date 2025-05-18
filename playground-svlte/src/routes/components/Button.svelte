<script>
    import { createEventDispatcher } from 'svelte';
    const dispatchSumesh = createEventDispatcher();
</script>
<!-- normal -->
<!-- <button on:click><slot></slot></button> -->

<!-- passing the event -->
<button on:click  = { ()=> dispatchSumesh('showBabu')}>Show Header</button>
<button on:click  = { ()=> dispatchSumesh('hideBabu')}>Hide Header</button>

<!-- passing the event with detail-->
<!-- <button on:click={ () => dispatchSumesh('clickSasi',true)}>Show Header </button>
<button on:click={ () => dispatchSumesh('clickSasi',false)}>Hide Header </button> -->