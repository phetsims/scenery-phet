// Copyright 2014-2020, University of Colorado Boulder

/**
 * Button for returning to the level selection screen.
 *
 * @author John Blanco
 */

import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import StarShape from '../StarShape.js';

class StarButton extends RectangularPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // Match the size of the star button to the refresh buttons, since they often appear together.
      // see https://github.com/phetsims/scenery-phet/issues/44
      xMargin: 8.134152255572697,
      baseColor: PhetColorScheme.BUTTON_YELLOW
    }, options );

    assert && assert( !options.content, 'StarButton sets content' );
    options.content = new Path( new StarShape(), { fill: 'black' } );

    super( options );
  }
}

sceneryPhet.register( 'StarButton', StarButton );
export default StarButton;