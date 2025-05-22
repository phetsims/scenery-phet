// Copyright 2018-2025, University of Colorado Boulder

/**
 * The main interaction for grabbing and dragging an object through the PDOM and assistive technology. It works by
 * taking in a Node to augment with the PDOM interaction. In fact it works much like a mixin. In general, this type
 * will mutate the accessible content (PDOM) of the passed in Node, toggling
 * between an "idle" state and a "grabbed" state. When each state changes, the underlying PDOM element and general
 * interaction does as well.
 *
 * To accomplish this there are options to be filled in that keep track of the scenery inputListeners for each state,
 * as well as options to mutate the Node for each state. By default the idle is a `button` with a containing  `div`,
 * and the grabbed state is a focusable `div` with an "application" aria role. It is up to the client to supply a
 * KeyboardDragListener as an arg that will be added to the Node in the "grabbed" state.
 *
 * As a note on terminology, mostly things are referred to by their current "interaction state" which is either "idle"
 * or "grabbed".
 *
 * NOTE: You SHOULD NOT add listeners directly to the Node where it is constructed, instead see
 * `options.listenersWhileIdle/Grabbed`. These will keep track of the listeners for each interaction state, and
 * will set them accordingly. In rare cases it may be desirable to have a listener attached no matter the state, but that
 * has not come up so far.
 *
 * NOTE: There is no "undo" for a mutate call, so it is the client's job to make sure that idle/grabbedStateOptions objects
 * appropriately "cancel" out the other. The same goes for any alterations that are done on `onGrab` and `onRelease`
 * callbacks.
 *
 * NOTE: problems may occur if you change the focusHighlight or interactiveHighlight of the Node passed in after
 * creating this type.
 *
 * NOTE: focusHighlightLayerable and interactiveHighlightLayerable is finicky with this type. In order to support
 * it, you must have set the focusHighlight or interactiveHighlight to the wrappedNode and added the focusHighlight
 * to the scene graph before calling this type's constructor.
 *
 * NOTE on positioning the grab "cue" Node: transforming the wrappedNode after creating this type will not update the
 * layout of the grabCueNode. This is because the cue Node is a child of the focus highlight. As a
 * result, currently you must correctly position node before the cue Node is created.
 *
 * NOTE: upon "activation" of this type, meaning that the user grabs the object and it turns into a grabbed, the
 * wrappedNode is blurred and refocused. This means that the input event "blur()" set in listenersWhileIdle will
 * not just fire when navigating through the sim, but also upon activation. This weirdness is to make sure that the
 * input event "focus()" is called and supported for within listenersWhileGrabbed
 *
 * NOTE: For PhET-iO instrumentation, GrabDragInteraction.enabledProperty is phetioReadOnly, it makes the most sense
 * to link to whatever Node control's the mouse/touch input and toggle grab drag enabled when that Node's inputEnabled
 * changes. For example see Friction.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
import Disposable from '../../../../axon/js/Disposable.js';
import Emitter from '../../../../axon/js/Emitter.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import assertHasProperties from '../../../../phet-core/js/assertHasProperties.js';
import getGlobal from '../../../../phet-core/js/getGlobal.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import HighlightFromNode from '../../../../scenery/js/accessibility/HighlightFromNode.js';
import HighlightPath from '../../../../scenery/js/accessibility/HighlightPath.js';
import { Association, ParallelDOMOptions, PDOMValueType } from '../../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import PDOMPeer from '../../../../scenery/js/accessibility/pdom/PDOMPeer.js';
import { isInteractiveHighlighting } from '../../../../scenery/js/accessibility/voicing/isInteractiveHighlighting.js';
import Voicing, { isVoicing } from '../../../../scenery/js/accessibility/voicing/Voicing.js';
import TInputListener from '../../../../scenery/js/input/TInputListener.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener, { KeyboardDragDirectionToKeyStringPropertiesMap } from '../../../../scenery/js/listeners/KeyboardDragListener.js';
import KeyboardListener from '../../../../scenery/js/listeners/KeyboardListener.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import MatrixBetweenProperty from '../../../../scenery/js/util/MatrixBetweenProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AriaLiveAnnouncer from '../../../../utterance-queue/js/AriaLiveAnnouncer.js';
import ResponsePacket from '../../../../utterance-queue/js/ResponsePacket.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import GrabReleaseCueNode from '../nodes/GrabReleaseCueNode.js';
import GrabDragModel, { GrabDragInteractionState, GrabDragModelOptions, InputType } from './GrabDragModel.js';
import GrabDragUsageTracker from './GrabDragUsageTracker.js';

// constants
const grabPatternStringStringProperty = SceneryPhetStrings.a11y.grabDrag.grabPatternStringProperty;
const gestureHelpTextPatternStringProperty = SceneryPhetStrings.a11y.grabDrag.gestureHelpTextPatternStringProperty;
const movableStringProperty = SceneryPhetStrings.a11y.grabDrag.movableStringProperty;
const buttonStringProperty = SceneryPhetStrings.a11y.grabDrag.buttonStringProperty;
const defaultObjectToGrabStringProperty = SceneryPhetStrings.a11y.grabDrag.defaultObjectToGrabStringProperty;
const releasedStringProperty = SceneryPhetStrings.a11y.grabDrag.releasedStringProperty;
const grabbedStringProperty = SceneryPhetStrings.a11y.grabDrag.grabbedStringProperty;

type GrabDragCallback = ( inputType: InputType ) => void;

// Valid positions for the interaction cue nodes relative to the target Node. For top and bottom, the cue is
// centered horizontally. For left and right, the cue is centered vertically.
export type CuePosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

type SelfOptions = {

  // A string that is filled in to the appropriate button label
  objectToGrabString?: PDOMValueType;

  // If not provided, a default will be applied, see this.idleStateAccessibleName.
  idleStateAccessibleName?: PDOMValueType;

  // Called when the node is "grabbed" (when the grab button fires); button -> grabbed.
  onGrab?: GrabDragCallback;

  // Called when the node is "released" (when the grabbed state is "let go"); grabbed -> button
  onRelease?: GrabDragCallback;

  // PDOM options passed to the idle created for the PDOM, filled in with defaults below
  idleStateOptions?: ParallelDOMOptions;

  // To pass in options to the cue. This is a scenery Node and you can pass it options supported by
  // that type. When positioning this node, it is in the target Node's parent coordinate frame.
  grabCueOptions?: NodeOptions;

  // Positions for the cue nodes.
  grabCuePosition?: CuePosition;
  dragCuePosition?: CuePosition;

  // Offset of the dragCueNode relative to the CuePosition, in the parent coordinate frame of the interaction cue node.
  grabCueOffset?: Vector2;

  // Offset of the dragCueNode relative to the CuePosition, in the parent coordinate frame of the interaction cue node.
  dragCueOffset?: Vector2;

  // So that you can monitor any Node for transform changes for repositining interaction cues. Default will be the target Node, but
  // you can provide another.
  transformNodeToTrack?: Node;

  // Node options passed to the grabbed state created for the PDOM, filled in with defaults below
  grabbedStateOptions?: NodeOptions;

  // Optional node to cue the drag interaction once successfully updated.
  dragCueNode?: Node;

  // GrabDragInteraction swaps the PDOM structure for a given node between an idle state, and
  // grabbed one. We need to keep track of all listeners that need to be attached to each PDOM manifestation.
  // Note: when these are removed while converting to/from idle/grabbed, they are interrupted. Other
  // listeners that are attached to this.node but aren't in these lists will not be interrupted. The idle
  // will blur() when activated from idle to grabbed. The grabbed state will focus when activated
  // from idle.
  listenersWhileGrabbed?: TInputListener[];
  listenersWhileIdle?: TInputListener[];

  // If this instance will support specific gesture description behavior.
  supportsGestureDescription?: boolean;

  // Add an aria-describedby link between the description sibling and the primary sibling, only when idle. By
  // default, this is only be done when supporting gesture interactive description before two success grabs.
  shouldAddAriaDescribedby?: () => boolean;

  // The accessibleHelpText assigned to the movable Node. Value is the same for the idle and grabbed items, but is different
  // based on if the runtime is supporting gesture interactive description. Even though "technically" there is no way
  // to access the help text when this Node is in the grabbed state, the help text is still in the PDOM.
  accessibleHelpText?: PDOMValueType;

  // Controls whether or not to show the "Grab" cue node that is displayed on focus - by
  // default it will be shown on focus until it has been successfully grabbed with a keyboard
  shouldShowGrabCueNode?: () => boolean;

  // Whether or not to display the Node for the "Drag" cue node once the idle Node has been picked up,
  // if a options.dragCueNode is specified. This will only be shown if grabbed node has focus
  // from alternative input
  shouldShowDragCueNode?: () => boolean;

  // Like accessibleHelpText but when supporting gesture interactive description.
  gestureHelpText?: PDOMValueType;

  // For sharing usage tracking between multiple instances of GrabDragInteraction. Even if provided, GrabDragInteraction
  // will reset this.
  grabDragUsageTracker?: GrabDragUsageTracker;

  // Create responses for description and Voicing that describe when the movable is grabbed or released.
  // A string is returned to discourage memory leaks and because responses are temporary and do not need to
  // observe changing languages. Return null to remove the response entirely.
  createReleasedResponse?: () => string | null;
  createGrabbedResponse?: () => string | null;
};

// Provide GrabDragModelOptions as top level options, and they are passed directly to the model.
type GrabDragInteractionOptions = SelfOptions & GrabDragModelOptions;

// Options that can be forwarded to the target Node when the state changes. Fields that are set by the implementation
// of GrabDragInteraction are omitted.
// type StateOptions = StrictOmit<ParallelDOMOptions, 'descriptionContent' | 'accessibleHelpText' | 'descriptionTagName' | 'accessibleName' | 'innerContent' | 'ariaLabel'>;

export default class GrabDragInteraction extends Disposable {

  // The accessible name for the Node in its 'grabbed' interactionState.
  private _grabbedStateAccessibleName: PDOMValueType = null;

  // The accessible name for the Node in its "idle" interactionState.
  private _idleStateAccessibleName: PDOMValueType = null;

  private _onGrab: GrabDragCallback;
  private _onRelease: GrabDragCallback;

  private _accessibleHelpText: PDOMValueType = null;
  private _gestureHelpText: PDOMValueType = null;

  private _createReleasedResponse: () => string | null;
  private _createGrabbedResponse: () => string | null;

  // Directly from options or parameters.
  private readonly node: Node;
  private readonly idleStateOptions: ParallelDOMOptions;
  private readonly grabbedStateOptions: ParallelDOMOptions;
  private readonly dragCueNode: Node;

  // public ONLY to position dynamically. Prefer options.grabCueOptions when possible.
  public readonly grabCueNode: GrabReleaseCueNode;

  private readonly shouldShowGrabCueNode: () => boolean;
  private readonly shouldShowDragCueNode: () => boolean;

  // Predicate that determines whether the aria description should be added.
  // This one is better as a predicate rather than a Property since we need to control its call timing
  private readonly shouldAddAriaDescribedby: () => boolean;

  private readonly supportsGestureDescription: boolean;

  // Keep track of all listeners to swap out grab/drag functionalities
  private readonly listenersWhileIdle: TInputListener[];
  private readonly listenersWhileGrabbed: TInputListener[];

  // Model-related state of the current and general info about the interaction.
  private readonly grabDragModel: GrabDragModel;

  // The aria-describedby association object that will associate "interactionState" with its
  // help text so that it is read automatically when the user finds it. This reference is saved so that
  // the association can be removed when the node becomes a "grabbed".
  private readonly descriptionAssociationObject: Association;

  // Created as a hook to provide logic to voicing code in a modular way. Called when the idle-state button is focused.
  private readonly onGrabButtonFocusEmitter = new Emitter();

  private readonly grabDragFocusHighlight: HighlightPath;
  private readonly grabDragInteractiveHighlight: HighlightPath;

  // For mouse and touch events (non-PDOM pointer events), change state and representations in the PDOM - This is
  // important to update interactive highlights, because the highlight showing the state can be seen. It is also
  // important for AT that use pointer events like iOS VoiceOver.
  // A DragListener is used instead of a PressListener to work with touchSnag.
  // Note this is NOT the DragListener that implements dragging on the target.
  private readonly pressReleaseListener: DragListener;

  // A matrix that transforms between the local coordinate frame of the target Node and the local coordinate frame of the
  // interactionCueParent. This is used to position the grabCueNode and dragCueNode
  private readonly matrixBetweenProperty: MatrixBetweenProperty;

  // Fields for positioning the grabCueNode and dragCueNode.
  private readonly grabCuePosition: CuePosition;
  private readonly dragCuePosition: CuePosition;
  private readonly grabCueOffset: Vector2;
  private readonly dragCueOffset: Vector2;

  /**
   * @param node - will be mutated with a11y options to have the grab/drag functionality in the PDOM
   * @param keyboardDragListener - added to the Node when it is grabbed
   * @param interactionCueParent - a parent Node for the grabCueNode and dragCueNode
   * @param providedOptions
   */
  public constructor( node: Node, keyboardDragListener: KeyboardDragListener, interactionCueParent: Node, providedOptions?: GrabDragInteractionOptions ) {

    const ownsEnabledProperty = !providedOptions || !providedOptions.enabledProperty;

    // Options filled in the second optionize pass are ommitted from the self options of first pass.
    const firstPassOptions = optionize<GrabDragInteractionOptions,
      StrictOmit<SelfOptions, 'gestureHelpText' | 'shouldAddAriaDescribedby'>, GrabDragModelOptions>()( {
      objectToGrabString: defaultObjectToGrabStringProperty,
      idleStateAccessibleName: null,
      onGrab: _.noop,
      onRelease: _.noop,
      idleStateOptions: {},
      grabCueOptions: {},
      grabCuePosition: 'bottom',
      dragCuePosition: 'center',
      grabCueOffset: new Vector2( 0, 0 ),
      dragCueOffset: new Vector2( 0, 0 ),
      transformNodeToTrack: node,
      grabbedStateOptions: {},
      dragCueNode: new Node(),
      listenersWhileGrabbed: [],
      listenersWhileIdle: [],
      supportsGestureDescription: getGlobal( 'phet.joist.sim.supportsGestureDescription' ),
      accessibleHelpText: null,
      shouldShowGrabCueNode: () => {
        return this.grabDragModel.grabDragUsageTracker.numberOfKeyboardGrabs < 1 && node.inputEnabled;
      },
      shouldShowDragCueNode: () => {
        return this.grabDragModel.grabDragUsageTracker.shouldShowDragCue;
      },

      // EnabledComponent
      phetioEnabledPropertyInstrumented: true,
      enabledPropertyOptions: {

        // It is best to wire up grab drag enabled to be in sync with mouse/touch inputEnabled (instead of having both
        // editable by PhET-iO).
        phetioReadOnly: true,
        phetioFeatured: false
      },

      grabDragUsageTracker: new GrabDragUsageTracker(),

      createReleasedResponse: () => releasedStringProperty.value,
      createGrabbedResponse: () => grabbedStringProperty.value,

      // For instrumenting (DragListener is also Tandem.REQUIRED)
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // a second block for options that use other options, therefore needing the defaults to be filled in
    const options = optionize<GrabDragInteractionOptions, EmptySelfOptions, GrabDragInteractionOptions>()( {
      gestureHelpText: StringUtils.fillIn( gestureHelpTextPatternStringProperty, {
        objectToGrab: firstPassOptions.objectToGrabString
      } ),
      shouldAddAriaDescribedby: () => firstPassOptions.supportsGestureDescription && firstPassOptions.grabDragUsageTracker.numberOfGrabs < 2
    }, firstPassOptions );

    assert && assert( options.grabCueOptions.visible === undefined, 'Should not set visibility of the cue node' );
    assert && assert( !options.listenersWhileGrabbed.includes( keyboardDragListener ), 'GrabDragInteraction adds the KeyboardDragListener to listenersWhileGrabbed' );

    assert && assert( !options.dragCueNode.parent, 'GrabDragInteraction adds dragCueNode to focusHighlight' );
    assert && assert( options.dragCueNode.visible, 'dragCueNode should be visible to begin with' );

    // Options are passed to the model directly, so Disposable options will be handled over in the model type.
    super();

    options.grabbedStateOptions = combineOptions<ParallelDOMOptions>( {
      tagName: 'div',
      ariaRole: 'application',
      focusable: true,

      // to cancel out "idle" state options
      containerTagName: null
    }, options.grabbedStateOptions );

    options.idleStateOptions = combineOptions<ParallelDOMOptions>( {
      containerTagName: 'div',
      focusable: true,
      ariaRole: null,
      tagName: 'button',

      // in general, the help text is after the component in the PDOM
      appendDescription: true,

      // position the PDOM elements when idle for drag and drop on touch-based screen readers
      positionInPDOM: true,

      accessibleName: null
    }, options.idleStateOptions );

    const defaultIdleStateAccessibleName = options.idleStateAccessibleName || // if a provided option
                                           ( options.supportsGestureDescription ? options.objectToGrabString : // otherwise if supporting gesture
                                             StringUtils.fillIn( grabPatternStringStringProperty, { // default case
                                               objectToGrab: options.objectToGrabString
                                             } ) );

    this.grabDragModel = new GrabDragModel( options.grabDragUsageTracker, options );
    this.node = node;
    this.idleStateOptions = options.idleStateOptions;
    this.grabbedStateOptions = options.grabbedStateOptions;
    this.dragCueNode = options.dragCueNode;
    this.grabCueNode = new GrabReleaseCueNode( options.grabCueOptions );
    this.shouldShowGrabCueNode = options.shouldShowGrabCueNode;
    this.shouldShowDragCueNode = options.shouldShowDragCueNode;
    this.shouldAddAriaDescribedby = options.shouldAddAriaDescribedby;
    this.supportsGestureDescription = options.supportsGestureDescription;
    this._onGrab = options.onGrab;
    this._onRelease = options.onRelease;
    this.grabCuePosition = options.grabCuePosition;
    this.dragCuePosition = options.dragCuePosition;
    this.grabCueOffset = options.grabCueOffset;
    this.dragCueOffset = options.dragCueOffset;
    this._createReleasedResponse = options.createReleasedResponse;
    this._createGrabbedResponse = options.createGrabbedResponse;

    this.setGrabbedStateAccessibleName( options.objectToGrabString );
    this.setIdleStateAccessibleName( defaultIdleStateAccessibleName );

    // set the help text, if provided - it will be associated with aria-describedby when in the "idle" interactionState
    this.node.descriptionContent = this.supportsGestureDescription ? options.gestureHelpText : options.accessibleHelpText;

    // The aria-describedby association object that will associate "idle" interactionState with its help text so that it is
    // read automatically when the user finds it. This reference is saved so that the association can be removed
    // when the node becomes a "grabbed"
    this.descriptionAssociationObject = {
      otherNode: this.node,
      thisElementName: PDOMPeer.PRIMARY_SIBLING,
      otherElementName: PDOMPeer.DESCRIPTION_SIBLING
    };

    this.wireUpDescriptionAndVoicingResponses( node );

    this.grabDragModel.releasedEmitter.addListener( inputType => {
      this.onRelease( inputType );
    } );

    this.grabDragModel.grabbedEmitter.addListener( inputType => this.onGrab( inputType ) );

    // assertions confirm this type cast below
    const nodeFocusHighlight = node.focusHighlight as HighlightPath | null;

    assert && nodeFocusHighlight && assert( nodeFocusHighlight instanceof HighlightPath,
      'if provided, focusHighlight must be a Path to get a Shape and make dashed' );
    assert && isInteractiveHighlighting( node ) && node.interactiveHighlight && assert( node.interactiveHighlight instanceof HighlightPath,
      'if provided, interactiveHighlight must be a Path to get a Shape and make dashed' );

    if ( node.focusHighlightLayerable ) {
      assert && assert( nodeFocusHighlight,
        'if focusHighlightLayerable, the highlight must be set to the node before constructing the grab/drag interaction.' );
      assert && assert( ( nodeFocusHighlight! ).parent,
        'if focusHighlightLayerable, the highlight must be added to the scene graph before grab/drag construction.' );
    }

    if ( isInteractiveHighlighting( node ) && node.interactiveHighlightLayerable ) {
      assert && assert( node.interactiveHighlight,
        'An interactive highlight must be set to the Node before construction when using interactiveHighlightLayerable' );
      assert && assert( ( node.interactiveHighlight! as HighlightPath ).parent,
        'if interactiveHighlightLayerable, the highlight must be added to the scene graph before construction' );
    }

    // Create custom focus highlight (unless the Node already has one). This allows us to dash the highlight in the 'grabbed' state.
    const ownsFocusHighlight = nodeFocusHighlight === null; // for disposal
    this.grabDragFocusHighlight = nodeFocusHighlight || new HighlightFromNode( node );

    // If the Node supports interactive highlight and defines its own interactive highlight, use it.
    // Otherwise, create a new one that will surround the target Node.
    const ownsInteractiveHighlight = !( isInteractiveHighlighting( node ) && node.interactiveHighlight );
    this.grabDragInteractiveHighlight = !ownsInteractiveHighlight ? ( node.interactiveHighlight as HighlightPath ) :

                                        // If it doesn't have a custom interactive highlight, use the same highlight as the focus highlight.
                                        this.grabDragFocusHighlight;

    node.focusHighlight = this.grabDragFocusHighlight;
    isInteractiveHighlighting( node ) && node.setInteractiveHighlight( this.grabDragInteractiveHighlight );

    interactionCueParent.addChild( this.dragCueNode );
    interactionCueParent.addChild( this.grabCueNode );

    // A matrix between the local frame of the target Node and the local frame of the interactionCueParent.
    this.matrixBetweenProperty = new MatrixBetweenProperty( options.transformNodeToTrack, interactionCueParent, {

      // Use the local coordinate frame so that the Property observes transform changes up to and including
      // the target Node.
      fromCoordinateFrame: 'local',
      toCoordinateFrame: 'local'
    } );

    const repositionCuesListener = this.repositionCues.bind( this );
    this.matrixBetweenProperty.link( repositionCuesListener );

    // Some key presses can fire the node's click (the grab button) from the same press that fires the keydown from
    // the grabbed state, so guard against that.
    let guardGrabKeyPressFromGrabbedState = false;

    // when the "Grab {{thing}}" button is pressed, focus the grabbed node and set to dragged state
    const grabButtonListener = {
      click: () => {

        // don't turn to grabbed on mobile a11y, it is the wrong gesture - user should press down and hold
        // to initiate a drag
        if ( this.supportsGestureDescription || !this.grabDragModel.enabled ) {
          return;
        }

        // if the grabbed node was just released, don't pick it up again until the next click event so we don't "loop"
        // and pick it up immediately again.
        if ( guardGrabKeyPressFromGrabbedState ) {

          // allow grab the node on the next click event
          guardGrabKeyPressFromGrabbedState = false;
          return;
        }

        // blur as an idle so that we get a new focus event after we turn into a grabbed, and so that grab listeners get a blur() event before mutating.
        this.node.blur();

        this.grabDragModel.keyboardGrab( () => {

          // focus after the transition so that listeners added to the grabbed state get a focus event().
          this.node.focus();
        } );

      },

      focus: () => {
        this.updateVisibilityForCues();

        this.onGrabButtonFocusEmitter.emit();
      },

      blur: () => this.updateVisibilityForCues()
    };

    // Keep track of all listeners to swap out grab/drag functionalities.
    this.listenersWhileIdle = options.listenersWhileIdle.concat( grabButtonListener );

    const dragDivDownListener = new KeyboardListener( {
      keys: [ 'enter' ],
      fire: () => {


        // set a guard to make sure the key press from enter doesn't fire future listeners, therefore
        // "clicking" the grab button also on this key press.
        // The sequence that dispatched this fire also dispatches a click event, so we must avoid immediately grabbing
        // from this event that released
        guardGrabKeyPressFromGrabbedState = true;
        this.grabDragModel.release( 'alternative' );
      }
    } );

    const dragDivUpListener = new KeyboardListener( {
      keys: [ 'space', 'escape' ],

      // For the release action, it is more typical to fire it when the key is released.
      fireOnDown: false,
      fire: () => {

        // Release on keyup for spacebar so that we don't pick up the grabbed node again when we release the spacebar
        // and trigger a click event - escape could be added to either keyup or keydown listeners
        this.grabDragModel.release( 'alternative' );
      },

      // release when focus is lost
      blur: () => this.grabDragModel.release( 'programmatic' ),

      // if successfully dragged, then make the cue node invisible
      focus: () => this.updateVisibilityForCues()
    } );

    // Update the visibility of dragging cues whenever keyboard dragging keys release (keyup), bug fix for https://github.com/phetsims/scenery-phet/issues/868
    const dragDivDraggedListener = new KeyboardListener( {

      // All possible dragging keys will fire this.
      keyStringProperties: KeyboardDragDirectionToKeyStringPropertiesMap.get( 'both' ),
      fireOnDown: false,
      fire: () => this.updateVisibilityForCues(),

      // This option will ensure that this listener doesn't disrupt other keys
      overlapBehavior: 'allow'
    } );

    this.listenersWhileGrabbed = options.listenersWhileGrabbed.concat( [
      dragDivDownListener,
      dragDivUpListener,
      dragDivDraggedListener,
      keyboardDragListener
    ] );

    this.pressReleaseListener = new DragListener( {
      press: event => {
        if ( !event.isFromPDOM() ) {
          this.grabDragModel.grab( _.noop, 'pointer' );
        }
      },
      release: event => {

        // If the event is null, then we are in the interrupt case, and should attempt to release()
        // If the release is an event from the PDOM (which shouldn't happen most of the time), then PDOM listeners will
        // handle the release().
        const shouldRelease = ( event === null || !event.isFromPDOM() );

        // release if interrupted, but only if not already idle, which is possible if the GrabDragInteraction
        // has been reset since press
        if ( shouldRelease && this.grabDragModel.interactionStateProperty.value === 'grabbed' ) {
          this.grabDragModel.release( 'pointer' );
        }
      },

      // this listener shouldn't prevent the behavior of other listeners, and this listener should always fire
      // whether the pointer is already attached
      attach: false,
      enabledProperty: this.grabDragModel.enabledProperty,
      tandem: options.tandem.createTandem( 'pressReleaseListener' )
    } );
    this.node.addInputListener( this.pressReleaseListener );

    assert && assert( this.grabDragModel.interactionStateProperty.value === 'idle', 'starting state idle please' );

    // Update the interaction, pdom, focus, etc when the state changes.
    this.grabDragModel.interactionStateProperty.link( () => this.updateFromState() );

    this.grabDragModel.enabledProperty.lazyLink( enabled => {
      if ( !enabled ) {
        this.interrupt(); // This will trigger state change to idle via DragListener.release()
      }

      this.updateVisibilityForCues();
    } );

    const inputEnabledListener = ( nodeInputEnabled: boolean ) => { this.grabDragModel.enabled = nodeInputEnabled; };

    // Use the "owns" pattern here to keep the enabledProperty PhET-iO instrumented based on the super options.
    // If the client specified their own enabledProperty, then they are responsible for managing enabled.
    ownsEnabledProperty && this.node.inputEnabledProperty.lazyLink( inputEnabledListener );

    this.grabDragModel.resetEmitter.addListener( () => this.updateVisibilityForCues() );

    // Hide the drag cue when there has been a successful pickup.
    const keyboardPressedListener = ( isPressed: boolean ) => {
      if ( isPressed ) {
        this.grabDragModel.grabDragUsageTracker.shouldShowDragCue = false;
      }
    };
    keyboardDragListener.isPressedProperty.link( keyboardPressedListener );

    this.disposeEmitter.addListener( () => {

      this.node.removeInputListener( this.pressReleaseListener );
      ownsEnabledProperty && this.node.inputEnabledProperty.unlink( inputEnabledListener );

      this.node.accessibleRoleDescription = null;

      // Remove listeners (gracefully)
      this.removeInputListeners( this.listenersWhileIdle );
      this.removeInputListeners( this.listenersWhileGrabbed );

      interactionCueParent.removeChild( this.dragCueNode );
      interactionCueParent.removeChild( this.grabCueNode );

      this.matrixBetweenProperty.unlink( repositionCuesListener );
      this.matrixBetweenProperty.dispose();

      keyboardDragListener.isPressedProperty.unlink( keyboardPressedListener );

      dragDivDownListener.dispose();
      dragDivUpListener.dispose();
      dragDivDraggedListener.dispose();
      this.pressReleaseListener.dispose();

      this.onGrabButtonFocusEmitter.dispose();

      // Focus and cue disposal
      if ( ownsFocusHighlight ) {

        // Assume the GrabDragInteraction was the primary/sole reason for highlighting, do not try to fall back to a prior highlight
        this.node.focusHighlight = null;
        this.grabDragFocusHighlight.dispose();
      }

      if ( ownsInteractiveHighlight ) {
        isInteractiveHighlighting( node ) && node.setInteractiveHighlight( null );
        this.grabDragInteractiveHighlight.dispose();
      }

      this.grabCueNode.dispose();
      this.dragCueNode.detach();

      this.grabDragModel.dispose();
    } );
  }

  /**
   * Sets the name to be used when in the "grabbed" state. If already grabbed, the name is set to the target Node right away.
   */
  public setGrabbedStateAccessibleName( name: PDOMValueType ): void {
    this._grabbedStateAccessibleName = name;
    this.grabbedStateOptions.innerContent = this._grabbedStateAccessibleName;
    this.grabbedStateOptions.ariaLabel = this._grabbedStateAccessibleName;

    // If grabbed, mutate the Node with these options right away
    if ( this.grabDragModel.interactionStateProperty.value === 'grabbed' ) {
      this.node.mutate( this.grabbedStateOptions );
    }
  }

  public set grabbedStateAccessibleName( name: PDOMValueType ) {
    this.setGrabbedStateAccessibleName( name );
  }

  /**
   * Sets the name to be used when in the "idle" state. If already idle, the name is set to the target Node right away.
   * @param name
   */
  public setIdleStateAccessibleName( name: PDOMValueType ): void {
    this._idleStateAccessibleName = name;
    this.idleStateOptions.innerContent = this._idleStateAccessibleName;

    // Setting the aria-label on the interactionState element fixes a bug with VoiceOver in Safari where the aria role
    // from the grabbed state is never cleared, see https://github.com/phetsims/scenery-phet/issues/688
    this.idleStateOptions.ariaLabel = this._idleStateAccessibleName;

    // if idle, mutate the Node with these options right away
    if ( this.grabDragModel.interactionStateProperty.value === 'idle' ) {
      this.node.mutate( this.idleStateOptions );
    }
  }

  public set idleStateAccessibleName( name: PDOMValueType ) {
    this.setIdleStateAccessibleName( name );
  }

  /**
   * Set the help text for keyboard input. If the runtime supports "gesture description" this is a no-op.
   */
  public setAccessibleHelpText( text: PDOMValueType ): void {
    this._accessibleHelpText = text;
    if ( !this.supportsGestureDescription ) {
      this.node.descriptionContent = text;
    }
  }

  public getAccessibleHelpText(): PDOMValueType {
    return this._accessibleHelpText;
  }

  public set accessibleHelpText( text: PDOMValueType ) {
    this.setAccessibleHelpText( text );
  }

  public get accessibleHelpText(): PDOMValueType {
    return this.getAccessibleHelpText();
  }

  /**
   * Set the help text for gesture input. If the runtime does not support "gesture description" this is a no-op.
   */
  public setGestureHelpText( text: PDOMValueType ): void {
    this._gestureHelpText = text;
    if ( this.supportsGestureDescription ) {
      this.node.descriptionContent = text;
    }
  }

  public getGestureHelpText(): PDOMValueType {
    return this._gestureHelpText;
  }

  public set gestureHelpText( text: PDOMValueType ) {
    this.setGestureHelpText( text );
  }

  public get gestureHelpText(): PDOMValueType {
    return this._gestureHelpText;
  }

  /**
   * Set the callback that should be used when grabbed - called when switching from idle to grabbed state.
   */
  public setOnGrab( onGrab: GrabDragCallback ): void {
    this._onGrab = onGrab;
  }

  public getOnGrab(): GrabDragCallback {
    return this._onGrab;
  }

  public set onGrab( onGrab: GrabDragCallback ) {
    this.setOnGrab( onGrab );
  }

  public get onGrab(): GrabDragCallback {
    return this.getOnGrab();
  }

  /**
   * Set the callback that should be used when released - called when switching from grabbed to idle state.
   */
  public setOnRelease( onRelease: GrabDragCallback ): void {
    this._onRelease = onRelease;
  }

  public getOnRelease(): GrabDragCallback {
    return this._onRelease;
  }

  public set onRelease( onRelease: GrabDragCallback ) {
    this.setOnRelease( onRelease );
  }

  public get onRelease(): GrabDragCallback {
    return this.getOnRelease();
  }

  /**
   * Set the positions of the grabCueNode and dragCueNode relative to the target Node. The position is determined by
   * the CuePosition and the offsets.
   */
  public repositionCues( matrix: Matrix3 | null ): void {
    if ( matrix ) {
      this.positionCueNode( matrix, this.grabCueNode, this.grabCuePosition, this.grabCueOffset );
      this.positionCueNode( matrix, this.dragCueNode, this.dragCuePosition, this.dragCueOffset );
    }
  }

  /**
   * Sets the position of the cueNode relative to the bounds in the parent coordinate frame, from
   * the provided position type and offsets.
   *
   * @param matrix - the transformation matrix from the local frame of the target Node to the local frame of the interactionCueParent
   * @param cueNode - the Node to position
   * @param position - the position of the cueNode relative to the bounds
   * @param offset - the offset of the cueNode relative to the position
   */
  private positionCueNode( matrix: Matrix3, cueNode: Node, position: CuePosition, offset: Vector2 ): void {

    // The bounds for the Node may not be finite during construction.
    // Skip positioning if the cueNode is not shown for performance.
    if ( !this.node.bounds.isFinite() || !cueNode.visible ) {
      return;
    }

    let parentPointBoundsGetter: string;
    let cueNodePositionSetter: string;

    if ( position === 'center' ) {
      parentPointBoundsGetter = 'center';
      cueNodePositionSetter = 'center';
    }
    else if ( position === 'top' ) {
      parentPointBoundsGetter = 'centerTop';
      cueNodePositionSetter = 'centerBottom';
    }
    else if ( position === 'bottom' ) {
      parentPointBoundsGetter = 'centerBottom';
      cueNodePositionSetter = 'centerTop';
    }
    else if ( position === 'left' ) {
      parentPointBoundsGetter = 'leftCenter';
      cueNodePositionSetter = 'rightCenter';
    }
    else if ( position === 'right' ) {
      parentPointBoundsGetter = 'rightCenter';
      cueNodePositionSetter = 'leftCenter';
    }
    else {
      assert && assert( false, `unknown position: ${position}` );
    }

    // @ts-expect-error - so a string can be used to access the Bounds2 field.
    const localPoint = this.node.parentToLocalPoint( this.node.bounds[ parentPointBoundsGetter ] );

    // @ts-expect-error - so a string can be used to access the Node setter.
    cueNode[ cueNodePositionSetter ] = matrix.timesVector2( localPoint ).plusXY( offset.x, offset.y );
  }

  /**
   * Update the node to switch modalities between being grabbed, and idle. This function holds code that should
   * be called when switching from any state to any other state.
   */
  private updateFromState(): void {
    const interactionState = this.grabDragModel.interactionStateProperty.value;

    const listenersToRemove = interactionState === 'idle' ? this.listenersWhileGrabbed : this.listenersWhileIdle;

    // interrupt prior input, reset the key state of the drag handler by interrupting the drag. Don't interrupt all
    // input, but instead just those to be removed.
    listenersToRemove.forEach( listener => listener.interrupt && listener.interrupt() );

    // remove all previous listeners from the node
    this.removeInputListeners( listenersToRemove );

    // To support gesture and mobile screen readers, we change the roledescription, see https://github.com/phetsims/scenery-phet/issues/536
    // By default, the idle gets a roledescription to force the AT to say its role. This fixes a bug in VoiceOver
    // where it fails to update the role after turning back into an idle.
    // See https://github.com/phetsims/scenery-phet/issues/688.
    this.node.accessibleRoleDescription = ( interactionState === 'grabbed' || this.supportsGestureDescription ) ? movableStringProperty : buttonStringProperty;

    this.updateAriaDescribedby( interactionState );

    // update the PDOM of the node
    const nodeOptions = interactionState === 'idle' ? this.idleStateOptions : this.grabbedStateOptions;
    this.node.mutate( nodeOptions );
    assert && this.grabDragModel.enabledProperty.value && assert( this.node.focusable, 'GrabDragInteraction node must remain focusable after mutation' );

    const listenersToAdd = interactionState === 'idle' ? this.listenersWhileIdle : this.listenersWhileGrabbed;
    this.addInputListeners( listenersToAdd );

    this.updateFocusHighlights();
    this.updateVisibilityForCues();

    assert && assert( this.grabDragModel.interactionStateProperty.value === interactionState,
      'updating from state should not change the interaction state.' );
  }

  private updateAriaDescribedby( interactionState: GrabDragInteractionState ): void {

    if ( interactionState === 'idle' && this.shouldAddAriaDescribedby() ) {

      // this node is aria-describedby its own description content, so that the description is read automatically
      // when found by the user
      !this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) &&
      this.node.addAriaDescribedbyAssociation( this.descriptionAssociationObject );
    }
    else {

      // This node is aria-describedby its own description content only when idle, so that the description is
      // read automatically when found by the user with the virtual cursor. Remove it for grabbed
      if ( this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) ) {
        this.node.removeAriaDescribedbyAssociation( this.descriptionAssociationObject );
      }
    }
  }

  /**
   * Update the focusHighlights according to if we are in idle or grabbed state
   * No need to set visibility to true, because that will happen for us by HighlightOverlay on focus.
   */
  private updateFocusHighlights(): void {
    this.grabDragFocusHighlight.setDashed( this.grabDragModel.interactionStateProperty.value === 'grabbed' );
    this.grabDragInteractiveHighlight.setDashed( this.grabDragModel.interactionStateProperty.value === 'grabbed' );
  }

  /**
   * Update the visibility of the cues for both idle and grabbed states.
   */
  private updateVisibilityForCues(): void {
    const wasDragCueVisible = this.dragCueNode.visible;
    const wasGrabCueVisible = this.grabCueNode.visible;

    this.dragCueNode.visible = this.grabDragModel.enabled && this.grabDragModel.interactionStateProperty.value === 'grabbed' &&
                               this.node.focused && this.shouldShowDragCueNode();
    this.grabCueNode.visible = this.grabDragModel.enabled && this.grabDragModel.interactionStateProperty.value === 'idle' &&
                               this.node.focused && this.shouldShowGrabCueNode();

    // If visibility of either has changed, reposition the cues. For performance, the cues are only repositioned
    // while they are shown.
    if ( wasDragCueVisible !== this.dragCueNode.visible || wasGrabCueVisible !== this.grabCueNode.visible ) {
      this.repositionCues( this.matrixBetweenProperty.value );
    }
  }

  /**
   * Add all listeners to node
   */
  private addInputListeners( listeners: TInputListener[] ): void {
    for ( let i = 0; i < listeners.length; i++ ) {
      this.node.addInputListener( listeners[ i ] );
    }
  }

  /**
   * Remove all listeners from the node. Called from dispose, so it is nice to be graceful.
   */
  private removeInputListeners( listeners: TInputListener[] ): void {
    for ( let i = 0; i < listeners.length; i++ ) {
      const listener = listeners[ i ];
      if ( this.node.hasInputListener( listener ) ) {
        this.node.removeInputListener( listener );
      }
    }
  }

  /**
   * Interrupt the grab drag interraction - interrupts any listeners attached and makes sure the
   * Node is back in its "idle" state.
   */
  public interrupt(): void {
    if ( this.grabDragModel.interactionStateProperty.value === 'grabbed' ) {
      this.grabDragModel.release( 'programmatic' );
    }
    this.pressReleaseListener.interrupt();

    assert && assert( this.grabDragModel.interactionStateProperty.value === 'idle', 'disabled grabDragInteractions must be in "idle" state.' );
  }

  private wireUpDescriptionAndVoicingResponses( node: Node ): void {

    const responsePacket = new ResponsePacket();

    // Responses are assertive so that a pile up of alerts doesn't happen with rapid movement, see
    // https://github.com/phetsims/balloons-and-static-electricity/issues/491
    const responseUtterance = new Utterance( {
      alert: responsePacket,

      // This was being obscured by other messages, the priority helps make sure it is heard, see https://github.com/phetsims/friction/issues/325
      priority: Utterance.MEDIUM_PRIORITY,

      announcerOptions: {
        ariaLivePriority: AriaLiveAnnouncer.AriaLive.ASSERTIVE // for AriaLiveAnnouncer
      }
    } );
    this.disposeEmitter.addListener( () => responseUtterance.dispose() );

    if ( isVoicing( node ) ) {

      assert && assert( node.voicingFocusListener === node.defaultFocusListener,
        'GrabDragInteraction sets its own voicingFocusListener.' );

      // sanity check on the voicing interface API.
      assertHasProperties( node, [ 'voicingFocusListener' ] );

      const voicingFocusUtterance = new Utterance( {
        alert: new ResponsePacket(),
        announcerOptions: {
          cancelOther: false
        }
      } );
      this.disposeEmitter.addListener( () => voicingFocusUtterance.dispose() );

      node.voicingFocusListener = () => {

        // When swapping from interactionState to grabbed, the grabbed element will be focused, ignore that case here, see https://github.com/phetsims/friction/issues/213
        this.grabDragModel.interactionStateProperty.value === 'idle' && node.defaultFocusListener();
      };

      // These Utterances should only be announced if the Node is globally visible and voicingVisible.
      Voicing.registerUtteranceToVoicingNode( responseUtterance, node );
      Voicing.registerUtteranceToVoicingNode( voicingFocusUtterance, node );

      this.onGrabButtonFocusEmitter.addListener( () => {
        if ( this.grabDragModel.enabled && this.shouldShowGrabCueNode() ) {
          const alert = voicingFocusUtterance.alert! as ResponsePacket;
          alert.hintResponse = SceneryPhetStrings.a11y.grabDrag.spaceToGrabOrReleaseStringProperty;
          Voicing.alertUtterance( voicingFocusUtterance );
        }
      } );

      this.grabDragModel.resetEmitter.addListener( () => voicingFocusUtterance.reset() );
    }

    this.grabDragModel.releasedEmitter.addListener( () => {
      responsePacket.objectResponse = this._createReleasedResponse();
      this.node.addAccessibleResponse( responseUtterance );
      isVoicing( node ) && Voicing.alertUtterance( responseUtterance );
    } );

    this.grabDragModel.grabbedEmitter.addListener( () => {
      responsePacket.objectResponse = this._createGrabbedResponse();
      this.node.addAccessibleResponse( responseUtterance );
      isVoicing( node ) && Voicing.alertUtterance( responseUtterance );
    } );
  }

  /**
   * Reset to initial state
   */
  public reset(): void {
    this.grabDragModel.reset();
  }

  public get enabledProperty(): TProperty<boolean> {
    return this.grabDragModel.enabledProperty;
  }

  public get enabled(): boolean {
    return this.grabDragModel.enabled;
  }

  public set enabled( enabled: boolean ) {
    this.grabDragModel.enabledProperty.value = enabled;
  }

  public get interactionStateProperty(): TProperty<GrabDragInteractionState> {
    return this.grabDragModel.interactionStateProperty;
  }

  public get grabDragUsageTracker(): GrabDragUsageTracker {
    return this.grabDragModel.grabDragUsageTracker;
  }
}

sceneryPhet.register( 'GrabDragInteraction', GrabDragInteraction );