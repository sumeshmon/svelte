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

