<script>
    export let message = 'Default value'
    export let isLoggedIn = false
    export let afterLoggin = true
    let showModal = false
    const showModalFn = () => {
        isLoggedIn = !isLoggedIn
    }
    
</script>


{#if isLoggedIn}
    <dialog class="modal" class:if-logged-in={afterLoggin} open={showModal}>
        <div class="modal-inner">
            <h2>{message}</h2>
        </div>
        
    </dialog>
    
{/if}
<button on:click={showModalFn}>Show modal</button>

<style>
    button{
        padding: 20px;
        color: #fff;
        position: relative;
        z-index: 10;
        background-color: red;
    }
    .modal{
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        color: #222;
        margin: auto;
        width: 100%;
        height: 100%;
        display: flex;
    }
    .if-logged-in{
        background-color: cadetblue;
    }
    .modal-inner{
        background-color: #fff;
        padding: 30px;
        max-width: 600px;
        color: #222;
        margin: auto;
        vertical-align: top;
        & h2{
            color: #222;
        }
    }
</style>