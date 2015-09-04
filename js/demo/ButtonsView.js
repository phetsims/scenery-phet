// Copyright 2002-2014, University of Colorado Boulder

/**
 * Demonstration of scenery-phet buttons
 *
 * @author Sam Reid
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RefreshButton = require( 'SCENERY_PHET/buttons/RefreshButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StarButton = require( 'SCENERY_PHET/buttons/StarButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );

  // constants
  var BUTTON_CAPTION_FONT = new PhetFont( 12 );
  var BUTTON_CAPTION_SPACING = 10; // space between buttons and their captions

  function ButtonsView() {
    ScreenView.call( this );

    // Refresh button
    var refreshButton = new RefreshButton( {
      listener: function() { console.log( 'Refresh pressed' ); },
      right: this.layoutBounds.width - 20,
      top: 10
    } );
    this.addChild( refreshButton );
    var refreshButtonLabel = new Text( 'Refresh: ', {
      font: BUTTON_CAPTION_FONT,
      right: refreshButton.left - 5,
      centerY: refreshButton.centerY
    } );
    this.addChild( refreshButtonLabel );

    // Return-to-level-selection button
    var returnToLevelSelectButton = new StarButton( {
      listener: function() { console.log( 'Return to Level Selection pressed' ); },
      centerX: refreshButton.centerX,
      top: refreshButton.bottom + BUTTON_CAPTION_SPACING
    } );
    this.addChild( returnToLevelSelectButton );
    var returnToLevelSelectButtonLabel = new Text( 'Return to Level Selection: ', {
      font: BUTTON_CAPTION_FONT,
      right: returnToLevelSelectButton.left - 5,
      centerY: returnToLevelSelectButton.centerY
    } );
    this.addChild( returnToLevelSelectButtonLabel );

    // Sound toggle button
    var soundEnableProperty = new Property( true );
    var soundToggleButton = new SoundToggleButton( soundEnableProperty, {
      centerX: refreshButton.centerX,
      top: returnToLevelSelectButton.bottom + BUTTON_CAPTION_SPACING * 5
    } );
    this.addChild( soundToggleButton );
    var soundToggleButtonLabel = new Text( 'Sound: ', {
      font: BUTTON_CAPTION_FONT,
      right: soundToggleButton.left - 5,
      centerY: soundToggleButton.centerY
    } );
    this.addChild( soundToggleButtonLabel );

    // Timer toggle button
    var timerEnableProperty = new Property( true );
    var timerToggleButton = new TimerToggleButton( timerEnableProperty, { centerX: refreshButton.centerX, y: soundToggleButton.bottom + 5 } );
    this.addChild( timerToggleButton );
    var timerToggleButtonLabel = new Text( 'Timer: ', {
      font: BUTTON_CAPTION_FONT,
      right: timerToggleButton.left - 5,
      centerY: timerToggleButton.centerY
    } );
    this.addChild( timerToggleButtonLabel );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        soundEnableProperty.reset();
        timerEnableProperty.reset();
      },
      radius: 22,
      right:  this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, ButtonsView );
} );