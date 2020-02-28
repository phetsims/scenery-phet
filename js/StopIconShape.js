// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shape for the 'stop' icon that appears on buttons and other UI components.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../kite/js/Shape.js';
import sceneryPhet from './sceneryPhet.js';

class StopIconShape extends Shape {

  /**
   * @param {number} width
   */
  constructor( width ) {
    super();

    // rectangle
    this.rect( 0, 0, width, width );
  }
}

sceneryPhet.register( 'StopIconShape', StopIconShape );
export default StopIconShape;