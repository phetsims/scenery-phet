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
 * TODO: Having the model be modeProperty = 'grabbable' or 'draggable' and listening for changes in that could help address some of the recommendations below.
 *        Like interactionStateProperty https://github.com/phetsims/scenery-phet/issues/869
 * TODO: Have two classes, one for all the grabbable stuff, and one for the draggable. https://github.com/phetsims/scenery-phet/issues/869
 *        - have demos for grab/drag, and just grab, and just drag
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
import EnabledComponent, { EnabledComponentOptions } from '../../../../axon/js/EnabledComponent.js';
import assertHasProperties from '../../../../phet-core/js/assertHasProperties.js';
import getGlobal from '../../../../phet-core/js/getGlobal.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Association, DragListener, HighlightFromNode, HighlightPath, InteractiveHighlightingNode, keyboardDraggingKeys, KeyboardDragListener, KeyboardListener, Node, NodeOptions, ParallelDOMOptions, PDOMPeer, PDOMValueType, SceneryEvent, SceneryListenerFunction, SceneryNullableListenerFunction, TInputListener, Voicing, VoicingNode } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import AriaLiveAnnouncer from '../../../../utterance-queue/js/AriaLiveAnnouncer.js';
import ResponsePacket from '../../../../utterance-queue/js/ResponsePacket.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import sceneryPhet from '../../sceneryPhet.js';
import SceneryPhetStrings from '../../SceneryPhetStrings.js';
import GrabReleaseCueNode from '../nodes/GrabReleaseCueNode.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import LocalizedStringProperty from '../../../../chipper/js/LocalizedStringProperty.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';

// constants
const grabPatternStringStringProperty = SceneryPhetStrings.a11y.grabDrag.grabPatternStringProperty;
const gestureHelpTextPatternStringProperty = SceneryPhetStrings.a11y.grabDrag.gestureHelpTextPatternStringProperty;
const movableStringProperty = SceneryPhetStrings.a11y.grabDrag.movableStringProperty;
const buttonStringProperty = SceneryPhetStrings.a11y.grabDrag.buttonStringProperty;
const defaultObjectToGrabStringProperty = SceneryPhetStrings.a11y.grabDrag.defaultObjectToGrabStringProperty;
const releasedStringProperty = SceneryPhetStrings.a11y.grabDrag.releasedStringProperty;

type SelfOptions = {

  // A string that is filled in to the appropriate button label
  objectToGrabString?: LocalizedStringProperty | string;

  // If not provided, a default will be applied, see this.grabbableAccessibleName.
  grabbableAccessibleName?: null | string;

  // Called when the node is "grabbed" (when the grab button fires); button -> draggable.
  onGrab?: SceneryListenerFunction;

  // Called when the node is "released" (when the draggable is "let go"); draggable -> button
  onRelease?: () => void;

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
  shouldAddAriaDescription?: ( numberOfGrabs: number ) => boolean;

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

  // For sharing cueing logic between multiple instance of GrabDragInteraction
  grabDragCueModel?: GrabDragCueModel;
};

type ParentOptions = EnabledComponentOptions;
type GrabDragInteractionOptions = SelfOptions & ParentOptions;

// Options that can be forwarded to the target Node when the state changes. Fields that are set by the implementation
// of GrabDragInteraction are omitted.
type StateOptions = StrictOmit<ParallelDOMOptions, 'descriptionContent' | 'helpText' | 'descriptionTagName' | 'accessibleName' | 'innerContent' | 'ariaLabel'>;

export default class GrabDragInteraction extends EnabledComponent {

  // The accessible name for the Node in its 'draggable' interactionState.
  private readonly draggableAccessibleName: string | LocalizedStringProperty;

  // The accessible name for the Node in its "grabbable" interactionState.
  private readonly grabbableAccessibleName: string | LocalizedStringProperty;

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
  private readonly shouldAddAriaDescription: ( numberOfGrabs: number ) => boolean;

  private readonly supportsGestureDescription: boolean;

