// Copyright 2002-2014, University of Colorado Boulder

/**
 * Eye dropper, with a button for dispensing whatever is in the dropper.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var RoundMomentaryButton = require( 'SUN/buttons/RoundMomentaryButton' );
  var Shape = require( 'KITE/Shape' );

  // images
  var foregroundImage = require( 'image!SCENERY_PHET/eye_dropper_foreground.png' );
  var backgroundImage = require( 'image!SCENERY_PHET/eye_dropper_background.png' );

  // constants
  var DEBUG_ORIGIN = false; // if true, put a red dot at the dropper's origin (bottom center)

  // constants specific to the image files
  var TIP_WIDTH = 15;
  var TIP_HEIGHT = 4;
  var GLASS_WIDTH = 46;
  var GLASS_MAX_Y = -18; // relative to bottom center
  var GLASS_MIN_Y = -124; // relative to bottom center
  var BUTTON_CENTER_Y_OFFSET = 32; // y-offset of button's center in dropper image file

  /**
   * @param {Object} [options]
   * @constructor
   */
  function EyeDropperNode( options ) {

    options = _.extend( {
      cursor: 'pointer',
      onProperty: new Property( false ), // is the dropper on? (ie, dispensing)
      enabledProperty: new Property( true ), // is the button enabled?
      emptyProperty: new Property( false ), // does the dropper appear to be empty?
      buttonTouchAreaDilation: 30, // dilation of the button's radius for touchArea
      fluidColor: 'yellow' // {Color|String} color of the fluid in the glass
    }, options );

    var thisNode = this;

    // @public
    this.onProperty = options.onProperty;
    this.enabledProperty = options.enabledProperty;
    this.emptyProperty = options.emptyProperty;

    // @private fluid fills the glass portion of the dropper, shape is specific to the dropper image file
    this.fluidNode = new Path( new Shape()
      .moveTo( -TIP_WIDTH / 2, 0 )
      .lineTo( -TIP_WIDTH / 2, -TIP_HEIGHT )
      .lineTo( -GLASS_WIDTH / 2, GLASS_MAX_Y )
      .lineTo( -GLASS_WIDTH / 2, GLASS_MIN_Y )
      .lineTo( GLASS_WIDTH / 2, GLASS_MIN_Y )
      .lineTo( GLASS_WIDTH / 2, GLASS_MAX_Y )
      .lineTo( TIP_WIDTH / 2, -TIP_HEIGHT )
      .lineTo( TIP_WIDTH / 2, 0 )
      .close(), {
      fill: options.fluidColor
    } );

    // images, origin moved to bottom center
    var foreground = new Image( foregroundImage );
    var background = new Image( backgroundImage );
    foreground.x = -foreground.width / 2;
    foreground.y = -foreground.height;
    background.x = -background.width / 2;
    background.y = -background.height;

    // button, centered in the dropper's bulb
    var button = new RoundMomentaryButton( this.onProperty, { baseColor: 'red', radius: 18 } );
    this.enabledProperty.link( function( enabled ) { button.enabled = enabled; } );
    button.touchArea = Shape.circle( button.width / 2, button.height / 2, ( button.width / 2 ) + options.buttonTouchAreaDilation );
    button.centerX = foreground.centerX;
    button.centerY = foreground.top + BUTTON_CENTER_Y_OFFSET;

    // make the background visible only when the dropper is empty
    this.emptyProperty.link( function( empty ) {
      thisNode.fluidNode.visible = !empty;
      background.visible = empty;
    } );

    options.children = [ this.fluidNode, background, foreground, button ];

    // add a red dot at the origin
    if ( DEBUG_ORIGIN ) {
      options.children.push( new Circle( { radius: 3, fill: 'red' } ) );
    }

    Node.call( this, options );
  }

  return inherit( Node, EyeDropperNode, {

    // You'll need these if you want to create fluid coming out of the tip, or put a label on the glass.
    TIP_WIDTH: TIP_WIDTH,
    TIP_HEIGHT: TIP_HEIGHT,
    GLASS_WIDTH: GLASS_WIDTH,
    GLASS_MIN_Y: GLASS_MIN_Y,
    GLASS_MAX_Y: GLASS_MAX_Y,

    set on( value ) { this.onProperty = value; },

    get on() { return this.onProperty.value; },

    set enabled( value ) { this.enabledProperty = value; },

    get enabled() { return this.enabledProperty.value; },

    set empty( value ) { this.emptyProperty = value; },

    get empty() { return this.emptyProperty.value; },

    set fluidColor( value ) { this.fluidNode.fill = value; },

    get fluidColor() { return this.fluidNode.fill; }
  } );
} );
