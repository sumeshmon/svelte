<script>
    import { createEventDispatcher } from 'svelte';
    const dispatchSumesh = createEventDispatcher();

    export let buttons
</script>
<!-- normal -->
<!-- <button on:click><slot></slot></button> -->

<!-- passing the event -->
<!-- <button on:click  = { ()=> dispatchSumesh('showBabu')}>Show Header</button>
<button on:click  = { ()=> dispatchSumesh('hideBabu')}>Hide Header</button> -->

<!-- passing the event with detail-->
<!-- <button on:click={ () => dispatchSumesh('clickSasi',true)}>Show Header </button>
<button on:click={ () => dispatchSumesh('clickSasi',false)}>Hide Header </button> -->

<!-- Challenge  
1. add a prop in Buttons.svelte called buttons which is a list of objects like:
[{value: '', text: ''}, ...etc]
2. use #each to turn all the objects into buttons that
    a. have innerHTML equal to the .text of the object
    b. dispatch a click event that passes the .value of the object 
3. Handle the event in App.svelte to update the score
-->
{#each buttons as button}
    <button on:click={() => dispatchSumesh('click', {value: button.value})}> {button.text}</button>
{/each}
