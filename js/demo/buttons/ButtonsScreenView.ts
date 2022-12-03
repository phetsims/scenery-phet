// Copyright 2014-2022, University of Colorado Boulder

/**
 * Demonstration of scenery-phet buttons
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { HBox, Text, VBox, VStrut } from '../../../../scenery/js/imports.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import BackButton from '../../buttons/BackButton.js';
import CloseButton from '../../buttons/CloseButton.js';
import EraserButton from '../../buttons/EraserButton.js';
import EyeToggleButton from '../../buttons/EyeToggleButton.js';
import InfoButton from '../../buttons/InfoButton.js';
import PlayPauseButton from '../../buttons/PlayPauseButton.js';
import PlayStopButton from '../../buttons/PlayStopButton.js';
import RecordStopButton from '../../buttons/RecordStopButton.js';
import RefreshButton from '../../buttons/RefreshButton.js';
import ResetAllButton from '../../buttons/ResetAllButton.js';
import ResetButton from '../../buttons/ResetButton.js';
import RestartButton from '../../buttons/RestartButton.js';
import SoundToggleButton from '../../buttons/SoundToggleButton.js';
import StarButton from '../../buttons/StarButton.js';
import StepBackwardButton from '../../buttons/StepBackwardButton.js';
import StepForwardButton from '../../buttons/StepForwardButton.js';
import TimerToggleButton from '../../buttons/TimerToggleButton.js';
import ZoomButton from '../../buttons/ZoomButton.js';
import MagnifyingGlassZoomButtonGroup from '../../MagnifyingGlassZoomButtonGroup.js';
import MoveToTrashButton from '../../buttons/MoveToTrashButton.js';
import MoveToTrashLegendButton from '../../buttons/MoveToTrashLegendButton.js';
import PhetFont from '../../PhetFont.js';
import PlusMinusZoomButtonGroup from '../../PlusMinusZoomButtonGroup.js';
import sceneryPhet from '../../sceneryPhet.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import TrashButton from '../../buttons/TrashButton.js';
import UndoButton from '../../buttons/UndoButton.js';
import CameraButton from '../../buttons/CameraButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type SelfOptions = EmptySelfOptions;
type ButtonsScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

export default class ButtonsScreenView extends ScreenView {

  public constructor( providedOptions: ButtonsScreenViewOptions ) {

    super( providedOptions );

    //------------------------------------------------------------------------------------------------------
    // Push buttons

    const pushButtons: ButtonNode[] = [];

    const backButton = new BackButton( {
      listener: () => console.log( 'BackButton pressed' )
    } );
    pushButtons.push( backButton );

    const closeButton = new CloseButton( {
      listener: () => console.log( 'CloseButton pressed' )
    } );
    pushButtons.push( closeButton );

    const eraserButton = new EraserButton( {
      listener: () => console.log( 'EraserButton pressed' )
    } );
    pushButtons.push( eraserButton );

    const resetButton = new ResetButton( {
      listener: () => console.log( 'ResetButton pressed' )
    } );
    pushButtons.push( resetButton );

    const restartButton = new RestartButton( {
      listener: () => console.log( 'RestartButton pressed' )
    } );
    pushButtons.push( restartButton );

    const starButton = new StarButton( {
      listener: () => console.log( 'StarButton pressed' )
    } );
    pushButtons.push( starButton );

    const stepBackwardButton = new StepBackwardButton( {
      listener: () => console.log( 'StepBackwardButton pressed' )
    } );
    pushButtons.push( stepBackwardButton );

    const stepForwardButton = new StepForwardButton( {
      listener: () => console.log( 'StepForwardButton pressed' )
    } );
    pushButtons.push( stepForwardButton );

    const zoomButton = new ZoomButton( {
      listener: () => console.log( 'ZoomButton pressed' )
    } );
    pushButtons.push( zoomButton );

    const infoButton = new InfoButton( {
      listener: () => console.log( 'InfoButton pressed' )
    } );
    pushButtons.push( infoButton );

    const refreshButton = new RefreshButton( {
      listener: () => console.log( 'RefreshButton pressed' )
    } );
    pushButtons.push( refreshButton );

    const trashButton = new TrashButton( {
      listener: () => console.log( 'TrashButton pressed' )
    } );
    pushButtons.push( trashButton );

    const moveToTrashButton = new MoveToTrashButton( {
      arrowColor: 'red',
      listener: () => console.log( 'MoveToTrashButton pressed' )
    } );
    pushButtons.push( moveToTrashButton );

    pushButtons.push( new MoveToTrashLegendButton( {
      arrowColor: 'red',
      listener: () => console.log( 'MoveToTrashLegendButton pressed' )
    } ) );

    const resetAllButton = new ResetAllButton( {
      listener: () => console.log( 'ResetAllButton pressed' )
    } );
    pushButtons.push( resetAllButton );

    const undoButton = new UndoButton( {
      listener: () => console.log( 'UndoButton pressed' )
    } );
    pushButtons.push( undoButton );

    const cameraButton = new CameraButton( {
      listener: () => console.log( 'cameraButton pressed' ),
      tandem: Tandem.OPT_OUT
    } );
    pushButtons.push( cameraButton );

    const pushButtonsHBox = new HBox( {
      children: pushButtons,
      spacing: 10,
      align: 'center',
      center: this.layoutBounds.center
    } );

    //------------------------------------------------------------------------------------------------------
    // Toggle buttons

    const toggleButtons: ButtonNode[] = [];

    // Add button properties here, so that resetAllButton functions properly.
    const toggleButtonProperties = {
      eyeOpenProperty: new Property( true ),
      isPlayingProperty: new Property( true ),
      stopButtonIsPlayingProperty: new Property( false ),
      recordingProperty: new Property( true ),
      soundEnabledProperty: new Property( true ),
      timerEnabledProperty: new Property( true )
    };

    const eyeButton = new EyeToggleButton( toggleButtonProperties.eyeOpenProperty );
    toggleButtonProperties.eyeOpenProperty.lazyLink(
      eyeOpen => console.log( `EyeToggleButton pressed, eyeOpen=${eyeOpen}` )
    );
    toggleButtons.push( eyeButton );

    const playPauseButton = new PlayPauseButton( toggleButtonProperties.isPlayingProperty );
    toggleButtonProperties.isPlayingProperty.lazyLink(
      playing => console.log( `PlayPauseButton pressed, playing=${playing}` )
    );
    toggleButtons.push( playPauseButton );

    const playStopButton = new PlayStopButton( toggleButtonProperties.stopButtonIsPlayingProperty );
    toggleButtonProperties.stopButtonIsPlayingProperty.lazyLink(
      playing => console.log( `PlayStopButton pressed, playing=${playing}` )
    );
    toggleButtons.push( playStopButton );

    const recordStopButton = new RecordStopButton( toggleButtonProperties.recordingProperty );
    toggleButtonProperties.recordingProperty.lazyLink(
      recording => console.log( `RecordStopButton pressed, recording=${recording}` )
    );
    toggleButtons.push( recordStopButton );

    const soundToggleButton = new SoundToggleButton( toggleButtonProperties.soundEnabledProperty );
    toggleButtonProperties.soundEnabledProperty.lazyLink(
      soundEnabled => console.log( `SoundToggleButton pressed, soundEnabled=${soundEnabled}` )
    );
    toggleButtons.push( soundToggleButton );

    const timerToggleButton = new TimerToggleButton( toggleButtonProperties.timerEnabledProperty );
    toggleButtonProperties.timerEnabledProperty.lazyLink(
      timerEnabled => console.log( `TimerToggleButton pressed, timerEnabled=${timerEnabled}` )
    );
    toggleButtons.push( timerToggleButton );

    const toggleButtonsHBox = new HBox( {
      children: toggleButtons,
      spacing: 10,
      align: 'center',
      center: this.layoutBounds.center
    } );

    //------------------------------------------------------------------------------------------------------
    // Button groups

    const buttonGroups = [];

    // Property shared by ZoomButtonGroups
    const zoomLevelProperty = new NumberProperty( 0, {
      range: new Range( 0, 5 )
    } );
    zoomLevelProperty.lazyLink( zoomLevel => console.log( `zoomLevel=${zoomLevel}` ) );

    // Spacing shared by ZoomButtonGroups
    // Change this value to see how pointer areas are adjusted to prevent overlap.
    // See https://github.com/phetsims/scenery-phet/issues/650
    const spacing = 0;

    const verticalPlusMinusZoomButtonGroup = new PlusMinusZoomButtonGroup( zoomLevelProperty, {
      orientation: 'vertical',
      spacing: spacing,
      mouseAreaXDilation: 5,
      mouseAreaYDilation: 10,
      touchAreaXDilation: 5,
      touchAreaYDilation: 10
    } );
    buttonGroups.push( verticalPlusMinusZoomButtonGroup );

    const horizontalPlusMinusZoomButtonGroup = new PlusMinusZoomButtonGroup( zoomLevelProperty, {
      orientation: 'horizontal',
      spacing: spacing,
      mouseAreaXDilation: 10,
      mouseAreaYDilation: 5,
      touchAreaXDilation: 10,
      touchAreaYDilation: 5
    } );
    buttonGroups.push( horizontalPlusMinusZoomButtonGroup );

    const verticalMagnifyingGlassZoomButtonGroup = new MagnifyingGlassZoomButtonGroup( zoomLevelProperty, {
      orientation: 'vertical',
      spacing: spacing,
      mouseAreaXDilation: 5,
      mouseAreaYDilation: 10,
      touchAreaXDilation: 5,
      touchAreaYDilation: 10
    } );
    buttonGroups.push( verticalMagnifyingGlassZoomButtonGroup );

    const horizontalMagnifyingGlassZoomButtonGroup = new MagnifyingGlassZoomButtonGroup( zoomLevelProperty, {
      orientation: 'horizontal',
      spacing: spacing,
      mouseAreaXDilation: 10,
      mouseAreaYDilation: 5,
      touchAreaXDilation: 10,
      touchAreaYDilation: 5
    } );
    buttonGroups.push( horizontalMagnifyingGlassZoomButtonGroup );

    const buttonGroupsHBox = new HBox( {
      children: buttonGroups,
      spacing: 20,
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
    const enabledCheckbox = new Checkbox( buttonsEnabledProperty, enabledText );

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
        new Text( 'Button groups:', { font: new PhetFont( 24 ) } ),
        buttonGroupsHBox,
        new VStrut( 20 ),
        new Text( 'Tests:', { font: new PhetFont( 24 ) } ),
        enabledCheckbox
      ],
      spacing: 10,
      center: this.layoutBounds.center
    } ) );
  }
}

sceneryPhet.register( 'ButtonsScreenView', ButtonsScreenView );