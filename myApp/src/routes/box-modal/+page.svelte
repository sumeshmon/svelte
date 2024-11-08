<script lang="ts">
  import Modal from "../../components/Modal.svelte";
  let isLoggedIn = false;
  let showModal = false

  const show = () => {
    isLoggedIn = !isLoggedIn
    showModal = true
  }
</script>

<svelte:head>
  <title>SvelteKit demo page</title>
</svelte:head>
<!-- <button on:click={show}>Show Modal</button> -->
<Modal 
  message='I am from parent page'
/>

<style>
  body{
    background-color: white;
  }
  button{
    position: relative;
    display: inline-block;
    padding: 10px;
    margin: 0 auto;
    width: 200px;
    background-color: #222;
    color: #fff;
  }
</style>
