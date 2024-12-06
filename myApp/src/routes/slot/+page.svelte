<script>
    import Modal from "../../components/Modal.svelte";
    let showModal = false
    let openModal = () => {
        showModal = !showModal
    }
    let toggleModal = () => {
        showModal = !showModal
    }
    let hideModal = () => {
        showModal = !showModal
    }
 
</script>
<Modal {showModal} on:click={hideModal}>
    <div slot="title">I am from named title</div>
    <h4>I am from slot </h4>
    <!-- <div slot="test">I am from named title</div> -->
    
</Modal>
<button on:click={openModal}>Show modal</button>

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