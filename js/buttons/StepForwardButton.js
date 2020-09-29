// Copyright 2016-2020, University of Colorado Boulder

/**
 * Step forward button.
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../phet-core/js/merge.js';
import sceneryPhet from '../sceneryPhet.js';
import StepButton from './StepButton.js';

class StepForwardButton extends StepButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    assert && assert( !options || !options.direction, 'StepForwardButton sets direction' );
    options = merge( {
      direction: 'forward'
    }, options );

    super( options );
  }
}

sceneryPhet.register( 'StepForwardButton', StepForwardButton );
export default StepForwardButton;