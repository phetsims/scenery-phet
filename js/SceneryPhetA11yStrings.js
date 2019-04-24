// Copyright 2017-2019, University of Colorado Boulder

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

    //------------------------------------------------------------------------
    // Sim Section strings
    //------------------------------------------------------------------------

    // screen summary intro for a multiscreen sim (not sim specific),
    // extra space at end for string concat with rest of the screen summary
    screenSummaryMultiScreenIntro: {
      value: 'This is an interactive sim. It changes as you play with it. Each screen has a Play Area and Control Area. '
    },

    // screen summary intro for a single screen sim (not sim specific),
    screenSummarySingleScreenIntroPattern: {
      value: '{{sim}} is an interactive sim. It changes as you play with it. It has a Play Area and a Control Area. '
    },
    // screen summary intro for a single screen sim (not sim specific),
    screenSummaryKeyboardShortcutsHint: {
      value: 'If needed, check out keyboard shortcuts under Sim Resources.'
    },

    playArea: {
      value: 'Play Area'
    },
    controlArea: {
      value: 'Control Area'
    },

    //------------------------------------------------------------------------


    // button labels
    soundToggleLabelString: {
      value: 'Mute Sound'
    },
    resetAllLabelString: {
      value: 'Reset All'
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
    keyboardHelpDialogTabDescription: {
      value: 'Move to next item with Tab key.'
    },
    keyboardHelpDialogShiftTabDescription: {
      value: 'Move to previous item with Shift plus Tab key.'
    },
    keyboardHelpDialogPressButtonsDescription: {
      value: 'Press buttons with Space key.'
    },
    keyboardHelpDialogGroupNavigationDescription: {
      value: 'Move between items in a group with Left and Right arrow keys or Up and Down Arrow keys.'
    },
    keyboardHelpDialogExitDialogDescription: {
      value: 'Exit a dialog with Escape key.'
    },
    toggleCheckboxesDescription: {
      value: 'Toggle checkboxes with Space key.'
    },

    // help descriptions for sliders
    keyboardHelpDialogAdjustDefaultStepsString: {
      value: 'Adjust slider with Left and Right arrow keys, or Up and Down arrow keys.'
    },
    keyboardHelpDialogAdjustSmallerStepsString: {
      value: 'Adjust in smaller steps with Shift plus Left or Right arrow key, or Shift plus Up or Down arrow key.'
    },
    keyboardHelpDialogAdjustLargerStepsString: {
      value: 'Adjust in larger steps with Page Up or Page Down key.'
    },
    keyboardHelpDialogJumpToHomeString: {
      value: 'Jump to minimum with Home key.'
    },
    keyboardHelpDialogJumpToEndString: {
      value: 'Jump to maximum with End key.'
    },

    // PlayPauseButton
    playString: {
      value: 'Play'
    },
    pauseString: {
      value: 'Pause'
    },
    playDescriptionString: {
      value: 'Resume what is happening in the Play Area'
    },
    pauseDescriptionString: {
      value: 'Pause what is happening in the Play Area'
    },
    // StepButton
    stepString: {
      'value': 'Step'
    },
    stepDescriptionString: {
      'value': 'Pause and resume stream with every press.'
    },


    //------------------------------------------------------------------------
    // MovementDescriber strings
    //------------------------------------------------------------------------

    down: {
      value: 'down'
    },
    left: {
      value: 'left'
    },
    right: {
      value: 'right'
    },
    up: {
      value: 'up'
    },

    leftBorderAlert: {
      value: 'At left edge'
    },
    rightBorderAlert: {
      value: 'At right edge'
    },
    topBorderAlert: {
      value: 'At top'
    },
    bottomBorderAlert: {
      value: 'At bottom'
    },

    //------------------------------------------------------------------------
    // A11yGrabDragNode strings
    //------------------------------------------------------------------------
    grabPattern: {
      value: 'Grab {{objectToGrab}}'
    },
    movablePattern: {
      value: 'Movable {{objectToGrab}}'
    },
    defaultObjectToGrab: {
      value: 'Object'
    },
    released: {
      value: 'Released.'
    },
    grabOrReleaseDescriptionPattern: {
      value: 'Grab or release {{thing}} with Space or Enter keys.'
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