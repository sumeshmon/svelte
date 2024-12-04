<script lang="ts">
    let cars = [
        {
            name:'Maruthi', model:'Alto', year: '2015',
        },
        {
            name:'Honda', model:'Brio', year: '2012',
        },
        {
            name:'Hyundai', model:'creta', year: '2020',
        },
        
    ];
    const removeOldCar = (year:string,e:Event) => {
        cars = cars.filter( (ele) => ele.year != year)
        console.log(e);
    } 
    let conditional = true
</script>

{#each cars as cars}
    <div class="name" class:conditional={conditional}>{cars.name} {cars.model} {cars.year}</div>  
    <br>  
    <button on:click={ (e) => removeOldCar(cars.year,e)}>Remove</button> 
    <br>  <br>   
    <hr>
    {:else}
    <p>No record found !</p>
{/each}
<style>
    button{
        background-color: red;
        color: white;
        padding: 10px;
    }
</style>