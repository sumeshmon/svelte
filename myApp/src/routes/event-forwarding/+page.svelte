<script>
    import Modal from "../../components/Modal.svelte";


    let showModal = false
    let testToggle = false

    let testTogglefn =  () => {
        testToggle = !testToggle
        console.log(testToggle);
        
    }
    
    let toggleModal = () => {
        showModal = !showModal
    }
    let openModal = () => {
        showModal = !showModal
    }
</script>
{#if showModal}
    <div class="backdrop" on:click|self={toggleModal}>
        <div class="modal">
            <p>I am from default</p>
            
        </div>
        
    </div>
    {:else}
    <p>I am else</p>
{/if}
<button on:click={openModal}>Show modal</button>
<Modal
/>

<style>
    .backdrop{
        background-color: rgba(0, 0, 0, 0.8);
        width: 100%;
        height: 100%;
        position: fixed;

    }
    .modal{        
        margin: 10% auto;
        max-width: 400px;
        padding: 10px;
        background-color: white;
    }
    button{
        margin-top: 20px;
        padding: 10px;
        background-color: #000;
        color: #fff;
    }
</style>
