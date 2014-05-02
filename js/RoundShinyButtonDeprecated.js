// Copyright 2002-2013, University of Colorado Boulder

/**
 * Round shiny button, like for the Reset All button.
 * See https://github.com/phetsims/scenery-phet/issues/23
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // Includes
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PushButton = require( 'SUN/PushButton' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Shape = require( 'KITE/Shape' );

  // Constants
  var DEFAULT_RADIUS = 32; // Derived from images initially used for reset button.

  // Inner type for creating button nodes used for various button states.
  function ButtonStateNode( radius, fill, icon, iconOffsetX, iconOffsetY, backgroundGradientColorStop0, backgroundGradientColorStop1, innerButtonStroke, innerButtonLineWidth ) {
    Node.call( this, { pickable: false } );
    var backgroundGradient = new RadialGradient( radius * 0.05, radius * 0.05, radius * 0.85, 0, 0, radius * 1.2 );
    backgroundGradient.addColorStop( 0, backgroundGradientColorStop0 );
    backgroundGradient.addColorStop( 1, backgroundGradientColorStop1 );
    this.addChild( new Circle( radius, { fill: backgroundGradient } ) );
    var innerButtonRadius = radius * 0.92; // Multiplier determined by eyeballing it.
    this.addChild( new Circle( innerButtonRadius, { fill: fill, stroke: innerButtonStroke, lineWidth: innerButtonLineWidth } ) );
    this.addChild( icon );
    icon.centerX = iconOffsetX;
    icon.centerY = iconOffsetY;
  }

  inherit( Node, ButtonStateNode );

  /**
   * @param {function} callback
   * @param {Node} icon
   * @param {Object} options
   * @constructor
   */
  function RoundShinyButtonDeprecated( callback, icon, options ) {
    options = _.extend( {

      //Colors for the border gradient
      backgroundGradientColorStop0: 'black',
      backgroundGradientColorStop1: 'rgb( 230, 230, 230 )',

      //Drawing a line around the inner circle.  Off by default but maybe should be changed to on by default
      innerButtonStroke: null,
      innerButtonLineWidth: null,

      radius: DEFAULT_RADIUS,
      touchAreaRadius: DEFAULT_RADIUS * 1.3, // convenience for expanding the touchArea, which is a circle

      // By default, icons are centered in the button, but icons with odd
      // shapes (that should not be wrapped in a normalizing parent node), may
      // need to specify offsets to line things up properly
      iconOffsetX: 0,
      iconOffsetY: 0,

      // Default color scheme
      upFill: new Color( 153, 206, 220 ),
      overFill: new Color( 160, 216, 255 ),
      disabledFill: new Color( 180, 180, 180 ),
      downFill: new Color( 145, 190, 250 )
    }, options );
    options.listener = callback;

    // Local functions for creating gradients to use on buttons.
    var createButtonFillGradient = function( baseColor ) {
      var buttonGradient = new RadialGradient( options.radius * 0.05, options.radius * 0.05, options.radius * 0.87, 0, 0, options.radius );
      buttonGradient.addColorStop( 0, baseColor );
      buttonGradient.addColorStop( 0.7, baseColor.colorUtilsBrighter( 0.6 ) );
      buttonGradient.addColorStop( 1, baseColor.colorUtilsBrighter( 0.8 ) );
      return buttonGradient;
    };
    var createPushedButtonGradient = function( baseColor ) {
      var buttonGradient = new RadialGradient( 0, 0, options.radius * 0.5, 0, 0, options.radius );
      buttonGradient.addColorStop( 0, baseColor );
      buttonGradient.addColorStop( 0.3, baseColor );
      buttonGradient.addColorStop( 0.5, baseColor.colorUtilsDarker( 0.1 ) );
      buttonGradient.addColorStop( 0.7, baseColor );
      return buttonGradient;
    };
    var translatedIcon = new Node( {children: [icon]} );

    // Create the nodes for each of the button states. Note: the same icon is
    // used in each of the children (except for the down node, which must be
    // translated), this is to save on memory and CPU but means they all will
    // have the same appearance and offset
    var upNode = new ButtonStateNode( options.radius, createButtonFillGradient( options.upFill ), icon, options.iconOffsetX, options.iconOffsetY,
      options.backgroundGradientColorStop0, options.backgroundGradientColorStop1, options.innerButtonStroke, options.innerButtonLineWidth );
    var overNode = new ButtonStateNode( options.radius, createButtonFillGradient( options.overFill ), icon, options.iconOffsetX, options.iconOffsetY,
      options.backgroundGradientColorStop0, options.backgroundGradientColorStop1, options.innerButtonStroke, options.innerButtonLineWidth );
    var disabledNode = new ButtonStateNode( options.radius, createButtonFillGradient( options.disabledFill ), icon, options.iconOffsetX, options.iconOffsetY,
      options.backgroundGradientColorStop0, options.backgroundGradientColorStop1, options.innerButtonStroke, options.innerButtonLineWidth );
    var downNode = new ButtonStateNode( options.radius, createPushedButtonGradient( options.downFill ), translatedIcon, options.iconOffsetX + options.radius * 0.01, options.iconOffsetY + options.radius * 0.01,
      options.backgroundGradientColorStop0, options.backgroundGradientColorStop1, options.innerButtonStroke, options.innerButtonLineWidth );

    // Create the actual button by invoking the parent type.
    PushButton.call( this, upNode, overNode, downNode, disabledNode, options );

    // Add an explicit mouse area so that the child nodes can all be non-pickable.
    this.mouseArea = Shape.circle( 0, 0, options.radius );

    // Expand the touch area so that the button works better on touch devices.
    this.touchArea = Shape.circle( 0, 0, options.touchAreaRadius );
  }

  return inherit( PushButton, RoundShinyButtonDeprecated, {},

    //Statics
    {
      DEFAULT_RADIUS: DEFAULT_RADIUS
    } );
} );