  // Keep track of all listeners to swap out grab/drag functionalities
  // TODO: Would it be simpler to keep these and other attributes in a constructor closure? See https://github.com/phetsims/scenery-phet/issues/869
  private readonly listenersWhileGrabbable: TInputListener[];
  private readonly listenersWhileDraggable: TInputListener[];

  // Model-related state of the current and general info about the interaction.
  private readonly grabDragModel: GrabDragModel;

  // The aria-describedby association object that will associate "interactionState" with its
  // help text so that it is read automatically when the user finds it. This reference is saved so that
  // the association can be removed when the node becomes a "draggable".
  private readonly descriptionAssociationObject: Association;

  // A reusable Utterance for Voicing output from this type.
  private readonly voicingFocusUtterance: Utterance;

  private readonly onRelease: SceneryNullableListenerFunction;
  private readonly onGrab: SceneryListenerFunction;

  private readonly ownsGrabFocusHighlight: boolean;
  private readonly grabFocusHighlight: HighlightPath;

  private readonly ownsGrabInteractiveHighlight: boolean;
  private readonly grabInteractiveHighlight: HighlightPath;

  private readonly dragFocusHighlight: HighlightPath;
  private readonly dragInteractiveHighlight: HighlightPath;

  // For mouse and touch events (non-PDOM pointer events), change state and representations in the PDOM - This is
  // important to update interactive highlights, because the highlight showing the state can be seen. It is also
  // important for AT that use pointer events like iOS VoiceOver.
  // A DragListener is used instead of a PressListener to work with touchSnag.
  // Note this is NOT the DragListener that implements dragging on the target.
  private readonly pressReleaseListener: DragListener;

  private readonly disposeGrabDragInteraction: () => void;

