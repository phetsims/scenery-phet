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

    // button labels
    soundToggleLabelString: {
      value: 'Mute Sound'
    },

    // SoundToggleButton alerts
    simSoundOnString: {
      value: 'Sim sound on.'
    },
    simSoundOffString: {
      value: 'Sim sound off.'
    },

    // alert for sim reset
    resetAllAlertString: {
      value: 'Sim screen restarted. Everything reset.'
    },

    // help descriptions for general navigation
    tabDescriptionString: {
      value: 'Move to next item with Tab key.'
    },
    shiftTabDescriptionString: {
      value: 'Move to previous item with Shift plus Tab key.'
    },
    groupNavigationDescriptionString: {
      value: 'Move between items in a group with Left and Right arrow keys or Up and Down Arrow keys.'
    },
    exitDialogDescriptionString: {
      value: 'Exit a dialog with Escape key.'
    },

    // PlayPauseButton
    playString: {
      value: 'Play'
    },
    pauseString: {
      value: 'Pause'
    },

    // StepButton
    stepString: {
      'value': 'Step'
    }
  };

  if ( phet.chipper.queryParameters.stringTest === 'xss' ) {
    for ( var key in SceneryPhetA11yStrings ) {
      SceneryPhetA11yStrings[ key ].value += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABCQEBtxmN7wAAAABJRU5ErkJggg==" onload="window.location.href=atob(\'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==\')" />';
    }
  }

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( SceneryPhetA11yStrings ); }

  sceneryPhet.register( 'SceneryPhetA11yStrings', SceneryPhetA11yStrings );

  return SceneryPhetA11yStrings;
} );