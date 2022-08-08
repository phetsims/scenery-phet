// Copyright 2017-2022, University of Colorado Boulder

/**
 * MoveToTrashButton is a push button whose icon means 'move to trash'.
 * The arrow can be color-coded to the thing being deleted by setting options.arrowColor.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import InstanceRegistry from '../../../phet-core/js/documentation/InstanceRegistry.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import optionize from '../../../phet-core/js/optionize.js';
import { TColor, Node, Path } from '../../../scenery/js/imports.js';
import trashAltRegularShape from '../../../sherpa/js/fontawesome-5/trashAltRegularShape.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import CurvedArrowShape from '../CurvedArrowShape.js';
import sceneryPhet from '../sceneryPhet.js';

type SelfOptions = {
  arrowColor?: TColor;
  iconScale?: number;
};

export type MoveToTrashButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

export default class MoveToTrashButton extends RectangularPushButton {

  public constructor( providedOptions?: MoveToTrashButtonOptions ) {

    const options = optionize<MoveToTrashButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {

      // MoveToTrashButtonOptions
      arrowColor: 'black',

      iconScale: 0.46
    }, providedOptions );

    const trashNode = new Path( trashAltRegularShape, {
      fill: 'black',
      scale: 0.08
    } );

    const arrowShape = new CurvedArrowShape( 10, -0.9 * Math.PI, -0.2 * Math.PI, {
      headWidth: 12,
      tailWidth: 4
    } );

    const arrowPath = new Path( arrowShape, {
      fill: options.arrowColor,
      right: trashNode.left + ( 0.75 * trashNode.width ), // a bit to the left of center
      bottom: trashNode.top
    } );

    options.content = new Node( {
      children: [ trashNode, arrowPath ],
      scale: options.iconScale
    } );

    super( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'MoveToTrashButton', this );
  }
}

sceneryPhet.register( 'MoveToTrashButton', MoveToTrashButton );