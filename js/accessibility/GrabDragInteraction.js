// Copyright 2018-2020, University of Colorado Boulder

/**
 * The main interaction for grabbing and dragging an object. It works by taking in a Node to augment with the a11y
 * interaction. In fact it works much like a mixin. In general, this type will mutate the accessible content of the
 * passed in node (sometimes referred to "wrappedNode"), alternating between a grabbable object and a draggable object.
 * To accomplish this there are options to be filled in that keeps track of the scenery inputListeners for each mode,
 * as well as the options to mutate the node by. By default the grabbable is a button with a parent div, and the
 * draggable is a focusable div with an "application" aria role.
 *
 * As a note on terminology, mostly things are referred to by their current "interaction mode" which is either grabbable
 * or draggable.
 *
 * This type will alert when the draggable is released, but not default alert is provided when the object is grabbed.
 * This is because in usages so far that alert has been custom, context specific, and easier to just supply through
 * the onGrab listener.
 *
 * NOTE: You cannot add a11y listeners directly to the node where it is constructed, instead see
 * `options.listenersForGrab/Drag`. These will keep track of the listeners for each interaction mode, and
 * will set them accordingly.
 *
 * NOTE: There is no "undo" for a mutate call, so it is the client's job to make sure that grabbable/draggableOptions objects
 * appropriately "cancel" out the other. The same goes for any alterations that are done on `onGrab` and `onRelease`
 *
 * NOTE: problems may occur if you change the focusHighlight of the node passed in after creating this type.
 *
 * NOTE: focusHighlightLayerable is finicky with this type. In order to support it, you must have added the
 * focusHighlight to the wrappedNode and added the focusHighlight to the scene graph before calling this Type's constructor.
 *
 * NOTE: positioning the grab "cue" node: transforming the Node adding the grab/drag interaction after running this code
 * will not update the layout of the grabCueNode. This is because it is a child of the focus highlight. As a result,
 * currently you must correctly position node before the cue node is created.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import merge from '../../../phet-core/js/merge.js';
import StringUtils from '../../../phetcommon/js/util/StringUtils.js';
import AccessiblePeer from '../../../scenery/js/accessibility/AccessiblePeer.js';
import FocusHighlightFromNode from '../../../scenery/js/accessibility/FocusHighlightFromNode.js';
import FocusHighlightPath from '../../../scenery/js/accessibility/FocusHighlightPath.js';
import KeyboardUtils from '../../../scenery/js/accessibility/KeyboardUtils.js';
import PressListener from '../../../scenery/js/listeners/PressListener.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Tandem from '../../../tandem/js/Tandem.js';
import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetStrings from '../scenery-phet-strings.js';
import GrabReleaseCueNode from './nodes/GrabReleaseCueNode.js';

// constants
const grabPatternString = sceneryPhetStrings.a11y.grabDrag.grabPattern;
const gestureHelpTextPatternString = sceneryPhetStrings.a11y.grabDrag.gestureHelpTextPattern;
const movableString = sceneryPhetStrings.a11y.grabDrag.movable;
const defaultObjectToGrabString = sceneryPhetStrings.a11y.grabDrag.defaultObjectToGrab;
const releasedString = sceneryPhetStrings.a11y.grabDrag.released;

// wrap in a function because phet.joist.sim doesn't exist at RequireJS time
const supportsGestureDescription = () => {
  assert && assert( phet.joist && phet.joist.sim && typeof phet.joist.sim.supportsGestureDescription === 'boolean', 'boolean expected' );
  return phet.joist.sim.supportsGestureDescription;
};

class GrabDragInteraction {

  /**
   * @param {Node} node - will be mutated with a11y options to have the grab/drag functionality in the PDOM
   * @param {Object} [options]
   */
  constructor( node, options ) {
    options = merge( {

      // A string that is filled in to the appropriate button label
      objectToGrabString: defaultObjectToGrabString,

      // {string|null} - if not provided, a default will be applied, see this.grabbableAccessibleName
      grabbableAccessibleName: null,

      // {function} - called when the node is "grabbed" (when the grab button fires); button -> draggable
      onGrab: _.noop,

      // {function} - called when the node is "released" (when the draggable is "let go"); draggable -> button
      onRelease: _.noop,

      // {function} - similar to onRelease, but called whenever the interaction mode is set to "grab". Useful for adding
      // accessible content for the interaction mode in a way that can't be achieved with options, like setting
      // accessibleAttributes.
      onGrabbable: _.noop,

      // {function} - similar to onGrab, but called whenever the interaction mode is set to "drag". Useful for adding
      // accessible content for the interaction mode in a way that can't be achieved with options, like setting
      // accessibleAttributes.
      onDraggable: _.noop,

      // {Object} - Node options passed to the grabbable created for the PDOM, filled in with defaults below
      grabbableOptions: {
        appendDescription: true // in general, the help text is after the grabbable
      },

      // {Object} - To pass in options to the cue. This is a scenery Node and you can pass it options supported by
      // that type. When positioning this node, it is in the target Node's parent coordinate frame.
      grabCueOptions: {},

      // {number} - the number of times a user has to successfully grab the object before hiding the cue.
      grabsToCue: 1,

      // {Object} - Node options passed to the draggable created for the PDOM, filled in with defaults below
      draggableOptions: {},

      // {null|Node} - Optional node to cue the drag interaction once successfully updated.
      dragCueNode: null,

      // {Function[]} - This type swaps the PDOM structure for a given node between a grabbable mode, and draggable one.
      // We need to keep track of all listeners that need to be attached to each PDOM manifestation. Note: when these
      // are removed while converting to/from grabbable/draggable, they are interrupted. Other listeners that are
      // attached to this.node but aren't in these lists will not be interrupted.
      listenersForDrag: [],
      listenersForGrab: [],

      // {function(numberOfGrabs:number} - Add an aria-describedby link between the description
      // sibling and the primary sibling, only when grabbable. By default this should only be done when supporting
      // gesture interactive description before two success grabs. This function is called with one parameters: the number of
      // successful grabs that has occurred thus far.
      addAriaDescribedbyPredicate: numberOfGrabs => supportsGestureDescription() && numberOfGrabs < 2,

      // {string} - Help text is treated as the same for the grabbable and draggable items, but is different based on if the
      // runtime is supporting gesture interactive description. Even though "technically" there is no way to access the
      // help text when this Node is in the draggable mode, the help text is still in the PDOM.
      keyboardHelpText: null,

      // {function} - returns {boolean}, whether or not there has been a successful drag interaction,
      //              thus determining whether or not to show the dragCueNode.
      successfulDrag: _.stubTrue,

      // {Tandem} - For instrumenting
      tandem: Tandem.REQUIRED
    }, options );

    // a second block for options that use other options, therefore needing the defaults to be filled in
    options = merge( {

      // {string} - like keyboardHelpText but when supporting gesture interactive description
      gestureHelpText: StringUtils.fillIn( gestureHelpTextPatternString, {
        objectToGrab: options.objectToGrabString
      } )
    }, options );

    if ( node.focusHighlightLayerable ) {

      assert && assert( node.focusHighlight,
        'if focusHighlightLayerable, the highlight must be set to the node before constructing the grab/drag interaction.' );
      assert && assert( node.focusHighlight.parent, 'if focusHighlightLayerable, the highlight must be added to the ' +
                                                    'scene graph before grab/drag construction.' );
    }
    if ( node.focusHighlight ) {
      assert && assert( node.focusHighlight instanceof phet.scenery.FocusHighlightPath,
        'if provided, focusHighlight must be a Path' );
    }
    assert && assert( typeof options.onGrab === 'function' );
    assert && assert( typeof options.onRelease === 'function' );
    assert && assert( typeof options.onGrabbable === 'function' );
    assert && assert( typeof options.onDraggable === 'function' );
    assert && assert( Array.isArray( options.listenersForDrag ) );
    assert && assert( Array.isArray( options.listenersForGrab ) );
    assert && assert( typeof options.grabsToCue === 'number' );
    assert && assert( options.grabbableOptions instanceof Object );
    assert && assert( options.grabCueOptions instanceof Object );
    assert && assert( options.grabCueOptions.visible === undefined, 'Should not set visibility of the cue node' );
    assert && assert( options.draggableOptions instanceof Object );
    if ( options.dragCueNode !== null ) {
      assert && assert( options.dragCueNode instanceof Node );
      assert && assert( !options.dragCueNode.parent, 'GrabDragInteraction adds dragCueNode to focusHighlight' );
      assert && assert( options.dragCueNode.visible === true, 'dragCueNode should be visible to begin with' );
    }

    // GrabDragInteraction has its own api for description content.
    assert && assert( !options.grabbableOptions.descriptionContent,
      'set grabbableOptions.descriptionContent through custom Grab/Drag api, (see keyboardHelpText and gestureHelpText option).' );
    assert && assert( !options.grabbableOptions.helpText,
      'set grabbableOptions.helpText through custom Grab/Drag api, (see keyboardHelpText and gestureHelpText option).' );
    assert && assert( !options.grabbableOptions.descriptionTagName,
      'set grabbableOptions.descriptionTagName through custom Grab/Drag api, (see keyboardHelpText and gestureHelpText option).' );
    assert && assert( !options.draggableOptions.descriptionTagName,
      'set draggableOptions.descriptionTagName through custom Grab/Drag api, (see keyboardHelpText and gestureHelpText option).' );
    assert && assert( !options.draggableOptions.descriptionContent,
      'set draggableOptions.descriptionContent through custom Grab/Drag api, (see keyboardHelpText and gestureHelpText option).' );
    assert && assert( !options.draggableOptions.helpText,
      'set draggableOptions.helpText through custom Grab/Drag api, (see keyboardHelpText and gestureHelpText option).' );

    assert && assert( !options.draggableOptions.accessibleName, 'GrabDragInteraction sets its own accessible name, see objectToGrabString' );
    assert && assert( !options.draggableOptions.innerContent, 'GrabDragInteraction sets its own innerContent, see objectToGrabString' );
    assert && assert( !options.draggableOptions.ariaLabel, 'GrabDragInteraction sets its own ariaLabel, see objectToGrabString' );

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

    options.grabbableOptions = merge( {
      containerTagName: 'div',
      ariaRole: null,
      tagName: 'button',

      accessibleName: null,
      ariaLabel: null // also since many use ariaLabel to set accessibleName
    }, options.grabbableOptions );

    // @private
    this.grabbableAccessibleName = options.grabbableAccessibleName || // if a provided option
                                   ( supportsGestureDescription() ? options.objectToGrabString : // otherwise if supporting gesture
                                     StringUtils.fillIn( grabPatternString, { // default case
                                       objectToGrab: options.objectToGrabString
                                     } ) );
    options.grabbableOptions.innerContent = this.grabbableAccessibleName;

    // @private
    this.grabbable = true; // If false, then instead this type is in the draggable interaction mode.
    this.node = node;
    this.grabbableOptions = options.grabbableOptions;
    this.draggableOptions = options.draggableOptions;
    this.numberOfGrabs = 0; // {number}
    this.grabsToCue = options.grabsToCue;
    this.successfulDrag = options.successfulDrag;
    this.dragCueNode = options.dragCueNode; // {Node|null}
    this.grabCueNode = new GrabReleaseCueNode( options.grabCueOptions );
    this.onGrabbable = options.onGrabbable;
    this.onDraggable = options.onDraggable;
    this.addAriaDescribedbyPredicate = options.addAriaDescribedbyPredicate;

    // @private {string|null}
    // set the help text, if provided - it will be associated with aria-describedby when in the "grabbable" state
    this.node.descriptionContent = supportsGestureDescription() ? options.gestureHelpText : options.keyboardHelpText;

    // @private {Object} - The aria-describedby association object that will associate "grabbable" with its
    // help text so that it is read automatically when the user finds it. This reference is saved so that
    // the association can be removed when the node becomes a "draggable"
    this.descriptionAssociationObject = {
      otherNode: this.node,
      thisElementName: AccessiblePeer.PRIMARY_SIBLING,
      otherElementName: AccessiblePeer.DESCRIPTION_SIBLING
    };

    // for both grabbing and dragging, the node with this interaction must be focusable
    this.node.focusable = true;

    // @private - wrap the optional onRelease in logic that is needed for the core type.
    this.onRelease = () => {
      options.onRelease && options.onRelease();
      phet.joist.sim.utteranceQueue.addToBack( releasedString );
    };
    this.onGrab = options.onGrab; // @private

    // @private - Take the focusHighlight from the node for the grab button interaction highlight.
    this.grabFocusHighlight = node.focusHighlight || new FocusHighlightFromNode( node );
    node.focusHighlight = this.grabFocusHighlight;

    // @private - Make the draggable focusHighlight in the spitting image of the node's
    this.dragFocusHighlight = new FocusHighlightPath( this.grabFocusHighlight.shape, {
      visible: false,
      transformSourceNode: this.grabFocusHighlight.transformSourceNode || node
    } );

    // Update the passed in node's focusHighlight to make it dashed for the "grabbed" mode
    this.dragFocusHighlight.makeDashed();

    // if ever we update the node's focusHighlight, then update the grab button's too to keep in syn.
    const onHighlightChange = () => {
      this.dragFocusHighlight.setShape( this.grabFocusHighlight.shape );
    };
    this.grabFocusHighlight.highlightChangedEmitter.addListener( onHighlightChange );

    // TODO: Likely we will need to monitor the parent for changes, and update accordingly, though for now it works in friction, see https://github.com/phetsims/scenery-phet/issues/421
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
      click: () => {

        // don't turn to draggable on mobile a11y, it is the wrong gesture - user should press down and hold
        // to initiate a drag
        if ( supportsGestureDescription() ) {
          return;
        }

        // if the draggable was just released, don't pick it up again until the next click event so we don't "loop"
        // and pick it up immediately again.
        if ( !guardKeyPressFromDraggable ) {
          this.turnToDraggable();

          this.node.focus();

          this.onGrab();

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

      blur: () => {
        if ( this.numberOfGrabs >= options.grabsToCue ) {
          this.grabCueNode.visible = false;
        }
      }
    };

    // @private - keep track of all listeners to swap out grab/drag functionalities
    this.listenersForGrab = options.listenersForGrab.concat( grabButtonListener );

    // use arrow functions so that we can have the right "this" reference
    const dragDivListener = {

      // Release the draggable on 'enter' key, tracking that we have released the draggable with this key so that
      // we don't immediately catch the 'click' event while the enter key is down on the button
      keydown: event => {
        if ( event.domEvent.keyCode === KeyboardUtils.KEY_ENTER ) {

          // set a guard to make sure the key press from enter doesn't fire future listeners, therefore
          // "clicking" the grab button also on this key press.
          guardKeyPressFromDraggable = true;
          this.releaseDraggable();
        }
      },
      keyup: event => {

        // Release  on keyup of spacebar so that we don't pick up the draggable again when we release the spacebar
        // and trigger a click event - escape could be added to either keyup or keydown listeners
        if ( event.domEvent.keyCode === KeyboardUtils.KEY_SPACE || event.domEvent.keyCode === KeyboardUtils.KEY_ESCAPE ) {
          this.releaseDraggable();
        }

        // if successfully dragged, then make the cue node invisible
        if ( this.dragCueNode && options.successfulDrag() ) {
          this.dragCueNode.visible = false;
        }
      },
      blur: () => this.releaseDraggable(),
      focus: () => {

        // if successfully dragged, then make the cue node invisible
        if ( this.dragCueNode && options.successfulDrag() ) {
          this.dragCueNode.visible = false;
        }
      }
    };

    // @private
    this.listenersForDrag = options.listenersForDrag.concat( dragDivListener );

    // From non-PDOM pointer events, change representations in the PDOM - necessary for accessible tech that
    // uses pointer events like iOS VoiceOver. The above listeners manage input from the PDOM.
    const pressListener = new PressListener( {
      press: ( event, listener ) => {
        if ( !event.isA11y() ) {
          this.turnToDraggable();
          this.onGrab();
        }
      },
      release: ( event, listener ) => {

        // release if PressListener is interrupted
        if ( event === null || !event.isA11y() ) {
          this.releaseDraggable();
        }
      },

      // this listener shouldn't prevent the behavior of other listeners, and this listener should always fire
      // whether or not the pointer is already attached
      attach: false,

      tandem: options.tandem.createTandem( 'pressListener' )
    } );
    this.node.addInputListener( pressListener );

    // Initialize the Node as a grabbable (button) to begin with
    this.turnToGrabbable();

    // @private
    this.disposeA11yGrabDragNode = () => {

      this.node.removeInputListener( pressListener );

      // Remove listeners according to what mode we are in
      if ( this.grabbable ) {
        this.removeInputListeners( this.listenersForGrab );
      }
      else {
        this.removeInputListeners( this.listenersForDrag );
      }

      this.grabFocusHighlight.highlightChangedEmitter.removeListener( onHighlightChange );

      // Remove child if focusHighlightLayerable
      if ( node.focusHighlightLayerable ) {
        assert && assert( this.grabFocusHighlight.parent, 'how can we have focusHighlightLayerable with a ' +
                                                          'node that is not in the scene graph?' );
        if ( this.grabFocusHighlight.parent.hasChild( this.dragFocusHighlight ) ) {
          this.grabFocusHighlight.parent.removeChild( this.dragFocusHighlight );
        }
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
    if ( supportsGestureDescription() ) {
      this.node.setAccessibleAttribute( 'aria-roledescription', movableString );
    }
    else if ( this.node.hasAccessibleAttribute( 'aria-roledescription' ) ) {

      // by default, the grabbable has no roledescription. Can be overwritten in `onGrabbable()`
      this.node.removeAccessibleAttribute( 'aria-roledescription' );
    }

    if ( this.addAriaDescribedbyPredicate( this.numberOfGrabs ) ) {

      // this node is aria-describedby its own description content, so that the description is read automatically
      // when found by the user
      !this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) && this.node.addAriaDescribedbyAssociation( this.descriptionAssociationObject );
    }
    else if ( this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) ) {
      this.node.removeAriaDescribedbyAssociation( this.descriptionAssociationObject );
    }

    this.baseInteractionUpdate( this.grabbableOptions, this.listenersForDrag, this.listenersForGrab );

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
    this.node.setAccessibleAttribute( 'aria-roledescription', movableString );

    // This node is aria-describedby its own description content only when grabbable, so that the description is
    // read automatically when found by the user with the virtual cursor. Remove it for draggable
    if ( this.node.hasAriaDescribedbyAssociation( this.descriptionAssociationObject ) ) {
      this.node.removeAriaDescribedbyAssociation( this.descriptionAssociationObject );
    }

    // turn this into a draggable in the node
    this.baseInteractionUpdate( this.draggableOptions, this.listenersForGrab, this.listenersForDrag );

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
    assert && assert( this.node.focusable, 'GrabDragInteraction node must remain focusable after mutation' );

    this.addInputListeners( listenersToAdd );

    this.updateFocusHighlights();
    this.updateCues();
  }

  /**
   * Update the focusHighlights according to if we are in grabbable or draggable mode
   * No need to set visibility to true, because that will happen for us by FocusOverlay on focus.
   *
   * @private
   */
  updateFocusHighlights() {
    if ( this.grabbable ) {
      this.dragFocusHighlight.visible = false;
      this.node.focusHighlight = this.grabFocusHighlight;
    }
    else {
      this.grabFocusHighlight.visible = false;
      this.node.focusHighlight = this.dragFocusHighlight;
    }
  }

  /**
   * Update the visiblity of the cues for both grabbable and draggable modes
   * @private
   */
  updateCues() {

    // only if there is a dragCueNode
    if ( this.dragCueNode ) {

      // Only visible if there hasn't yet been a successful drag
      this.dragCueNode.visible = !this.successfulDrag();
    }

    this.grabCueNode.visible = this.numberOfGrabs < this.grabsToCue;
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
    this.disposeA11yGrabDragNode();
  }

  /**
   * Reset to initial state
   * @public
   */
  reset() {

    // reset numberOfGrabs for turnToGrabbable
    this.numberOfGrabs = 0;
    this.turnToGrabbable();

    // turnToGrabbable will increment this, so reset it again
    this.numberOfGrabs = 0;
    this.grabCueNode.visible = true;
    if ( this.dragCueNode ) {
      this.dragCueNode.visible = true;
    }
  }
}

sceneryPhet.register( 'GrabDragInteraction', GrabDragInteraction );
export default GrabDragInteraction;