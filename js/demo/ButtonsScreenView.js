// Copyright 2014-2020, University of Colorado Boulder

/**
 * Demonstration of scenery-phet buttons
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import Property from '../../../axon/js/Property.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import inherit from '../../../phet-core/js/inherit.js';
import HBox from '../../../scenery/js/nodes/HBox.js';
import Text from '../../../scenery/js/nodes/Text.js';
import VBox from '../../../scenery/js/nodes/VBox.js';
import VStrut from '../../../scenery/js/nodes/VStrut.js';
import Checkbox from '../../../sun/js/Checkbox.js';
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
import MoveToTrashButton from '../MoveToTrashButton.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @constructor
 */
function ButtonsScreenView() {

  ScreenView.call( this );

  //------------------------------------------------------------------------------------------------------
  // Push buttons

  const pushButtons = [];

  const backButton = new BackButton( {
    listener: function() { console.log( 'BackButton pressed' ); }
  } );
  pushButtons.push( backButton );

  const closeButton = new CloseButton( {
    listener: function() { console.log( 'CloseButton pressed' ); }
  } );
  pushButtons.push( closeButton );

  const eraserButton = new EraserButton( {
    listener: function() { console.log( 'EraserButton pressed' ); }
  } );
  pushButtons.push( eraserButton );

  const resetButton = new ResetButton( {
    listener: function() { console.log( 'ResetButton pressed' ); }
  } );
  pushButtons.push( resetButton );

  const restartButton = new RestartButton( {
    listener: function() { console.log( 'RestartButton pressed' ); }
  } );
  pushButtons.push( restartButton );

  const starButton = new StarButton( {
    listener: function() { console.log( 'StarButton pressed' ); }
  } );
  pushButtons.push( starButton );

  const stepBackwardButton = new StepBackwardButton( {
    listener: function() { console.log( 'StepBackwardButton pressed' ); }
  } );
  pushButtons.push( stepBackwardButton );

  const stepForwardButton = new StepForwardButton( {
    listener: function() { console.log( 'StepForwardButton pressed' ); }
  } );
  pushButtons.push( stepForwardButton );

  const zoomButton = new ZoomButton( {
    listener: function() { console.log( 'ZoomButton pressed' ); }
  } );
  pushButtons.push( zoomButton );

  const infoButton = new InfoButton( {
    listener: function() { console.log( 'InfoButton pressed' ); }
  } );
  pushButtons.push( infoButton );

  const refreshButton = new RefreshButton( {
    listener: function() { console.log( 'RefreshButton pressed' ); }
  } );
  pushButtons.push( refreshButton );

  const moveToTrashButton = new MoveToTrashButton( {
    arrowColor: 'red',
    scale: 2
  } );
  pushButtons.push( moveToTrashButton );

  const resetAllButton = new ResetAllButton();
  pushButtons.push( resetAllButton );

  const pushButtonsHBox = new HBox( {
    children: pushButtons,
    spacing: 10,
    align: 'center',
    center: this.layoutBounds.center
  } );

  //------------------------------------------------------------------------------------------------------
  // Toggle buttons

  const toggleButtons = [];

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
  toggleButtons.push( eyeButton );

  const playPauseButton = new PlayPauseButton( toggleButtonProperties.isPlayingProperty );
  toggleButtonProperties.isPlayingProperty.lazyLink( function( playing ) {
    console.log( 'playing=' + playing );
  } );
  toggleButtons.push( playPauseButton );

  const recordStopButton = new RecordStopButton( toggleButtonProperties.recordingProperty );
  toggleButtonProperties.recordingProperty.lazyLink( function( recording ) {
    console.log( 'recording=' + recording );
  } );
  toggleButtons.push( recordStopButton );

  const soundToggleButton = new SoundToggleButton( toggleButtonProperties.soundEnabledProperty );
  toggleButtonProperties.soundEnabledProperty.lazyLink( function( soundEnabled ) {
    console.log( 'soundEnabled=' + soundEnabled );
  } );
  toggleButtons.push( soundToggleButton );

  const timerToggleButton = new TimerToggleButton( toggleButtonProperties.timerEnabledProperty );
  toggleButtonProperties.timerEnabledProperty.lazyLink( function( timerEnabled ) {
    console.log( 'timerEnabled=' + timerEnabled );
  } );
  toggleButtons.push( timerToggleButton );

  // Toggle button
  const toggleButtonsHBox = new HBox( {
    children: toggleButtons,
    spacing: 10,
    align: 'center',
    center: this.layoutBounds.center
  } );

  //------------------------------------------------------------------------------------------------------
  // enabledProperty

  const buttonsEnabledProperty = new BooleanProperty( true );
  buttonsEnabledProperty.link( enabled => {
    pushButtons.forEach( button => {
      button.enabled = enabled;
    } );
    toggleButtons.forEach( button => {
      button.enabled = enabled;
    } );
  } );

  const enabledText = new Text( 'Enabled', { font: new PhetFont( 22 ) } );
  const enabledCheckbox = new Checkbox( enabledText, buttonsEnabledProperty );

  //------------------------------------------------------------------------------------------------------
  // ScreenView layout

  this.addChild( new VBox( {
    align: 'left',
    children: [
      new Text( 'Push buttons:', { font: new PhetFont( 24 ) } ),
      pushButtonsHBox,
      new VStrut( 20 ),
      new Text( 'Toggle buttons:', { font: new PhetFont( 24 ) } ),
      toggleButtonsHBox,
      new VStrut( 20 ),
      new Text(  'Tests:', { font: new PhetFont( 24 ) }  ),
      enabledCheckbox
    ],
    spacing: 10,
    center: this.layoutBounds.center
  } ) );


}

sceneryPhet.register( 'ButtonsScreenView', ButtonsScreenView );

inherit( ScreenView, ButtonsScreenView );
export default ButtonsScreenView;