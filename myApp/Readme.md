## event
https://dev.to/tanhauhau/7-event-modifiers-in-svelte-you-must-know-27oc

## event while looping
If we use on:click{action}, this will execute while looping. To avoid this this method need to loop in another function.
Ex: on:click={ (e) => action(object,e)}

## conditional css
class:conditional={class}. If the conditional is true then only the class will display.

## event forwarding
in the component can pass enpty on:click - and in the page which the components  is inserted. Ex: on:click{props}

## event modifiers
self - only fire the event if the clicked element is target
once - Sometimes you want the event listener to be called only once. You want to remove the event listener as soon as it's being called.

## slots
`<slot /> `- From child we can add contnets. If we use `<slot name="title"></slot>` then the child should be `<div slot="title">content</div>`. The important things is the slot order will be followed by order which is from parent. 

## truthy
to check if name is truthy. <br>
`{#if name}
    <h2>{name}</h2>
{/if}`

## forms
in JS if the input value is number it will convert in to string, while in svelte it will remain number.<br>
Example: <br>
`<input type="text" placeholder="Name" bind:value={name}>`  <br>
`<form on:submit|preventDefault={formSubmit}>`
<br><br>
<h5>Checkbox</h5>
 The checkbox "checked "value is default false. bind:checked={varibale_name} and assign like let varibale_name = false. After the checkbox is checked the value will be true. Using this we need to create many variables and the respond will be boolean.  
 <br><br>
 To avoid this we can use <b>grouping</b>. This help to get all the values in an Array.
 <br>
`<input type="checkbox" value="sumesh" bind:group={family}`  <br>
`<input type="checkbox" value="Sali" bind:group={family}`

Then we can use let family:string[] = []
<br>
<h5>Select box</h3>
For select box use <strong>bind:value={var name}</strong>, the options use different values.
<br>