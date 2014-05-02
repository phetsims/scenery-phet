// Copyright 2002-2013, University of Colorado Boulder

/**
 * A scenery node that is generally placed at the top of a kit selection node
 * and is used to control which kit is selected.  It contains the back and
 * forward buttons and, optionally, a title node.
 *
 * @author John Blanco
 * @author Sam Reid
 */

define( function( require ) {
  'use strict';

  // Imports
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RoundShinyButtonDeprecated = require( 'SCENERY_PHET/RoundShinyButtonDeprecated' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {number} numKits
   * @param {Property} selectedKit - A property that tracks the selected kit as an integer
   * @param {Object} options
   * @constructor
   */
  function KitControlNodeTop( numKits, selectedKit, options ) {
    Node.call( this );
    options = _.extend(
      {
        // Default values
        titleNode: null,
        inset: 5,
        buttonColor: 'rgb( 255, 184, 77 )',
        minButtonXSpace: 30
      }, options );

    var baseColor = new Color( 255, 204, 0 );
    var buttonOptions = {
      radius: 12,
      touchAreaRadius: 20,
      upFill: baseColor,
      overFill: baseColor.colorUtilsBrighter( 0.2 ),
      disabledFill: new Color( 180, 180, 180 ),
      downFill: baseColor.colorUtilsDarker( 0.2 ),
      xMargin: 5,
      yMargin: 3
    };

    var iconOptions = { stroke: 'black', lineWidth: 3, lineCap: 'round' };
    var nextIcon = new Path( new Shape().moveTo( 0, 0 ).lineTo( 5, 5 ).lineTo( 0, 10 ), iconOptions );
    var previousIcon = new Path( new Shape().moveTo( 0, 0 ).lineTo( -5, 5 ).lineTo( 0, 10 ), iconOptions );

    var nextKitButton = new RoundShinyButtonDeprecated( function() {
      selectedKit.value = selectedKit.value + 1;
    }, nextIcon, _.extend( { iconOffsetX: 1 }, buttonOptions ) );
    this.addChild( nextKitButton );

    var previousKitButton = new RoundShinyButtonDeprecated( function() {
      selectedKit.value = selectedKit.value - 1;
    }, previousIcon, _.extend( { iconOffsetX: -1 }, buttonOptions ) );
    this.addChild( previousKitButton );

    // Control button enabled state
    selectedKit.link( function( kitNum ) {
      nextKitButton.enabled = ( kitNum < numKits - 1 );
      previousKitButton.enabled = ( kitNum !== 0 );
    } );

    // Layout
    var interButtonXSpace = Math.max( options.minButtonXSpace, 2 * options.inset + ( options.titleNode === null ? 0 : options.titleNode.width ) );
    nextKitButton.left = previousKitButton.right + interButtonXSpace;
    if ( options.titleNode !== null ) {
      this.addChild( options.titleNode, { centerX: ( previousKitButton.centerX + nextKitButton.centerX ) / 2 } );
    }

    // If there is only one kit, show the title but not the control buttons.
    // Leave the buttons in the scene graph for keeping layout consistent.
    previousKitButton.visible = numKits > 1;
    nextKitButton.visible = numKits > 1;

    this.mutate( options );
  }

  return inherit( Node, KitControlNodeTop );
} );
