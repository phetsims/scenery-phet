// Copyright 2002-2013, University of Colorado Boulder

/**
 * Reset All button.  This version is drawn in code using shapes, gradients,
 * and such, and does not use any image files.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Includes
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // Constants
  var CORNER_ROUNDING_PROPORTION = 0.2; // Arrived at through rigorous optical scrutiny (basically a guess).

  /**
   * @param {function} callback
   * @param {Node} label - Node to put on surface of button, could be icon or text
   * @param {Object} options
   * @constructor
   */
  function PushButton( callback, content, options ) {

    options = _.extend( {
      // Default values.
      cursor: 'pointer',
      length: 32, // Fairly arbitrary
      touchAreaLengthProportion: 1.3,
      baseColor: new Color( 179, 218, 255 ),
      disabledBaseColor: new Color( 220, 220, 220 ),
      stroke: 'black',
      lineWidth: 1,
      listener: callback
    }, options );

    var thisButton = this;
    Node.call( thisButton );

    thisButton._state = 'up';
    thisButton._enabled = new Property( options.enabled );
    thisButton._listeners = [];
    if ( options.listener ) { thisButton._listeners.push( options.listener ); }
    thisButton.baseColor = options.baseColor;
    thisButton.disabledBaseColor = options.disabledBaseColor;

    // Convenience vars
    var length = options.length;
    var cornerRounding = options.length * CORNER_ROUNDING_PROPORTION;

    // Gradient fills used for various button states
    thisButton.upFill = new LinearGradient( 0, 0, 0, options.length )
      .addColorStop( 0, thisButton.baseColor.colorUtilsBrighter( 0.5 ) )
      .addColorStop( 0.2, thisButton.baseColor )
      .addColorStop( 0.9, thisButton.baseColor )
      .addColorStop( 1, thisButton.baseColor.colorUtilsDarker( 0.5 ) );

    thisButton.overFill = new LinearGradient( 0, 0, 0, options.length )
      .addColorStop( 0, thisButton.baseColor.colorUtilsBrighter( 0.7 ) )
      .addColorStop( 0.2, thisButton.baseColor.colorUtilsBrighter( 0.2 ) )
      .addColorStop( 0.9, thisButton.baseColor.colorUtilsBrighter( 0.2 ) )
      .addColorStop( 1, thisButton.baseColor.colorUtilsDarker( 0.5 ) );

    thisButton.downFill = new LinearGradient( 0, 0, 0, options.length )
      .addColorStop( 0, thisButton.baseColor.colorUtilsDarker( 0.2 ) )
      .addColorStop( 0.8, thisButton.baseColor.colorUtilsDarker( 0.2 ) )
      .addColorStop( 1, thisButton.baseColor );

    thisButton.background = new Rectangle( 0, 0, length, length, cornerRounding, cornerRounding,
      {
        fill: options.baseColor,
        stroke: options.stroke,
        lineWidth: options.lineWidth
      } );
    this.addChild( thisButton.background );

    // Hook up the button listener to modify the appearance as the state
    // changes and to hook up the callback function.
    thisButton.addInputListener( new ButtonListener( {

      up: function() {
        thisButton._state = 'up';
        thisButton._update();
      },

      over: function() {
        thisButton._state = 'over';
        thisButton._update();
      },

      down: function() {
        thisButton._state = 'down';
        thisButton._update();
      },

      out: function() {
        thisButton._state = 'up'; //NOTE: 'out' state looks the same as 'up'
        thisButton._update();
      },

      fire: function() {
        if ( thisButton._enabled.get() ) {
          thisButton._fire();
        }
      }
    } ) );

    // Add an explicit mouse area so that the child nodes can all be non-pickable.
    this.mouseArea = Shape.rectangle( 0, 0, options.length, options.length );

    // Expand the touch area so that the button works better on touch devices.
    var touchAreaLength = options.length * options.touchAreaLengthProportion;
    this.touchArea = Shape.rectangle( length - ( touchAreaLength / 2 ), length - ( touchAreaLength / 2 ), touchAreaLength, touchAreaLength );

    // accessibility
    thisButton.addPeer( '<input type="button" aria-label="' + _.escape( options.label ) + '">',
      { click: thisButton._fire.bind( thisButton ) }
    );

    thisButton._enabled.link( function( enabled ) {
      thisButton.cursor = enabled ? options.cursor : 'default';
      thisButton._update();
    } );

    // Mutate with the options after the layout is complete so that you can
    // use width-dependent fields like centerX, etc.
    thisButton.mutate( options );
  }

  return inherit( Node, PushButton, {

    // Adds a listener. If already a listener, this is a no-op.
    addListener: function( listener ) {
      if ( this._listeners.indexOf( listener ) === -1 ) {
        this._listeners.push( listener );
      }
    },

    // Remove a listener. If not a listener, this is a no-op.
    removeListener: function( listener ) {
      var i = this._listeners.indexOf( listener );
      if ( i !== -1 ) {
        this._listeners.splice( i, 1 );
      }
    },

    _fire: function() {
      var copy = this._listeners.slice( 0 );
      copy.forEach( function( listener ) {
        listener();
      } );
    },

    _update: function() {
      // use visible instead of add/removeChild to prevent flickering
      var enabled = this._enabled.get();
      if ( enabled ) {
        this.background.fill = this.disabledBaseColor;
      }
      else {
        switch( this._state ) {

          case 'up':
            this.background.fill = this.upFill;
            break;

          case 'down':
            this.background.fill = this.downFill;
            break;

          case 'over':
            this.background.fill = this.overFill;
            break;
        }
      }
    },

    set enabled( value ) {
      assert && assert( typeof value === 'boolean', 'PushButton.enabled must be a boolean value' ); // Scenery complains about visible otherwise
      this._enabled.set( value );
    },

    get enabled() { return this._enabled.get(); }
  } );
} );