<script>
    import { onMount, onDestroy } from 'svelte';
   
    onMount(() => {
       const accordionItem = document.querySelectorAll('.accordion > .accordion-item')

       accordionItem.forEach( (accordionTitle) => {
        const accordionContent = accordionTitle.querySelector('.accordion-content')
        
        accordionTitle.addEventListener('click', (e)=>{
            e.preventDefault();                       
            
            const isTitleActive = accordionTitle.classList.toggle('active')

            if (accordionContent instanceof HTMLElement){
                accordionContent.style.display = isTitleActive ? 'block' : 'none'
            }

            accordionItem.forEach( (otheraccordionTitle)=>{
                if (accordionTitle != otheraccordionTitle){
                    otheraccordionTitle.classList.remove('active')
                    const otherAccordionContent = otheraccordionTitle.querySelector('.accordion-content')
                    if( otherAccordionContent instanceof HTMLElement){
                        otherAccordionContent.style.display = 'none'
                    }
                }
            })

        })
        
       })
       

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