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
</script>

{#each cars as cars}
    <div class="name">{cars.name} {cars.model} {cars.year}</div>  
    <br>  
    <button on:click={ (e) => removeOldCar(cars.year,e)}>Remove</button> 
    <br>  <br>   
    <hr>
{/each}
<style>
    button{
        background-color: red;
        color: white;
        padding: 10px;
    }
</style>