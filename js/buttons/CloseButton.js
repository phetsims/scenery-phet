// Copyright 2015-2020, University of Colorado Boulder

/**
 * Close button, red with a white 'X'.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Shape from '../../../kite/js/Shape.js';
import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';

class CloseButton extends RectangularPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // {number} length of the 'X' icon, whose bounds are square
      iconLength: 16,

      // {Object} - options passed along to the Path for the 'X'
      pathOptions: {
        stroke: 'white',
        lineWidth: 2.5,
        lineCap: 'round'
      },

      // RectangularPushButton options
      baseColor: PhetColorScheme.RED_COLORBLIND,
      xMargin: 4, // {number} x margin around the icon
      yMargin: 4 // {number} y margin around the icon

    }, options );

    // 'X' icon
    options.content = new Path( new Shape()
        .moveTo( -options.iconLength / 2, -options.iconLength / 2 )
        .lineTo( options.iconLength / 2, options.iconLength / 2 )
        .moveTo( options.iconLength / 2, -options.iconLength / 2 )
        .lineTo( -options.iconLength / 2, options.iconLength / 2 ),
      options.pathOptions
    );

    super( options );
  }
}

sceneryPhet.register( 'CloseButton', CloseButton );

export default CloseButton;