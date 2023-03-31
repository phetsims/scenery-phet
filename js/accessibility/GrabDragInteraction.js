// Copyright 2018-2023, University of Colorado Boulder

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
 * wrappedNode is blurred and refocused. This means that the input event "blur()" set in listenersForGrabState will
 * not just fire when navigating through the sim, but also upon activation. This weirdness is to make sure that the
 * input event "focus()" is called and supported for within listenersForDragState
 *
 * NOTE: For PhET-iO instrumentation, GrabDragInteraction.enabledProperty is phetioReadOnly, it makes the most sense
 * to link to whatever Node control's the mouse/touch input and toggle grab drag enabled when that Node's inputEnabled
 * changes. For example see Friction.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import EnabledComponent from '../../../axon/js/EnabledComponent.js';
import assertHasProperties from '../../../phet-core/js/assertHasProperties.js';
import getGlobal from '../../../phet-core/js/getGlobal.js';
import merge from '../../../phet-core/js/merge.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import { FocusHighlightFromNode, FocusHighlightPath, KeyboardUtils, Node, PDOMPeer, PressListener, Voicing } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import AriaLiveAnnouncer from '../../../utterance-queue/js/AriaLiveAnnouncer.js';
import ResponsePacket from '../../../utterance-queue/js/ResponsePacket.js';
import Utterance from '../../../utterance-queue/js/Utterance.js';
import sceneryPhet from '../sceneryPhet.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';
import GrabReleaseCueNode from './nodes/GrabReleaseCueNode.js';

// constants
const grabPatternString = SceneryPhetStrings.a11y.grabDrag.grabPattern;
const gestureHelpTextPatternString = SceneryPhetStrings.a11y.grabDrag.gestureHelpTextPattern;
const movableString = SceneryPhetStrings.a11y.grabDrag.movable;
const buttonString = SceneryPhetStrings.a11y.grabDrag.button;
const defaultObjectToGrabString = SceneryPhetStrings.a11y.grabDrag.defaultObjectToGrab;
const releasedString = SceneryPhetStrings.a11y.grabDrag.released;

class GrabDragInteraction extends EnabledComponent {

