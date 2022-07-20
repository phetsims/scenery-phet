// Copyright 2022, University of Colorado Boulder

/**
 * Button with a back arrow.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import { Color, Path } from '../../../scenery/js/imports.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';
import sceneryPhet from '../sceneryPhet.js';
import { Shape } from '../../../kite/js/imports.js';

const ICON_HEIGHT = 17;

type SelfOptions = EmptySelfOptions;
type ReturnButtonSelfOptions = SelfOptions & StrictOmit<RectangularPushButtonOptions, 'content'>;

class ReturnButton extends RectangularPushButton {

  public constructor( listener: () => void, providedOptions?: ReturnButtonSelfOptions ) {

    const options = optionize<ReturnButtonSelfOptions, SelfOptions, RectangularPushButtonOptions>()( {
      xMargin: 5,
      yMargin: 5,
      baseColor: Color.YELLOW,
      listener: listener
    }, providedOptions );

    const undoArrowShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, ICON_HEIGHT )
      .lineTo( ICON_HEIGHT, ICON_HEIGHT )
      .lineTo( ICON_HEIGHT * 0.7, ICON_HEIGHT * 0.7 )
      .quadraticCurveTo( ICON_HEIGHT * 1.25, -ICON_HEIGHT * 0.1, ICON_HEIGHT * 2, ICON_HEIGHT * 0.75 )
      .quadraticCurveTo( ICON_HEIGHT * 1.25, -ICON_HEIGHT * 0.5, ICON_HEIGHT * 0.3, ICON_HEIGHT * 0.3 )
      .close();

    const undoArrowPath = new Path( undoArrowShape, {
      fill: 'black',
      scale: 0.7
    } );

    options.content = undoArrowPath;

    super( options );
  }
}

sceneryPhet.register( 'ReturnButton', ReturnButton );
export default ReturnButton;