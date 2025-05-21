<script>
  import Button from "./components/Button.svelte";
  import Container from "./components/Container.svelte";
  import FaceComponent from "./components/FaceComponent.svelte";
  import Header from "./components/Header.svelte";
  import Play from "./components/Play.svelte";
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

  let showHeader = false;
  // setTimeout(() => {
  //   showHeader = true;
  // }, 1000);

// challenge
  const buttons = [
        {value: 0,  text: 'ummmmmm......'},
        {value: 1,  text: 'I sure do!'},
        {value: -2, text: 'gross!'}
    ]
    let score = 0;
</script>
<Play/>


{#if showHeader}
  <Header />
{/if} <br><br><br><br><br><br><br>
<!-- just passing the click event with slot -->
<!-- <button on:click={ () =>{showHeader=true} }>Show header</button>
<button on:click={ () =>{showHeader=false} }>Hide header</button> -->

<!-- passing the event -->
 <!-- <Button on:showBabu = { ()=>{showHeader=true} } on:hideBabu = { ()=>{showHeader=false} }/> -->

 <!-- <Button on:clickSasi = { (e)=>{showHeader=e.detail} } /> -->

 <!-- challenge -->
  {score}
  <Button {buttons} on:click={ (e)=> {score += e.detail.value}}/>
<Container>
  <div>Say: {say}</div> 

  {#if isLogged}
    <h2>Welcome dude!</h2>
  {:else}
    <h2>Please login</h2>
  {/if}

  {#each fruits as value, index}
    <p>Value is {value} and the index is {index}</p>
  {/each}

  {#each [15, 25, 33] as value, index}
    <p>{value} <span> - </span> {index}</p>
  {/each}

</Container>



