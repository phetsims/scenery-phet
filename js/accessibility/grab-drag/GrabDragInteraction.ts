// Copyright 2018-2024, University of Colorado Boulder

/**
 * The main interaction for grabbing and dragging an object through the PDOM and assistive technology. It works by
 * taking in a Node to augment with the PDOM interaction. In fact it works much like a mixin. In general, this type
 * will mutate the accessible content (PDOM) of the passed in Node (sometimes referred to "wrappedNode"), toggling
 * between a "grabbable" state and a "draggable" state. When each state changes, the underlying PDOM element and general
 * interaction does as well.
 *
 * To accomplish this there are options to be filled in that keep track of the scenery inputListeners for each state,
 * as well as options to mutate the Node for each state. By default the grabbable is a `button` with a containing  `div`,
 * and the draggable is a focusable `div` with an "application" aria role. It is up to the client to supply a
 * KeyboardDragListener as an arg that will be added to the Node in the "draggable" state.
 *
 * As a note on terminology, mostly things are referred to by their current "interaction state" which is either grabbable
 * or draggable.
 *
 * This type will alert when the draggable is released, but no default alert is provided when the object is grabbed.
 * This is because in usages so far, that alert has been custom, context specific, and easier to just supply through
 * the onGrab callback option.
 *
 * NOTE: You SHOULD NOT add listeners directly to the Node where it is constructed, instead see
 * `options.listenersForGrab/DragState`. These will keep track of the listeners for each interaction state, and
 * will set them accordingly. In rare cases it may be desirable to have a listener attached no matter the state, but that
 * has not come up so far.
 *
 * NOTE: There is no "undo" for a mutate call, so it is the client's job to make sure that grabbable/draggableOptions objects
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
 * NOTE: upon "activation" of this type, meaning that the user grabs the object and it turns into a draggable, the
 * wrappedNode is blurred and refocused. This means that the input event "blur()" set in listenersWhileGrabbable will
 * not just fire when navigating through the sim, but also upon activation. This weirdness is to make sure that the
 * input event "focus()" is called and supported for within listenersWhileDraggable
 *
 * NOTE: For PhET-iO instrumentation, GrabDragInteraction.enabledProperty is phetioReadOnly, it makes the most sense
 * to link to whatever Node control's the mouse/touch input and toggle grab drag enabled when that Node's inputEnabled
 * changes. For example see Friction.

 * TODO: Can the voicing implementation be a separate component that is composed? https://github.com/phetsims/scenery-phet/issues/869
 * TODO: Have two classes, one for all the grabbable stuff, and one for the draggable. https://github.com/phetsims/scenery-phet/issues/869
 *        - have demos for grab/drag, and just grab, and just drag
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
import EnabledComponent, { EnabledComponentOptions } from '../../../../axon/js/EnabledComponent.js';
import assertHasProperties from '../../../../phet-core/js/assertHasProperties.js';
import getGlobal from '../../../../phet-core/js/getGlobal.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Association, DragListener, HighlightFromNode, HighlightPath, isInteractiveHighlighting, isVoicing, keyboardDraggingKeys, KeyboardDragListener, KeyboardListener, Node, NodeOptions, ParallelDOMOptions, PDOMPeer, PDOMValueType, TInputListener, Voicing } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AriaLiveAnnouncer from '../../../../utterance-queue/js/AriaLiveAnnouncer.js';
import ResponsePacket from '../../../../utterance-queue/js/ResponsePacket.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import GrabReleaseCueNode from '../nodes/GrabReleaseCueNode.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import GrabDragModel, { GrabDragInteractionState } from './GrabDragModel.js';
import GrabDragUsageTracker from './GrabDragUsageTracker.js';

// constants
const grabPatternStringStringProperty = SceneryPhetStrings.a11y.grabDrag.grabPatternStringProperty;
const gestureHelpTextPatternStringProperty = SceneryPhetStrings.a11y.grabDrag.gestureHelpTextPatternStringProperty;
const movableStringProperty = SceneryPhetStrings.a11y.grabDrag.movableStringProperty;
const buttonStringProperty = SceneryPhetStrings.a11y.grabDrag.buttonStringProperty;
const defaultObjectToGrabStringProperty = SceneryPhetStrings.a11y.grabDrag.defaultObjectToGrabStringProperty;
const releasedStringProperty = SceneryPhetStrings.a11y.grabDrag.releasedStringProperty;

type SelfOptions = {

  // A string that is filled in to the appropriate button label
  objectToGrabString?: PDOMValueType;

  // If not provided, a default will be applied, see this.grabbableAccessibleName.
  grabbableAccessibleName?: null | string;

  // Called when the node is "grabbed" (when the grab button fires); button -> draggable.
  // TODO: REname to onGrabbed? https://github.com/phetsims/scenery-phet/issues/869
  onGrab?: VoidFunction;

  // Called when the node is "released" (when the draggable is "let go"); draggable -> button
  // TODO: REname to onReleased? https://github.com/phetsims/scenery-phet/issues/869
  onRelease?: VoidFunction;

  // PDOM options passed to the grabbable created for the PDOM, filled in with defaults below
  grabbableOptions?: ParallelDOMOptions;

  // To pass in options to the cue. This is a scenery Node and you can pass it options supported by
  // that type. When positioning this node, it is in the target Node's parent coordinate frame.
  grabCueOptions?: NodeOptions;

  // Node options passed to the draggable created for the PDOM, filled in with defaults below
  draggableOptions?: NodeOptions;

  // Optional node to cue the drag interaction once successfully updated.
  dragCueNode?: Node;

  // GrabDragInteraction swaps the PDOM structure for a given node between a grabbable state, and
  // draggable one. We need to keep track of all listeners that need to be attached to each PDOM manifestation.
  // Note: when these are removed while converting to/from grabbable/draggable, they are interrupted. Other
  // listeners that are attached to this.node but aren't in these lists will not be interrupted. The grabbable
  // will blur() when activated from a grabbable to a draggable. The draggable will focus when activated
  // from grabbable.
  listenersWhileDraggable?: TInputListener[];
  listenersWhileGrabbable?: TInputListener[];

  // If this instance will support specific gesture description behavior.
  supportsGestureDescription?: boolean;

  // Add an aria-describedby link between the description sibling and the primary sibling, only when grabbable. By
  // default this should only be done when supporting gesture interactive description before two success grabs. This
  // function is called with one parameters: the number of successful grabs that has occurred thus far.
  shouldAddAriaDescribedby?: () => boolean;

  // Help text is treated as the same for the grabbable and draggable items, but is different based on if the
  // runtime is supporting gesture interactive description. Even though "technically" there is no way to access the
  // help text when this Node is in the draggable state, the help text is still in the PDOM.
  keyboardHelpText?: string | null;

  // Controls whether or not to show the "Grab" cue node that is displayed on focus - by
  // default it will be shown on focus until it has been successfully grabbed with a keyboard
  showGrabCueNode?: () => boolean;

  // Whether or not to display the Node for the "Drag" cue node once the grabbable Node has been picked up,
  // if a options.dragCueNode is specified. This will only be shown if draggable node has focus
  // from alternative input
  showDragCueNode?: () => boolean;

  // Like keyboardHelpText but when supporting gesture interactive description.
  gestureHelpText?: PDOMValueType;

  // For sharing usage tracking between multiple instances of GrabDragInteraction. Even if provided, GrabDragInteraction
  // will reset this.
  grabDragUsageTracker?: GrabDragUsageTracker;
};

type ParentOptions = EnabledComponentOptions;
type GrabDragInteractionOptions = SelfOptions & ParentOptions;

// Options that can be forwarded to the target Node when the state changes. Fields that are set by the implementation
// of GrabDragInteraction are omitted.
type StateOptions = StrictOmit<ParallelDOMOptions, 'descriptionContent' | 'helpText' | 'descriptionTagName' | 'accessibleName' | 'innerContent' | 'ariaLabel'>;

export default class GrabDragInteraction extends EnabledComponent {

  // The accessible name for the Node in its 'draggable' interactionState.
  private readonly draggableAccessibleName: PDOMValueType;

  // The accessible name for the Node in its "grabbable" interactionState.
  private readonly grabbableAccessibleName: PDOMValueType;

  // Directly from options or parameters.
  private readonly node: Node;
  private readonly grabbableOptions: StateOptions;
  private readonly draggableOptions: StateOptions;
  private readonly dragCueNode: Node;

  // public ONLY to position dynamically. Prefer options.grabCueOptions when possible.
  public readonly grabCueNode: GrabReleaseCueNode;

  // TODO: These should be Property instances, or DerivedProperty instances, which would alleviate our need to be careful about calling updateVisibilityForCues at the right times, see https://github.com/phetsims/scenery-phet/issues/869
  private readonly showGrabCueNode: () => boolean;
  private readonly showDragCueNode: () => boolean;

  // Predicate that determines whether the aria description should be added.
  // This one is better as a predicate rather than a Property since we need to control its call timing
  private readonly shouldAddAriaDescribedby: () => boolean;

  private readonly supportsGestureDescription: boolean;

  // Keep track of all listeners to swap out grab/drag functionalities
  // TODO: Would it be simpler to keep these and other attributes in a constructor closure? See https://github.com/phetsims/scenery-phet/issues/869
  private readonly listenersWhileGrabbable: TInputListener[];
  private readonly listenersWhileDraggable: TInputListener[];

  // Model-related state of the current and general info about the interaction.
  public readonly grabDragModel: GrabDragModel;

  // The aria-describedby association object that will associate "interactionState" with its
  // help text so that it is read automatically when the user finds it. This reference is saved so that
  // the association can be removed when the node becomes a "draggable".
  private readonly descriptionAssociationObject: Association;

  // A reusable Utterance for Voicing output from this type.
  private readonly voicingFocusUtterance: Utterance;

  private readonly grabDragFocusHighlight: HighlightPath;
  private readonly grabDragInteractiveHighlight: HighlightPath;

  // For mouse and touch events (non-PDOM pointer events), change state and representations in the PDOM - This is
  // important to update interactive highlights, because the highlight showing the state can be seen. It is also
  // important for AT that use pointer events like iOS VoiceOver.
  // A DragListener is used instead of a PressListener to work with touchSnag.
  // Note this is NOT the DragListener that implements dragging on the target.
  private readonly pressReleaseListener: DragListener;

  /**
   * @param node - will be mutated with a11y options to have the grab/drag functionality in the PDOM
   * @param keyboardDragListener - added to the Node when it is draggable
   * @param providedOptions
   */
  public constructor( node: Node, keyboardDragListener: KeyboardDragListener, providedOptions?: GrabDragInteractionOptions ) {

    const ownsEnabledProperty = !providedOptions || !providedOptions.enabledProperty;

    // Options filled in the second optionize pass are ommitted from the self options of first pass.
    const firstPassOptions = optionize<GrabDragInteractionOptions, StrictOmit<SelfOptions, 'gestureHelpText' | 'shouldAddAriaDescribedby'>, ParentOptions>()( {
      objectToGrabString: defaultObjectToGrabStringProperty,
      grabbableAccessibleName: null,
      onGrab: _.noop,
      onRelease: _.noop,
      grabbableOptions: {},
      grabCueOptions: {},
      draggableOptions: {},
      dragCueNode: new Node(),
      listenersWhileDraggable: [],
      listenersWhileGrabbable: [],
      supportsGestureDescription: getGlobal( 'phet.joist.sim.supportsGestureDescription' ),
      keyboardHelpText: null,
      showGrabCueNode: () => {
        return this.grabDragModel.grabDragUsageTracker.numberOfKeyboardGrabs < 1 && node.inputEnabled;
      },
      showDragCueNode: () => {
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
    assert && assert( !options.listenersWhileDraggable.includes( keyboardDragListener ), 'GrabDragInteraction adds the KeyboardDragListener to listenersWhileDraggable' );

    assert && assert( !options.dragCueNode.parent, 'GrabDragInteraction adds dragCueNode to focusHighlight' );
    assert && assert( options.dragCueNode.visible, 'dragCueNode should be visible to begin with' );

    super( options );

    options.draggableOptions = combineOptions<ParallelDOMOptions>( {
      tagName: 'div',
      ariaRole: 'application',
      focusable: true,

      // to cancel out grabbable
      containerTagName: null
    }, options.draggableOptions );

    this.draggableAccessibleName = options.objectToGrabString;
    options.draggableOptions.innerContent = this.draggableAccessibleName;
    options.draggableOptions.ariaLabel = this.draggableAccessibleName;

    options.grabbableOptions = combineOptions<ParallelDOMOptions>( {
      containerTagName: 'div',
      focusable: true,
      ariaRole: null,
      tagName: 'button',

      // in general, the help text is after the grabbable
      appendDescription: true,

      // position the PDOM elements when grabbable for drag and drop on touch-based screen readers
      positionInPDOM: true,

      accessibleName: null
    }, options.grabbableOptions );

    this.grabbableAccessibleName = options.grabbableAccessibleName || // if a provided option
                                   ( options.supportsGestureDescription ? options.objectToGrabString : // otherwise if supporting gesture
                                     StringUtils.fillIn( grabPatternStringStringProperty, { // default case
                                       objectToGrab: options.objectToGrabString
                                     } ) );
    options.grabbableOptions.innerContent = this.grabbableAccessibleName;

    // Setting the aria-label on the interactionState element fixes a bug with VoiceOver in Safari where the aria role
    // from the draggable state is never cleared, see https://github.com/phetsims/scenery-phet/issues/688
    options.grabbableOptions.ariaLabel = this.grabbableAccessibleName;

    this.grabDragModel = new GrabDragModel( options.grabDragUsageTracker );
    this.node = node;
    this.grabbableOptions = options.grabbableOptions;
    this.draggableOptions = options.draggableOptions;
    this.dragCueNode = options.dragCueNode;
    this.grabCueNode = new GrabReleaseCueNode( options.grabCueOptions );
    this.showGrabCueNode = options.showGrabCueNode;
    this.showDragCueNode = options.showDragCueNode;
    this.shouldAddAriaDescribedby = options.shouldAddAriaDescribedby;
    this.supportsGestureDescription = options.supportsGestureDescription;

    // set the help text, if provided - it will be associated with aria-describedby when in the "grabbable" interactionState
    this.node.descriptionContent = this.supportsGestureDescription ? options.gestureHelpText : options.keyboardHelpText;

    // The aria-describedby association object that will associate "grabbable" interactionState with its help text so that it is
    // read automatically when the user finds it. This reference is saved so that the association can be removed
    // when the node becomes a "draggable"
    this.descriptionAssociationObject = {
      otherNode: this.node,
      thisElementName: PDOMPeer.PRIMARY_SIBLING,
      otherElementName: PDOMPeer.DESCRIPTION_SIBLING
    };

    this.voicingFocusUtterance = new Utterance( {
      alert: new ResponsePacket(),
      announcerOptions: {
        cancelOther: false
      }
    } );

    // "released" alerts are assertive so that a pile up of alerts doesn't happen with rapid movement, see
    // https://github.com/phetsims/balloons-and-static-electricity/issues/491
    const releasedUtterance = new Utterance( {
      alert: new ResponsePacket( { objectResponse: releasedStringProperty } ),

      // This was being obscured by other messages, the priority helps make sure it is heard, see https://github.com/phetsims/friction/issues/325
      priority: Utterance.MEDIUM_PRIORITY,

      announcerOptions: {
        ariaLivePriority: AriaLiveAnnouncer.AriaLive.ASSERTIVE // for AriaLiveAnnouncer
      }
    } );

    if ( isVoicing( node ) ) {
      assert && assert( node.voicingFocusListener === node.defaultFocusListener, 'GrabDragInteraction sets ' +
                                                                                 'its own voicingFocusListener.' );

      // sanity check on the voicing interface API.
      assertHasProperties( node, [ 'voicingFocusListener' ] );

      node.voicingFocusListener = () => {

        // When swapping from interactionState to draggable, the draggable element will be focused, ignore that case here, see https://github.com/phetsims/friction/issues/213
        this.grabDragModel.interactionStateProperty.value === 'grabbable' && node.defaultFocusListener();
      };

      // These Utterances should only be announced if the Node is globally visible and voicingVisible.
      Voicing.registerUtteranceToVoicingNode( releasedUtterance, node );
      Voicing.registerUtteranceToVoicingNode( this.voicingFocusUtterance, node );
    }

    this.grabDragModel.releasedEmitter.addListener( () => {
      options.onRelease();

      this.node.alertDescriptionUtterance( releasedUtterance );
      isVoicing( node ) && Voicing.alertUtterance( releasedUtterance );
    } );

    this.grabDragModel.grabbedEmitter.addListener( () => options.onGrab() );

    // assertions confirm this type cast below
    const nodeFocusHighlight = node.focusHighlight as HighlightPath | null;

    assert && nodeFocusHighlight && assert( nodeFocusHighlight instanceof HighlightPath,
      'if provided, focusHighlight must be a Path to support highlightChangedEmitter' );
    assert && isInteractiveHighlighting( node ) && node.interactiveHighlight && assert( node.interactiveHighlight instanceof HighlightPath,
      'if provided, interactiveHighlight must be a Path to support highlightChangedEmitter' );
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

    // Take highlights from the node for the grab/drag interaction. The Interactive Highlights cannot fall back to
    // the default focus highlights because GrabDragInteraction adds "grab cue" Nodes as children
    // to the focus highlights that should not be displayed when using Interactive Highlights.
    const ownsFocusHighlight = !node.focusHighlightLayerable;
    this.grabDragFocusHighlight = !ownsFocusHighlight ? nodeFocusHighlight! :
                                  nodeFocusHighlight ? new HighlightPath( nodeFocusHighlight.shapeProperty ) :
                                  new HighlightFromNode( node );
    const ownsInteractiveHighlight = !( isInteractiveHighlighting( node ) && node.interactiveHighlightLayerable );
    this.grabDragInteractiveHighlight = !ownsInteractiveHighlight ? ( node.interactiveHighlight as HighlightPath ) :
                                        ( isInteractiveHighlighting( node ) && node.interactiveHighlight ) ?
                                        new HighlightPath( ( node.interactiveHighlight as HighlightPath ).shapeProperty ) :
                                        new HighlightPath( this.grabDragFocusHighlight.shapeProperty );

    node.focusHighlight = this.grabDragFocusHighlight;
    isInteractiveHighlighting( node ) && node.setInteractiveHighlight( this.grabDragInteractiveHighlight );

    // only the focus highlights have "cue" Nodes so we do not need to do any work here for the Interactive Highlights
    const startingMatrix = node.getMatrix();
    this.grabCueNode.prependMatrix( startingMatrix );
    this.grabDragFocusHighlight.addChild( this.grabCueNode );
    this.dragCueNode.prependMatrix( startingMatrix );
    this.grabDragFocusHighlight.addChild( this.dragCueNode );

    // Some key presses can fire the node's click (the grab button) from the same press that fires the keydown from
    // the draggable, so guard against that.
    let guardKeyPressFromDraggable = false;

    // when the "Grab {{thing}}" button is pressed, focus the draggable node and set to dragged state
    const grabButtonListener = {
      click: () => {

        // don't turn to draggable on mobile a11y, it is the wrong gesture - user should press down and hold
        // to initiate a drag
        if ( this.supportsGestureDescription || !this.enabled ) {
          return;
        }

        // if the draggable was just released, don't pick it up again until the next click event so we don't "loop"
        // and pick it up immediately again.
        if ( guardKeyPressFromDraggable ) {

          // "grab" the draggable on the next click event
          guardKeyPressFromDraggable = false;
          return;
        }

        // blur as a grabbable so that we get a new focus event after we turn into a draggable, and so that grab listeners get a blur() event before mutating.
        this.node.blur();

        this.grabDragModel.keyboardGrab( () => {

          // focus after the transition so that listeners added to the draggable state get a focus event().
          this.node.focus();
        } );

      },

      focus: () => {
        this.updateVisibilityForCues();

        if ( this.enabled && isVoicing( this.node ) && this.showGrabCueNode() ) {
          const alert = this.voicingFocusUtterance.alert! as ResponsePacket;
          alert.hintResponse = SceneryPhetStrings.a11y.grabDrag.spaceToGrabOrReleaseStringProperty;
          Voicing.alertUtterance( this.voicingFocusUtterance );
        }
      },

      blur: () => this.updateVisibilityForCues()
    };

    // Keep track of all listeners to swap out grab/drag functionalities.
    this.listenersWhileGrabbable = options.listenersWhileGrabbable.concat( grabButtonListener );

    const dragDivDownListener = new KeyboardListener( {
      keys: [ 'enter' ],
      fire: () => {


        // set a guard to make sure the key press from enter doesn't fire future listeners, therefore
        // "clicking" the grab button also on this key press.
        // The sequence that dispatched this fire also dispatches a click event, so we must avoid immediately grabbing
        // from this event that released
        guardKeyPressFromDraggable = true;
        this.grabDragModel.release();
      }
    } );

    const dragDivUpListener = new KeyboardListener( {
      keys: [ 'space', 'escape' ],

      // For the release action, it is more typical to fire it when the key is released.
      fireOnDown: false,
      fire: () => {

        // Release on keyup for spacebar so that we don't pick up the draggable again when we release the spacebar
        // and trigger a click event - escape could be added to either keyup or keydown listeners
        this.grabDragModel.release();
      },

      // release when focus is lost
      blur: () => this.grabDragModel.release(),

      // if successfully dragged, then make the cue node invisible
      focus: () => this.updateVisibilityForCues()
    } );

    // Update the visibility of dragging cues whenever keyboard dragging keys release (keyup), bug fix for https://github.com/phetsims/scenery-phet/issues/868
    const dragDivDraggedListener = new KeyboardListener( {
      keys: keyboardDraggingKeys, // TODO: This doesn't support shift+X controls, https://github.com/phetsims/scenery-phet/issues/868
      fireOnDown: false,
      fire: () => this.updateVisibilityForCues(),

      // These options simulate PressListener's attach:false option, and will ensure this doesn't disrupt other keys
      override: false,
      allowOverlap: true
    } );

    this.listenersWhileDraggable = options.listenersWhileDraggable.concat( [
      dragDivDownListener,
      dragDivUpListener,
      dragDivDraggedListener,
      keyboardDragListener
    ] );

    this.pressReleaseListener = new DragListener( {
      press: event => {
        if ( !event.isFromPDOM() ) {
          this.grabDragModel.grab();
        }
      },
      release: event => {

        // If the event is null, then we are in the interrupt case, and should attempt to release()
        // If the release is an event from the PDOM (which shouldn't happen most of the time), then PDOM listeners will
        // handle the release().
        const shouldRelease = ( event === null || !event.isFromPDOM() );

        // release if interrupted, but only if not already grabbable, which is possible if the GrabDragInteraction
        // has been reset since press
        if ( shouldRelease && this.grabDragModel.interactionStateProperty.value === 'draggable' ) {
          this.grabDragModel.release();
        }
      },

      // this listener shouldn't prevent the behavior of other listeners, and this listener should always fire
      // whether the pointer is already attached
      attach: false,
      enabledProperty: this.enabledProperty,
      tandem: options.tandem.createTandem( 'pressReleaseListener' )
    } );
    this.node.addInputListener( this.pressReleaseListener );

    assert && assert( this.grabDragModel.interactionStateProperty.value === 'grabbable', 'starting state grabbable please' );

    // Update the interaction, pdom, focus, etc when the state changes.
    this.grabDragModel.interactionStateProperty.link( () => this.updateFromState() );


    this.enabledProperty.lazyLink( enabled => {
      if ( !enabled ) {
        this.interrupt(); // This will trigger state change to grabbable via DragListener.release()
      }

      this.updateVisibilityForCues();
    } );

    const inputEnabledListener = ( nodeInputEnabled: boolean ) => { this.enabled = nodeInputEnabled; };

    // Use the "owns" pattern here to keep the enabledProperty PhET-iO instrumented based on the super options.
    // If the client specified their own enabledProperty, then they are responsible for managing enabled.
    ownsEnabledProperty && this.node.inputEnabledProperty.lazyLink( inputEnabledListener );

    this.disposeEmitter.addListener( () => {

      this.node.removeInputListener( this.pressReleaseListener );
      ownsEnabledProperty && this.node.inputEnabledProperty.unlink( inputEnabledListener );

      this.node.removePDOMAttribute( 'aria-roledescription' );

      // Remove listeners (gracefully)
      this.removeInputListeners( this.listenersWhileGrabbable );
      this.removeInputListeners( this.listenersWhileDraggable );

      dragDivDownListener.dispose();
      dragDivUpListener.dispose();
      this.pressReleaseListener.dispose();

      releasedUtterance.dispose();
      this.voicingFocusUtterance.dispose();

      // Focus and cue disposal
      ownsFocusHighlight && this.grabDragFocusHighlight.dispose();
      ownsInteractiveHighlight && this.grabDragInteractiveHighlight.dispose();
      this.grabCueNode.dispose();
      this.dragCueNode.detach();

      this.grabDragModel.dispose();
    } );
  }

  /**
   * Update the node to switch modalities between being draggable, and grabbable. This function holds code that should
   * be called when switching from any state to any other state.
   */
  private updateFromState(): void {
    const interactionState = this.grabDragModel.interactionStateProperty.value;

    const listenersToRemove = interactionState === 'grabbable' ? this.listenersWhileDraggable : this.listenersWhileGrabbable;

    // interrupt prior input, reset the key state of the drag handler by interrupting the drag. Don't interrupt all
    // input, but instead just those to be removed.
    listenersToRemove.forEach( listener => listener.interrupt && listener.interrupt() );

    // remove all previous listeners from the node
    this.removeInputListeners( listenersToRemove );

    // To support gesture and mobile screen readers, we change the roledescription, see https://github.com/phetsims/scenery-phet/issues/536
    // By default, the grabbable gets a roledescription to force the AT to say its role. This fixes a bug in VoiceOver
    // where it fails to update the role after turning back into a grabbable.
    // See https://github.com/phetsims/scenery-phet/issues/688.
    this.node.setPDOMAttribute( 'aria-roledescription',
      ( interactionState === 'draggable' || this.supportsGestureDescription ) ? movableStringProperty : buttonStringProperty
    );

    this.updateAriaDescribedby( interactionState );

    // update the PDOM of the node
    const nodeOptions = interactionState === 'grabbable' ? this.grabbableOptions : this.draggableOptions;
    this.node.mutate( nodeOptions );
    assert && this.enabledProperty.value && assert( this.node.focusable, 'GrabDragInteraction node must remain focusable after mutation' );

    const listenersToAdd = interactionState === 'grabbable' ? this.listenersWhileGrabbable : this.listenersWhileDraggable;
    this.addInputListeners( listenersToAdd );

    this.updateFocusHighlights();
    this.updateVisibilityForCues();

    assert && assert( this.grabDragModel.interactionStateProperty.value === interactionState,
      'updating from state should not change the interaction state.' );
  }

  private updateAriaDescribedby( interactionState: GrabDragInteractionState ): void {

    if ( interactionState === 'grabbable' && this.shouldAddAriaDescribedby() ) {

      // this node is aria-describedby its own description content, so that the description is read automatically
      // when found by the user
      !this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) &&
      this.node.addAriaDescribedbyAssociation( this.descriptionAssociationObject );
    }
    else {

      // This node is aria-describedby its own description content only when grabbable, so that the description is
      // read automatically when found by the user with the virtual cursor. Remove it for draggable
      if ( this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) ) {
        this.node.removeAriaDescribedbyAssociation( this.descriptionAssociationObject );
      }
    }
  }

  /**
   * Update the focusHighlights according to if we are in grabbable or draggable state
   * No need to set visibility to true, because that will happen for us by HighlightOverlay on focus.
   */
  private updateFocusHighlights(): void {
    this.grabDragFocusHighlight.setDashed( this.grabDragModel.interactionStateProperty.value === 'draggable' );
    this.grabDragInteractiveHighlight.setDashed( this.grabDragModel.interactionStateProperty.value === 'draggable' );
  }

  /**
   * Update the visibility of the cues for both grabbable and draggable states.
   */
  private updateVisibilityForCues(): void {
    this.dragCueNode.visible = this.enabled && this.grabDragModel.interactionStateProperty.value === 'draggable' &&
                               this.showDragCueNode();
    this.grabCueNode.visible = this.enabled && this.grabDragModel.interactionStateProperty.value === 'grabbable' &&
                               this.showGrabCueNode();
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
   * Node is back in its "grabbable" state.
   */
  public interrupt(): void {

    // Interrupting this listener will set us back to grabbable
    this.pressReleaseListener.interrupt();

    assert && assert( this.grabDragModel.interactionStateProperty.value === 'grabbable', 'disabled grabDragInteractions must be in "grabbable" state.' );
  }

  /**
   * Often onGrab callbacks need to know whether the grab was triggered from keyboard/pdom, in which case it should
   * trigger description, OR triggered via mouse/touch which may not trigger description because another listener may
   * be responsible.
   */
  public isInputFromMouseOrTouch(): boolean {
    return this.pressReleaseListener.isPressed;
  }

  /**
   * Reset to initial state
   */
  public reset(): void {
    this.grabDragModel.reset();
    this.voicingFocusUtterance.reset();
    this.updateVisibilityForCues();
  }
}

sceneryPhet.register( 'GrabDragInteraction', GrabDragInteraction );