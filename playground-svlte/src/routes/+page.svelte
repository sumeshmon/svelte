<script>
  import Container from "./components/Container.svelte";
  import FaceComponent from "./components/FaceComponent.svelte";
  let say = "hi";
  setTimeout(() => {
    say = "hello";
  }, 2000);

  let isLogged = false;
  setTimeout(() => {
    isLogged = true;
  }, 3000);

  const fruits = ["apple", "banana", "grape"];
  function logValue(value, index) {
    console.log(`value is ${value} and the position of the array is ${index}`);
    return null;
  }
</script>
 
<Container> 
  <div>Say: {say}</div>

  <FaceComponent index={2} />

  {#if isLogged}
    <h2>Welcome dude!</h2>
  {:else}
    <h2>Please login</h2>
  {/if}

  {#each fruits as value, index}
    <p>Value is {value} and the index is {index}</p>
  {/each}

  {#each [15,25,33] as value,index }
    <p>{value}  <span> - </span>   {index}</p>
  {/each}
</Container>
