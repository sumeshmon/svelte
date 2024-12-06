<script lang="ts">
    let name: string | undefined;
    let sumesh = false
    let sali = false

    let family :string[] = []
    let cars : string [] = []

    let handleValues = () => {
        console.log(name,family,sumesh, cars);
        
    }
</script>

{#if name}
    <h2>{name} </h2>
{/if}
<div>
    {sumesh} {sali}
</div>
<form action="" class="form" on:submit={handleValues}>
    <input type="text" placeholder="{name}" bind:value={name}>
    <br><br>

    <label for="Family">
        <input type="checkbox" name="" bind:checked={sumesh}> Sumesh
    </label>
    <br>
    <label for="Family">
        <input type="checkbox" name="" bind:checked={sali}> Sali
    </label> 
    <!-- If if use like above many variables need to declare -->
     <br><br>
<hr>

{#if family}
    <div>{family}</div>  
{/if}
<br>
    <label for="family">
        <input type="checkbox" value="sumesh" bind:group={family}>
    </label> Sumesh <br>
    <label for="family">
        <input type="checkbox" value="sali" bind:group={family}>
    </label> Sali<br>
    <label for="family">
        <input type="checkbox" value="theertha" bind:group={family}>
    </label> Theertha
    <label for="family"> <br>
        <input type="checkbox" value="tejas" bind:group={family}>
    </label> Tejas
<br><br>
    <select name="cars" id="" bind:value={cars}>
        <option value="bmw">BMW</option>
        <option value="audi">Audi</option>
        <option value="maruthi">Maruthi</option>
        <option value="honda">Honda</option>
        
        
        
    </select>
    <button>Add value</button>
</form>
<style>
    form{
        margin: 20px;
    }
    button{
        background-color: #222;
        padding: 10px 20px;
        color: #fff;
    }
</style>