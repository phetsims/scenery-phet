// Copyright 2014-2020, University of Colorado Boulder

/**
 * BackspaceIcon draws a backspace icon.
 * This was originally created for use on keypads, but may have other applications.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../dot/js/Dimension2.js';
import Shape from '../../kite/js/Shape.js';
import merge from '../../phet-core/js/merge.js';
import Path from '../../scenery/js/nodes/Path.js';
import sceneryPhet from './sceneryPhet.js';

class BackspaceIcon extends Path {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      stroke: 'black',
      lineWidth: 1,
      lineJoin: 'round',
      lineCap: 'square',
      size: new Dimension2( 15, 10 )
    }, options );

    const iconShape = new Shape();

    // the outline, tip points left, described clockwise from the tip
    const tipWidth = options.size.width / 3;
    iconShape.moveTo( 0, tipWidth )
      .lineTo( tipWidth, 0 )
      .lineTo( options.size.width, 0 )
      .lineTo( options.size.width, options.size.height )
      .lineTo( tipWidth, options.size.height )
      .close();

    // the x in the middle, multipliers determined empirically
    const left = 0.47 * options.size.width;
    const right = 0.73 * options.size.width;
    const top = 0.3 * options.size.height;
    const bottom = 0.7 * options.size.height;
    iconShape.moveTo( left, top )
      .lineTo( right, bottom )
      .moveTo( right, top )
      .lineTo( left, bottom );

    super( iconShape, options );
  }
}

sceneryPhet.register( 'BackspaceIcon', BackspaceIcon );
export default BackspaceIcon;