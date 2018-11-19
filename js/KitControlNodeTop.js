// Copyright 2014-2018, University of Colorado Boulder

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

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {number} numKits
   * @param {Property.<number>} selectedKitProperty - A property that tracks the selected kit as an integer
   * @param {Object} [options]
   * @constructor
   */
  function KitControlNodeTop( numKits, selectedKitProperty, options ) {
    Tandem.indicateUninstrumentedCode();

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
    var commonButtonOptions = {
      radius: 12,
      touchAreaRadius: 20,
      baseColor: baseColor,
      xMargin: 5,
      yMargin: 3
    };

    var iconOptions = { stroke: 'black', lineWidth: 3, lineCap: 'round' };
    var nextIcon = new Path( new Shape().moveTo( 0, 0 ).lineTo( 5, 5 ).lineTo( 0, 10 ), iconOptions );
    var previousIcon = new Path( new Shape().moveTo( 0, 0 ).lineTo( -5, 5 ).lineTo( 0, 10 ), iconOptions );

    var nextKitButton = new RoundPushButton( _.extend( {
      listener: function() { selectedKitProperty.value = selectedKitProperty.value + 1; },
      content: nextIcon
    }, commonButtonOptions ) );
    this.addChild( nextKitButton );

    var previousKitButton = new RoundPushButton( _.extend( {
      listener: function() { selectedKitProperty.value = selectedKitProperty.value - 1; },
      content: previousIcon
    }, commonButtonOptions ) );
    this.addChild( previousKitButton );

    // Control button enabled state
    var selectedKitPropertyObserver = function( kitNum ) {
      nextKitButton.enabled = ( kitNum < numKits - 1 );
      previousKitButton.enabled = ( kitNum !== 0 );
    };
    selectedKitProperty.link( selectedKitPropertyObserver );

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

    // @private
    this.disposeKitControlNodeTop = function() {
      nextKitButton.dispose();
      previousKitButton.dispose();
      if ( selectedKitProperty.hasListener( selectedKitPropertyObserver ) ) {
        selectedKitProperty.unlink( selectedKitPropertyObserver );
      }
    };
  }

  sceneryPhet.register( 'KitControlNodeTop', KitControlNodeTop );

  return inherit( Node, KitControlNodeTop, {

    /**
     * Ensures that this node is subject to garbage collection
     * @public
     */
    dispose: function() {
      this.disposeKitControlNodeTop();
      Node.prototype.dispose.call( this );
    }
  } );
} );
