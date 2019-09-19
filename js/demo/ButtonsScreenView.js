// Copyright 2014-2019, University of Colorado Boulder

/**
 * Demonstration of scenery-phet buttons
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BackButton = require( 'SCENERY_PHET/buttons/BackButton' );
  const CloseButton = require( 'SCENERY_PHET/buttons/CloseButton' );
  const EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  const EyeToggleButton = require( 'SCENERY_PHET/buttons/EyeToggleButton' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const InfoButton = require( 'SCENERY_PHET/buttons/InfoButton' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LeftRightSpinner = require( 'SCENERY_PHET/LeftRightSpinner' );
  const MoveToTrashButton = require( 'SCENERY_PHET/MoveToTrashButton' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  const Property = require( 'AXON/Property' );
  const RecordStopButton = require( 'SCENERY_PHET/buttons/RecordStopButton' );
  const RefreshButton = require( 'SCENERY_PHET/buttons/RefreshButton' );
  const ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  const ResetButton = require( 'SCENERY_PHET/buttons/ResetButton' );
  const RewindButton = require( 'SCENERY_PHET/buttons/RewindButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const ScreenView = require( 'JOIST/ScreenView' );
  const SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  const StarButton = require( 'SCENERY_PHET/buttons/StarButton' );
  const StepBackwardButton = require( 'SCENERY_PHET/buttons/StepBackwardButton' );
  const StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  const Text = require( 'SCENERY/nodes/Text' );
  const TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  const UpDownSpinner = require( 'SCENERY_PHET/UpDownSpinner' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VStrut = require( 'SCENERY/nodes/VStrut' );
  const ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

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

    var infoButton = new InfoButton( {
      listener: function() { console.log( 'InfoButton pressed' ); }
    } );

    var refreshButton = new RefreshButton( {
      listener: function() { console.log( 'RefreshButton pressed' ); }
    } );

    var leftRightSpinnerProperty = new Property( 1 );
    var leftEnabledProperty = new Property( true );
    var rightEnabledProperty = new Property( true );

    var leftRightSpinner = new LeftRightSpinner( leftRightSpinnerProperty, leftEnabledProperty, rightEnabledProperty );

    leftRightSpinnerProperty.lazyLink( function( value ) {
      console.log( 'LeftRightSpinner: ' + value );
      if ( value >= 10 ) {
        rightEnabledProperty.set( false );
      }
      else if ( value <= 0 ) {
        leftEnabledProperty.set( false );
      }
      else {
        rightEnabledProperty.set( true );
        leftEnabledProperty.set( true );
      }
    } );

    var upDownSpinnerProperty = new Property( 1 );
    var upEnabledProperty = new Property( true );
    var downEnabledProperty = new Property( true );

    var upDownSpinner = new UpDownSpinner( upDownSpinnerProperty, upEnabledProperty, downEnabledProperty );

    upDownSpinnerProperty.lazyLink( function( value ) {
      console.log( 'UpDownSpinner: ' + value );
      if ( value >= 10 ) {
        upEnabledProperty.set( false );
      }
      else if ( value <= 0 ) {
        downEnabledProperty.set( false );
      }
      else {
        upEnabledProperty.set( true );
        downEnabledProperty.set( true );
      }
    } );

    var moveToTrashButton = new MoveToTrashButton( {
      scale: 2
    } );

    // Push buttons
    var pushButtons = new HBox( {
      children: [
        backButton,
        closeButton,
        eraserButton,
        resetButton,
        rewindButton,
        starButton,
        stepBackwardButton,
        stepForwardButton,
        zoomButton,
        infoButton,
        refreshButton,
        leftRightSpinner,
        upDownSpinner,
        moveToTrashButton
      ],
      spacing: 10,
      align: 'center',
      center: this.layoutBounds.center
    } );

    //------------------------------------------------------------------------------------------------------
    // Toggle buttons

    // Add button properties here, so that resetAllButton functions properly.
    var toggleButtonProperties = {
      eyeOpenProperty: new Property( true ),
      isPlayingProperty: new Property( true ),
      recordingProperty: new Property( true ),
      soundEnabledProperty: new Property( true ),
      timerEnabledProperty: new Property( true )
    };

    var eyeButton = new EyeToggleButton( toggleButtonProperties.eyeOpenProperty );
    toggleButtonProperties.eyeOpenProperty.lazyLink( function( eyeOpen ) {
      console.log( 'eyeOpen=' + eyeOpen );
    } );

    var playPauseButton = new PlayPauseButton( toggleButtonProperties.isPlayingProperty );
    toggleButtonProperties.isPlayingProperty.lazyLink( function( playing ) {
      console.log( 'playing=' + playing );
    } );

    var recordStopButton = new RecordStopButton( toggleButtonProperties.recordingProperty );
    toggleButtonProperties.recordingProperty.lazyLink( function( recording ) {
      console.log( 'recording=' + recording );
    } );

    var soundToggleButton = new SoundToggleButton( toggleButtonProperties.soundEnabledProperty );
    toggleButtonProperties.soundEnabledProperty.lazyLink( function( soundEnabled ) {
      console.log( 'soundEnabled=' + soundEnabled );
    } );

    var timerToggleButton = new TimerToggleButton( toggleButtonProperties.timerEnabledProperty );
    toggleButtonProperties.timerEnabledProperty.lazyLink( function( timerEnabled ) {
      console.log( 'timerEnabled=' + timerEnabled );
    } );

    // Toggle button
    var toggleButtons = new HBox( {
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

    this.addChild( new VBox( {
      align: 'left',
      children: [
        new Text( 'Push buttons:', { font: new PhetFont( 24 ) } ),
        pushButtons,
        new VStrut( 20 ),
        new Text( 'Toggle buttons:', { font: new PhetFont( 24 ) } ),
        toggleButtons
      ],
      spacing: 10,
      center: this.layoutBounds.center
    } ) );

    // Reset All button, in its usual lower-right position
    var resetAllButton = new ResetAllButton( {
      listener: function() {

        leftRightSpinnerProperty.reset();
        leftEnabledProperty.reset();
        rightEnabledProperty.reset();
        upDownSpinnerProperty.reset();
        upEnabledProperty.reset();
        downEnabledProperty.reset();

        // reset each Property in toggleButtonProperties
        for ( var property in toggleButtonProperties ) {
          if ( toggleButtonProperties.hasOwnProperty( property ) && ( toggleButtonProperties[ property ] instanceof Property ) ) {
            toggleButtonProperties[ property ].reset();
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