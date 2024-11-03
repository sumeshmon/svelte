<script lang="ts">
  let family = [
    {
      name: 'Sumesh', age : 44, position: 'Elder Person', id : 1,
    },
    {
      name: 'Sali', age : 38, position: 'House Wife', id : 2,
    },
    {
      name: 'Theertha', age : 14, position: 'Daughter', id : 3,
    },
    {
      name: 'Tejas', age : 11, position: 'Son', id : 4,
    }
  ]
  // function removeSumesh (){
  //   family = family.filter ( member => member.id != 1)
  // }
  // const removeSumesh = () => {
  //   family = family.filter (member => member.id != 1)
  // }

  // Inline Event Handlers
const removeSumesh = (id: number) => {
  {console.log(id)}
  family = family.filter( (members) => members.id != id)
}
</script>

<svelte:head>
  <title>SvelteKit demo page</title>
</svelte:head>
<div>
 
  {#each family as members (members.id)}
   <div>
    <h3>{members.name}, Age is {members.age} and the person is {members.position}</h3> <br>
    <button on:click={ () => removeSumesh(members.id) }>{members.id}</button> <br> <br> 
   </div>
   {:else}
   {console.log('No data')}
  {/each}
</div>
<style>
  .links {
    display: flex;
    justify-content: center;

    margin-top: 4rem;

    color: #0df5e3;
    text-decoration: underline;
  }
  input{
    color:#000
  }
</style>
