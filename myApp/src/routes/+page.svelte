<script lang="ts">
    import Header from "../components/Header.svelte";
    import Hello from "../components/Hello/Hello.svelte";
  let content = 'white'
  let name = "Not clicked";

  function onClick(e:any) {
    name = "Clicked";
    // e.stopPropogation
    const ele = e
    console.log(ele);
  }
  const inputPlay = (e) => {
    content = e.target.value
  }
</script>

<svelte:head>
  <title>SvelteKit demo page</title>
</svelte:head>
<!-- <Header title={name}/> -->
<!-- <Hello {name} on:click={onClick} /> -->
<h2 style="color: {content};">This is input text {content}</h2>
<button  on:click={onClick}> Click Me</button>
<!-- <input type="text"  on:input={inputPlay}> -->
 <input type="text" bind:value={content}>


<style>
  .links {
    display: flex;
    justify-content: center;

    margin-top: 4rem;

    color: #0df5e3;
    text-decoration: underline;
  }
</style>
