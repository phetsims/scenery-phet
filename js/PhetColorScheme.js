// Copyright 2015-2019, University of Colorado Boulder

/**
 * Colors that are specific to PhET simulations.
 * Reuse these in sims whenever possible to facilitate uniformity across sims.
 * These should all be instances of scenery.Color, since {Color} can typically be used anywhere but {string} cannot.
 * 
 * This is based on the google doc here:
 * https://docs.google.com/spreadsheets/d/1mNsOWSbcoO-Ox2evxJij5Lix4HTZbXKbFgMlPe9W-u0/edit#gid=0
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );


  // Colors that are used for one or more things in the color scheme.
  var DARK_GREEN = new Color( 0, 200, 0 );
  var RED_COLORBLIND = new Color( 255, 85, 0 ); // looks good in colorblind tests, typically used in place of 'red'
  var GREEN_COLORBLIND = new Color( 0, 135, 0 ); // looks good in colorblind tests when used alongside RED_COLORBLIND
  var PHET_LOGO_BLUE = new Color( 106, 206, 245 ); // the color of the blue in the PhET logo
  var PHET_LOGO_YELLOW = new Color( 254, 225, 5 ); // the color of the yellow in the PhET logo

  var PhetColorScheme = {
    ACCELERATION: Color.GREEN,
    APPLIED_FORCE: new Color( 236, 153, 55 ),
    BUTTON_YELLOW: PHET_LOGO_YELLOW,
    ELASTIC_POTENTIAL_ENERGY: new Color( 0, 204, 255 ),
    FRICTION_FORCE: RED_COLORBLIND,
    GRAVITATIONAL_FORCE: new Color( 50, 130, 215 ),
    GRAVITATIONAL_POTENTIAL_ENERGY: new Color(  55, 130, 215 ),
    HEAT_THERMAL_ENERGY: RED_COLORBLIND,
    IMAGINARY_PART: new Color( 153, 51, 102 ),
    KINETIC_ENERGY: new Color( 30, 200, 45 ),
    NET_WORK: DARK_GREEN,
    NORMAL_FORCE: new Color( 255, 235, 0 ),
    PHET_LOGO_BLUE: PHET_LOGO_BLUE,
    PHET_LOGO_YELLOW: PHET_LOGO_YELLOW,
    POSITION: Color.BLUE,
    REAL_PART: new Color( 255, 153, 0 ),
    RED_COLORBLIND: RED_COLORBLIND,
    RESET_ALL_BUTTON_BASE_COLOR: new Color( 247, 151, 34 ),
    GREEN_COLORBLIND: GREEN_COLORBLIND,
    TOTAL_ENERGY: new Color( 180, 180, 0 ),
    TOTAL_FORCE: DARK_GREEN,
    VELOCITY: RED_COLORBLIND,
    WALL_FORCE: new Color( 153, 51, 0 ),
    SCREEN_ICON_FRAME: '#dddddd'
  };

  sceneryPhet.register( 'PhetColorScheme', PhetColorScheme );

  return PhetColorScheme;
} );
