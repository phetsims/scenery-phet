// Copyright 2024, University of Colorado Boulder

/**
 * A drag listener that supports both pointer and keyboard input. It is composed with a RichPointerDragListener and a
 * RichKeyboardDragListener to support pointer input, alternative input, sounds, and other PhET-specific features.
 *
 * Be sure to dispose of this listener when it is no longer needed.
 *
 * Options that are common to both listeners are provided directly to this listener. Options that are specific to
 * a particular listener can be provided through the richPointerDragListenerOptions or richKeyboardDragListenerOptions.
 *
 * Typical PhET usage will use a position Property in a model coordinate frame and look like this:
 *
 *     // A focusable Node that can be dragged with pointer or keyboard.
 *     const draggableNode = new Node( {
 *       tagName: 'div',
 *       focusable: true
 *     } );
 *
 *     const richDragListener = new SoundRichDragListener( {
 *       positionProperty: someObject.positionProperty,
 *       transform: modelViewTransform
 *     } );
 *
 *     draggableNode.addInputListener( richDragListener );
 *
 * This listener works by implementing TInputListener and forwarding input events to the specific listeners. This is
 * how we support adding this listener through the scenery input listener API.
 *
 * @author Jesse Greenberg
 */

import { Hotkey, PressListenerEvent, SceneryEvent, TInputListener } from '../../scenery/js/imports.js';
import TProperty from '../../axon/js/TProperty.js';
import Vector2 from '../../dot/js/Vector2.js';
import Transform3 from '../../dot/js/Transform3.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import RichPointerDragListener, { PressedRichPointerDragListener, RichPointerDragListenerOptions } from './RichPointerDragListener.js';
import RichKeyboardDragListener, { RichKeyboardDragListenerOptions } from './RichKeyboardDragListener.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import { SoundClipOptions } from '../../tambo/js/sound-generators/SoundClip.js';
import { SoundGeneratorAddOptions } from '../../tambo/js/soundManager.js';
import grab_mp3 from '../../tambo/sounds/grab_mp3.js';
import release_mp3 from '../../tambo/sounds/release_mp3.js';
import SceneryPhetConstants from './SceneryPhetConstants.js';
import sceneryPhet from './sceneryPhet.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';

type SelfOptions = {

  // Called when the drag is started, for any input type. If you want to determine the type of input, you can check
  // SceneryEvent.isFromPDOM or SceneryEvent.type. If you need a start behavior for a specific form of input,
  // provide a start callback for that listener's options. It will be called IN ADDITION to this callback.
  start?: ( ( event: SceneryEvent, listener: RichPointerDragListener | RichKeyboardDragListener ) => void ) | null;

  // Called during the drag event, for any input type. If you want to determine the type of input, you can check
  // SceneryEvent.isFromPDOM or SceneryEvent.type. If you need a drag behavior for a specific form of input,
  // provide a drag callback for that listener's options. It will be called IN ADDITION to this callback.
  drag?: ( ( event: SceneryEvent, listener: RichPointerDragListener | RichKeyboardDragListener ) => void ) | null;

  // Called when the drag is ended, for any input type. If you want to determine the type of input, you can check
  // SceneryEvent.isFromPDOM or SceneryEvent.type. If you need an end behavior for a specific form of input,
  // provide an end callback for that listener's options. It will be called IN ADDITION to this callback. The event
  // may be null for cases of interruption.
  end?: ( ( event: SceneryEvent | null, listener: RichPointerDragListener | RichKeyboardDragListener ) => void ) | null;

  // If provided, it will be synchronized with the drag position in the model coordinate frame. The optional transform
  // is applied.
  positionProperty?: Pick<TProperty<Vector2>, 'value'> | null;

  // If provided, this will be used to convert between the parent (view) and model coordinate frames. Most useful
  // when you also provide a positionProperty.
  transform?: Transform3 | TReadOnlyProperty<Transform3> | null;

  // If provided, the model position will be constrained to these bounds.
  dragBoundsProperty?: TReadOnlyProperty<Bounds2 | null> | null;

  // If provided, this allows custom mapping from the desired position (i.e. where the pointer is, or where the
  // RichKeyboardListener will set the position) to the actual position that will be used.
  mapPosition?: null | ( ( point: Vector2 ) => Vector2 );

  // If true, the target Node will be translated during the drag operation.
  translateNode?: boolean;

  // Grab and release sounds. `null` means no sound.
  grabSound?: WrappedAudioBuffer | null;
  releaseSound?: WrappedAudioBuffer | null;

  // Passed to the grab and release SoundClip instances.
  grabSoundClipOptions?: SoundClipOptions;
  releaseSoundClipOptions?: SoundClipOptions;

  // addSoundGeneratorOptions
  grabSoundGeneratorAddOptions?: SoundGeneratorAddOptions;
  releaseSoundGeneratorAddOptions?: SoundGeneratorAddOptions;

  // Additional options for the RichPointerDragListener, OR any overrides for the RichPointerDragListener that should
  // be used instead of the above options. For example, if the RichPointerDragListener should have different
  // grab/release sounds, you can provide those options here.
  richPointerDragListenerOptions?: RichPointerDragListenerOptions;

  // Additional options for the RichKeyboardDragListener, OR any overrides for the RichKeyboardDragListener that should
  // be used instead of the above options. For example, if the RichKeyboardDragListener should have different
  // grab/release sounds, you can provide those options here.
  richKeyboardDragListenerOptions?: RichKeyboardDragListenerOptions;
};

