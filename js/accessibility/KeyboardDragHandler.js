// Copyright 2017, University of Colorado Boulder

/**
 * A general type for keyboard dragging.  Updates a position Property with keyboard interaction. Objects can be
 * dragged in two dimensions with the arrow keys and with the WASD keys.
 *
 * JavaScript does not natively handle multiple 'keydown' events at once, so we have a custom implementation that
 * tracks which keys are down and for how long in a step() function. To function, this drag handler requires a view step.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Input = require('SCENERY/input/Input' );
  var Bounds2 = require( 'DOT/Bounds2' );

  /**
   * @constructor
   * @param {Property} positionProperty
   * @param {Object} options
   */
  function KeyboardDragHandler( positionProperty, options ) {

    var self = this;
    options = _.extend( {
      positionDelta: 5, // while direction key is down, 1D delta for the positionProperty
      shiftKeyMultiplier: 2, // if shift key is down, dragging speed will be changed by this multiplier
      dragBounds: Bounds2.EVERYTHING, // position will be limited to these bounds
      onDrag: function() {}, // called every drag where the position changes
      startDrag: function( event ) {}, // called at the very start of the drag
      endDrag: function( event ) {}, // called at the end of the dragging interaction
    }, options );

    // @private - tracks the state of the keyboard, array elements are objects with key-value pairs of keyCode {number},
    // isDown {boolean}, and timeDown {number}. JavaScript doesn't handle multiple key presses, so we track
    // which keys are currently down and update via step()
    this.keyState = [];

    // @private - groups of keys that will change the position property or have other behavior.  Entries of the array will look
    // like { keys: <Array.number>, callback: <Function> }.  Add hotkey groups with this.addHotkeyGroup
    this.hotkeyGroups = [];

    // @private - a key in the hot key group that is currently down.  Object collects { keyCode: <number>, timeDown: <number> }
    // when one of the hotkeys are pressed down, this 
    this.hotKeyDown = {};

    // @private - the change in position (in model coordinates) that will be applied by dragging with the keyboard
    this.positionDelta = options.positionDelta;

    // @private
    this.shiftKeyMultiplier = options.shiftKeyMultiplier;
    this.positionProperty = positionProperty;
    this._dragBounds = options.dragBounds;

    // @private
    this.onDrag = options.onDrag;

    // @private {keys: <Array.number>, callback: <Function>} - when a hotkey group is down, dragging
    // will be disabled until all hotkeys are up again
    this.keyGroupDown = null;

    // @private {boolean} - when a hotkey group is pressed down, dragging will be disabled until
    // all keys are up again in case any of the movemene keys are also used as hotkeys
    this.draggingDisabled = false;

    // @public (read-only) - listener that will be added to the node for dragging behavior, made public on the Object
    // so that a KeyboardDragHandler can be added via myNode.addAccessibleInputListener( myKeyboardDragHandler )
    this.keydown = function( event ) {

      // if the key is already down, don't do anything else (we don't want to create a new keystate object
      // for a key that is already being tracked and down, nor call startDrag every keydown event)
      if ( self.keyInListDown( [ event.keyCode ] ) ) { return; }

      // required to work with Safari and VoiceOver, otherwise arrow keys will move virtual cursor
      if ( Input.isArrowKey( event.keyCode ) ) { event.preventDefault(); }

      // update the key state
      self.keyState.push( {
        keyDown: true,
        keyCode: event.keyCode,
        timeDown: 0 // in ms
      } );

      if ( self.movementKeysDown ) {
        options.startDrag( event );
      }
    };

    // @public (read-only) - listener that will be added to the node for dragging behavior, made public on the Object
    // so that a KeyboardDragHandler can be added via myNode.addAccessibleInputListener( myKeyboardDragHandler )
    this.keyup = function( event ) {
      var moveKeysDown = self.movementKeysDown;

      for ( var i = 0; i < self.keyState.length; i++ ) {
        if ( event.keyCode === self.keyState[ i ].keyCode ) {
          self.keyState.splice( i, 1 );
        }
      }

      // if movement keys are no longer down after keyup, call the optional end drag function
      var moveKeysStillDown = self.movementKeysDown;
      if ( !moveKeysStillDown && moveKeysDown !== moveKeysStillDown ) {
        options.endDrag( event );
      }
    };

    // @public (read-only) - reset when the focus is blurred from the node being dragged.
    this.blur = function(){
      self.reset();
    }
  }

  sceneryPhet.register( 'KeyboardDragHandler', KeyboardDragHandler );

  return inherit( Object, KeyboardDragHandler, {

    /**
     * Step function for the drag handler. JavaScript does not natively handle many keydown events at once,
     * so we need to track the state of the keyboard in an Object and update the position Property in a step
     * function based on the keyboard state object every animation frame.  In order for the drag handler to
     * work, call this function somewhere in ScreenView.step().
     * 
     * @public
     */
    step: function( dt ) {

      // for each key that is still down, increment the tracked time that they have been down
      for ( var i = 0; i < this.keyState.length; i++ ) {
        if ( this.keyState[ i ].keyDown ) {
          this.keyState[ i ].timeDown += dt;
        }
      }

      // check to see if any hotkey combinations are down
      for ( var j = 0; j < this.hotkeyGroups.length; j++ ) {
        var hotkeysDownList = [];
        var keys = this.hotkeyGroups[ j ].keys;

        for ( var k = 0; k < keys.length; k++ ) {
          for ( var l = 0; l < this.keyState.length; l++ ) {
            if ( this.keyState[ l ].keyCode === keys[ k ] ) {
              hotkeysDownList.push( this.keyState[ l ] );
            }
          }
        }

        // the hotkeysDownList array order should match the order of the key group, so now we just need to make
        // sure that the key down times are in the right order
        var keysInOrder = false;
        for ( var m = 0; m < hotkeysDownList.length - 1; m++ ) {
          if ( hotkeysDownList[ m + 1 ] && hotkeysDownList[ m ].timeDown > hotkeysDownList[ m + 1 ].timeDown ) {
            keysInOrder = true;
          }
        }

        // if keys are in order, call the callback associated with the group, and disable dragging until
        // all hotkeys associated with that group are up again
        if ( keysInOrder ) {
          this.keyGroupDown = this.hotkeyGroups[ j ];
          this.hotkeyGroups[ j ].callback();
        }
      }

      // if a key group is down, check to see if any of those keys are still down - if so, we will disable dragging
      // until all of them are up
      if ( this.keyGroupDown ) {
        if ( this.keyInListDown( this.keyGroupDown.keys ) ) {
          this.draggingDisabled = true;
        }
        else {
          this.draggingDisabled = false;

          // keys are no longer down, clear the group
          this.keyGroupDown = null;
        }
      }

      if ( !this.draggingDisabled ) {

        // handle the change in position
        var deltaX = 0;
        var deltaY = 0;
        var positionDelta = this.shiftKeyDown() ? ( this.positionDelta * this.shiftKeyMultiplier ) : this.positionDelta;

        if ( this.leftMovementKeysDown() ) {
          deltaX = -positionDelta;
        }
        if ( this.rightMovementKeysDown() ) {
          deltaX = positionDelta;
        }
        if ( this.upMovementKeysDown() ) {
          deltaY = -positionDelta;
        }
        if ( this.downMovementKeysDown() ) {
          deltaY = positionDelta;
        }

        // determine if the new position is within the constraints of the drag bounds
        var vectorDelta = new Vector2( deltaX, deltaY );
        var newPosition = this.positionProperty.get().plus( vectorDelta );
        newPosition = this._dragBounds.closestPointTo( newPosition );

        // update the position if it is different
        if ( !newPosition.equals( this.positionProperty.get() ) ) {
          this.positionProperty.set( newPosition );

          // on successful drag, call the optional onDrag function
          this.onDrag();
        }
      }
    },

    getKeyInState: function( keyCode ) {
      var keyObject = null;
      for ( var i = 0; i < this.keyState.length; i++ ) {
        if ( this.keyState[ i ].keyCode === keyCode ) {
          keyObject = this.keyState[ i ];
        }
      }
      return keyObject;
    },

    /**
     * Returns true if any of the keys in the list are currently down.
     * 
     * @param  {Array.<number>} keys
     * @return {boolean}
     */
    keyInListDown: function( keys ) {
      var keyIsDown = false;
      for ( var i = 0; i < this.keyState.length; i++ ) {
        if ( this.keyState[ i ].keyDown ) {
          for ( var j = 0; j < keys.length; j++ ) {
            if ( keys[ j ] === this.keyState[ i ].keyCode ) {
              keyIsDown = true;
              break;
            }
          }
        }
        if ( keyIsDown ) {
          // no need to keep looking
          break;
        }
      }

      return keyIsDown;
    },

    /**
     * Returns true if the keystate indicates that a key is down that should move the object to the left.
     * 
     * @private
     * @return {boolean}
     */
    leftMovementKeysDown: function() {
      return this.keyInListDown( [ Input.KEY_A, Input.KEY_LEFT_ARROW ] );
    },

    /**
     * Returns true if the keystate indicates that a key is down that should move the object to the right.
     * 
     * @public
     * @return {boolean}
     */
    rightMovementKeysDown: function() {
      return this.keyInListDown( [ Input.KEY_RIGHT_ARROW, Input.KEY_D ] );
    },

    /**
     * Returns true if the keystate indicatest that a key is down that should move the object up.
     * 
     * @public
     * @return {boolean}
     */
    upMovementKeysDown: function() {
      return this.keyInListDown( [ Input.KEY_UP_ARROW, Input.KEY_W ] );
    },

    /**
     * Returns true if the keystate indicates that a key is down that should move the upject down.
     * 
     * @public
     * @return {boolean}
     */
    downMovementKeysDown: function() {
      return this.keyInListDown( [ Input.KEY_DOWN_ARROW, Input.KEY_S ] );
    },

    /**
     * Returns true if any of the movement keys are down (arrow keys or WASD keys).
     * 
     * @return {boolean}
     */
    getMovementKeysDown: function() {
      return this.rightMovementKeysDown() || this.leftMovementKeysDown() ||
                this.upMovementKeysDown() || this.downMovementKeysDown();
    },
    get movementKeysDown() { return this.getMovementKeysDown(); },

    /**
     * Returns true if the enter key is currently pressed down.
     * 
     * @return {boolean}
     */
    enterKeyDown: function() {
      return this.keyInListDown( [ Input.KEY_ENTER ] );
    },

    /**
     * Returns true if the keystate indicates that the shift key is currently down.
     * 
     * @return {boolean}
     */
    shiftKeyDown: function() {
      return this.keyInListDown( [ Input.KEY_SHIFT ] );
    },

    /**
     * Sets the bounds for dragging with the keyboard.
     *
     * @public
     * @param {Bounds2} dragBounds
     */
    setDragBounds: function( dragBounds ) {
      this._dragBounds = dragBounds.copy();
      this.positionProperty.set( this._dragBounds.closestPointTo( this.positionProperty.get() ) );
    },
    set dragBounds( dragBounds ) { this.setDragBounds( dragBounds ); },

    /**
     * Get the Bounds2 Object wich constrains the possible Vector2 values of the position Property.
     * 
     * @public
     * @return {Bounds2}
     */
    getDragBounds: function() {
      return this._dragBounds;
    },
    get dragBounds() { return this.getDragBounds(); },

    /**
     * Add a set of hotkeys that behave such that the desired callback will be called when 
     * all keys listed in the array are pressed down in order.
     * 
     * @param {Object} hotKeyGroup - { keys: [].<number>, callback: function }
     */
    addHotkeyGroup: function( hotkeyGroup ) {
      this.hotkeyGroups.push( hotkeyGroup );
    },

    /**
     * Add mutliple sets of hotkey groups that behave such hat the desired callback will be called
     * when all keys listed in the array are pressed down in order.  Behaves much like addHotkeyGroup,
     * but allows you to add multiple groups at one time.
     * 
     * @param {[].<string>} hotKeyGroups
     */
    addHotkeyGroups: function( hotKeyGroups ) {
      for ( var i = 0; i < hotKeyGroups.length; i++ ) {
        this.addHotkeyGroup( hotKeyGroups[ i ] );
      }
    },

    /**
     * Reset the keystate Object tracking which keys are currently pressed down.
     * 
     * @public
     */
    reset: function() {
      this.keyState = [];
    }
  }, {

    /**
     * Returns true if the keycode corresponds to a key that should move the object to the left.
     * 
     * @private
     * @return {boolean}
     */
    isLeftMovementKey: function( keyCode ) {
      return keyCode === Input.KEY_A || keyCode === Input.KEY_LEFT_ARROW;
    },

    /**
     * Returns true if the keycode corresponds to a key that should move the object to the right.
     * 
     * @public
     * @return {boolean}
     */
    isRightMovementKey: function( keyCode ) {
      return keyCode === Input.KEY_D || keyCode === Input.KEY_RIGHT_ARROW;
    },

    /**
     * Returns true if the keycode corresponse to a key that should move the object up.
     * 
     * @public
     * @return {boolean}
     */
    isUpMovementKey: function( keyCode ) {
      return keyCode === Input.KEY_W || keyCode === Input.KEY_UP_ARROW;
    },

    /**
     * Returns true if the keycode corresponds to a key that should move the upject down.
     * 
     * @public
     * @return {boolean}
     */
    isDownMovementKey: function( keyCode ) {
      return keyCode === Input.KEY_S || keyCode === Input.KEY_DOWN_ARROW;
    },
  } );
} );
