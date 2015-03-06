// Copyright 2002-2015, University of Colorado Boulder

/**
 * Colors that are specific to PhET simulations.
 * Reuse these in sims whenever possible to facilitate uniformity across sims.
 * <p>
 * This is based on the google doc here:
 * http://spreadsheets.google.com/ccc?key=0Ajw3oS4YmCBqdDZzYUhlMksxZ0lfUHZ3bXUzM0JNU3c&hl=en&pli=1#gid=0
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );

  // Colors that are used for one or more things in the color scheme.
  var DARK_GREEN = 'rgb( 0, 200, 0 )';
  var RED_COLORBLIND = 'rgb( 255, 85, 0 )';
  var TAN_ORANGE ='rgb( 236, 153, 55 )';

  return {
    ACCELERATION: Color.GREEN,
    APPLIED_FORCE: TAN_ORANGE,
    ELASTIC_ENERGY: 'rgb( 153, 51, 102  )',
    FRICTION_FORCE: RED_COLORBLIND,
    GRAVITATIONAL_FORCE: 'rgb( 50, 130, 215 )',
    HEAT_THERMAL_ENERGY: RED_COLORBLIND,
    IMAGINARY_PART: 'rgb( 153, 51, 102  )',
    KINETIC_ENERGY: Color.GREEN,
    NET_WORK: DARK_GREEN,
    NORMAL_FORCE: 'rgb( 255, 235, 0 )',
    POSITION: Color.BLUE,
    POTENTIAL_ENERGY: Color.BLUE,
    REAL_PART: 'rgb( 255, 153, 0 )',
    RED_COLORBLIND: RED_COLORBLIND,
    TOTAL_ENERGY: TAN_ORANGE,
    TOTAL_FORCE: DARK_GREEN,
    VELOCITY: RED_COLORBLIND,
    WALL_FORCE: 'rgb( 153, 51, 0 )'
  };
} );
