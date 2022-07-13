// Copyright 2018-2022, University of Colorado Boulder

/**
 * Button for group nodes that returns a piece from the group to the panel it came from.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { Shape } from '../../../kite/js/imports.ts';
import merge from '../../../phet-core/js/merge.ts';
import { Path } from '../../../scenery/js/imports.ts';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.ts';
import FractionsCommonColors from '../../../fractions-common/js/common/view/FractionsCommonColors.js';
import fractionsCommon from '../../../fractions-common/js/fractionsCommon.js';

const ICON_HEIGHT = 17;

class ReturnButton extends RectangularPushButton {
  /**
   * @param {function} listener
   * @param {Object} [options]
   */
  constructor( listener, options ) {
    const undoArrowShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, ICON_HEIGHT )
      .lineTo( ICON_HEIGHT, ICON_HEIGHT )
      .lineTo( ICON_HEIGHT * 0.7, ICON_HEIGHT * 0.7 )
      .quadraticCurveTo( ICON_HEIGHT * 1.25, -ICON_HEIGHT * 0.1, ICON_HEIGHT * 2, ICON_HEIGHT * 0.75 )
      .quadraticCurveTo( ICON_HEIGHT * 1.25, -ICON_HEIGHT * 0.5, ICON_HEIGHT * 0.3, ICON_HEIGHT * 0.3 )
      .close();

    options = merge( {
      content: new Path( undoArrowShape, {
        fill: 'black',
        scale: 0.7
      } ),
      xMargin: 5,
      yMargin: 5,
      baseColor: FractionsCommonColors.undoButtonProperty,
      listener: listener
    }, options );

    super( options );
  }
}

fractionsCommon.register( 'ReturnButton', ReturnButton );
export default ReturnButton;