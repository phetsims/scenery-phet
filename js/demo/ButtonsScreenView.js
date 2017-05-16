// Copyright 2014-2016, University of Colorado Boulder

/**
 * Demonstration of scenery-phet buttons
 *
 * @author Sam Reid
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var BackButton = require( 'SCENERY_PHET/buttons/BackButton' );
  var CloseButton = require( 'SCENERY_PHET/buttons/CloseButton' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var EyeToggleButton = require( 'SCENERY_PHET/buttons/EyeToggleButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var Property = require( 'AXON/Property' );
  var RecordStopButton = require( 'SCENERY_PHET/buttons/RecordStopButton' );
  var ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RewindButton = require( 'SCENERY_PHET/buttons/RewindButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StarButton = require( 'SCENERY_PHET/buttons/StarButton' );
  var StepBackwardButton = require( 'SCENERY_PHET/buttons/StepBackwardButton' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  /**
   * @constructor
   */
  function ButtonsScreenView() {

    ScreenView.call( this );

    //------------------------------------------------------------------------------------------------------
    // Push buttons

    var backButton = new BackButton( {
      listener: function() { console.log( 'BackButton pressed' ); }
    } );

    var closeButton = new CloseButton( {
      listener: function() { console.log( 'CloseButton pressed' ); }
    } );

    var eraserButton = new EraserButton( {
      listener: function() { console.log( 'EraserButton pressed' ); }
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

    var stepBackwardButton = new StepBackwardButton( {
      listener: function() { console.log( 'StepBackwardButton pressed' ); }
    } );

    var stepForwardButton = new StepForwardButton( {
      listener: function() { console.log( 'StepForwardButton pressed' ); }
    } );

    var zoomButton = new ZoomButton( {
      listener: function() { console.log( 'ZoomButton pressed' ); }
    } );

    // Push buttons
    var pushButtons = new VBox( {
      children: [
        backButton,
        closeButton,
        eraserButton,
        resetButton,
        rewindButton,
        starButton,
        stepBackwardButton,
        stepForwardButton,
        zoomButton
      ],
      spacing: 10,
      align: 'center',
      center: this.layoutBounds.center
    } );

    //------------------------------------------------------------------------------------------------------
    // Toggle buttons

    // Add button properties here, so that resetAllButton functions properly.
    var buttonProperties = {
      eyeOpenProperty: new Property( true ),
      playingProperty: new Property( true ),
      recordingProperty: new Property( true ),
      soundEnabledProperty: new Property( true ),
      timerEnabledProperty: new Property( true )
    };

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

        // reset each Property in buttonProperties
        for ( var property in buttonProperties ) {
          if ( buttonProperties.hasOwnProperty( property ) && ( buttonProperties[ property ] instanceof Property ) ) {
            buttonProperties[ property ].reset();
          }
        }
      },
      radius: 22,
      right: this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( resetAllButton );
  }

  sceneryPhet.register( 'ButtonsScreenView', ButtonsScreenView );

  return inherit( ScreenView, ButtonsScreenView );
} );