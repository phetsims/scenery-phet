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
  const Tandem = require( 'TANDEM/Tandem' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );
  const GrabReleaseCueNode = require( 'SCENERY_PHET/accessibility/nodes/GrabReleaseCueNode' );

  // a11y strings
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

        // {Object} filled in below
        grabButtonOptions: {},

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

      assert && assert( wrappedNode.accessibleContent, 'grab button must wrap a node with accessible content' );
      assert && assert( typeof options.onGrab === 'function' );
      assert && assert( typeof options.onRelease === 'function' );
      if ( wrappedNode.focusHighlight ) {
        assert && assert( wrappedNode.focusHighlight instanceof phet.scenery.FocusHighlightPath,
          'if provided, focusHighlight must be a path' );
      }

      assert && assert( typeof options.grabsToCue === 'number' );

      assert && assert( typeof options.grabCueOptions === 'object' );
      assert && assert( options.grabCueOptions.visible === undefined, 'GrabButtonNode sets visibility of cue node' );
      options.grabCueOptions = _.extend( {
        center: wrappedNode.center.minusXY( 0, 50 ),
        visible: false // starts out as invisible, and is reset that way too
      }, options.grabCueOptions );

      options.grabButtonOptions = _.extend( {

        tandem: options.tandem,

        // a11y
        containerTagName: 'div',
        tagName: 'button',
        focusHighlightLayerable: true
      }, options.grabButtonOptions );

      // don't pass this to up to Node
      delete options.tandem;

      assert && assert( !options.grabButtonOptions.innerContent, 'GrabButtonNode sets its own innerContent, see thingToGrab' );

      // @private
      this.numberOfGrabs = 0;

      options.grabButtonOptions.innerContent = StringUtils.fillIn( grabPatternString, {
        thingToGrab: options.thingToGrab
      } );
      const grabButton = new Node( options.grabButtonOptions );

      // @private
      this.grabCueNode = new GrabReleaseCueNode( options.grabCueOptions );
      grabButton.addChild( this.grabCueNode );

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
        click: () => {

          // if the balloon was released on enter, don't pick it up again until the next click event so we don't pick
          // it up immediately again
          if ( !guardKeyPress ) {
            this.numberOfGrabs++;

            options.onGrab();
            wrappedNode.accessibleVisible = true;
            wrappedNode.focus();
          }

          // pick up the balloon on the next click event
          guardKeyPress = false;
        },

        // arrow function handles `this` properly
        focus: () => {
          if ( this.numberOfGrabs < options.grabsToCue ) {
            this.grabCueNode.visible = true;
          }
        },
        blur: () => {
          this.grabCueNode.visible = false;
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

    /**
     * Reset to initial state
     * @public
     */
    reset() {
      this.numberOfGrabs = 0;
      this.grabCueNode.visible = false;
    }
  }

  return sceneryPhet.register( 'GrabButtonNode', GrabButtonNode );

} );
