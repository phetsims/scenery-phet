// Copyright 2018, University of Colorado Boulder

/**
 * @author Michael Kauzmann
 */
define( require => {
  'use strict';

  // modules
  const FocusHighlightFromNode = require( 'SCENERY/accessibility/FocusHighlightFromNode' );
  const FocusHighlightPath = require( 'SCENERY/accessibility/FocusHighlightPath' );
  // const GrabReleaseCueNode = require( 'SCENERY_PHET/accessibility/nodes/GrabReleaseCueNode' );
  const KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  const Node = require( 'SCENERY/nodes/Node' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Tandem = require( 'TANDEM/Tandem' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // a11y strings
  const grabPatternString = SceneryPhetA11yStrings.grabPattern.value;
  const defaultThingToGrabString = SceneryPhetA11yStrings.defaultThingToGrab.value;
  const releasedString = SceneryPhetA11yStrings.released.value;

  /**
   * TODO: There are three possible nodes to manipulate: draggableNodeToGetA11yButton, this, and child node. Do we need all three?
   * TODO: rename to GrabDragInteractionNode???? https://github.com/phetsims/scenery-phet/issues/421
   * NOTE: if passing inthis class assumes
   * @param {Node} wrappedNode
   * @param  {Object} options
   */
  class GrabButtonNode extends Node {

    // TODO: rename this horrid thinghttps://github.com/phetsims/scenery-phet/issues/421
    constructor( parentButton, options ) {
      super();

      options = _.extend( {
        cursor: 'pointer',

        // A string that is filled in to the appropriate button label
        thingToGrab: defaultThingToGrabString,

        // {function} - called when the node is "grabbed" (when the grab button fires)
        onGrab: _.noop(),

        // {function} - if you override this, make sure to handle the alert in the default onRelease
        onRelease: GrabButtonNode.onRelease,

        // TODO: these are really just a11y options for "parentButton"
        // {Object} - Node options passed to the actually <button> created for the PDOM, filled in below
        grabButtonOptions: {},

        // TODO: these are really just a11y options for "this" https://github.com/phetsims/scenery-phet/issues/421
        // {Object} - Options for the child Node that will be the draggable component in the PDOM. This gets a11y
        // related draggable listeners and such.
        a11yDraggableNodeOptions: {},


        // TODO: why support this? shouldn't we just attach this to the focusHighlight passed in https://github.com/phetsims/scenery-phet/issues/421
        // // {null|Node} -  additional cueing node who's visibility can be toggled.
        // supplementaryCueNode: null,

        // {Object} - to pass in options to the cue
        grabCueOptions: {},

        // {number} - the number of times a user has to successfully grab the object before hiding the cue.
        grabsToCue: 1,

        // not passed to this node, but instead to the grabButton
        tandem: Tandem.required,

        // a11y - this node will act as a container for more accessible content, its children will implement
        // most of the keyboard navigation
        tagName: 'div'
      }, options );

      // assert && assert( options.supplementaryCueNode instanceof Node || options.supplementaryCueNode === null );
      // assert && assert( options.supplementaryCueNode === null || !options.supplementaryCueNode.parent, 'GrabButtonNode adds supplementaryCueNode to focusHighlight' );

      assert && assert( typeof options.onGrab === 'function' );
      assert && assert( typeof options.onRelease === 'function' );

      if ( parentButton.focusHighlight ) {
        assert && assert( parentButton.focusHighlight instanceof phet.scenery.FocusHighlightPath,
          'if provided, focusHighlight must be a Path' );
      }

      assert && assert( typeof options.grabsToCue === 'number' );

      assert && assert( typeof options.a11yDraggableNodeOptions === 'object' );
      assert && assert( typeof options.grabCueOptions === 'object' );
      assert && assert( options.grabCueOptions.visible === undefined, 'GrabButtonNode sets visibility of cue node' );

      // TODO: finish up, we need this? https://github.com/phetsims/scenery-phet/issues/421
      // options.grabCueOptions = _.extend( {
      //   visible: true
      // }, options.grabCueOptions );


      options.a11yDraggableNodeOptions = _.extend( {

        // a11y
        tagName: 'div',
        ariaRole: 'application',
        focusable: true
      }, options.a11yDraggableNodeOptions );


      // TODO - maybe we don't need this to be an option https://github.com/phetsims/scenery-phet/issues/421
      // TODO - provide a way to not do this if we don't want to (though do it by default).
      // TODO: Likely if we don't have grabButtonOPtions, at the very least we will want to assert that options
      // TODO: aren't trying to set these
      options.grabButtonOptions = _.extend( {

        // a11y
        containerTagName: 'div',
        tagName: 'button',
        focusHighlightLayerable: true
      }, options.grabButtonOptions );

      assert && assert( !options.grabButtonOptions.innerContent, 'GrabButtonNode sets its own innerContent, see thingToGrab' );

      // @private
      this.numberOfGrabs = 0;

      // // TODO: this should be added as the focusHighlight?? Maybe with an options, https://github.com/phetsims/scenery-phet/issues/421
      // this.supplementaryCueNode = options.supplementaryCueNode; // could be null
      // if ( this.supplementaryCueNode ) {
      //   this.supplementaryCueNode.visible = true; // initialize it to invisible by default
      // }

      options.grabButtonOptions.innerContent = StringUtils.fillIn( grabPatternString, {
        thingToGrab: options.thingToGrab
      } );

      // Add options to draggable node to make it look like a button
      parentButton.mutate( options.grabButtonOptions );

      // TODO: this should be part of the focusHighlight, removing for now. https://github.com/phetsims/scenery-phet/issues/421
      // @private
      // this.grabCueNode = new GrabReleaseCueNode( options.grabCueOptions );

      this.mutate( options.a11yDraggableNodeOptions );

      // by default should be hidden until "grabbed" (grab button is pressed)
      this.accessibleVisible = false;

      // Update the passed in node's focusHighlight to make it "dashed"
      let parentButtonFocusHighlight = parentButton.focusHighlight;
      if ( !parentButtonFocusHighlight ) {
        parentButtonFocusHighlight = new FocusHighlightFromNode( parentButton );
      }
      parentButton.focusHighlight = parentButtonFocusHighlight;

      // TODO: support grabCueNode https://github.com/phetsims/scenery-phet/issues/421
      // parentButton.focusHighlight.addChild( this.grabCueNode );
      // options.supplementaryCueNode && parentButton.focusHighlight.addChild( this.supplementaryCueNode );

      // Make the grab button's focusHighlight in the spitting image of the parentButton's
      const childDraggableFocusHighlight = new FocusHighlightPath( parentButtonFocusHighlight.shape, {
        visible: false
      } );
      childDraggableFocusHighlight.makeDashed();
      this.focusHighlight = childDraggableFocusHighlight;

      // if ever we update the parentButton's focusHighlight, then update the grab button's too to keep in syn.
      let onHighlightChange = () => {
        childDraggableFocusHighlight.setShape( parentButtonFocusHighlight.shape );
      };
      parentButton.focusHighlight.highlightChangedEmitter.addListener( onHighlightChange );


      // some keypresses can fire the parentButton's click (the grab button) from the same press that fires the event below, so guard against that.
      let guardKeyPressFromDraggable = false;

      // when the "Grab {{thing}}" button is pressed, focus the draggable node and set to dragged state
      const grabButtonListener = {
        click: () => {

          // if the draggable was just released, don't pick it up again until the next click event so we don't "loop"
          // and pick it up immediately again.
          if ( !guardKeyPressFromDraggable ) {

            this.numberOfGrabs++;

            options.onGrab();
            this.accessibleVisible = true;

            // TODO: so hacky!!!! https://github.com/phetsims/scenery-phet/issues/421
            if ( this.focusHighlightLayerable &&
                 !parentButtonFocusHighlight.parent.hasChild( childDraggableFocusHighlight ) ) {
              assert && assert( parentButtonFocusHighlight.parent, 'how can we have focusHighlightLayerable with a ' +
                                                                   'node that is not in the scene graph?' );
              parentButtonFocusHighlight.parent.addChild( childDraggableFocusHighlight );
            }
            this.focus();
          }

          // "grab" the draggable on the next click event
          guardKeyPressFromDraggable = false;
        },

        blur: () => {
          if ( this.numberOfGrabs >= options.grabsToCue ) {

            // TODO: support cueing
            // this.grabCueNode.visible = false;
            // if ( this.supplementaryCueNode ) {
            //   this.supplementaryCueNode.visible = false;
            // }
          }
        }
      };
      parentButton.addAccessibleInputListener( grabButtonListener );

      // Release the balloon after an accessible interaction, resetting  model Properties, returning focus
      // to the "grab" button, and hiding the draggable balloon.
      const a11yReleaseWrappedNode = () => {

        // set a guard that will make sure that the click doesn't inappropriately bubble up to the parent listener
        // (likely that is the parentButton)
        // NOTE: we need this for spacebar also when "this" node is added as a child of the `parentButton`
        guardKeyPressFromDraggable = true;

        // focus the grab button again
        parentButton.focus();

        // the draggable node should no longer be discoverable in the parallel DOM
        this.accessibleVisible = false;

        // reset the key state of the drag handler by interrupting the drag
        this.interruptInput();

        // callback when node is "released"
        options.onRelease();
      };

      this.addAccessibleInputListener( {

        // Release the balloon on 'enter' key, tracking that we have released the balloon with this key so that
        // we don't immediately catch the 'click' event while the enter key is down on the button
        keydown: ( event ) => {
          if ( event.keyCode === KeyboardUtil.KEY_ENTER ) {
            a11yReleaseWrappedNode();
          }
        },
        keyup: ( event ) => {

          // Release  on keyup of spacebar so that we don't pick up the balloon again when we release the spacebar
          // and trigger a click event - escape could be added to either keyup or keydown listeners
          if ( event.keyCode === KeyboardUtil.KEY_SPACE || event.keyCode === KeyboardUtil.KEY_ESCAPE ) {
            a11yReleaseWrappedNode();
          }
        },

        // arrow function for this
        blur: () => {
          // No need to interrupt the KeyboardDragHandler, accessibilityInputListeners are already interrupted on blur

          // the draggable node should no longer be focusable
          this.accessibleVisible = false;

        }
      } );

      // TODO: Handle what is best here, I think we may want to move button logic from the draggableNode an to "this" (GrabButtonNode) https://github.com/phetsims/scenery-phet/issues/421
      // pull the this out of the parentButton's children so that they are on the same level of the PDOM.
      // parentButton.accessibleOrder = [ parentButton, this ];

      this.disposeGrabButtonNode = () => {

        parentButton.removeAccessibleInputListener( grabButtonListener );
        parentButton.focusHighlight.highlightChangedEmitter.removeListener( onHighlightChange );

        if ( this.focusHighlightLayerable ) {
          assert && assert( parentButtonFocusHighlight.parent, 'how can we have focusHighlightLayerable with a ' +
                                                               'node that is not in the scene graph?' );
          parentButtonFocusHighlight.parent.removeChild( childDraggableFocusHighlight );
        }

        // TODO: do we have to do this?
        // parentButton.focusHighlight.removeChild( this.grabCueNode );
        // options.supplementaryCueNode && parentButton.focusHighlight.removeChild( this.supplementaryCueNode );
      };

      this.mutate( options );
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
      this.disposeGrabButtonNode();
      super.dispose();
    }

    /**
     * Reset to initial state
     * @public
     */
    reset() {
      this.numberOfGrabs = 0;

      // TODO: support cueing
      // if ( this.supplementaryCueNode ) {
      //   this.supplementaryCueNode.visible = true;
      // }
      // this.grabCueNode.visible = true;
    }
  }

  return sceneryPhet.register( 'GrabButtonNode', GrabButtonNode );

} );
