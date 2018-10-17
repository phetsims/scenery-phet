// Copyright 2018, University of Colorado Boulder

/**
 * @author Michael Kauzmann
 */
define( require => {
  'use strict';

  // modules
  const FocusHighlightFromNode = require( 'SCENERY/accessibility/FocusHighlightFromNode' );
  const FocusHighlightPath = require( 'SCENERY/accessibility/FocusHighlightPath' );
  const KeyboardUtil = require( 'SCENERY/accessibility/KeyboardUtil' );
  const Node = require( 'SCENERY/nodes/Node' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const SceneryPhetA11yStrings = require( 'SCENERY_PHET/SceneryPhetA11yStrings' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // constants
  const grabPatternString = SceneryPhetA11yStrings.grabPattern.value;
  const defaultThingToGrabString = SceneryPhetA11yStrings.defaultThingToGrab.value;
  const releasedString = SceneryPhetA11yStrings.released.value;


  /**
   *
   * NOTE: if passing inthis class assumes
   * @param {Node} wrappedNode
   * @param  {Object} options
   */
  class GrabButtonNode extends Node {
    constructor( wrappedNode, options ) {
      super();

      options = _.extend( {
        cursor: 'pointer',

        // A string that is filled in to the appropriate button label
        thingToGrab: defaultThingToGrabString,

        // {function} - called when the node is "grabbed" (when the grab button fires)
        onGrab: _.noop(),

        // {function} - if you override this, make sure to handle the alert in the default onRelease
        onRelease: GrabButtonNode.onRelease,

        // filled in below
        grabButtonOptions: {},

        // a11y - this node will act as a container for more accessible content, its children will implement
        // most of the keyboard navigation
        tagName: 'div'
      }, options );

      assert && assert( wrappedNode.accessibleContent, 'grab button must wrap a node with accessible content' );
      assert && assert( typeof options.onGrab === 'function' );
      assert && assert( typeof options.onRelease === 'function' );
      if ( wrappedNode.focusHighlight ) {
        assert && assert( wrappedNode.focusHighlight instanceof phet.scenery.Path,
          'if provided, focusHighlight must be a path' );
      }

      options.grabButtonOptions = _.extend( {

        // a11y
        containerTagName: 'div',
        tagName: 'button',
        focusHighlightLayerable: true
      }, options.grabButtonOptions );

      assert && assert( !options.grabButtonOptions.innerContent, 'GrabButtonNode sets its own innerContent, see thingToGrab' );

      options.grabButtonOptions.innerContent = StringUtils.fillIn( grabPatternString, {
        thingToGrab: options.thingToGrab
      } );


      const grabButton = new Node( options.grabButtonOptions );

      // make sure that the grabButton actually has some width, so add the wrapped node to it
      this.addChild( grabButton );
      grabButton.addChild( wrappedNode );

      // The wrapped node starts invisible in the PDOM
      wrappedNode.accessibleVisible = false;

      // Update the passed in node's focusHighlight to make it "dashed"
      let wrappedNodeFocusHighlight = wrappedNode.focusHighlight;
      if ( !wrappedNodeFocusHighlight ) {
        wrappedNodeFocusHighlight = new FocusHighlightFromNode( wrappedNode );
      }
      wrappedNodeFocusHighlight.makeDashed();
      wrappedNode.focusHighlight = wrappedNodeFocusHighlight;

      // Make the grab button's focusHighlight in the spitting image of the wrappedNode's
      const grabButtonFocusHighlight = new FocusHighlightPath( wrappedNodeFocusHighlight.shape );
      grabButtonFocusHighlight.center = wrappedNode.center;
      grabButton.focusHighlight = grabButtonFocusHighlight;

      // if ever we update the wrappedNode's focusHighlight, then update the grab button's too to keep in syn.
      let onHighlightChange = () => {
        grabButtonFocusHighlight.setShape( wrappedNodeFocusHighlight.shape );
      };
      wrappedNode.focusHighlight.highlightChangedEmitter.addListener( onHighlightChange );


      // update the grabButton's focusHighlight whenever the wrappedNode moves.
      const transformListener = () => {
        grabButtonFocusHighlight.center = wrappedNode.center;
      };
      wrappedNode.on( 'transform', transformListener );

      // for focusHighlightLayerable
      grabButton.addChild( grabButtonFocusHighlight );

      // when the "Grab Balloon" button is pressed, focus the draggable node and set to dragged state
      grabButton.addAccessibleInputListener( {
        click( event ) {

          // if the balloon was released on enter, don't pick it up again until the next click event so we don't pick
          // it up immediately again
          if ( !guardKeyPress ) {
            options.onGrab();
            wrappedNode.accessibleVisible = true;
            wrappedNode.focus();
          }

          // pick up the balloon on the next click event
          guardKeyPress = false;
        }
      } );

      /**
       * Release the balloon after an accessible interaction, resetting  model Properties, returning focus
       * to the "grab" button, and hiding the draggable balloon.
       */
      const a11yReleaseWrappedNode = () => {

        // focus the grab balloon button
        grabButton.focus();

        // the draggable node should no longer be discoverable in the parallel DOM
        wrappedNode.accessibleVisible = false;

        // reset the key state of the drag handler by interrupting the drag
        wrappedNode.interruptInput();

        // callback when node is "released"
        options.onRelease();
      };

      // some keypresses can fire the grabButton's click from the same press that fires the event below, so guard against that.
      let guardKeyPress = false;
      wrappedNode.addAccessibleInputListener( {

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
          wrappedNode.accessibleVisible = false;
        }
      } );

      // pull the wrappedNode out of the grabButton's children so that they are on the same level of the PDOM.
      this.accessibleOrder = [ grabButton, wrappedNode ];

      this.disposeGrabButtonNode = () => {
        wrappedNode.focusHighlight.highlightChangedEmitter.removeListener( onHighlightChange );
        this.off( 'transform', transformListener );
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
  }

  return sceneryPhet.register( 'GrabButtonNode', GrabButtonNode );

} );