export type RichDragListenerOptions = SelfOptions;

export default class SoundRichDragListener implements TInputListener {
  private readonly richPointerDragListener: RichPointerDragListener;
  private readonly richKeyboardDragListener: RichKeyboardDragListener;

  // True if the listener is currently pressed (RichPointerDragListener OR RichKeyboardDragListener).
  public readonly isPressedProperty: TReadOnlyProperty<boolean>;

  // Properties for each of the pressed states of the RichPointerDragListener and RichKeyboardDragListener.
  public readonly keyboardListenerPressedProperty: TReadOnlyProperty<boolean>;
  public readonly pointerListenerPressedProperty: TReadOnlyProperty<boolean>;

  // Implements TInputListener
  public readonly hotkeys: Hotkey[];

  public constructor( providedOptions?: RichDragListenerOptions ) {

    const options = optionize<RichDragListenerOptions>()( {

      // RichDragListenerOptions
      positionProperty: null,
      start: null,
      end: null,
      drag: null,
      transform: null,
      dragBoundsProperty: null,
      mapPosition: null,
      translateNode: false,
      grabSound: grab_mp3,
      releaseSound: release_mp3,
      grabSoundClipOptions: SceneryPhetConstants.DEFAULT_DRAG_CLIP_OPTIONS,
      releaseSoundClipOptions: SceneryPhetConstants.DEFAULT_DRAG_CLIP_OPTIONS,
      grabSoundGeneratorAddOptions: SceneryPhetConstants.DEFAULT_GRAB_SOUND_GENERATOR_ADD_OPTIONS,
      releaseSoundGeneratorAddOptions: SceneryPhetConstants.DEFAULT_GRAB_SOUND_GENERATOR_ADD_OPTIONS,
      richPointerDragListenerOptions: {},
      richKeyboardDragListenerOptions: {}
    }, providedOptions );

    // Options that will apply to both listeners.
    const sharedOptions = {
      positionProperty: options.positionProperty,
      transform: options.transform,
      dragBoundsProperty: options.dragBoundsProperty || undefined,
      mapPosition: options.mapPosition || undefined,
      translateNode: options.translateNode,
      grabSound: options.grabSound,
      releaseSound: options.releaseSound,
      grabSoundClipOptions: options.grabSoundClipOptions,
      releaseSoundClipOptions: options.releaseSoundClipOptions,
      grabSoundGeneratorAddOptions: options.grabSoundGeneratorAddOptions
    };

    //---------------------------------------------------------------------------------
    // Construct the RichPointerDragListener and combine its options.
    //---------------------------------------------------------------------------------
    const wrappedDragListenerStart = ( event: PressListenerEvent, listener: PressedRichPointerDragListener ) => {

      // when the drag listener starts, interrupt the keyboard dragging
      this.richKeyboardDragListener.interrupt();

      options.start && options.start( event, listener );
      options.richPointerDragListenerOptions.start && options.richPointerDragListenerOptions.start( event, listener );
    };

    const wrappedDragListenerDrag = ( event: PressListenerEvent, listener: PressedRichPointerDragListener ) => {
      options.drag && options.drag( event, listener );
      options.richPointerDragListenerOptions.drag && options.richPointerDragListenerOptions.drag( event, listener );
    };

    const wrappedDragListenerEnd = ( event: PressListenerEvent | null, listener: PressedRichPointerDragListener ) => {
      options.end && options.end( event, listener );
      options.richPointerDragListenerOptions.end && options.richPointerDragListenerOptions.end( event, listener );
    };

    const richPointerDragListenerOptions = combineOptions<RichPointerDragListenerOptions>(
      // target object
      {},
      // Options that apply to both, but can be overridden by provided listener-specific options
      sharedOptions,
      // Provided listener-specific options
      options.richPointerDragListenerOptions,
      // Options that cannot be overridden - see wrapped callbacks above
      {
        start: wrappedDragListenerStart,
        drag: wrappedDragListenerDrag,
        end: wrappedDragListenerEnd
      }
    );

    this.richPointerDragListener = new RichPointerDragListener( richPointerDragListenerOptions );

    //---------------------------------------------------------------------------------
    // Construct the RichKeyboardDragListener and combine its options.
    //---------------------------------------------------------------------------------
    const wrappedKeyboardListenerStart = ( event: SceneryEvent, listener: RichKeyboardDragListener ) => {

      // when the drag listener starts, interrupt the pointer dragging
      this.richPointerDragListener.interrupt();

      options.start && options.start( event, listener );
      options.richKeyboardDragListenerOptions.start && options.richKeyboardDragListenerOptions.start( event, listener );
    };

    const wrappedKeyboardListenerDrag = ( event: SceneryEvent, listener: RichKeyboardDragListener ) => {
      options.drag && options.drag( event, listener );
      options.richKeyboardDragListenerOptions.drag && options.richKeyboardDragListenerOptions.drag( event, listener );
    };

    const wrappedKeyboardListenerEnd = ( event: SceneryEvent | null, listener: RichKeyboardDragListener ) => {
      options.end && options.end( event, listener );
      options.richKeyboardDragListenerOptions.end && options.richKeyboardDragListenerOptions.end( event, listener );
    };

    const richKeyboardDragListenerOptions = combineOptions<RichKeyboardDragListenerOptions>(
      // target object
      {},
      // Options that apply to both, but can be overridden by provided listener-specific options
      sharedOptions,
      // Provided listener-specific options
      options.richKeyboardDragListenerOptions,
      // Options that cannot be overridden - see wrapped callbacks above
      {
        start: wrappedKeyboardListenerStart,
        drag: wrappedKeyboardListenerDrag,
        end: wrappedKeyboardListenerEnd
      }
    );

    this.richKeyboardDragListener = new RichKeyboardDragListener( richKeyboardDragListenerOptions );

    // The hotkeys from the keyboard listener are assigned to this listener so that they are activated for Nodes
    // where this listener is added.
    this.hotkeys = this.richKeyboardDragListener.hotkeys;

    this.isPressedProperty = DerivedProperty.or( [ this.richPointerDragListener.isPressedProperty, this.richKeyboardDragListener.isPressedProperty ] );
    this.keyboardListenerPressedProperty = this.richKeyboardDragListener.isPressedProperty;
    this.pointerListenerPressedProperty = this.richPointerDragListener.isPressedProperty;
  }

