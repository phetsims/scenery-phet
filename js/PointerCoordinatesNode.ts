// Copyright 2019-2025, University of Colorado Boulder

/**
 * Shows the model and view coordinates that correspond to the cursor position.
 * Originally implemented for use in gas-properties, where it was used exclusively for debugging.
 * CAUTION! This adds a listener to the Display, see notes below.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { toFixed } from '../../dot/js/util/toFixed.js';
import getGlobal from '../../phet-core/js/getGlobal.js';
import optionize from '../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../phetcommon/js/view/ModelViewTransform2.js';
import Display from '../../scenery/js/display/Display.js';
import SceneryEvent from '../../scenery/js/input/SceneryEvent.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import RichText, { RichTextAlign } from '../../scenery/js/nodes/RichText.js';
import Font from '../../scenery/js/util/Font.js';
import TColor from '../../scenery/js/util/TColor.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

const DEFAULT_FONT = new PhetFont( 14 );

type SelfOptions = {

  display?: Display;
  pickable?: boolean;

  // RichText
  font?: Font;
  textColor?: TColor;
  align?: RichTextAlign;
  modelDecimalPlaces?: number;
  viewDecimalPlaces?: number;

  // Rectangle
  backgroundColor?: TColor;
};

export type PointerCoordinatesNodeOptions = SelfOptions; // not propagated to super!

export default class PointerCoordinatesNode extends Node {

  /**
   * @param modelViewTransform
   * @param providedOptions - not propagated to super!
   */
  public constructor( modelViewTransform: ModelViewTransform2, providedOptions?: PointerCoordinatesNodeOptions ) {

    const options = optionize<PointerCoordinatesNodeOptions, SelfOptions>()( {
      display: getGlobal( 'phet.joist.display' ),
      pickable: false,
      font: DEFAULT_FONT,
      textColor: 'black',
      align: 'center',
      modelDecimalPlaces: 1,
      viewDecimalPlaces: 0,
      backgroundColor: 'rgba( 255, 255, 255, 0.5 )'
    }, providedOptions );

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
    // Add the input listener to the Display, so that other things in the sim will receive events.
    // Scenery does not support having one event sent through two different trails.
    // Note that this will continue to receive events when the current screen is inactive!
    options.display.addInputListener( {
      move: ( event: SceneryEvent ) => {

        // (x,y) in view coordinates
        const viewPoint = this.globalToParentPoint( event.pointer.point );
        const xView = toFixed( viewPoint.x, options.viewDecimalPlaces );
        const yView = toFixed( viewPoint.y, options.viewDecimalPlaces );

        // (x,y) in model coordinates
        const modelPoint = modelViewTransform.viewToModelPosition( viewPoint );
        const xModel = toFixed( modelPoint.x, options.modelDecimalPlaces );
        const yModel = toFixed( modelPoint.y, options.modelDecimalPlaces );

        // Update coordinates display.
        textNode.string = `(${xView},${yView})<br>(${xModel},${yModel})`;

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