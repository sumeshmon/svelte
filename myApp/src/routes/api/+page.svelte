<script lang="ts">
  //   interface User {
  //   id: number;
  //   name: string;
  //   username: string;
  //   email: string;
  // }
  //let userData: User[] = []; // Explicitly typed as an array of User objects
  let userData: [] = []
  async function fromApi() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json(); // Explicitly type `data`
    // const data: User[] = await response.json(); // Explicitly type `data`
    userData = data; 
  } catch (error) {
    console.log('Something went wrong', error);
  }
}

 // Fetch data when the component mounts
 import { onMount } from 'svelte';
 onMount(() => {
    fromApi();
  });

// show more function
let visibleCount = 3

function showMore (){
  visibleCount += 3
}
function showLess () {
  visibleCount = 3
}
</script>

<svelte:head>
  <title>Playing with API and data</title>
</svelte:head>

<div class="data-table">
  {#each userData.slice(0, visibleCount) as user}
    <div>
      <strong>{user.name}</strong> (Username: {user.username})
    </div>
  {/each}
  <button id="showMoreBtn" on:click={showMore}>Show More</button>
  {#if  visibleCount > 3}
    <button id="showLessBtn" on:click={showLess} class="hidden">Show Less</button>
  {/if}
  
</div>
<style>
 
</style>
