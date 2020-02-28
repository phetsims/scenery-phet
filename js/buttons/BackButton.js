// Copyright 2014-2020, University of Colorado Boulder

/**
 * Button for returning to the level selection screen, which shows a "back" arrow, i.e., an arrow pointing to the left.
 * (Note the original version had a star icon.)
 *
 * @author John Blanco
 * @author Sam Reid
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Path from '../../../scenery/js/nodes/Path.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import ArrowShape from '../ArrowShape.js';
import PhetColorScheme from '../PhetColorScheme.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function BackButton( options ) {
  options = merge( {

    // Default margin values were set up to make this button match the size of the refresh button, since these
    // buttons often appear together.  See see https://github.com/phetsims/scenery-phet/issues/44.
    xMargin: 8,
    yMargin: 10.9,

    baseColor: PhetColorScheme.BUTTON_YELLOW

  }, options );

  const arrowShape = new ArrowShape( 0, 0, -28.5, 0, {
    tailWidth: 8,
    headWidth: 18,
    headHeight: 15
  } );

  RectangularPushButton.call( this, merge( {
    content: new Path( arrowShape, { fill: 'black' } )
  }, options ) );
}

sceneryPhet.register( 'BackButton', BackButton );

inherit( RectangularPushButton, BackButton );
export default BackButton;