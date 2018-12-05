// Copyright 2018, University of Colorado Boulder

/**
 * @author Michael Kauzmann
 */
define( require => {
  'use strict';

  // modules
  const FocusHighlightFromNode = require( 'SCENERY/accessibility/FocusHighlightFromNode' );
  const FocusHighlightPath = require( 'SCENERY/accessibility/FocusHighlightPath' );
  const GrabReleaseCueNode = require( 'SCENERY_PHET/accessibility/nodes/GrabReleaseCueNode' );
  const KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  const Node = require( 'SCENERY/nodes/Node' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // a11y strings
  const grabPatternString = SceneryPhetA11yStrings.grabPattern.value;
  const defaultThingToGrabString = SceneryPhetA11yStrings.defaultThingToGrab.value;
  const releasedString = SceneryPhetA11yStrings.released.value;

  /**
   * NOTE: problems may occur if you change the focusHighlight of the node passed in after creating this type.
   * @param {Node} parentButton - Node passed in that will be mutated with a11y options to have the grab functionality in the PDOM
   * @param  {Object} options
   */
  class A11yGrabDragNode {
    constructor( node, options ) {

      options = _.extend( {

        // A string that is filled in to the appropriate button label
        thingToGrab: defaultThingToGrabString,

        // {function} - called when the node is "grabbed" (when the grab button fires)
        onGrab: _.noop(),

        // {function} - if you override this, make sure to handle the alert in the default onRelease
        onRelease: A11yGrabDragNode.onRelease,

        // {Object} - Node options passed to the grabbable created for the PDOM, filled in with defaults below
        grabButtonOptions: {},

        // {Object} - to pass in options to the cue
        grabCueOptions: {},

        // {number} - the number of times a user has to successfully grab the object before hiding the cue.
        grabsToCue: 1,

        // {Object} - Node options passed to the draggable created for the PDOM, filled in with defaults below
        dragDivOptions: {},

        // // {null|Node} - Optional node to cue the drag interaction once successfully updated.
        dragCueNode: null,

        // {Function[]} - This type swaps the PDOM structure for a given node between a grabbable mode, and draggable one.
        // We need to keep track of all listeners that need to be attached to each PDOM manifestation.
        listenersForDrag: [],
        listenersForGrab: [],

        // {function} - returns {boolean}, whether or not there has been a successful drag interaction,
        //              thus determining whether or not to show the dragCueNode.
        successfulDrag: _.noop
      }, options );

      if ( node.focusHighlight ) {
        assert && assert( node.focusHighlight instanceof phet.scenery.FocusHighlightPath,
          'if provided, focusHighlight must be a Path' );
      }
      assert && assert( typeof options.onGrab === 'function' );
      assert && assert( typeof options.onRelease === 'function' );
      assert && assert( Array.isArray( options.listenersForDrag ) );
      assert && assert( Array.isArray( options.listenersForGrab ) );
      assert && assert( typeof options.grabsToCue === 'number' );
      assert && assert( options.grabButtonOptions instanceof Object );
      assert && assert( options.grabCueOptions instanceof Object );
      assert && assert( options.grabCueOptions.visible === undefined, 'Should not set visibility of the cue node' );
      assert && assert( options.dragDivOptions instanceof Object );
      if ( options.dragCueNode !== null ) {
        assert && assert( options.dragCueNode instanceof Node );
        assert && assert( !options.dragCueNode.parent, 'A11yGrabDragNode adds dragCueNode to focusHighlight' );
        assert && assert( options.dragCueNode.visible === true, 'dragCueNode should be visible to begin with' );
      }

      options.dragDivOptions = _.extend( {
        tagName: 'div',
        ariaRole: 'application',
        focusable: true
      }, options.dragDivOptions );

      options.grabButtonOptions = _.extend( {
        containerTagName: 'div',
        tagName: 'button'
      }, options.grabButtonOptions );

      assert && assert( !options.grabButtonOptions.innerContent, 'A11yGrabDragNode sets its own innerContent, see thingToGrab' );

      options.grabButtonOptions.innerContent = StringUtils.fillIn( grabPatternString, {
        thingToGrab: options.thingToGrab
      } );

      // Initialize the node as a button to begin with
      node.mutate( options.grabButtonOptions );

      // @private
      this.grabbable = true; // if false, then instead it has draggable functionality
      this.node = node;
      this.grabButtonOptions = options.grabButtonOptions;
      this.dragDivOptions = options.dragDivOptions;
      this.numberOfGrabs = 0; // {number}
      this.grabsToCue = options.grabsToCue;
      this.successfulDrag = options.successfulDrag;
      this.dragCueNode = options.dragCueNode; // {Node|null}
      this.grabCueNode = new GrabReleaseCueNode( options.grabCueOptions );

      // @private - Take the focusHighlight from the node for the grab button interaction highlight.
      this.grabFocusHighlight = node.focusHighlight || new FocusHighlightFromNode( node );
      node.focusHighlight = this.grabFocusHighlight;

      // @private - Make the draggable focusHighlight in the spitting image of the node's
      this.dragFocusHighlight = new FocusHighlightPath( this.grabFocusHighlight.shape, {
        visible: false
      } );

      // Update the passed in node's focusHighlight to make it dashed for the "grabbed" mode
      this.dragFocusHighlight.makeDashed();

      // if ever we update the node's focusHighlight, then update the grab button's too to keep in syn.
      let onHighlightChange = () => {
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

          // if the draggable was just released, don't pick it up again until the next click event so we don't "loop"
          // and pick it up immediately again.
          if ( !guardKeyPressFromDraggable ) {
            this.numberOfGrabs++;

            this.turnToDraggable();

            this.node.focus();

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

            options.onGrab();
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
      node.addInputListener( grabButtonListener );

      // Release the draggable after an accessible interaction, resetting  model Properties, returning focus
      // to the "grab" button, and hiding the draggable.
      const a11yReleaseWrappedNode = () => {

        // reset the key state of the drag handler by interrupting the drag
        node.interruptInput();

        this.turnToGrabbable();

        // refocus once reconstructed, TODO: this may not be necessary if scenery knows how to restore focus on tagName change
        node.focus();

        // callback when node is "released"
        options.onRelease();
      };

      let dragDivListener = {

        // Release the draggable on 'enter' key, tracking that we have released the draggable with this key so that
        // we don't immediately catch the 'click' event while the enter key is down on the button
        keydown: ( event ) => {
          if ( event.domEvent.keyCode === KeyboardUtil.KEY_ENTER ) {

            // set a guard to make sure the key press from enter doesn't fire future listeners, therefore
            // "clicking" the grab button also on this key press.
            guardKeyPressFromDraggable = true;

            a11yReleaseWrappedNode();
          }
        },
        keyup: ( event ) => {

          // Release  on keyup of spacebar so that we don't pick up the draggable again when we release the spacebar
          // and trigger a click event - escape could be added to either keyup or keydown listeners
          if ( event.domEvent.keyCode === KeyboardUtil.KEY_SPACE || event.domEvent.keyCode === KeyboardUtil.KEY_ESCAPE ) {
            a11yReleaseWrappedNode();
          }

          // if successfully dragged, then make the cue node invisible
          if ( this.dragCueNode && options.successfulDrag() ) {
            this.dragCueNode.visible = false;
          }
        },

        // arrow function for this
        blur: () => {
          // No need to interrupt the KeyboardDragHandler, accessibilityInputListeners are already interrupted on blur

          this.turnToGrabbable();
        },
        focus: () => {

          // if successfully dragged, then make the cue node invisible
          if ( this.dragCueNode && options.successfulDrag() ) {
            this.dragCueNode.visible = false;
          }
        }
      };

      // @private
      this.listenersForDrag = options.listenersForDrag.concat( dragDivListener );

      // @private
      this.disposeA11yGrabDragNode = () => {

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
          this.grabFocusHighlight.parent.removeChild( this.dragFocusHighlight );
        }

        // remove cue references
        this.grabFocusHighlight.removeChild( this.grabCueNode );
        this.dragCueNode && this.dragFocusHighlight.focusHighlight.removeChild( this.dragCueNode );
      };
    }

    /**
     * turn the node into a button, swap out listeners too
     * @private
     */
    turnToGrabbable() {
      this.grabbable = true;
      this.baseInteractionUpdate( this.grabButtonOptions, this.listenersForDrag, this.listenersForGrab );
    }

    /**
     * turn the node into a draggable, swap out listeners too
     * @private
     */
    turnToDraggable() {
      this.grabbable = false;

      // turn this into a draggable in the node
      this.baseInteractionUpdate( this.dragDivOptions, this.listenersForGrab, this.listenersForDrag );
    }

    /**
     * Update the node to switch modalities between being draggable, and grabbable. This function holds code that should
     * be called when switching in either direction.
     * @private
     */
    baseInteractionUpdate( optionsToMutate, listenersToRemove, listenersToAdd ) {

      // remove all previous listeners from the node
      this.removeInputListeners( listenersToRemove );

      // update the PDOM of the node
      this.node.mutate( optionsToMutate );

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
     * @public
     */
    static onRelease() {
      utteranceQueue.addToBack( releasedString );
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

      this.turnToGrabbable();
      this.numberOfGrabs = 0;
      this.grabCueNode.visible = true;
      if ( this.dragCueNode ) {
        this.dragCueNode.visible = true;
      }
    }
  }

  return sceneryPhet.register( 'A11yGrabDragNode', A11yGrabDragNode );

} );
