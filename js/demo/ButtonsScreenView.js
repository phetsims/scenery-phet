// Copyright 2014-2020, University of Colorado Boulder

/**
 * Demonstration of scenery-phet buttons
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import inherit from '../../../phet-core/js/inherit.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import VStrut from '../../../scenery/js/nodes/VStrut.js';
import BackButton from '../buttons/BackButton.js';
import CloseButton from '../buttons/CloseButton.js';
import EraserButton from '../buttons/EraserButton.js';
import EyeToggleButton from '../buttons/EyeToggleButton.js';
import InfoButton from '../buttons/InfoButton.js';
import PlayPauseButton from '../buttons/PlayPauseButton.js';
import RecordStopButton from '../buttons/RecordStopButton.js';
import RefreshButton from '../buttons/RefreshButton.js';
import ResetAllButton from '../buttons/ResetAllButton.js';
import ResetButton from '../buttons/ResetButton.js';
import RestartButton from '../buttons/RestartButton.js';
import SoundToggleButton from '../buttons/SoundToggleButton.js';
import StarButton from '../buttons/StarButton.js';
import StepBackwardButton from '../buttons/StepBackwardButton.js';
import StepForwardButton from '../buttons/StepForwardButton.js';
import TimerToggleButton from '../buttons/TimerToggleButton.js';
import ZoomButton from '../buttons/ZoomButton.js';
import LeftRightSpinner from '../LeftRightSpinner.js';
import MoveToTrashButton from '../MoveToTrashButton.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';
import UpDownSpinner from '../UpDownSpinner.js';

/**
 * @constructor
 */
function ButtonsScreenView() {

  ScreenView.call( this );

  //------------------------------------------------------------------------------------------------------
  // Push buttons

  const backButton = new BackButton( {
    listener: function() { console.log( 'BackButton pressed' ); }
  } );

  const closeButton = new CloseButton( {
    listener: function() { console.log( 'CloseButton pressed' ); }
  } );

  const eraserButton = new EraserButton( {
    listener: function() { console.log( 'EraserButton pressed' ); }
  } );

  const resetButton = new ResetButton( {
    listener: function() { console.log( 'ResetButton pressed' ); }
  } );

  const restartButton = new RestartButton( {
    listener: function() { console.log( 'RestartButton pressed' ); }
  } );

  const starButton = new StarButton( {
    listener: function() { console.log( 'StarButton pressed' ); }
  } );

  const stepBackwardButton = new StepBackwardButton( {
    listener: function() { console.log( 'StepBackwardButton pressed' ); }
  } );

  const stepForwardButton = new StepForwardButton( {
    listener: function() { console.log( 'StepForwardButton pressed' ); }
  } );

  const zoomButton = new ZoomButton( {
    listener: function() { console.log( 'ZoomButton pressed' ); }
  } );

  const infoButton = new InfoButton( {
    listener: function() { console.log( 'InfoButton pressed' ); }
  } );

  const refreshButton = new RefreshButton( {
    listener: function() { console.log( 'RefreshButton pressed' ); }
  } );

  const leftRightSpinnerProperty = new Property( 1 );
  const leftEnabledProperty = new Property( true );
  const rightEnabledProperty = new Property( true );

  const leftRightSpinner = new LeftRightSpinner( leftRightSpinnerProperty, leftEnabledProperty, rightEnabledProperty );

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

  const upDownSpinnerProperty = new Property( 1 );
  const upEnabledProperty = new Property( true );
  const downEnabledProperty = new Property( true );

  const upDownSpinner = new UpDownSpinner( upDownSpinnerProperty, upEnabledProperty, downEnabledProperty );

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

  const moveToTrashButton = new MoveToTrashButton( {
    scale: 2
  } );

  // Push buttons
  const pushButtons = new HBox( {
    children: [
      backButton,
      closeButton,
      eraserButton,
      resetButton,
      restartButton,
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
  const toggleButtonProperties = {
    eyeOpenProperty: new Property( true ),
    isPlayingProperty: new Property( true ),
    recordingProperty: new Property( true ),
    soundEnabledProperty: new Property( true ),
    timerEnabledProperty: new Property( true )
  };

  const eyeButton = new EyeToggleButton( toggleButtonProperties.eyeOpenProperty );
  toggleButtonProperties.eyeOpenProperty.lazyLink( function( eyeOpen ) {
    console.log( 'eyeOpen=' + eyeOpen );
  } );

  const playPauseButton = new PlayPauseButton( toggleButtonProperties.isPlayingProperty );
  toggleButtonProperties.isPlayingProperty.lazyLink( function( playing ) {
    console.log( 'playing=' + playing );
  } );

  const recordStopButton = new RecordStopButton( toggleButtonProperties.recordingProperty );
  toggleButtonProperties.recordingProperty.lazyLink( function( recording ) {
    console.log( 'recording=' + recording );
  } );

  const soundToggleButton = new SoundToggleButton( toggleButtonProperties.soundEnabledProperty );
  toggleButtonProperties.soundEnabledProperty.lazyLink( function( soundEnabled ) {
    console.log( 'soundEnabled=' + soundEnabled );
  } );

  const timerToggleButton = new TimerToggleButton( toggleButtonProperties.timerEnabledProperty );
  toggleButtonProperties.timerEnabledProperty.lazyLink( function( timerEnabled ) {
    console.log( 'timerEnabled=' + timerEnabled );
  } );

  // Toggle button
  const toggleButtons = new HBox( {
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
  const resetAllButton = new ResetAllButton( {
    listener: function() {

      leftRightSpinnerProperty.reset();
      leftEnabledProperty.reset();
      rightEnabledProperty.reset();
      upDownSpinnerProperty.reset();
      upEnabledProperty.reset();
      downEnabledProperty.reset();

      // reset each Property in toggleButtonProperties
      for ( const property in toggleButtonProperties ) {
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

inherit( ScreenView, ButtonsScreenView );
export default ButtonsScreenView;