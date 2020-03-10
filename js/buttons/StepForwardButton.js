// Copyright 2016-2020, University of Colorado Boulder

/**
 * Step forward button.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import sceneryPhet from '../sceneryPhet.js';
import StepButton from './StepButton.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function StepForwardButton( options ) {

  assert && assert( !options || !options.direction, 'StepForwardButton sets direction' );
  options = merge( {
    direction: 'forward'
  }, options );

  StepButton.call( this, options );
}

sceneryPhet.register( 'StepForwardButton', StepForwardButton );

inherit( StepButton, StepForwardButton );
export default StepForwardButton;