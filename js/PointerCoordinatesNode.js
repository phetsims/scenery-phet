// Copyright 2019-2021, University of Colorado Boulder

/**
 * Shows the model and view coordinates that correspond to the cursor position.
 * Originally implemented for use in gas-properties, where it was used exclusively for debugging.
 * CAUTION! This adds a listener to the Display, see notes below.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../dot/js/Utils.js';
import getGlobal from '../../phet-core/js/getGlobal.js';
import merge from '../../phet-core/js/merge.js';
import Display from '../../scenery/js/display/Display.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import RichText from '../../scenery/js/nodes/RichText.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

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
      pickable: false,

      // {Display}
      display: getGlobal( 'phet.joist.display' )
    }, options );

    assert && assert( options.display instanceof Display, 'display must be provided to support this move listener' );

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

    // Update the coordinates to match the pointer position.
    // Add the input listener to the Display, so that things behind the grid will received events.
    // Scenery does not support having one event sent through two different trails.
    // Note that this will continue to receive events when the current screen is inactive.
    options.display.addInputListener( {
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

sceneryPhet.register( 'PointerCoordinatesNode', PointerCoordinatesNode );
export default PointerCoordinatesNode;