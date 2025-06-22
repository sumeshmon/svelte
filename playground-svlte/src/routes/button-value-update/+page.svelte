<script>
    import Buttons from "./Buttons.svelte";
    const buttons = [
      { value: 0, text: 'Neutral' },
      { value: -1, text: 'Decrease' },
      { value: 1, text: 'Increase' }
    ];
    let buttonValue = 0;
  </script>
  
<div>{buttonValue}</div>
<Buttons {buttons} on:click={(e) => buttonValue += e.detail.value} />
    
  