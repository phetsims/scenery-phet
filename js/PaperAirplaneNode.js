// Copyright 2014-2020, University of Colorado Boulder

/**
 * The paper airplane that is part of the PhET logo.
 *
 * @author John Blanco
 */

import Shape from '../../kite/js/Shape.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Path from '../../scenery/js/nodes/Path.js';
import PhetColorScheme from './PhetColorScheme.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function PaperAirplaneNode( options ) {
  options = merge( {
    fill: PhetColorScheme.PHET_LOGO_YELLOW
  }, options );

  // Define the shape, from the points in the PhET Logo AI file, see https://github.com/phetsims/scenery-phet/issues/75
  // The bounds offset were determined by getting bodyShape.bounds.minX, bodyShape.bounds.minY, and the shape
  // is adjusted to have top/left at (0,0)
  const dx = 221.92;
  const dy = 114.975;
  const bodyShape = new Shape()
    .moveTo( 221.92 - dx, 131.225 - dy )
    .lineTo( 234.307 - dx, 135.705 - dy )
    .lineTo( 250.253 - dx, 122.428 - dy )
    .lineTo( 237.983 - dx, 136.955 - dy )
    .lineTo( 251.236 - dx, 141.627 - dy )
    .lineTo( 256.021 - dx, 114.975 - dy )
    .close()

    // Lower part
    .moveTo( 238.004 - dx, 139.547 - dy )
    .lineTo( 238.312 - dx, 146.48 - dy )
    .lineTo( 243.254 - dx, 141.54 - dy )
    .close();

  Path.call( this, bodyShape, options );
}

sceneryPhet.register( 'PaperAirplaneNode', PaperAirplaneNode );

inherit( Path, PaperAirplaneNode );
export default PaperAirplaneNode;