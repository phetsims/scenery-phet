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
  const Tandem = require( 'TANDEM/Tandem' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // a11y strings
  const grabPatternString = SceneryPhetA11yStrings.grabPattern.value;
  const defaultThingToGrabString = SceneryPhetA11yStrings.defaultThingToGrab.value;
  const releasedString = SceneryPhetA11yStrings.released.value;

  /**
   * TODO: There are three possible nodes to manipulate: draggableNodeToGetA11yButton, this, and child node. Do we need all three?
   * TODO: rename to GrabDragInteractionNode????
   * NOTE: if passing inthis class assumes
   * @param {Node} wrappedNode
   * @param  {Object} options
   */
  class GrabButtonNode extends Node {

    // TODO: rename this horrid thing
    constructor( draggableNodeToGetA11yButton, options ) {
      super();

      options = _.extend( {
        cursor: 'pointer',

        // A string that is filled in to the appropriate button label
        thingToGrab: defaultThingToGrabString,

        // {function} - called when the node is "grabbed" (when the grab button fires)
        onGrab: _.noop(),

        // {function} - if you override this, make sure to handle the alert in the default onRelease
        onRelease: GrabButtonNode.onRelease,

        // {Object} - Node options passed to the actually <button> created for the PDOM, filled in below
        grabButtonOptions: {},

        // {Object} - Options for the child Node that will be the draggable component in the PDOM. This gets a11y
        // related draggable listeners and such.
        a11yDraggableNodeOptions: {},

        // {null|Node} -  additional cueing node who's visibility can be toggled.
        supplementaryCueNode: null,

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

      assert && assert( options.supplementaryCueNode instanceof Node || options.supplementaryCueNode === null );
      assert && assert( options.supplementaryCueNode === null || !options.supplementaryCueNode.parent, 'GrabButtonNode adds supplementaryCueNode to focusHighlight' );

      assert && assert( typeof options.onGrab === 'function' );
      assert && assert( typeof options.onRelease === 'function' );

      if ( draggableNodeToGetA11yButton.focusHighlight ) {
        assert && assert( draggableNodeToGetA11yButton.focusHighlight instanceof phet.scenery.FocusHighlightPath,
          'if provided, focusHighlight must be a Path' );
      }

      assert && assert( typeof options.grabsToCue === 'number' );

      assert && assert( typeof options.a11yDraggableNodeOptions === 'object' );
      assert && assert( typeof options.grabCueOptions === 'object' );
      assert && assert( options.grabCueOptions.visible === undefined, 'GrabButtonNode sets visibility of cue node' );
      options.grabCueOptions = _.extend( {
        visible: true
      }, options.grabCueOptions );


      options.a11yDraggableNodeOptions = _.extend( {

        // a11y
        tagName: 'div',
        ariaRole: 'application',
        focusable: true
      }, options.a11yDraggableNodeOptions );


      // TODO - maybe we don't need this to be an option
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

      // TODO: this should be added as the focusHighlight?? Maybe with an options
      this.supplementaryCueNode = options.supplementaryCueNode; // could be null
      if ( this.supplementaryCueNode ) {
        this.supplementaryCueNode.visible = true; // initialize it to invisible by default
      }

      options.grabButtonOptions.innerContent = StringUtils.fillIn( grabPatternString, {
        thingToGrab: options.thingToGrab
      } );

      // Add options to draggable node to make it look like a button
      draggableNodeToGetA11yButton.mutate( options.grabButtonOptions );

      // @private

      // TODO: this should be part of the focusHighlight, removing for now.
      this.grabCueNode = new GrabReleaseCueNode( options.grabCueOptions );

      var childA11yDraggableNode = new Node( options.a11yDraggableNodeOptions );

      // by default should be hidden until "grabbed" (grab button is pressed)
      childA11yDraggableNode.accessibleVisible = false;

      this.addChild( childA11yDraggableNode );

      // Update the passed in node's focusHighlight to make it "dashed"
      let draggableNodeFocusHighlight = draggableNodeToGetA11yButton.focusHighlight;
      if ( !draggableNodeFocusHighlight ) {
        draggableNodeFocusHighlight = new FocusHighlightFromNode( draggableNodeToGetA11yButton );
      }
      draggableNodeToGetA11yButton.focusHighlight = draggableNodeFocusHighlight;
      draggableNodeToGetA11yButton.focusHighlight.addChild( this.grabCueNode );
      options.supplementaryCueNode && draggableNodeToGetA11yButton.focusHighlight.addChild( this.supplementaryCueNode );

      // Make the grab button's focusHighlight in the spitting image of the draggableNodeToGetA11yButton's
      const childDraggableFocusHighlight = new FocusHighlightPath( draggableNodeFocusHighlight.shape, {
        visible: false
      } );
      childDraggableFocusHighlight.makeDashed();
      childA11yDraggableNode.focusHighlight = childDraggableFocusHighlight;

      // if ever we update the draggableNodeToGetA11yButton's focusHighlight, then update the grab button's too to keep in syn.
      let onHighlightChange = () => {
        childDraggableFocusHighlight.setShape( draggableNodeFocusHighlight.shape );
      };
      draggableNodeToGetA11yButton.focusHighlight.highlightChangedEmitter.addListener( onHighlightChange );

      // when the "Grab {{thing}}" button is pressed, focus the draggable node and set to dragged state
      const grabButtonListener = {
        click: () => {

          // if the balloon was released on enter, don't pick it up again until the next click event so we don't pick
          // it up immediately again
          if ( !guardKeyPress ) {
            this.numberOfGrabs++;

            options.onGrab();
            childA11yDraggableNode.accessibleVisible = true;

            // TODO: so hacky!!!!
            if ( childA11yDraggableNode.focusHighlightLayerable &&
                 !draggableNodeFocusHighlight.parent.hasChild( childDraggableFocusHighlight ) ) {
              assert && assert( draggableNodeFocusHighlight.parent, 'how can we have focusHighlightLayerable with a ' +
                                                                    'node that is not in the scene graph?' );
              draggableNodeFocusHighlight.parent.addChild( childDraggableFocusHighlight );
            }
            childA11yDraggableNode.focus();
          }

          // pick up the balloon on the next click event
          guardKeyPress = false;
        },

        blur: () => {
          if ( this.numberOfGrabs >= options.grabsToCue ) {

            this.grabCueNode.visible = false;
            if ( this.supplementaryCueNode ) {
              this.supplementaryCueNode.visible = false;
            }
          }
        }
      };
      draggableNodeToGetA11yButton.addAccessibleInputListener( grabButtonListener );

      // Release the balloon after an accessible interaction, resetting  model Properties, returning focus
      // to the "grab" button, and hiding the draggable balloon.
      const a11yReleaseWrappedNode = () => {

        // focus the grab button again
        draggableNodeToGetA11yButton.focus();

        // the draggable node should no longer be discoverable in the parallel DOM
        childA11yDraggableNode.accessibleVisible = false;

        // reset the key state of the drag handler by interrupting the drag
        childA11yDraggableNode.interruptInput();

        // callback when node is "released"
        options.onRelease();
      };

      // some keypresses can fire the draggableNodeToGetA11yButton's click (the grab button) from the same press that fires the event below, so guard against that.
      let guardKeyPress = false;
      // TODO: handle guardKeyPress the other direction too.
      childA11yDraggableNode.addAccessibleInputListener( {

        // Release the balloon on 'enter' key, tracking that we have released the balloon with this key so that
        // we don't immediately catch the 'click' event while the enter key is down on the button
        keydown( event ) {
          if ( event.keyCode === KeyboardUtil.KEY_ENTER ) {
            guardKeyPress = true;
            a11yReleaseWrappedNode();
          }
        },
        keyup( event ) {

          // Release  on keyup of spacebar so that we don't pick up the balloon again when we release the spacebar
          // and trigger a click event - escape could be added to either keyup or keydown listeners
          if ( event.keyCode === KeyboardUtil.KEY_SPACE || event.keyCode === KeyboardUtil.KEY_ESCAPE ) {
            a11yReleaseWrappedNode();
          }
        },
        blur() {
          // No need to interrupt the KeyboardDragHandler, accessibilityInputListeners are already interrupted on blur

          // the draggable node should no longer be focusable
          childA11yDraggableNode.accessibleVisible = false;

        }
      } );

      // TODO: Handle what is best here, I think we may want to move button logic from the draggableNode an to "this" (GrabButtonNode)
      // pull the childA11yDraggableNode out of the draggableNodeToGetA11yButton's children so that they are on the same level of the PDOM.
      // draggableNodeToGetA11yButton.accessibleOrder = [ draggableNodeToGetA11yButton, childA11yDraggableNode ];

      this.disposeGrabButtonNode = () => {

        draggableNodeToGetA11yButton.removeAccessibleInputListener( grabButtonListener );
        draggableNodeToGetA11yButton.focusHighlight.highlightChangedEmitter.removeListener( onHighlightChange );

        if ( childA11yDraggableNode.focusHighlightLayerable ) {
          assert && assert( draggableNodeFocusHighlight.parent, 'how can we have focusHighlightLayerable with a ' +
                                                                'node that is not in the scene graph?' );
          draggableNodeFocusHighlight.parent.removeChild( childDraggableFocusHighlight );
        }

        // TODO: do we have to do this?
        draggableNodeToGetA11yButton.focusHighlight.removeChild( this.grabCueNode );
        options.supplementaryCueNode && draggableNodeToGetA11yButton.focusHighlight.removeChild( this.supplementaryCueNode );
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
      if ( this.supplementaryCueNode ) {
        this.supplementaryCueNode.visible = true;
      }
      this.grabCueNode.visible = true;
    }
  }

  return sceneryPhet.register( 'GrabButtonNode', GrabButtonNode );

} );
