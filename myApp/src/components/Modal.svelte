<script>
    // export let message = 'Default value'
    export let afterLoggin = true
    export let showModal = false
    
    
</script>


{#if showModal}
    <dialog class="modal" class:if-logged-in={afterLoggin} on:click|self>
        <div class="modal-inner">
            <!-- <h2>{message}</h2> -->
            <slot />
            <slot name="title"></slot>
        </div>
    </dialog>
    
{/if}


<style>
    
    .modal{
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        color: #222;
        margin: auto;
        width: 100%;
        height: 100%;
        display: flex;
        top:0;
        z-index: 10;
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