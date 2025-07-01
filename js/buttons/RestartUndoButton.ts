// Copyright 2025, University of Colorado Boulder

/**
 * A rectangular "restart"" button (with an "undo" icon)
 *
 * @author Brandon Li
 * @author Martin Veillette
 */

import sceneryPhet from '../sceneryPhet.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import ColorConstants from '../../../sun/js/ColorConstants.js';
import Path from '../../../scenery/js/nodes/Path.js';
import undoSolidShape from '../../../sherpa/js/fontawesome-5/undoSolidShape.js';

type SelfOptions = EmptySelfOptions;

export type RestartUndoButtonOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

export default class RestartUndoButton extends RectangularPushButton {
  public constructor( providedOptions?: RestartUndoButtonOptions ) {

    super( optionize<RestartUndoButtonOptions, SelfOptions, RectangularPushButtonOptions>()( {
      baseColor: ColorConstants.LIGHT_BLUE,
      xMargin: 6,
      yMargin: 5,
      touchAreaXDilation: 8,
      touchAreaYDilation: 8,
      content: new Path( undoSolidShape, { scale: 0.038, fill: 'black' } )
    }, providedOptions ) );
  }
}

sceneryPhet.register( 'RestartUndoButton', RestartUndoButton );