<script lang="ts">
    import { onMount } from 'svelte';
    import { t } from '$lib/translations';
    import { PUBLIC_PAGE_LIMIT, PUBLIC_PAGINATION_LINK_LIMIT } from '$env/static/public';
    import { PaginatorType } from '$utils/constants';
    /**
     * Define the type of paginatorType: "pagination", "loadMore"
     */
    export let paginatorType: string | boolean = 'pagination';

    /**
     * Number of visible pages in the pagination
     * recommended to use an odd number as value for numberOfPaginationLinks
     */
    export let numberOfPaginationLinks: string = PUBLIC_PAGINATION_LINK_LIMIT;
    export let currentPage: number = 1;
    export let totalItems: number = 1;
    export let itemsPerPage: string = PUBLIC_PAGE_LIMIT;

    let totalPages: number;

    onMount(() => {
        const parentSection = document.querySelector('.wrapper');
        if (parentSection) {
            if (paginatorType === PaginatorType.LoadMore) {
                parentSection.classList.add('load-more-pagination');
            } else {
                parentSection.classList.remove('load-more-pagination');
            }
        }
    });

    // Function to get the range of pages to display
    const getnumberOfPaginationLinks = (
        currentPage: number,
        totalPages: number,
        numberOfPaginationLinks: number
    ) => {
        const halfVisible = Math.floor(numberOfPaginationLinks / 2);
        let startPage: number, endPage: number;

        // Calculate the start and end pages
        if (currentPage <= halfVisible) {
            // Start near the beginning
            startPage = 1;
            endPage = Math.min(numberOfPaginationLinks, totalPages);
        } else if (currentPage + halfVisible >= totalPages) {
            // Start near the end
            startPage = Math.max(1, totalPages - numberOfPaginationLinks + 1);
            endPage = totalPages;
        } else {
            // Center the current page in the visible range
            startPage = currentPage - halfVisible;
            endPage = currentPage + halfVisible;
        }
        // Return the array of visible pages
        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };
    // Get the total page count
    $: totalPages = Math.ceil(totalItems / parseInt(itemsPerPage));
    // Get the array of visible pages based on the current page
    $: visiblePages = getnumberOfPaginationLinks(
        currentPage,
        totalPages,
        Number(numberOfPaginationLinks)
    );
</script>

{#if totalPages > 1}
    {#if paginatorType == PaginatorType.LoadMore}
        <div class="pagination">
            {#if currentPage < totalPages && totalItems !== 0}
                <button class="pagination__link" on:click={() => currentPage++}>
                    {$t('common.paginationLoadMore')}
                </button>
            {/if}
        </div>
    {/if}
    {#if paginatorType == PaginatorType.Pagination}
        <div class="pagination">
            <!-- First page button -->
            <span class="pagination__item" class:disabled={currentPage <= 1}>
                <button class="pagination__link" on:click={() => (currentPage = 1)}>
                    {$t('common.paginationFirst')}
                </button>
            </span>

            <!-- Previous page button -->
            <span class="pagination__item" class:disabled={currentPage <= 1}>
                <button
                    class="pagination__link"
                    on:click={() => (currentPage = Math.max(1, currentPage - 1))}
                >
                    {$t('common.paginationPrevious')}
                </button>
            </span>

            <!-- Pagination for visible pages -->
            {#each visiblePages as page}
                <span class="pagination__item" class:active={currentPage === page}>
                    <button class="pagination__link" on:click={() => (currentPage = page)}>
                        {page}
                    </button>
                </span>
            {/each}

            <!-- Next page button -->
            <span class="pagination__item" class:disabled={currentPage >= totalPages}>
                <button
                    class="pagination__link"
                    on:click={() => (currentPage = Math.min(totalPages, currentPage + 1))}
                >
                    {$t('common.paginationNext')}
                </button>
            </span>

            <!-- Last page button -->
            <span class="pagination__item" class:disabled={currentPage >= totalPages}>
                <button class="pagination__link" on:click={() => (currentPage = totalPages)}>
                    {$t('common.paginationLast')}
                </button>
            </span>
        </div>
    {/if}
{/if}
