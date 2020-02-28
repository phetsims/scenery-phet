// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shape for the 'pause' icon that appears on buttons and other UI components.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../kite/js/Shape.js';
import sceneryPhet from './sceneryPhet.js';

class PauseIconShape extends Shape {

  /**
   * @param {number} width
   * @param {number} height
   */
  constructor( width, height ) {
    super();

    // 2 vertical bars
    const barWidth = width / 3;
    this.rect( 0, 0, barWidth, height );
    this.rect( 2 * barWidth, 0, barWidth, height );
  }
}

sceneryPhet.register( 'PauseIconShape', PauseIconShape );
export default PauseIconShape;