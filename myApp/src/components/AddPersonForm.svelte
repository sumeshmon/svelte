<script lang="ts">
  import type { svelte } from "@sveltejs/vite-plugin-svelte";
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let name: string = "";
  let age: number; 
  let movie: string;
  let position: string;
  let food: string[] = [];

  const formSubmit = () => {
    const person = {
      name,
      age,
      food,
      position,
      id: Math.floor(Math.random() * 10 + 100)
    };
    dispatch('addPerson', person)
  }

</script>
{#if name !== '' && typeof age === 'number' && movie !== '' && food.length > 0}
    <div>{name} - {age} - {food} - {movie}</div>
    {:else}
    <p>Please fill the form</p>
{/if}
<form on:submit|preventDefault={formSubmit}>
    <input type="text" placeholder="Name" bind:value={name}>
    <input type="number" placeholder="Age" bind:value={age}>
    <input type="text" placeholder="Position" bind:value={position}>
    <br><br>
    <input type="checkbox" value="veg" bind:group={food}> Veg <br>
    <input type="checkbox" value="nonVeg" bind:group={food}> Non Veg
    <br><br>
    <select bind:value={movie}>
        <option value="">Select</option>
        <option value="english">English Movie</option>
        <option value="malayalam">Malayalam Movie</option>
        <option value="hindi">Hindi Movie</option>
    </select>
    <br><br>
    <button>Add person</button>
    <br><br>
</form>

<style>
button{
    background-color: blueviolet;
    color: #fff;
    padding: 10px 20px;
}
</style>