<script lang="ts">
    let family = [
    {
      name: 'Sumesh', age : 44, position: 'Elder Person', id : 1,
    },
    {
      name: 'Sali', age : 37, position: 'House Wife', id : 2,
    },
    {
      name: 'Theertha', age : 14, position: 'Daughter', id : 3,
    },
    {
      name: 'Tejas', age : 11, position: 'Son', id : 4,
    }
  ]
  let name: string = "";
  let age: number; 
  let movie: string;
  let food: string[] = []

  const formSubmit = () => {
    console.log(name,age,food, movie);
  }

</script>
{#if name !== '' ||  typeof age === 'number' ||  movie !== '' ||  food.length > 0}
    <div>{name} - {age} - {food} - {movie}</div>
    {:else}
    <p>Please fill the form</p>
{/if}
<form on:submit|preventDefault={formSubmit}>
    <input type="text" placeholder="Name" bind:value={name}>
    <input type="number" placeholder="Age" bind:value={age}>
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