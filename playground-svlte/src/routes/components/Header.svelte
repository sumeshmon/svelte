<header>
  {#each [0,1,2,0] as d}
    <img
      alt="svelte logo"
      src="https://thepracticaldev.s3.amazonaws.com/i/ji7zisis4c0f4ce2cer1.png"
    />
    <span>🥳</span>
    
  {/each}
</header>

<style>
  img {
    height: 100%;
  }
  header {
    position: absolute;
    top: 0;
    height: 100px;
    width: 100%;
    color: gray;
    font-size: 5em;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
  }
</style>
