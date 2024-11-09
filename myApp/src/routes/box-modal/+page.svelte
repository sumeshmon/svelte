<script lang="ts">
  import AddPersonForm from "../../components/AddPersonForm.svelte";
  import Modal from "../../components/Modal.svelte";
  let showModal = false

  const toggleModel = () => {
        showModal = !showModal
    }
</script>

<svelte:head>
  <title>SvelteKit demo page</title>
</svelte:head>
<!-- <button on:click={show}>Show Modal</button> -->
<button on:click={toggleModel}>Show modal</button>
<Modal {showModal} on:click={toggleModel}>
  <AddPersonForm/>
  <div slot="title">
    <h4>Title from slot name</h4>
  </div>
</Modal>

<style>
  button{
        padding: 20px;
        color: #fff;
        position: relative;
        z-index: 10;
        background-color: red;
  }
  body{
    background-color: white;
  }
  
</style>
