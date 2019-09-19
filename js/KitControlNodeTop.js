// Copyright 2014-2019, University of Colorado Boulder

/**
 * A scenery node that is generally placed at the top of a kit selection node
 * and is used to control which kit is selected.  It contains the back and
 * forward buttons and, optionally, a title node.
 *
 * @author John Blanco
 * @author Sam Reid
 */

define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );

  /**
   * @param {number} numKits
   * @param {Property.<number>} selectedKitProperty - A property that tracks the selected kit as an integer
   * @param {Object} [options]
   * @constructor
   */
  function KitControlNodeTop( numKits, selectedKitProperty, options ) {
    Node.call( this );
    options = _.extend(
      {
        // Default values
        titleNode: null,
        inset: 5,
        buttonColor: 'rgb( 255, 184, 77 )',
        minButtonXSpace: 30
      }, options );

    const baseColor = new Color( 255, 204, 0 );
    const commonButtonOptions = {
      radius: 12,
      touchAreaRadius: 20,
      baseColor: baseColor,
      xMargin: 5,
      yMargin: 3
    };

    const iconOptions = { stroke: 'black', lineWidth: 3, lineCap: 'round' };
    const nextIcon = new Path( new Shape().moveTo( 0, 0 ).lineTo( 5, 5 ).lineTo( 0, 10 ), iconOptions );
    const previousIcon = new Path( new Shape().moveTo( 0, 0 ).lineTo( -5, 5 ).lineTo( 0, 10 ), iconOptions );

    const nextKitButton = new RoundPushButton( _.extend( {
      listener: function() { selectedKitProperty.value = selectedKitProperty.value + 1; },
      content: nextIcon
    }, commonButtonOptions ) );
    this.addChild( nextKitButton );

    const previousKitButton = new RoundPushButton( _.extend( {
      listener: function() { selectedKitProperty.value = selectedKitProperty.value - 1; },
      content: previousIcon
    }, commonButtonOptions ) );
    this.addChild( previousKitButton );

    // Control button enabled state
    const selectedKitPropertyObserver = function( kitNum ) {
      nextKitButton.enabled = ( kitNum < numKits - 1 );
      previousKitButton.enabled = ( kitNum !== 0 );
    };
    selectedKitProperty.link( selectedKitPropertyObserver );

    // Layout
    const interButtonXSpace = Math.max( options.minButtonXSpace, 2 * options.inset + ( options.titleNode === null ? 0 : options.titleNode.width ) );
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
