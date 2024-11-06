<script>
    export let message = 'I am from Modal'
    export let isLoggedIn = true
    let modal = true
</script>


{#if isLoggedIn}
    <div class="modal" class:conditional-class={modal}>
        <div class="modal-inner">
            <h2>{message}</h2>
        </div>
    </div>
{/if}

<style>
    .modal{
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        margin:  0 auto;
        width: 500px;
        color: #222;
    }
    .modal-inner{
        background-color: #fff;
        padding: 10px;
    }
</style>