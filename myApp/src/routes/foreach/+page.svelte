<script lang="ts">
  let family = [
    {
      name: 'Sumesh', age : 44, position: 'Elder Person'
    },
    {
      name: 'Sali', age : 37, position: 'House Wife'
    },
    {
      name: 'Theertha', age : 14, position: 'Daughter'
    },
    {
      name: 'Tejas', age : 11, position: 'Son'
    }
  ]
</script>

<svelte:head>
  <title>SvelteKit demo page</title>
</svelte:head>
<div>
  {#each family as family (family.age)}
    <h3>{family.name}, Age is {family.age} and the person is {family.position}</h3> <br>

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