  /**
   * @param node - will be mutated with a11y options to have the grab/drag functionality in the PDOM
   * @param keyboardDragListener - added to the Node when it is draggable
   * @param providedOptions
   */
  public constructor( node: Node, keyboardDragListener: KeyboardDragListener, providedOptions?: GrabDragInteractionOptions ) {

    const ownsEnabledProperty = !providedOptions || !providedOptions.enabledProperty;

    // Options filled in the second optionize pass are ommitted from the self options of first pass.
    const firstPassOptions = optionize<GrabDragInteractionOptions, StrictOmit<SelfOptions, 'gestureHelpText' | 'shouldAddAriaDescription'>, ParentOptions>()( {
      objectToGrabString: defaultObjectToGrabStringProperty,
      grabbableAccessibleName: null,
      onGrab: _.noop,
      onRelease: _.noop,
      grabbableOptions: {
        appendDescription: true // in general, the help text is after the grabbable
      },
      grabCueOptions: {},
      draggableOptions: {},
      dragCueNode: new Node(),
      listenersWhileDraggable: [],
      listenersWhileGrabbable: [],
      supportsGestureDescription: getGlobal( 'phet.joist.sim.supportsGestureDescription' ),
      keyboardHelpText: null,
      showGrabCueNode: () => {
        return this.grabDragModel.grabDragCueModel.numberOfKeyboardGrabs < 1 && node.inputEnabled;
      },
      showDragCueNode: () => {
        return true;
      },

      // EnabledComponent
      phetioEnabledPropertyInstrumented: true,
      enabledPropertyOptions: {

        // It is best to wire up grab drag enabled to be in sync with mouse/touch inputEnabled (instead of having both
        // editable by PhET-iO).
        phetioReadOnly: true,
        phetioFeatured: false
      },

      grabDragCueModel: new GrabDragCueModel(),

      // For instrumenting (DragListener is also Tandem.REQUIRED)
      tandem: Tandem.REQUIRED
    }, providedOptions );

    // a second block for options that use other options, therefore needing the defaults to be filled in
    const options = optionize<GrabDragInteractionOptions, EmptySelfOptions, GrabDragInteractionOptions>()( {
      gestureHelpText: StringUtils.fillIn( gestureHelpTextPatternStringProperty, {
        objectToGrab: firstPassOptions.objectToGrabString
      } ),
      shouldAddAriaDescription: numberOfGrabs => firstPassOptions.supportsGestureDescription && numberOfGrabs < 2
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

      // position the PDOM elements when grabbable for drag and drop on touch-based screen readers
      positionInPDOM: true,

      // {string}
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

    this.grabDragModel = new GrabDragModel( options.grabDragCueModel );
    this.node = node;
    this.grabbableOptions = options.grabbableOptions;
    this.draggableOptions = options.draggableOptions;
    this.dragCueNode = options.dragCueNode;
    this.grabCueNode = new GrabReleaseCueNode( options.grabCueOptions );
    this.showGrabCueNode = options.showGrabCueNode;
    this.showDragCueNode = options.showDragCueNode;
    this.shouldAddAriaDescription = options.shouldAddAriaDescription;
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

    const voicingNode = node as VoicingNode; /// TODO: Better way to do this? See https://github.com/phetsims/scenery-phet/issues/869 Maybe in a subclass? Or this.grabDragVoicing = isVoicing ? new GrabDragVoicing( model, options );?
    const interactiveHighlightingNode = node as InteractiveHighlightingNode; /// TODO: Better way to do this? See https://github.com/phetsims/scenery-phet/issues/869 Maybe in a subclass? Or this.grabDragVoicing = isVoicing ? new GrabDragVoicing( model, options );?
    if ( voicingNode.isVoicing ) {
      assert && assert( voicingNode.voicingFocusListener === voicingNode.defaultFocusListener, 'GrabDragInteraction sets ' +
                                                                                               'its own voicingFocusListener.' );

      // sanity check on the voicing interface API.
      assertHasProperties( voicingNode, [ 'voicingFocusListener' ] );

      voicingNode.voicingFocusListener = event => {

        // When swapping from interactionState to draggable, the draggable element will be focused, ignore that case here, see https://github.com/phetsims/friction/issues/213
        this.grabDragModel.interactionState === 'grabbable' && voicingNode.defaultFocusListener();
      };

      // These Utterances should only be announced if the Node is globally visible and voicingVisible.
      Voicing.registerUtteranceToVoicingNode( releasedUtterance, voicingNode );
      Voicing.registerUtteranceToVoicingNode( this.voicingFocusUtterance, voicingNode );
    }

    // Wrap the optional onRelease in logic that is needed for the core type.
    this.onRelease = () => {
      options.onRelease && options.onRelease();

      this.node.alertDescriptionUtterance( releasedUtterance );
      voicingNode.isVoicing && Voicing.alertUtterance( releasedUtterance );
    };
    this.onGrab = options.onGrab;

    assert && node.focusHighlight && assert( node.focusHighlight instanceof HighlightPath,
      'if provided, focusHighlight must be a Path to support highlightChangedEmitter' );
    assert && interactiveHighlightingNode.interactiveHighlight && assert( interactiveHighlightingNode.interactiveHighlight instanceof HighlightPath,
      'if provided, interactiveHighlight must be a Path to support highlightChangedEmitter' );
    if ( node.focusHighlightLayerable ) {
      assert && assert( node.focusHighlight,
        'if focusHighlightLayerable, the highlight must be set to the node before constructing the grab/drag interaction.' );
      assert && assert( ( node.focusHighlight! as HighlightPath ).parent,
        'if focusHighlightLayerable, the highlight must be added to the scene graph before grab/drag construction.' );
    }
    if ( interactiveHighlightingNode.isInteractiveHighlighting && interactiveHighlightingNode.interactiveHighlightLayerable ) {
      assert && assert( interactiveHighlightingNode.interactiveHighlight,
        'An interactive highlight must be set to the Node before construction when using interactiveHighlightLayerable' );
      assert && assert( ( interactiveHighlightingNode.interactiveHighlight! as HighlightPath ).parent,
        'if interactiveHighlightLayerable, the highlight must be added to the scene graph before construction' );
    }

    // Take highlights from the node for the grab button interaction. The Interactive Highlights cannot fall back to
    // the default focus highlights because GrabDragInteraction adds "grab cue" Nodes as children
    // to the focus highlights that should not be displayed when using Interactive Highlights.
    this.ownsGrabFocusHighlight = !node.focusHighlight;
    // TODO: provide shapeProperty to our instance of HighlightPath instead of sometimes owning it, https://github.com/phetsims/scenery-phet/issues/869
    this.grabFocusHighlight = ( node.focusHighlight as HighlightPath ) || new HighlightFromNode( node );

    this.ownsGrabInteractiveHighlight = !interactiveHighlightingNode.interactiveHighlight;
    // TODO: provide shapeProperty to our instance of HighlightPath instead of sometimes owning it, https://github.com/phetsims/scenery-phet/issues/869
    this.grabInteractiveHighlight = ( interactiveHighlightingNode.interactiveHighlight as HighlightPath ) || new HighlightFromNode( node );

    node.focusHighlight = this.grabFocusHighlight;
    interactiveHighlightingNode.isInteractiveHighlighting && interactiveHighlightingNode.setInteractiveHighlight( this.grabInteractiveHighlight );

    // Make the draggable highlights in the spitting image of the node's grabbable highlights.
    // TODO: What if the grabFocusHighlight shape changes? https://github.com/phetsims/scenery-phet/issues/869
    this.dragFocusHighlight = new HighlightPath( this.grabFocusHighlight.shape, {
      visible: false,
      transformSourceNode: this.grabFocusHighlight.transformSourceNode || node
    } );
    // TODO: What if the grabFocusHighlight shape changes? https://github.com/phetsims/scenery-phet/issues/869
    this.dragInteractiveHighlight = new HighlightPath( this.grabInteractiveHighlight.shape, {
      visible: false,
      transformSourceNode: ( this.grabInteractiveHighlight instanceof HighlightPath && this.grabInteractiveHighlight.transformSourceNode ) ? this.grabInteractiveHighlight.transformSourceNode : node
    } );

    // Update the passed in node's focusHighlight to make it dashed for the "draggable" state
    this.dragFocusHighlight.makeDashed( true );
    this.dragInteractiveHighlight.makeDashed( true );

    // if the Node layers its interactive highlights in the scene graph, add the dragInteractiveHighlight in the same
    // way the grabInteractiveHighlight was added
    if ( interactiveHighlightingNode.interactiveHighlightLayerable ) {
      assert && assert( this.grabInteractiveHighlight.parent, 'A parent is required if the highlight is layerable.' );
      this.grabInteractiveHighlight.parent!.addChild( this.dragInteractiveHighlight );
    }

    // if ever we update the node's highlights, then update the grab button's too to keep in syn.
    // TODO: Can these change if we provide the shapeProperty in the constructor? MK doesn't think so because highlightChangedEmitter is weird. https://github.com/phetsims/scenery-phet/issues/869
    const onFocusHighlightChange = () => {
      this.dragFocusHighlight.setShape( this.grabFocusHighlight.shape );
    };
    this.grabFocusHighlight.highlightChangedEmitter.addListener( onFocusHighlightChange );

    const onInteractiveHighlightChange = () => {
      this.dragInteractiveHighlight.setShape( this.grabInteractiveHighlight.shape );
    };
    this.grabInteractiveHighlight.highlightChangedEmitter.addListener( onInteractiveHighlightChange );

    // only the focus highlights have "cue" Nodes so we do not need to do any work here for the Interactive Highlights
    const startingMatrix = node.getMatrix();
    this.grabCueNode.prependMatrix( startingMatrix );
    this.grabFocusHighlight.addChild( this.grabCueNode );
    this.dragCueNode.prependMatrix( startingMatrix );
    this.dragFocusHighlight.addChild( this.dragCueNode );

    // Some key presses can fire the node's click (the grab button) from the same press that fires the keydown from
    // the draggable, so guard against that.
    let guardKeyPressFromDraggable = false;

    // when the "Grab {{thing}}" button is pressed, focus the draggable node and set to dragged state
    const grabButtonListener = {
      click: ( event: SceneryEvent ) => {

        // don't turn to draggable on mobile a11y, it is the wrong gesture - user should press down and hold
        // to initiate a drag
        if ( this.supportsGestureDescription || !this.enabled ) {
          return;
        }

        // if the draggable was just released, don't pick it up again until the next click event so we don't "loop"
        // and pick it up immediately again.
        if ( !guardKeyPressFromDraggable ) {

          // blur as a grabbable so that we get a new focus event after we turn into a draggable // TODO: Why do we need a new focus event? See https://github.com/phetsims/scenery-phet/issues/869
          this.node.blur();

          // TODO: Using the same DOM element for grabbing and dragging could be less confusing for screen reader users, and would not require swapping and transferring focus. See https://github.com/phetsims/scenery-phet/issues/869
          this.setDraggable();

          this.grabDragModel.grabDragCueModel.numberOfKeyboardGrabs++;

          // focus after the transition
          this.node.focus();

          this.onGrab( event );

          // Add the newly created focusHighlight to the scene graph if focusHighlightLayerable, just like the
          // original focus highlight was added. By doing this on click, we make sure that the node's
          // focusHighlight has been completely constructed (added to the scene graph) and can use its parent. But only
          // do it once.
          if ( node.focusHighlightLayerable ) {
            const grabHighlightParent = this.grabFocusHighlight.parent!;
            assert && assert( grabHighlightParent, 'how can we have focusHighlightLayerable with a node that is not ' +
                                                   'in the scene graph?' );
            // If not yet added, do so now.
            if ( !grabHighlightParent.hasChild( this.dragFocusHighlight ) ) {
              grabHighlightParent.addChild( this.dragFocusHighlight );
            }
          }
        }

        // "grab" the draggable on the next click event
        guardKeyPressFromDraggable = false;
      },

      focus: () => {
        this.updateVisibilityForCues();

        if ( this.enabled && voicingNode.isVoicing && this.showGrabCueNode() ) {
          const alert = this.voicingFocusUtterance.alert! as ResponsePacket;
          alert.hintResponse = SceneryPhetStrings.a11y.grabDrag.spaceToGrabOrReleaseStringProperty;
          Voicing.alertUtterance( this.voicingFocusUtterance );
        }
      },

      blur: () => this.updateVisibilityForCues()
    };

    // Keep track of all listeners to swap out grab/drag functionalities.
    this.listenersWhileGrabbable = options.listenersWhileGrabbable.concat( grabButtonListener );

    // TODO: is it important/necessary to swap out divs and listeners here? If so, why? Why not just have one listener that knows how to do the right thing based on the current state? See https://github.com/phetsims/scenery-phet/issues/869
    // TODO: Or if it is importantant that one is fireOnDown and one is not, why not always have both listeners, but no-op the irrelevant one? See https://github.com/phetsims/scenery-phet/issues/869
    const dragDivDownListener = new KeyboardListener( {
      keys: [ 'enter' ],
      fire: () => {

        // set a guard to make sure the key press from enter doesn't fire future listeners, therefore
        // "clicking" the grab button also on this key press.
        // TODO: Could it be clearer to remove the grabButtonListener, then call releaseDraggable, then add the grabButtonListener back? See https://github.com/phetsims/scenery-phet/issues/869
        guardKeyPressFromDraggable = true;
        this.releaseDraggable( null );
      }
    } );

    // TODO: Why is enter on down but spacebar is on up? Should they be consistent? See https://github.com/phetsims/scenery-phet/issues/869
    const dragDivUpListener = new KeyboardListener( {
      keys: [ 'space', 'escape' ],
      fireOnDown: false,
      fire: () => {

        // Release on keyup for spacebar so that we don't pick up the draggable again when we release the spacebar
        // and trigger a click event - escape could be added to either keyup or keydown listeners
        this.releaseDraggable( null ); // TODO: Why not send along the key event? See https://github.com/phetsims/scenery-phet/issues/869
      },

      // release when focus is lost
      blur: () => this.releaseDraggable( null ),

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
          this.setDraggable();
          this.onGrab( event );
        }
      },
      release: event => {

        // release if interrupted, but only if not already grabbable, which is possible if the GrabDragInteraction
        // has been reset since press
        if ( ( event === null || !event.isFromPDOM() ) && this.grabDragModel.interactionState === 'draggable' ) {
          this.releaseDraggable( event );
        }
      },

      // this listener shouldn't prevent the behavior of other listeners, and this listener should always fire
      // whether the pointer is already attached
      attach: false,
      enabledProperty: this.enabledProperty,
      tandem: options.tandem.createTandem( 'pressReleaseListener' )
    } );
    this.node.addInputListener( this.pressReleaseListener );

    // Initialize the Node as a grabbable (button) to begin with
    this.setGrabbable();

    this.enabledProperty.lazyLink( enabled => {
      if ( !enabled ) {
        this.interrupt(); // This will trigger state change to grabbable via DragListener.release()
        assert && assert( this.grabDragModel.interactionState === 'grabbable', 'disabled grabDragInteractions must be in "grabbable" state.' );
      }

      this.updateVisibilityForCues();
    } );

    const inputEnabledListener = ( nodeInputEnabled: boolean ) => { this.enabled = nodeInputEnabled; };

    // Use the "owns" pattern here to keep the enabledProperty PhET-iO instrumented based on the super options.
    // If the client specified their own enabledProperty, then they are responsible for managing enabled.
    ownsEnabledProperty && this.node.inputEnabledProperty.lazyLink( inputEnabledListener );

    this.disposeGrabDragInteraction = () => {

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
      this.grabFocusHighlight.highlightChangedEmitter.removeListener( onFocusHighlightChange );
      this.grabInteractiveHighlight.highlightChangedEmitter.removeListener( onInteractiveHighlightChange );
      this.ownsGrabFocusHighlight && this.grabFocusHighlight.dispose();
      this.ownsGrabInteractiveHighlight && this.grabInteractiveHighlight.dispose();
      this.dragFocusHighlight.dispose();
      this.dragInteractiveHighlight.dispose();
      this.grabCueNode.dispose();
      this.dragCueNode.detach();
    };
  }

