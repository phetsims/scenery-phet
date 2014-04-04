// Copyright 2002-2014, University of Colorado Boulder

/**
 * A scenery node that is used to control which kit is selected in a kit
 * selection node.  This version is intended to add buttons at the left and
 * right sides of a kit (there's an alternate version that can be used at the
 * top of the kit).  It contains the back and forward buttons with a space
 * between them where the kit elements will appear.
 *
 * @author John Blanco
 */

define( function( require ) {
  'use strict';

  // Imports
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectanglePushButton = require( 'SUN/RectanglePushButton' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {number} numKits
   * @param {Property} selectedKit - A property that tracks the selected kit as an integer
   * @param {Number} spaceBetweenControls - Amount of horizontal space between the left and right control buttons
   * @param {Object} options
   * @constructor
   */
  function KitControlNodeSides( numKits, selectedKit, spaceBetweenControls, options ) {
    Node.call( this );
    options = _.extend(
      {
        // Default values
        inset: 5,
        buttonIdleFill: 'rgba( 175, 240, 255, 0.5 )',
        buttonOverFill: 'rgba( 128, 223, 255, 0.5 )',
        buttonDownFill: 'rgba( 77, 210, 255, 0.5 )',
        buttonStroke: null,
        buttonOutlineWidth: 0.5,
//        arrowStroke: 'rgb( 150, 150, 150 )',
        arrowStroke: 'white',
        arrowLineWidth: 4,
        arrowWidth: 12,
        arrowHeight: 40,
        xPadding: 5,
        yPadding: 5
      }, options );

    var buttonOptions = {
      rectangleStroke: options.buttonStroke,
      rectangleLineWidth: options.buttonOutlineWidth,
      rectangleFillUp: options.buttonIdleFill instanceof Color ? options.buttonIdleFill : new Color( options.buttonIdleFill ),
      rectangleFillOver: options.buttonOverFill,
      rectangleFillDown: options.buttonDownFill,
      disabledFill: new Color( 180, 180, 180 ),
      downFill: options.buttonOverFill,
      rectangleCornerRadius: 4,
      xMargin: 5,
      yMargin: 3
    };

    var iconOptions = { stroke: options.arrowStroke, lineWidth: options.arrowLineWidth, lineCap: 'round' };

    // Create the icons that signify previous and next.
    var nextIcon = new Path( new Shape().moveTo( 0, 0 ).lineTo( options.arrowWidth, options.arrowHeight / 2 ).lineTo( 0, options.arrowHeight ), iconOptions );
    var previousIcon = new Path( new Shape().moveTo( options.arrowWidth, 0 ).lineTo( 0, options.arrowHeight / 2 ).lineTo( options.arrowWidth, options.arrowHeight ), iconOptions );

    var nextKitButton = new RectanglePushButton( nextIcon, _.extend( {
      listener: function() {
        selectedKit.value = selectedKit.value + 1;
      } }, buttonOptions ) );
    this.addChild( nextKitButton );

    var previousKitButton = new RectanglePushButton( previousIcon, _.extend( {
      listener: function() {
        selectedKit.value = selectedKit.value - 1;
      } }, buttonOptions ) );
    this.addChild( previousKitButton );

    // Control button enabled state
    selectedKit.link( function( kitNum ) {
      nextKitButton.visible = ( kitNum < numKits - 1 );
      previousKitButton.visible = ( kitNum !== 0 );
    } );

    // Layout
    nextKitButton.left = previousKitButton.right + spaceBetweenControls;

    this.mutate( options );
  }

  return inherit( Node, KitControlNodeSides );
} );
