// Copyright 2014-2025, University of Colorado Boulder

/**
 * A round toggle button that displays some custom icon when playing and a triangular "Play" icon when not playing.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import optionize from '../../../phet-core/js/optionize.js';
import { PDOMValueType } from '../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import HotkeyData from '../../../scenery/js/input/HotkeyData.js';
import { OneKeyStroke } from '../../../scenery/js/input/KeyDescriptor.js';
import KeyboardListener from '../../../scenery/js/listeners/KeyboardListener.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import BooleanRoundToggleButton, { BooleanRoundToggleButtonOptions } from '../../../sun/js/buttons/BooleanRoundToggleButton.js';
import sharedSoundPlayers from '../../../tambo/js/sharedSoundPlayers.js';
import TSoundPlayer from '../../../tambo/js/TSoundPlayer.js';
import PlayIconShape from '../PlayIconShape.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetConstants from '../SceneryPhetConstants.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';

type SelfOptions = {

  radius?: number;

  // {Scale factor applied to the button when the "Play" button is shown (isPlayingProperty is false).
  // PhET convention is to increase the size of the "Play" button when interaction with the sim does NOT unpause the sim.
  scaleFactorWhenNotPlaying?: number;

  // pdom: If true, listener is added to toggle isPlayingProperty with key command "alt + k" regardless
  // of where focus is in the document. Only if the sim supports Interactive Description.
  includeGlobalHotkey?: boolean;

  // Label for the button in the PDOM when the button will set isPlayingProperty to true
  startPlayingAccessibleName?: PDOMValueType;

  // Label for the button in the PDOM when the button will set isPlayingProperty to false
  endPlayingAccessibleName?: PDOMValueType | null;

  // sound generation
  valueOffSoundPlayer?: TSoundPlayer;
  valueOnSoundPlayer?: TSoundPlayer;
};

export type PlayControlButtonOptions = SelfOptions & BooleanRoundToggleButtonOptions;

export default class PlayControlButton extends BooleanRoundToggleButton {

  private readonly disposePlayStopButton: () => void;

  /**
   * @param isPlayingProperty
   * @param endPlayingIcon - icon for the button when pressing it will stop play
   * @param providedOptions
   */
  public constructor( isPlayingProperty: Property<boolean>, endPlayingIcon: Node, providedOptions?: PlayControlButtonOptions ) {

    const options = optionize<PlayControlButtonOptions, SelfOptions, BooleanRoundToggleButtonOptions>()( {

      // SelfOptions
      radius: SceneryPhetConstants.PLAY_CONTROL_BUTTON_RADIUS,
      scaleFactorWhenNotPlaying: 1,
      includeGlobalHotkey: false,
      startPlayingAccessibleName: SceneryPhetStrings.a11y.playControlButton.playStringProperty,
      endPlayingAccessibleName: null,
      valueOffSoundPlayer: sharedSoundPlayers.get( 'pause' ),
      valueOnSoundPlayer: sharedSoundPlayers.get( 'play' ),

      // It's dimensions are calculated dynamically based on radius below to make sure the play and pause buttons are
      // in sync.
      xMargin: 0,
      yMargin: 0

    }, providedOptions );

    assert && assert( options.scaleFactorWhenNotPlaying > 0, 'button scale factor must be greater than 0' );

    // play and pause icons are sized relative to the radius
    const playWidth = options.radius * 0.8;
    const playHeight = options.radius;

    const playPath = new Path( new PlayIconShape( playWidth, playHeight ), {
      fill: 'black',
      centerX: options.radius * 0.05, // move to right slightly since we don't want it exactly centered
      centerY: 0
    } );

    // put the play and stop symbols inside circles so they have the same bounds,
    // otherwise BooleanToggleNode will re-adjust their positions relative to each other
    const playCircle = new Circle( options.radius, {
      children: [ playPath ]
    } );

    endPlayingIcon.centerX = 0;
    endPlayingIcon.centerY = 0;

    const endPlayingCircle = new Circle( options.radius, {
      children: [ endPlayingIcon ]
    } );

    super( isPlayingProperty, endPlayingCircle, playCircle, options );

    const isPlayingListener = ( isPlaying: boolean, oldValue: boolean | null ) => {

      // pdom - accessible name for the button
      this.accessibleName = isPlaying ? options.endPlayingAccessibleName
                                      : options.startPlayingAccessibleName;

      // so we don't scale down the button immediately if isPlayingProperty is initially false
      const runningScale = oldValue === null ? 1 : 1 / options.scaleFactorWhenNotPlaying;
      this.scale( isPlaying ? runningScale : options.scaleFactorWhenNotPlaying );
    };
    isPlayingProperty.link( isPlayingListener );

    // a listener that toggles the isPlayingProperty with hotkey Alt+K, regardless of where focus is in the document
    let globalKeyboardListener: KeyboardListener<OneKeyStroke[]> | null = null;
    if ( options.includeGlobalHotkey && phet.chipper.queryParameters.supportsInteractiveDescription ) {
      globalKeyboardListener = KeyboardListener.createGlobal( this, {
        keyStringProperties: PlayControlButton.TOGGLE_PLAY_HOTKEY_DATA.keyStringProperties,
        fireOnDown: false,
        fire: () => {
          isPlayingProperty.set( !isPlayingProperty.get() );
          const soundPlayer = isPlayingProperty.get() ? options.valueOnSoundPlayer : options.valueOffSoundPlayer;
          if ( soundPlayer ) { soundPlayer.play(); }
        }
      } );
    }

    this.disposePlayStopButton = () => {
      if ( isPlayingProperty.hasListener( isPlayingListener ) ) {
        isPlayingProperty.unlink( isPlayingListener );
      }
      if ( globalKeyboardListener ) {
        globalKeyboardListener.dispose();
      }
    };
  }

  public override dispose(): void {
    this.disposePlayStopButton();
    super.dispose();
  }

  public static readonly TOGGLE_PLAY_HOTKEY_DATA = new HotkeyData( {
    keyStringProperties: [ new Property( 'alt+k' ) ],
    keyboardHelpDialogLabelStringProperty: SceneryPhetStrings.keyboardHelpDialog.timingControls.pauseOrPlayActionStringProperty,
    repoName: sceneryPhet.name,
    global: true
  } );
}

sceneryPhet.register( 'PlayControlButton', PlayControlButton );