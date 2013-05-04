# pointer-js

Normalize touch + mouse events via jQuery + Modernizr.

### Basic use:

```js
$elem.on(pointer.down, handler);
$elem.on(pointer.up, handler);
```

### Dragging:

Drag support is basic at this point, and must be done like so:

```js
// enable drag listener
$elem.on(pointer.down, function () {
  $elem.on(pointer.drag, dragHandler);
});

// disable drag listener
$elem.on(pointer.up, function () {
  $elem.off(pointer.drag, dragHandler);
});
```
  
### Prevent defaults and bubbling:

```js
$elem.on(pointer.down, { preventDefault: true }, handler);
$elem.on(pointer.down, { stopBubble: true }, handler);
$elem.on(pointer.down, { stopImmediate: true }, handler);
```

### CSS style helpers:

Apply ".down" CSS class based on down/up events:

```js
pointer.style($elem);
```

### TODO

 * Document handler data argument `{ x, y }`
 * Consider `dragStart`, `dragEnd` events to simplify `drag` setup.

## MIT License 

This code may be freely distributed under the [MIT license](http://danro.mit-license.org/).
