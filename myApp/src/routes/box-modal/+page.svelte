<script lang="ts">
  import AddPersonForm from "../../components/AddPersonForm.svelte";
  import Modal from "../../components/Modal.svelte";
  let showModal = false
  let myFamily = [
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
  const toggleModel = () => {
        showModal = !showModal
    }
    const removeSumesh = (id:number) => {
      myFamily = myFamily.filter( (member) => member.id  != id)
      
    }
    const addPerson = (e:any) => {
      let fullFamily = e.detail
      myFamily = [fullFamily,...myFamily]
      showModal = false
    }
</script>

<svelte:head>
  <title>SvelteKit demo page</title>
</svelte:head>
<!-- <button on:click={show}>Show Modal</button> -->
<button on:click={toggleModel}>Show modal</button>
<Modal {showModal} on:click={toggleModel}>
  <AddPersonForm 
    on:addPerson = {addPerson}
  />
  <div slot="title">
    <h4>Title from slot name</h4>
  </div>
</Modal>
{#each myFamily as member (member.id)}
   <!-- {console.log(member.id)} -->
   <div class="family">
      <h2>{member.name} is {member.position}</h2> 
      <p>Age is {member.age}</p> <br>
      <button on:click={ () => removeSumesh(member.id) }>Remove {member.name}</button>
   </div>
   
{/each}
<style>
  button{
        padding: 6px 20px;
        color: #fff;
        position: relative;
        z-index: 1;
        background-color: #4c2aaa;
  }
  body{
    background-color: white;
  }
  .family{
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid green;
  }
  h2{
    color: orangered;
    font-size: 2rem;
    font-weight: bold;
    padding-bottom: 10px;
  }
  
</style>
