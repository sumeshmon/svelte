<script lang="ts">
    import { PUBLIC_PAGE_LIMIT } from '$env/static/public';

    export let currentPage = 1; // Update this to simulate page change.
    export let itemsPerPage = PUBLIC_PAGE_LIMIT;
    export let totalItems = 0;

    let totalPages = 1;
    $: totalPages = Math.ceil(totalItems / parseInt(itemsPerPage));

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    const setCurrentPage = (page: number) => {
        if (page !== currentPage) {
            dispatch('change', { page });
            currentPage = page;
        }
    };
</script>

<nav class="pagination">
    {#if currentPage > 1}
        <li class="pagination__item">
            <a
                class="pagination__link"
                href={null}
                on:click|preventDefault={() => setCurrentPage(1)}>first</a
            >
        </li>
        <li class="pagination__item">
            <a
                class="pagination__link"
                href={null}
                on:click|preventDefault={() => setCurrentPage(currentPage - 1)}>previous</a
            >
        </li>
    {/if}
    {#each [3, 2, 1] as i}
        {#if currentPage - i > 0}
            <li class="pagination__item">
                <a
                    class="pagination__link"
                    href={null}
                    on:click|preventDefault={() => setCurrentPage(currentPage - i)}
                    >{currentPage - i}</a
                >
            </li>
        {/if}
    {/each}
    <li class="pagination__item active">
        <a href={null} class="pagination__link">{currentPage}</a>
    </li>
    {#each Array(3) as _, i}
        {#if currentPage + (i + 1) <= totalPages}
            <li class="pagination__item">
                <a
                    class="pagination__link"
                    href={null}
                    on:click|preventDefault={() => setCurrentPage(currentPage + (i + 1))}
                    >{currentPage + (i + 1)}</a
                >
            </li>
        {/if}
    {/each}
    {#if currentPage < totalPages}
        <li class="pagination__item">
            <a
                class="pagination__link"
                href={null}
                on:click|preventDefault={() => setCurrentPage(currentPage + 1)}>next</a
            >
        </li>
        <li class="pagination__item">
            <a
                class="pagination__link"
                href={null}
                on:click|preventDefault={() => setCurrentPage(totalPages)}>last</a
            >
        </li>
    {/if}
</nav>
