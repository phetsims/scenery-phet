// Copyright 2014-2020, University of Colorado Boulder

/**
 * Button for returning to the level selection screen.
 *
 * @author John Blanco
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';
import StarShape from '../StarShape.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function StarButton( options ) {
  options = merge( {
    xMargin: 8.134152255572697, //Match the size of the star button to the refresh buttons, since they often appear together.  see https://github.com/phetsims/scenery-phet/issues/44
    baseColor: PhetColorScheme.BUTTON_YELLOW
  }, options );

  RectangularPushButton.call( this, merge( { content: new Path( new StarShape(), { fill: 'black' } ) }, options ) );
}

sceneryPhet.register( 'StarButton', StarButton );

inherit( RectangularPushButton, StarButton );
export default StarButton;