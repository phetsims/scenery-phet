// Copyright 2018-2022, University of Colorado Boulder

/**
 * Shape for the 'play' icon that appears on buttons and other UI components.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../kite/js/imports.js';
import sceneryPhet from './sceneryPhet.js';

export default class PlayIconShape extends Shape {

  public constructor( width: number, height: number ) {
    super();

    // triangle that points to the right
    this.moveTo( 0, 0 );
    this.lineTo( width, height / 2 );
    this.lineTo( 0, height );
    this.close();
  }
}

sceneryPhet.register( 'PlayIconShape', PlayIconShape );