  /**
   * @param {Node} node - will be mutated with a11y options to have the grab/drag functionality in the PDOM
   * @param {KeyboardDragListener} keyboardDragListener - added to the Node when it is draggable
   * @param {Object} [options]
   */
  constructor( node, keyboardDragListener, options ) {
    options = merge( {

      // A string that is filled in to the appropriate button label
      objectToGrabString: defaultObjectToGrabString,

      // {string|null} - if not provided, a default will be applied, see this.grabbableAccessibleName
      grabbableAccessibleName: null,

      // {function(SceneryEvent):} - called when the node is "grabbed" (when the grab button fires); button -> draggable
      onGrab: _.noop,

      // {function} - called when the node is "released" (when the draggable is "let go"); draggable -> button
      onRelease: _.noop,

      // {function} - similar to onRelease, but called whenever the interaction state is set to "grab". Useful for adding
      // accessible content for the interaction state in a way that can't be achieved with options, like setting
      // pdom attributes.
      onGrabbable: _.noop,

      // {function} - similar to onGrab, but called whenever the interaction state is set to "drag". Useful for adding
      // accessible content for the interaction state in a way that can't be achieved with options, like setting
      // pdom attributes.
      onDraggable: _.noop,

      // {Object} - Node options passed to the grabbable created for the PDOM, filled in with defaults below
      grabbableOptions: {
        appendDescription: true // in general, the help text is after the grabbable
      },

      // {Object} - To pass in options to the cue. This is a scenery Node and you can pass it options supported by
      // that type. When positioning this node, it is in the target Node's parent coordinate frame.
      grabCueOptions: {},

      // {Object} - Node options passed to the draggable created for the PDOM, filled in with defaults below
      draggableOptions: {},

      // {null|Node} - Optional node to cue the drag interaction once successfully updated.
      dragCueNode: null,

      // {Object[]} - GrabDragInteraction swaps the PDOM structure for a given node between a grabbable state, and
      // draggable one. We need to keep track of all listeners that need to be attached to each PDOM manifestation.
      // Note: when these are removed while converting to/from grabbable/draggable, they are interrupted. Other
      // listeners that are attached to this.node but aren't in these lists will not be interrupted. The grabbable
      // will blur() when activated from a grabbable to a draggable. The draggable will focus when activated
      // from grabbable.
      listenersForDragState: [],
      listenersForGrabState: [],

      // {boolean} - if this instance will support specific gesture description behavior.
      supportsGestureDescription: getGlobal( 'phet.joist.sim.supportsGestureDescription' ),

      // {function(numberOfGrabs:number} - Add an aria-describedby link between the description
      // sibling and the primary sibling, only when grabbable. By default this should only be done when supporting
      // gesture interactive description before two success grabs. This function is called with one parameters: the number of
      // successful grabs that has occurred thus far.
      addAriaDescribedbyPredicate: numberOfGrabs => options.supportsGestureDescription && numberOfGrabs < 2,

      // {string} - Help text is treated as the same for the grabbable and draggable items, but is different based on if the
      // runtime is supporting gesture interactive description. Even though "technically" there is no way to access the
      // help text when this Node is in the draggable state, the help text is still in the PDOM.
      keyboardHelpText: null,

      // controls whether or not to show the "Grab" cue node that is displayed on focus - by
      // default it will be shown on focus until it has been successfully grabbed with a keyboard
      showGrabCueNode: () => {
        return this.numberOfKeyboardGrabs < 1 && node.inputEnabled;
      },

      // whether or not to display the Node for the "Drag" cue node once the grabbable Node has been picked up,
      // if a options.dragCueNode is specified. This will only be shown if draggable node has focus
      // from alternative input
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

      // {Tandem} - For instrumenting
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'GrabDragInteraction'
    }, options );

    // a second block for options that use other options, therefore needing the defaults to be filled in
    options = merge( {

      // {string} - like keyboardHelpText but when supporting gesture interactive description
      gestureHelpText: StringUtils.fillIn( gestureHelpTextPatternString, {
        objectToGrab: options.objectToGrabString
      } )
    }, options );

    assert && assert( typeof options.supportsGestureDescription === 'boolean', 'supportsGestureDescription must be provided' );

    if ( node.focusHighlightLayerable ) {

      assert && assert( node.focusHighlight,
        'if focusHighlightLayerable, the highlight must be set to the node before constructing the grab/drag interaction.' );
      assert && assert( node.focusHighlight.parent, 'if focusHighlightLayerable, the highlight must be added to the ' +
                                                    'scene graph before grab/drag construction.' );
    }
    if ( node.interactiveHighlightLayerable ) {
      assert && assert( node.interactiveHighlight,
        'An interactive highlight must be set to the Node before construcion when using interactiveHighlightLayerable' );
      assert && assert( node.interactiveHighlight.parent,
        'if interactiveHighlightLayerable, the highlight must be added to the scene graph before construction' );
    }
    if ( node.focusHighlight ) {
      assert && assert( node.focusHighlight instanceof phet.scenery.FocusHighlightPath,
        'if provided, focusHighlight must be a Path to support highlightChangedEmitter' );
    }
    if ( node.interactiveHighlight ) {
      assert && assert( node.interactiveHighlight instanceof phet.scenery.FocusHighlightPath,
        'if provided, interactiveHighlight must be a Path to support highlightChangedEmitter' );
    }
    assert && assert( typeof options.onGrab === 'function' );
    assert && assert( typeof options.onRelease === 'function' );
    assert && assert( typeof options.onGrabbable === 'function' );
    assert && assert( typeof options.onDraggable === 'function' );
    assert && assert( typeof options.showDragCueNode === 'function' );
    assert && assert( typeof options.showGrabCueNode === 'function' );
    assert && assert( Array.isArray( options.listenersForDragState ) );
    assert && assert( Array.isArray( options.listenersForGrabState ) );
    assert && assert( options.grabbableOptions instanceof Object );
    assert && assert( options.grabCueOptions instanceof Object );
    assert && assert( options.grabCueOptions.visible === undefined, 'Should not set visibility of the cue node' );
    assert && assert( options.draggableOptions instanceof Object );
    assert && assert( !options.listenersForDragState.includes( keyboardDragListener ), 'GrabDragInteraction adds the KeyboardDragListener to listenersForDragState' );
    if ( options.dragCueNode !== null ) {
      assert && assert( options.dragCueNode instanceof Node );
      assert && assert( !options.dragCueNode.parent, 'GrabDragInteraction adds dragCueNode to focusHighlight' );
      assert && assert( options.dragCueNode.visible === true, 'dragCueNode should be visible to begin with' );
    }

    // GrabDragInteraction has its own API for description content.
    assert && assert( !options.grabbableOptions.descriptionContent,
      'set grabbableOptions.descriptionContent through custom Grab/Drag API, (see keyboardHelpText and gestureHelpText option).' );
    assert && assert( !options.grabbableOptions.helpText,
      'set grabbableOptions.helpText through custom Grab/Drag API, (see keyboardHelpText and gestureHelpText option).' );
    assert && assert( !options.grabbableOptions.descriptionTagName,
      'set grabbableOptions.descriptionTagName through custom Grab/Drag API, (see keyboardHelpText and gestureHelpText option).' );
    assert && assert( !options.draggableOptions.descriptionTagName,
      'set draggableOptions.descriptionTagName through custom Grab/Drag API, (see keyboardHelpText and gestureHelpText option).' );
    assert && assert( !options.draggableOptions.descriptionContent,
      'set draggableOptions.descriptionContent through custom Grab/Drag API, (see keyboardHelpText and gestureHelpText option).' );
    assert && assert( !options.draggableOptions.helpText,
      'set draggableOptions.helpText through custom Grab/Drag API, (see keyboardHelpText and gestureHelpText option).' );

    assert && assert( !options.draggableOptions.accessibleName, 'GrabDragInteraction sets its own accessible name, see objectToGrabString' );
    assert && assert( !options.draggableOptions.innerContent, 'GrabDragInteraction sets its own innerContent, see objectToGrabString' );
    assert && assert( !options.draggableOptions.ariaLabel, 'GrabDragInteraction sets its own ariaLabel, see objectToGrabString' );

    super( options );

    options.draggableOptions = merge( {
      tagName: 'div',
      ariaRole: 'application',

      // to cancel out grabbable
      containerTagName: null
    }, options.draggableOptions );

    // @private
    this.draggableAccessibleName = options.objectToGrabString;
    options.draggableOptions.innerContent = this.draggableAccessibleName;
    options.draggableOptions.ariaLabel = this.draggableAccessibleName;

    assert && assert( !options.grabbableOptions.accessibleName, 'GrabDragInteraction sets its own accessible name, see objectToGrabString' );
    assert && assert( !options.grabbableOptions.innerContent, 'GrabDragInteraction sets its own innerContent, see objectToGrabString' );
    assert && assert( !options.grabbableOptions.ariaLabel, 'GrabDragInteraction sets its own ariaLabel, see objectToGrabString' );

    options.grabbableOptions = merge( {
      containerTagName: 'div',
      ariaRole: null,
      tagName: 'button',

      // position the PDOM elements when grabbable for drag and drop on touch-based screen readers
      positionInPDOM: true,

      // {string}
      accessibleName: null
    }, options.grabbableOptions );

    // @private
    this.grabbableAccessibleName = options.grabbableAccessibleName || // if a provided option
                                   ( options.supportsGestureDescription ? options.objectToGrabString : // otherwise if supporting gesture
                                     StringUtils.fillIn( grabPatternString, { // default case
                                       objectToGrab: options.objectToGrabString
                                     } ) );
    options.grabbableOptions.innerContent = this.grabbableAccessibleName;

    // Setting the aria-label on the grabbable element fixes a bug with VoiceOver in Safari where the aria role
    // from the draggable state is never cleared, see https://github.com/phetsims/scenery-phet/issues/688
    options.grabbableOptions.ariaLabel = this.grabbableAccessibleName;

    // @private
    this.grabbable = true; // If false, then instead this type is in the draggable interaction state.
    this.node = node;
    this.grabbableOptions = options.grabbableOptions;
    this.draggableOptions = options.draggableOptions;
    this.dragCueNode = options.dragCueNode; // {Node|null}
    this.grabCueNode = new GrabReleaseCueNode( options.grabCueOptions );
    this.showGrabCueNode = options.showGrabCueNode;
    this.showDragCueNode = options.showDragCueNode;
    this.onGrabbable = options.onGrabbable;
    this.onDraggable = options.onDraggable;
    this.addAriaDescribedbyPredicate = options.addAriaDescribedbyPredicate;
    this.supportsGestureDescription = options.supportsGestureDescription;

    // @private {number} - the number of times the component has been picked up for dragging, regardless
    // of pickup method for things like determining content for "hints" describing the interaction
    // to the user
    this.numberOfGrabs = 0; // {number}

    // @private {number} - the number of times this component has been picked up with a keyboard
    // specifically to provide hints specific to alternative input
    this.numberOfKeyboardGrabs = 0;

    // @private {string|null}
    // set the help text, if provided - it will be associated with aria-describedby when in the "grabbable" state
    this.node.descriptionContent = this.supportsGestureDescription ? options.gestureHelpText : options.keyboardHelpText;

    // @private {Object} - The aria-describedby association object that will associate "grabbable" with its
    // help text so that it is read automatically when the user finds it. This reference is saved so that
    // the association can be removed when the node becomes a "draggable"
    this.descriptionAssociationObject = {
      otherNode: this.node,
      thisElementName: PDOMPeer.PRIMARY_SIBLING,
      otherElementName: PDOMPeer.DESCRIPTION_SIBLING
    };

    // @private
    this.voicingFocusUtterance = new Utterance( {
      alert: new ResponsePacket(),
      announcerOptions: {
        cancelOther: false
      }
    } );

    // for both grabbing and dragging, the node with this interaction must be focusable, except when disabled.
    this.node.focusable = true;

    assert && node.isVoicing && assert( node.voicingFocusListener === node.defaultFocusListener,
      'GrabDragInteraction sets its own voicingFocusListener.' );

    // "released" alerts are assertive so that a pile up of alerts doesn't happen with rapid movement, see
    // https://github.com/phetsims/balloons-and-static-electricity/issues/491
    const releasedUtterance = new Utterance( {
      alert: new ResponsePacket( { objectResponse: releasedString } ),

      // This was being obscured by other messages, the priority helps make sure it is heard, see https://github.com/phetsims/friction/issues/325
      priority: Utterance.MEDIUM_PRIORITY,

      announcerOptions: {
        ariaLivePriority: AriaLiveAnnouncer.AriaLive.ASSERTIVE // for AriaLiveAnnouncer
      }
    } );

    if ( node.isVoicing ) {

      // sanity check on the voicing interface API.
      assertHasProperties( node, [ 'voicingFocusListener' ] );

      node.voicingFocusListener = event => {

        // When swapping from grabbable to draggable, the draggable element will be focused, ignore that case here, see https://github.com/phetsims/friction/issues/213
        this.grabbable && node.defaultFocusListener( event );
      };

      // These Utterances should only be announced if the Node is globally visible and voicingVisible.
      Voicing.registerUtteranceToVoicingNode( releasedUtterance, node );
      Voicing.registerUtteranceToVoicingNode( this.voicingFocusUtterance, node );
    }

    // @private - wrap the optional onRelease in logic that is needed for the core type.
    this.onRelease = () => {
      options.onRelease && options.onRelease();

      this.node.alertDescriptionUtterance( releasedUtterance );
      node.isVoicing && Voicing.alertUtterance( releasedUtterance );
    };
    this.onGrab = options.onGrab; // @private

    // @private - Take highlights from the node for the grab button interaction. The Interactive Highlights cannot
    // fall back to the default focus highlights because GrabDragInteraction adds "grab cue" Nodes as children
    // to the focus highlights that should not be displayed when using Interactive Highlights.
    this.grabFocusHighlight = node.focusHighlight || new FocusHighlightFromNode( node );
    this.grabInteractiveHighlight = node.interactiveHighlight || new FocusHighlightFromNode( node );

    node.focusHighlight = this.grabFocusHighlight;
    node.interactiveHighlight = this.grabInteractiveHighlight;

    // @private - Make the draggable highlights in the spitting image of the node's grabbable highlights
    this.dragFocusHighlight = new FocusHighlightPath( this.grabFocusHighlight.shape, {
      visible: false,
      transformSourceNode: this.grabFocusHighlight.transformSourceNode || node
    } );
    this.dragInteractiveHighlight = new FocusHighlightPath( this.grabInteractiveHighlight.shape, {
      visible: false,
      transformSourceNode: this.grabInteractiveHighlight.transformSourceNode || node
    } );

    // Update the passed in node's focusHighlight to make it dashed for the "draggable" state
    this.dragFocusHighlight.makeDashed();
    this.dragInteractiveHighlight.makeDashed();

    // if the Node layers its interactive highlights in the scene graph, add the dragInteractiveHighlight in the same
    // way the grabInteractiveHighlight was added
    if ( node.interactiveHighlightLayerable ) {
      this.grabInteractiveHighlight.parent.addChild( this.dragInteractiveHighlight );
    }

    // if ever we update the node's highlights, then update the grab button's too to keep in syn.
    const onFocusHighlightChange = () => {
      this.dragFocusHighlight.setShape( this.grabFocusHighlight.shape );
    };
    this.grabFocusHighlight.highlightChangedEmitter.addListener( onFocusHighlightChange );

    const onInteractiveHighlightChange = () => {
      this.dragInteractiveHighlight.setShape( this.grabInteractiveHighlight.shape );
    };
    this.grabInteractiveHighlight.highlightChangedEmitter.addListener( onInteractiveHighlightChange );

    // only the focus highlights have "cue" Nodes so we do not need to do any work here for the Interactive Highlights
    this.grabCueNode.prependMatrix( node.getMatrix() );
    this.grabFocusHighlight.addChild( this.grabCueNode );
    if ( this.dragCueNode ) {
      this.dragCueNode.prependMatrix( node.getMatrix() );
      this.dragFocusHighlight.addChild( this.dragCueNode );
    }

    // Some key presses can fire the node's click (the grab button) from the same press that fires the keydown from
    // the draggable, so guard against that.
    let guardKeyPressFromDraggable = false;

    // when the "Grab {{thing}}" button is pressed, focus the draggable node and set to dragged state
    const grabButtonListener = {
      click: event => {

        // don't turn to draggable on mobile a11y, it is the wrong gesture - user should press down and hold
        // to initiate a drag
        if ( this.supportsGestureDescription ) {
          return;
        }

        // if the draggable was just released, don't pick it up again until the next click event so we don't "loop"
        // and pick it up immediately again.
        if ( !guardKeyPressFromDraggable ) {

          // blur as a grabbable so that we geta new focus event after we turn into a draggable
          this.node.blur();

          this.turnToDraggable();

          this.numberOfKeyboardGrabs++;

          // focus after the transition
          this.node.focus();

          this.onGrab( event );

          // Add the newly created focusHighlight to the scene graph if focusHighlightLayerable, just like the
          // original focus highlight was added. By doing this on click, we make sure that the node's
          // focusHighlight has been completely constructed (added to the scene graph) and can use its parent. But only
          // do it once.
          if ( node.focusHighlightLayerable ) {
            assert && assert( this.grabFocusHighlight.parent, 'how can we have focusHighlightLayerable with a ' +
                                                              'node that is not in the scene graph?' );
            // If not yet added, do so now.
            if ( !this.grabFocusHighlight.parent.hasChild( this.dragFocusHighlight ) ) {
              this.grabFocusHighlight.parent.addChild( this.dragFocusHighlight );
            }
          }
        }

        // "grab" the draggable on the next click event
        guardKeyPressFromDraggable = false;
      },

      focus: () => {
        this.updateVisibilityForCues();

        if ( this.node.isVoicing && this.showGrabCueNode() ) {
          this.voicingFocusUtterance.alert.hintResponse = SceneryPhetStrings.a11y.grabDrag.spaceToGrabOrReleaseStringProperty;
          Voicing.alertUtterance( this.voicingFocusUtterance );
        }
      },

      blur: () => {
        this.grabCueNode.visible = options.showGrabCueNode();
      }
    };

    // @private - keep track of all listeners to swap out grab/drag functionalities
    this.listenersForGrabState = options.listenersForGrabState.concat( grabButtonListener );

    // use arrow functions so that we can have the right "this" reference
    const dragDivListener = {

      // Release the draggable on 'enter' key, tracking that we have released the draggable with this key so that
      // we don't immediately catch the 'click' event while the enter key is down on the button
      keydown: event => {
        if ( KeyboardUtils.isKeyEvent( event.domEvent, KeyboardUtils.KEY_ENTER ) ) {

          // set a guard to make sure the key press from enter doesn't fire future listeners, therefore
          // "clicking" the grab button also on this key press.
          guardKeyPressFromDraggable = true;
          this.releaseDraggable();
        }
      },
      keyup: event => {

        // Release  on keyup of spacebar so that we don't pick up the draggable again when we release the spacebar
        // and trigger a click event - escape could be added to either keyup or keydown listeners
        if ( KeyboardUtils.isAnyKeyEvent( event.domEvent, [ KeyboardUtils.KEY_SPACE, KeyboardUtils.KEY_ESCAPE ] ) ) {
          this.releaseDraggable();
        }

        // if successfully dragged, then make the cue node invisible
        this.updateVisibilityForCues();
      },
      blur: () => this.releaseDraggable(),
      focus: () => {

        // if successfully dragged, then make the cue node invisible
        this.updateVisibilityForCues();
      }
    };

    // @private
    this.listenersForDragState = options.listenersForDragState.concat( [ dragDivListener, keyboardDragListener ] );

    // @private - from non-PDOM pointer events, change representations in the PDOM - necessary for accessible tech that
    // uses pointer events like iOS VoiceOver. The above listeners manage input from the PDOM.
    this.pressListener = new PressListener( {
      press: event => {
        if ( !event.isFromPDOM() ) {
          this.turnToDraggable();
          this.onGrab( event );
        }
      },
      release: event => {

        // release if PressListener is interrupted, but only if not already
        // grabbable, which is possible if the GrabDragInteraction has been
        // reset since press
        if ( ( event === null || !event.isFromPDOM() ) && !this.grabbable ) {
          this.releaseDraggable();
        }
      },

      // this listener shouldn't prevent the behavior of other listeners, and this listener should always fire
      // whether or not the pointer is already attached
      attach: false,
      enabledProperty: this.enabledProperty,
      tandem: options.tandem.createTandem( 'pressListener' )
    } );
    this.node.addInputListener( this.pressListener );

    // Initialize the Node as a grabbable (button) to begin with
    this.turnToGrabbable();

    this.enabledProperty.lazyLink( enabled => {
      !enabled && this.interrupt();

      // Disabled GrabDragInteractions will be unable to be interacted with.
      this.node.focusable = enabled;
    } );

    const boundUpdateVisibilityForCues = this.updateVisibilityForCues.bind( this );

    this.node.inputEnabledProperty.lazyLink( boundUpdateVisibilityForCues );

    // @private
    this.disposeGrabDragInteraction = () => {

      this.node.removeInputListener( this.pressListener );
      this.node.inputEnabledProperty.unlink( boundUpdateVisibilityForCues );

      // Remove listeners according to what state we are in
      if ( this.grabbable ) {
        this.removeInputListeners( this.listenersForGrabState );
      }
      else {
        this.removeInputListeners( this.listenersForDragState );
      }

      this.grabFocusHighlight.highlightChangedEmitter.removeListener( onFocusHighlightChange );
      this.grabInteractiveHighlight.highlightChangedEmitter.removeListener( onInteractiveHighlightChange );

      // Remove children if they were added to support layerable highlights
      if ( node.focusHighlightLayerable ) {
        assert && assert( this.grabFocusHighlight.parent, 'how can we have focusHighlightLayerable with a ' +
                                                          'node that is not in the scene graph?' );
        if ( this.grabFocusHighlight.parent.hasChild( this.dragFocusHighlight ) ) {
          this.grabFocusHighlight.parent.removeChild( this.dragFocusHighlight );
        }
      }

      if ( node.interactiveHighlightLayerable ) {
        assert && assert( this.grabInteractiveHighlight.parent, 'how can we have interactiveHighlightLayerable with a ' +
                                                                'node that is not in the scene graph?' );

        if ( this.grabInteractiveHighlight.parent.hasChild( this.dragInteractiveHighlight ) ) {
          this.grabInteractiveHighlight.parent.removeChild( this.dragInteractiveHighlight );
        }
      }

      if ( node.isVoicing ) {
        Voicing.unregisterUtteranceToVoicingNode( releasedUtterance, node );
        Voicing.unregisterUtteranceToVoicingNode( this.voicingFocusUtterance, node );
      }

      // remove cue references
      this.grabFocusHighlight.removeChild( this.grabCueNode );
      this.dragCueNode && this.dragFocusHighlight.focusHighlight.removeChild( this.dragCueNode );
    };
  }

