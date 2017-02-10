// Copyright 2017, University of Colorado Boulder

/**
 * Single location of all accessibility strings used in scenery-phet.  These 
 * strings are not meant to be translatable yet.  Rosetta needs some work to
 * provide translators with context for these strings, and we want to receive
 * some community feedback before these strings are submitted for translation.
 * 
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  var SceneryPhetA11yStrings = {

    // keyboard key strings
    tabString: 'Tab',
    shiftString: 'Shift',
    capsLockString: 'Caps Lock',
    enterString: 'Enter',
    escString: 'Esc',

    // button labels
    soundToggleLabelString: 'Mute Sound',

    // alert for sim reset
    resetAllAlertString: 'Sim screen restarted, everything reset'

  };

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( SceneryPhetA11yStrings ); }

  sceneryPhet.register( 'SceneryPhetA11yStrings', SceneryPhetA11yStrings );

  return SceneryPhetA11yStrings;
} );