  /**
   * Release the draggable. TODO: Document when it is appropriate for a client to call this from the outside, see https://github.com/phetsims/scenery-phet/issues/869
   */
  public releaseDraggable( event: SceneryEvent | null ): void {
    assert && assert( this.grabDragModel.interactionState === 'draggable', 'cannot set to interactionState if already set that way' );
    this.setGrabbable();
    this.onRelease( event );
  }

  /**
   * TODO: This is only called by GrabDragInteraction at the moment, is it intended for public use? See https://github.com/phetsims/scenery-phet/issues/869
   * turn the Node into the grabbable (button), swap out listeners too
   *
   * TODO: Should this be named "release"? See https://github.com/phetsims/scenery-phet/issues/869 How does it differ from releaseDraggable?
   */
  private setGrabbable(): void {

    // TODO: Should we bail early if setting to 'grabbable' when it was already 'grabbable'? Would make it idempotent, which would be clearer, see https://github.com/phetsims/scenery-phet/issues/869
    this.grabDragModel.interactionState = 'grabbable';

    // To support gesture and mobile screen readers, we change the roledescription, see https://github.com/phetsims/scenery-phet/issues/536
    // By default, the grabbable gets a roledescription to force the AT to say its role. This fixes a bug in VoiceOver
    // where it fails to update the role after turning back into a grabbable.
    // See https://github.com/phetsims/scenery-phet/issues/688.
    this.node.setPDOMAttribute( 'aria-roledescription', this.supportsGestureDescription ? movableStringProperty : buttonStringProperty );

    if ( this.shouldAddAriaDescription( this.grabDragModel.grabDragCueModel.numberOfGrabs ) ) {

      // this node is aria-describedby its own description content, so that the description is read automatically
      // when found by the user
      !this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) && this.node.addAriaDescribedbyAssociation( this.descriptionAssociationObject );
    }
    else if ( this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) ) {
      this.node.removeAriaDescribedbyAssociation( this.descriptionAssociationObject );
    }

    this.baseInteractionUpdate( this.grabbableOptions, this.listenersWhileDraggable, this.listenersWhileGrabbable );
  }

  /**
   * Turn the node into a draggable by updating accessibility representation in the PDOM and changing input
   * listeners.
   */
  private setDraggable(): void {  // TODO: A name like grab() would be clearer than setDraggable(), see https://github.com/phetsims/scenery-phet/issues/869

    // TODO: Should we bail early if setting to 'draggable' when it was already 'draggable'? Would make it idempotent, which would be clearer, see https://github.com/phetsims/scenery-phet/issues/869
    this.grabDragModel.grabDragCueModel.numberOfGrabs++;

    this.grabDragModel.interactionState = 'draggable';

    // TODO: Should the remainder of this function be a callback that is triggered when the state changes to draggable? See https://github.com/phetsims/scenery-phet/issues/869

    // by default, the draggable has roledescription of "movable".
    this.node.setPDOMAttribute( 'aria-roledescription', movableStringProperty );

    // This node is aria-describedby its own description content only when grabbable, so that the description is
    // read automatically when found by the user with the virtual cursor. Remove it for draggable
    if ( this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) ) {
      this.node.removeAriaDescribedbyAssociation( this.descriptionAssociationObject );
    }

    // turn this into a draggable in the node
    this.baseInteractionUpdate( this.draggableOptions, this.listenersWhileGrabbable, this.listenersWhileDraggable );
  }

  /**
   * Update the node to switch modalities between being draggable, and grabbable. This function holds code that should
   * be called when switching in either direction.
   */
  // TODO: Would this be clearer to have immutable listeners that we do not interrupt or swap out, that we deal with the state in the callback? See https://github.com/phetsims/scenery-phet/issues/869
  private baseInteractionUpdate( nodeOptions: ParallelDOMOptions, listenersToRemove: TInputListener[], listenersToAdd: TInputListener[] ): void {

    // interrupt prior input, reset the key state of the drag handler by interrupting the drag. Don't interrupt all
    // input, but instead just those to be removed.
    listenersToRemove.forEach( listener => listener.interrupt && listener.interrupt() );

    // remove all previous listeners from the node
    this.removeInputListeners( listenersToRemove );

    // update the PDOM of the node
    this.node.mutate( nodeOptions );
    assert && this.enabledProperty.value && assert( this.node.focusable, 'GrabDragInteraction node must remain focusable after mutation' );

    this.addInputListeners( listenersToAdd );

    this.updateFocusHighlights();
    this.updateVisibilityForCues();
  }

  /**
   * Update the focusHighlights according to if we are in grabbable or draggable state
   * No need to set visibility to true, because that will happen for us by HighlightOverlay on focus.
   */
  private updateFocusHighlights(): void {

    // TODO: If we always cast to InteractiveHighlightingNode, how about a new type like MaybeInteractiveHighlightingNode and pass that in to the constructor, see https://github.com/phetsims/scenery-phet/issues/869
    const interactiveHighlightingNode = this.node as InteractiveHighlightingNode;

    if ( this.grabDragModel.interactionState === 'grabbable' ) {
      this.node.focusHighlight = this.grabFocusHighlight;
      interactiveHighlightingNode.isInteractiveHighlighting && interactiveHighlightingNode.setInteractiveHighlight( this.grabInteractiveHighlight );
    }
    else {
      this.node.focusHighlight = this.dragFocusHighlight;
      interactiveHighlightingNode.isInteractiveHighlighting && interactiveHighlightingNode.setInteractiveHighlight( this.dragInteractiveHighlight );
    }
  }

  /**
   * Update the visibility of the cues for both grabbable and draggable states.
   */
  private updateVisibilityForCues(): void {
    this.dragCueNode.visible = this.enabled && this.showDragCueNode();
    this.grabCueNode.visible = this.enabled && this.showGrabCueNode();
  }

  /**
   * Add all listeners to node
   * TODO: Is the gracefulness still important here? If so, document why, see https://github.com/phetsims/scenery-phet/issues/869
   */
  private addInputListeners( listeners: TInputListener[] ): void {
    for ( let i = 0; i < listeners.length; i++ ) {
      const listener = listeners[ i ];
      if ( !this.node.hasInputListener( listener ) ) {
        this.node.addInputListener( listener );
      }
    }
  }

  /**
   * Remove all listeners from the node.
   * TODO: Is the gracefulness still important here? If so, document why, see https://github.com/phetsims/scenery-phet/issues/869
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
   * @override
   */
  public override dispose(): void {
    this.disposeGrabDragInteraction();
    super.dispose();
  }

  /**
   * Interrupt the grab drag interraction - interrupts any listeners attached and makes sure the
   * Node is back in its "grabbable" state.
   */
  public interrupt(): void {
    this.pressReleaseListener.interrupt();

    // TODO: Where is the code that moves this back to 'grabbable'? It is somewhat hidden in the interrupt() method, see https://github.com/phetsims/scenery-phet/issues/869
    // TODO: Maybe at a minimum add an assertion that we landed in the right state? See https://github.com/phetsims/scenery-phet/issues/869
  }

  /**
   * Reset to initial state
   */
  public reset(): void {

    // reset numberOfGrabs for setGrabbable
    this.grabDragModel.reset();
    this.setGrabbable();

    this.voicingFocusUtterance.reset();

    // setGrabbable will update this, so reset it again
    this.grabDragModel.reset();
    this.updateVisibilityForCues();
  }
}

