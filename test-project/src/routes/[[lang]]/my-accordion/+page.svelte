<script>
    import { onMount, onDestroy } from 'svelte';
   
    onMount(() => {
        const accordionItems = document.querySelectorAll('.accordion > .accordion-item');

        accordionItems.forEach((item) => {
            const accordionHeader = item.querySelector('.accordion-header');
            const accordionContent = item.querySelector('.accordion-content') ;

            accordionHeader?.addEventListener('click', (e) => {
                e.preventDefault();

                // Toggle the current item's active class and content display
                const isActive = item.classList.toggle('active');
                if (accordionContent) {
                    accordionContent.style.display = isActive ? 'block' : 'none';
                }

                accordionItems.forEach((otherItem) => {
                    if (item !== otherItem) {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.accordion-content');
                        if (otherContent) {
                            otherContent.style.display = 'none';
                        }
                    }
                });
        });
});

    })
</script> 
<div class="container">
    <div class="row">
        <div class="col-sm-12">
            <div class="accordion">
                <div class="accordion-item">
                  <div class="accordion-header">Section 1</div>
                  <div class="accordion-content">Content for section 1</div>
                </div>
                <div class="accordion-item">
                  <div class="accordion-header">Section 2</div>
                  <div class="accordion-content">Content for section 2</div>
                </div>
                <div class="accordion-item">
                  <div class="accordion-header">Section 3</div>
                  <div class="accordion-content">Content for section 3</div>
                </div>
              </div>
        </div>
    </div>
</div>
<style>
    .accordion-header{
        cursor: pointer;
        padding:  5px 10px;
    }
    .accordion-content{
        display: none;
        padding:  5px 10px;
    }
</style>