  /**
   * Release the draggable
   * @public
   */
  releaseDraggable() {
    assert && assert( !this.grabbable, 'cannot set to grabbable if already set that way' );
    this.turnToGrabbable();
    this.onRelease();
  }

  /**
   * turn the Node into the grabbable (button), swap out listeners too
   * @private
   */
  turnToGrabbable() {
    this.grabbable = true;

    // To support gesture and mobile screen readers, we change the roledescription, see https://github.com/phetsims/scenery-phet/issues/536
    if ( this.supportsGestureDescription ) {
      this.node.setPDOMAttribute( 'aria-roledescription', movableString );
    }
    else if ( this.node.hasPDOMAttribute( 'aria-roledescription' ) ) {

      // By default, the grabbable gets a roledescription to force the AT to say its role. This fixes a bug in VoiceOver
      // where it fails to update the role after turning back into a grabbable.
      // See https://github.com/phetsims/scenery-phet/issues/688.
      // You can override this with onGrabbable() if necessary.
      this.node.setPDOMAttribute( 'aria-roledescription', buttonString );
    }

    if ( this.addAriaDescribedbyPredicate( this.numberOfGrabs ) ) {

      // this node is aria-describedby its own description content, so that the description is read automatically
      // when found by the user
      !this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) && this.node.addAriaDescribedbyAssociation( this.descriptionAssociationObject );
    }
    else if ( this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) ) {
      this.node.removeAriaDescribedbyAssociation( this.descriptionAssociationObject );
    }

    this.baseInteractionUpdate( this.grabbableOptions, this.listenersForDragState, this.listenersForGrabState );

    // callback on completion
    this.onGrabbable();
  }

  /**
   * Turn the node into a draggable by updating accessibility representation in the PDOM and changing input
   * listeners.
   * @private
   */
  turnToDraggable() {
    this.numberOfGrabs++;

    this.grabbable = false;

    // by default, the draggable has roledescription of "movable". Can be overwritten in `onDraggable()`
    this.node.setPDOMAttribute( 'aria-roledescription', movableString );

    // This node is aria-describedby its own description content only when grabbable, so that the description is
    // read automatically when found by the user with the virtual cursor. Remove it for draggable
    if ( this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) ) {
      this.node.removeAriaDescribedbyAssociation( this.descriptionAssociationObject );
    }

    // turn this into a draggable in the node
    this.baseInteractionUpdate( this.draggableOptions, this.listenersForGrabState, this.listenersForDragState );

    // callback on completion
    this.onDraggable();
  }

  /**
   * Update the node to switch modalities between being draggable, and grabbable. This function holds code that should
   * be called when switching in either direction.
   * @private
   */
  baseInteractionUpdate( optionsToMutate, listenersToRemove, listenersToAdd ) {

    // interrupt prior input, reset the key state of the drag handler by interrupting the drag. Don't interrupt all
    // input, but instead just those to be removed.
    listenersToRemove.forEach( listener => listener.interrupt && listener.interrupt() );

    // remove all previous listeners from the node
    this.removeInputListeners( listenersToRemove );

    // update the PDOM of the node
    this.node.mutate( optionsToMutate );
    assert && this.enabledProperty.value && assert( this.node.focusable, 'GrabDragInteraction node must remain focusable after mutation' );

    this.addInputListeners( listenersToAdd );

    this.updateFocusHighlights();
    this.updateVisibilityForCues();
  }

  /**
   * Update the focusHighlights according to if we are in grabbable or draggable state
   * No need to set visibility to true, because that will happen for us by HighlightOverlay on focus.
   *
   * @private
   */
  updateFocusHighlights() {
    if ( this.grabbable ) {
      this.node.focusHighlight = this.grabFocusHighlight;
      this.node.interactiveHighlight = this.grabInteractiveHighlight;
    }
    else {
      this.node.focusHighlight = this.dragFocusHighlight;
      this.node.interactiveHighlight = this.dragInteractiveHighlight;
    }
  }

  /**
   * Update the visibility of the cues for both grabbable and draggable states.
   * @private
   */
  updateVisibilityForCues() {
    if ( this.dragCueNode ) {
      this.dragCueNode.visible = this.showDragCueNode();
    }

    this.grabCueNode.visible = this.showGrabCueNode();
  }

  /**
   * Add all listeners to node
   * @private
   * @param {Function[]}listeners
   */
  addInputListeners( listeners ) {
    for ( let i = 0; i < listeners.length; i++ ) {
      const listener = listeners[ i ];
      if ( !this.node.hasInputListener( listener ) ) {
        this.node.addInputListener( listener );
      }
    }
  }


  /**
   * Remove all listeners from the node
   * @param listeners
   * @private
   */
  removeInputListeners( listeners ) {
    for ( let i = 0; i < listeners.length; i++ ) {
      const listener = listeners[ i ];
      if ( this.node.hasInputListener( listener ) ) {
        this.node.removeInputListener( listener );
      }
    }
  }

  /**
   * @override
   * @public
   */
  dispose() {
    this.disposeGrabDragInteraction();
    super.dispose();
  }

  /**
   * Interrupt the grab drag interraction - interrupts any listeners attached and makes sure the
   * Node is back in its "grabbable" state.
   * @public
   */
  interrupt() {
    this.pressListener.interrupt();
  }

  /**
   * Reset to initial state
   * @public
   */
  reset() {

    // reset numberOfGrabs for turnToGrabbable
    this.numberOfGrabs = 0;
    this.turnToGrabbable();

    this.voicingFocusUtterance.reset();

    // turnToGrabbable will increment this, so reset it again
    this.numberOfGrabs = 0;
    this.numberOfKeyboardGrabs = 0;
    this.grabCueNode.visible = true;
    if ( this.dragCueNode ) {
      this.dragCueNode.visible = true;
    }
  }
}

sceneryPhet.register( 'GrabDragInteraction', GrabDragInteraction );
export default GrabDragInteraction;