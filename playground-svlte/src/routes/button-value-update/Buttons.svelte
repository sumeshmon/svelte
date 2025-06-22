<script>
    import { createEventDispatcher } from 'svelte';
    export let buttons;
  
    let dispatch = createEventDispatcher();
  
  </script>
  
  {#each buttons as button}
    <button on:click={ () => dispatch('click', {value:button.value})}>
      {button.text}
    </button>
  {/each}
  
  <style>
    button {
      padding: 5px 10px;
      margin: 0 5px;
      color: #222;
    }
  </style>
  