// TODO: Move to a separate file, see https://github.com/phetsims/scenery-phet/issues/869
export class GrabDragCueModel {

  // The number of times the component has been picked up for dragging, regardless
  // of pickup method for things like determining content for "hints" describing the interaction
  // to the user
  public numberOfGrabs = 0;

  // The number of times this component has been picked up with a keyboard specifically to provide hints specific
  // to alternative input.
  public numberOfKeyboardGrabs = 0;

  // TODO: added for https://github.com/phetsims/density-buoyancy-common/issues/364, but probably won't pass code review.
  public shouldShowDragCue = true;

  public reset(): void {
    this.numberOfGrabs = 0;
    this.numberOfKeyboardGrabs = 0;
    this.shouldShowDragCue = true;
  }
}

// TODO: Move to a separate file, see https://github.com/phetsims/scenery-phet/issues/869
// TODO: This should be the EnabledComponent instead of the view, https://github.com/phetsims/scenery-phet/issues/869
// Private class for organizing the "model" side of the logic for the grab/drag interaction.
class GrabDragModel {

  // Interaction states that this component interaction can be in:
  // "grabbable": In the button state where you can interact with the node to grab it.
  // "draggable": In the state where you can use a keyboard listener to move the object with arrow keys.
  /**
   * TODO: Rename to "idle" vs "grabbed"? See https://github.com/phetsims/scenery-phet/issues/869
   * SR: grabbable vs draggable was initially confusing
   * MK: Since we want to show the "grabbable" cue when it is grabbable, we should call it grabbable.
   *     Wouldn't it introduce another layer of confusion to call it "idle" and have to know/figure out that idle means to show the "grabbable" message?
   * SR: Isn't grabbable a bit of a misnomer since something cannot be grabbed unless it also has focus?
   */
  public interactionState: 'grabbable' | 'draggable' = 'grabbable';

  public constructor( public readonly grabDragCueModel: GrabDragCueModel = new GrabDragCueModel() ) {}

  public reset(): void {
    this.grabDragCueModel.reset();
  }
}

sceneryPhet.register( 'GrabDragInteraction', GrabDragInteraction );