// Copyright 2018-2020, University of Colorado Boulder

/**
 * Shape for the 'play' icon that appears on buttons and other UI components.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Shape from '../../kite/js/Shape.js';
import sceneryPhet from './sceneryPhet.js';

class PlayIconShape extends Shape {

  /**
   * @param {number} width
   * @param {number} height
   */
  constructor( width, height ) {
    super();

    // triangle that points to the right
    this.moveTo( 0, 0 );
    this.lineTo( width, height / 2 );
    this.lineTo( 0, height );
    this.close();
  }
}

sceneryPhet.register( 'PlayIconShape', PlayIconShape );
export default PlayIconShape;