// Copyright 2014-2015, University of Colorado Boulder

/**
 * Demonstration of scenery-phet buttons
 *
 * @author Sam Reid
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var BackButton = require( 'SCENERY_PHET/buttons/BackButton' );
  var CloseButton = require( 'SCENERY_PHET/buttons/CloseButton' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var EyeToggleButton = require( 'SCENERY_PHET/buttons/EyeToggleButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var PropertySet = require( 'AXON/PropertySet' );
  var RecordStopButton = require( 'SCENERY_PHET/buttons/RecordStopButton' );
  var RefreshButton = require( 'SCENERY_PHET/buttons/RefreshButton' );
  var ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RewindButton = require( 'SCENERY_PHET/buttons/RewindButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StarButton = require( 'SCENERY_PHET/buttons/StarButton' );
  var StepButton = require( 'SCENERY_PHET/buttons/StepButton' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  /**
   * @constructor
   */
  function ButtonsView() {

    ScreenView.call( this );

    //------------------------------------------------------------------------------------------------------
    // Push buttons

    var arrowButton = new ArrowButton( 'left', function() { console.log( 'ArrowButton pressed' ); } );

    var backButton = new BackButton( {
      listener: function() { console.log( 'BackButton pressed' ); }
    } );

    var closeButton = new CloseButton( {
      listener: function() { console.log( 'CloseButton pressed' ); }
    } );

    var eraserButton = new EraserButton( {
      listener: function() { console.log( 'EraserButton pressed' ); }
    } );

    var refreshButton = new RefreshButton( {
      listener: function() { console.log( 'RefreshButton pressed' ); }
    } );

    var resetButton = new ResetButton( {
      listener: function() { console.log( 'ResetButton pressed' ); }
    } );

    var rewindButton = new RewindButton( {
      listener: function() { console.log( 'RewindButton pressed' ); }
    } );

    var starButton = new StarButton( {
      listener: function() { console.log( 'StarButton pressed' ); }
    } );

    var stepButton = new StepButton( {
      listener: function() { console.log( 'StepButton pressed' ); }
    } );

    var zoomButton = new ZoomButton( {
      listener: function() { console.log( 'ZoomButton pressed' ); }
    } );

    // Push buttons
    var pushButtons = new VBox( {
      children: [
        arrowButton,
        backButton,
        closeButton,
        eraserButton,
        refreshButton,
        resetButton,
        rewindButton,
        starButton,
        stepButton,
        zoomButton
      ],
      spacing: 10,
      align: 'center',
      center: this.layoutBounds.center
    } );

    //------------------------------------------------------------------------------------------------------
    // Toggle buttons

    // Add button properties here, so that resetAllButton functions properly.
    var buttonProperties = new PropertySet( {
      eyeOpen: true,
      playing: true,
      recording: true,
      soundEnabled: true,
      timerEnabled: true
    } );

    var eyeButton = new EyeToggleButton( buttonProperties.eyeOpenProperty );
    buttonProperties.eyeOpenProperty.lazyLink( function( eyeOpen ) {
      console.log( 'eyeOpen=' + eyeOpen );
    } );

    var playPauseButton = new PlayPauseButton( buttonProperties.playingProperty );
    buttonProperties.playingProperty.lazyLink( function( playing ) {
      console.log( 'playing=' + playing );
    } );

    var recordStopButton = new RecordStopButton( buttonProperties.recordingProperty );
    buttonProperties.recordingProperty.lazyLink( function( recording ) {
      console.log( 'recording=' + recording );
    } );

    var soundToggleButton = new SoundToggleButton( buttonProperties.soundEnabledProperty );
    buttonProperties.soundEnabledProperty.lazyLink( function( soundEnabled ) {
      console.log( 'soundEnabled=' + soundEnabled );
    } );

    var timerToggleButton = new TimerToggleButton( buttonProperties.timerEnabledProperty );
    buttonProperties.timerEnabledProperty.lazyLink( function( timerEnabled ) {
      console.log( 'timerEnabled=' + timerEnabled );
    } );

    // Toggle button
    var toggleButtons = new VBox( {
      children: [
        eyeButton,
        playPauseButton,
        recordStopButton,
        soundToggleButton,
        timerToggleButton
      ],
      spacing: 10,
      align: 'center',
      center: this.layoutBounds.center
    } );

    this.addChild( new HBox( {
      children: [ pushButtons, toggleButtons ],
      spacing: 100,
      align: 'top',
      center: this.layoutBounds.center
    } ) );

    // Reset All button, in its usual lower-right position
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        buttonProperties.reset();
      },
      radius: 22,
      right: this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( resetAllButton );
  }

  sceneryPhet.register( 'ButtonsView', ButtonsView );

  return inherit( ScreenView, ButtonsView );
} );