/*!
  * pointer.js v0.3.0-amd
  * jQuery events to normalize touch + mouse.
  * https://github.com/danro/pointer-js
  * MIT License
  */
define(function (require) {
  
  // dependencies
  var $ = require('jquery')
    , Modernizr = window.Modernizr
    
    // private vars
    , $doc = $(document)
    , store = 'pointerEvents'
    , downTarget
    , Handler
  ;
  
  // public module
  var pointer = {
    // events
    down: 'pointerDown',
    up: 'pointerUp',
    drag: 'pointerDrag',
    
    // utils
    style: style
  };
  
  // --------------------------------------------------
  // Touch events
  
  if (Modernizr.touch) {
    // remove browser default touch delay
    $doc.on('touchstart', function () {});
    
    specialEvent(pointer.down, 'touchstart', 'down');
    specialEvent(pointer.up, 'touchend touchcancel', 'up');
    specialEvent(pointer.drag, 'touchmove', 'drag');
    
    Handler = TouchHandler;
  }
  // --------------------------------------------------
  // Mouse events
  
  else {
    // keep track of mouse state at a document level
    $doc.on('mousedown', function (evt) { downTarget = evt.target; });
    $doc.on('mouseup', function (evt) { downTarget = null; });
    
    specialEvent(pointer.down, 'mousedown', 'down');
    specialEvent(pointer.up, 'mouseup', 'up', $doc);
    specialEvent(pointer.drag, 'mousemove', 'drag', $doc);
    
    Handler = MouseHandler;
  }
  
  // --------------------------------------------------
  // Event setup + handler class
  
  function specialEvent(name, events, method, $proxy) {
    
    $.event.special[name] = {
      setup: function (config) {
        if (!config) config = {};
        var data = $.data(this, store) || $.data(this, store, state());
        data.handler = (new Handler)[method];
        config = {
          name: name,
          state: data,
          element: this,
          stopBubble: config.stopBubble,
          stopImmediate: config.stopImmediate,
          preventDefault: config.preventDefault
        };
        ($proxy || $(this)).on(events, config, data.handler);
      },
      teardown: function () {
        var data = $.data(this, store);
        ($proxy || $(this)).off(events, data.handler);
        $.removeData(this, store);
      }
    };
  }
  
  // Create handler methods on each instance. This is necessary
  // because some mouse events attach to the document, and
  // unbinding a shared handler function would be bad.
  
  function TouchHandler() {
    
    this.down = function (evt) {
      evt.data.state.x = evt.originalEvent.touches[0].clientX;
      evt.data.state.y = evt.originalEvent.touches[0].clientY;
      trigger(evt);
    };
    
    this.up = function (evt) {
      evt.data.state.over = evt.target === evt.data.element;
      evt.data.state.x = evt.originalEvent.changedTouches[0].clientX;
      evt.data.state.y = evt.originalEvent.changedTouches[0].clientY;
      trigger(evt);
    };
    
    this.drag = function (evt) {
      evt.data.state.x = evt.originalEvent.touches[0].clientX;
      evt.data.state.y = evt.originalEvent.touches[0].clientY;
      trigger(evt);
    };
  }
  
  function MouseHandler() {
    
    this.down = function (evt) {
      evt.data.state.x = evt.clientX;
      evt.data.state.y = evt.clientY;
      trigger(evt);
    };
    
    this.up = function (evt) {
      evt.data.state.over = evt.target === evt.data.element;
      evt.data.state.x = evt.clientX;
      evt.data.state.y = evt.clientY;
      trigger(evt);
    };
    
    this.drag = function (evt) {
      evt.data.state.x = evt.clientX;
      evt.data.state.y = evt.clientY;
      trigger(evt);
    };
  }
  
  function trigger(evt) {
    $(evt.data.element).triggerHandler(evt.data.name,
      [evt.data.state, evt.originalEvent]);
    evt.data.preventDefault && evt.preventDefault();
    evt.data.stopBubble && evt.stopPropagation();
    evt.data.stopImmediate && evt.stopImmediatePropagation();
  }
  
  // --------------------------------------------------
  // Utils
  
  function state() {
    return { down: false, x: 0, y: 0 };
  }
  
  function style($elem) {
    $elem
      .off(pointer.down, addDown)
      .off(pointer.up, removeDown)
      .on(pointer.down, addDown)
      .on(pointer.up, removeDown)
    ;
  }
  
  function addDown() {
    $(this).addClass('down');
  }
  
  function removeDown() {
    $(this).removeClass('down');
  }
  
  return pointer;
});