  public get isPressed(): boolean {
    return this.richPointerDragListener.isPressed || this.richKeyboardDragListener.isPressed;
  }

  public dispose(): void {
    this.isPressedProperty.dispose();

    this.richPointerDragListener.dispose();
    this.richKeyboardDragListener.dispose();
  }

  /**
   * ********************************************************************
   * Forward input to both listeners
   * ********************************************************************
   */
  public interrupt(): void {
    this.richPointerDragListener.interrupt();
    this.richKeyboardDragListener.interrupt();
  }

  /**
   * ********************************************************************
   * Forward to the KeyboardListener
   * ********************************************************************
   */
  public keydown( event: SceneryEvent<KeyboardEvent> ): void {
    this.richKeyboardDragListener.keydown( event );
  }

  public focusout( event: SceneryEvent ): void {
    this.richKeyboardDragListener.focusout( event );
  }

  public focusin( event: SceneryEvent ): void {
    this.richKeyboardDragListener.focusin( event );
  }

  public cancel(): void {
    this.richKeyboardDragListener.cancel();
  }

  /**
   * ********************************************************************
   * Forward to the DragListener
   * ********************************************************************
   */
  public click( event: SceneryEvent<MouseEvent> ): void {
    this.richPointerDragListener.click( event );
  }

  public touchenter( event: PressListenerEvent ): void {
    this.richPointerDragListener.touchenter( event );
  }

  public touchmove( event: PressListenerEvent ): void {
    this.richPointerDragListener.touchmove( event );
  }

  public focus( event: SceneryEvent<FocusEvent> ): void {
    this.richPointerDragListener.focus( event );
  }

  public blur(): void {
    this.richPointerDragListener.blur();
  }

  public down( event: PressListenerEvent ): void {
    this.richPointerDragListener.down( event );
  }

  public up( event: PressListenerEvent ): void {
    this.richPointerDragListener.up( event );
  }

  public enter( event: PressListenerEvent ): void {
    this.richPointerDragListener.enter( event );
  }

  public move( event: PressListenerEvent ): void {
    this.richPointerDragListener.move( event );
  }

  public exit( event: PressListenerEvent ): void {
    this.richPointerDragListener.exit( event );
  }

  public pointerUp( event: PressListenerEvent ): void {
    this.richPointerDragListener.pointerUp( event );
  }

  public pointerCancel( event: PressListenerEvent ): void {
    this.richPointerDragListener.pointerCancel( event );
  }

  public pointerMove( event: PressListenerEvent ): void {
    this.richPointerDragListener.pointerMove( event );
  }

  public pointerInterrupt(): void {
    this.richPointerDragListener.pointerInterrupt();
  }
}

sceneryPhet.register( 'SoundRichDragListener', SoundRichDragListener );