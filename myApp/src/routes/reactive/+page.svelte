<script lang="ts">
    import Hello from "../../components/Hello/Hello.svelte";

  let content = 'enter color here'
  let name = "> Not clicked"
  let firstName = 'Sumesh'
  let lastName = 'K Sundaran'
  $: fullName = `${firstName} ${lastName}`
  $: {
    console.log(firstName);
    console.log(fullName);
    
    
  }
  function onClick(e:any) {
    name = " > Clicked";
    const ele = e
    // console.log(ele);
  } 

</script>

<svelte:head>
  <title>SvelteKit demo page</title>
</svelte:head>
<!-- <Header title={name}/> -->
<h2 style="color: {content};">This is input text {content}</h2>
<br>
<p>{fullName}</p>
<br>
<button  on:click={onClick}> Button {name}</button>
<input type="text" bind:value={firstName}>
<input type="text" bind:value={lastName}>
<input type="text" bind:value={content}>

<style>
  .links {
    display: flex;
    justify-content: center;

    margin-top: 4rem;

    color: #0df5e3;
    text-decoration: underline;
  }
  input{
    color:#000
  }
</style>
