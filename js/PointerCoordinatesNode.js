// Copyright 2019, University of Colorado Boulder

/**
 * Shows the model and view coordinates that correspond to the cursor location.
 * Originally implemented for use in gas-properties, where it was used exclusively for debugging.
 * CAUTION! This adds a listener to the Display, see notes below.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Utils = require( 'DOT/Utils' );

  class PointerCoordinatesNode extends Node {

    /**
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options] - not propagated to super
     */
    constructor( modelViewTransform, options ) {

      options = merge( {
        textColor: 'black',
        backgroundColor: 'rgba( 255, 255, 255, 0.5 )',
        font: new PhetFont( 14 ),
        modelDecimalPlaces: 1,
        viewDecimalPlaces: 0,
        align: 'center',
        pickable: false
      }, options );

      const textNode = new RichText( '', {
        font: options.font,
        fill: options.textColor,
        align: options.align
      } );

      const backgroundNode = new Rectangle( 0, 0, 1, 1, {
        fill: options.backgroundColor
      } );

      super( {
        children: [ backgroundNode, textNode ],
        pickable: false
      } );

      // Update the coordinates to match the pointer location.
      // Add the input listener to the Display, so that things behind the grid will received events.
      // Scenery does not support having one event sent through two different trails.
      // Note that this will continue to receive events when the current screen is inactive.
      phet.joist.display.addInputListener( {
        move: event => {

          // (x,y) in view coordinates
          const viewPoint = this.globalToParentPoint( event.pointer.point );
          const xView = Utils.toFixed( viewPoint.x, options.viewDecimalPlaces );
          const yView = Utils.toFixed( viewPoint.y, options.viewDecimalPlaces );

          // (x,y) in model coordinates
          const modelPoint = modelViewTransform.viewToModelPosition( viewPoint );
          const xModel = Utils.toFixed( modelPoint.x, options.modelDecimalPlaces );
          const yModel = Utils.toFixed( modelPoint.y, options.modelDecimalPlaces );

          // Update coordinates display.
          textNode.text = `(${xView},${yView})<br>(${xModel},${yModel})`;

          // Resize background
          backgroundNode.setRect( 0, 0, textNode.width + 4, textNode.height + 4 );
          textNode.center = backgroundNode.center;

          // Center above the cursor.
          this.centerX = viewPoint.x;
          this.bottom = viewPoint.y - 3;
        }
      } );
    }
  }

  return sceneryPhet.register( 'PointerCoordinatesNode', PointerCoordinatesNode );
} );