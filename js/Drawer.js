// Copyright 2016-2020, University of Colorado Boulder

/**
 * A drawer that opens/closes to show/hide its contents.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import stepTimer from '../../axon/js/stepTimer.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import PressListener from '../../scenery/js/listeners/PressListener.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Animation from '../../twixt/js/Animation.js';
import Easing from '../../twixt/js/Easing.js';
import sceneryPhet from './sceneryPhet.js';

class Drawer extends Node {

  /**
   * @param {Node} contentsNode - contents of the drawer
   * @param {Object} [options]
   */
  constructor( contentsNode, options ) {

    options = merge( {

      size: null, // {Dimension2|null} !null: contents sized to fit in container, null: container sized to fit contents
      cornerRadius: 0,
      xMargin: 0,
      yMargin: 0,
      open: true, // {boolean} is the drawer initially open?
      animationEnabled: true, // {boolean} is animation enabled when opening/closing the drawer?

      // handle
      handlePosition: 'top', // {string} 'top'|'bottom'
      handleSize: new Dimension2( 70, 20 ),
      handleCornerRadius: 5,
      handleFill: 'rgb( 230, 230, 230 )', // {Color|string}
      handleTouchAreaXDilation: 0, // {number} touchArea for the drawer's handle
      handleTouchAreaYDilation: 0, // {number} touchArea for the drawer's handle
      handleMouseAreaXDilation: 0, // {number} touchArea for the drawer's handle
      handleMouseAreaYDilation: 0, // {number} touchArea for the drawer's handle

      // grippy dots on handle
      grippyDotRadius: 1,
      grippyDotColor: 'black', // {Color|string}
      grippyDotRows: 2,
      grippyDotColumns: 4,
      grippyDotXSpacing: 9,
      grippyDotYSpacing: 5,

      /**
       * Callbacks. The default behavior is to make contentNode visible only while the drawer is open.
       * This can provide performance gains if your contentNode updates only while visible.
       */
      beforeOpen: function() { contentsNode.visible = true; }, // {function} called immediately before the drawer is opened
      afterClose: function() { contentsNode.visible = false; }, // {function} called immediately after the drawer is closed

      // animation of the drawer opening and closing
      animationDuration: 0.5, // seconds
      stepEmitter: stepTimer // {Emitter|null} see Animation options.stepEmitter
    }, options );

    assert && assert( options.handlePosition === 'top' || options.handlePosition === 'bottom' );

    // size of contents, adjusted for margins
    const CONTENTS_WIDTH = contentsNode.width + ( 2 * options.xMargin );
    const CONTENTS_HEIGHT = contentsNode.height + ( 2 * options.yMargin );

    // size of container
    const CONTAINER_WIDTH = options.size ? options.size.width : CONTENTS_WIDTH;
    const CONTAINER_HEIGHT = options.size ? options.size.height : CONTENTS_HEIGHT;

    // background
    const backgroundNode = new Rectangle( 0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT, {
      fill: 'white',
      cornerRadius: options.cornerRadius
    } );

    // border
    const borderNode = new Rectangle( 0, 0, CONTAINER_WIDTH, CONTAINER_HEIGHT, {
      stroke: 'black',
      cornerRadius: options.cornerRadius
    } );

    // scale contents to fit the container
    if ( options.size ) {
      const scale = Math.min( 1, Math.min( CONTAINER_WIDTH / CONTENTS_WIDTH, CONTAINER_HEIGHT / CONTENTS_HEIGHT ) );
      contentsNode.setScaleMagnitude( scale );
    }

    // handle, rectangle with top or bottom corners rounded, the other corners square
    const HANDLE_RADII = ( options.handlePosition === 'top' ) ? {
      topLeft: options.handleCornerRadius,
      topRight: options.handleCornerRadius
    } : {
      bottomLeft: options.handleCornerRadius,
      bottomRight: options.handleCornerRadius
    };
    const handleShape = Shape.roundedRectangleWithRadii( 0, 0, options.handleSize.width, options.handleSize.height, HANDLE_RADII );
    const handleNode = new Path( handleShape, {
      cursor: 'pointer',
      fill: options.handleFill,
      stroke: 'black'
    } );

    // grippy dots on the handle
    const grippyDotsShape = new Shape();
    let grippyX = 0;
    let grippyY = 0;
    for ( let row = 0; row < options.grippyDotRows; row++ ) {
      for ( let column = 0; column < options.grippyDotColumns; column++ ) {
        grippyX = column * options.grippyDotXSpacing;
        grippyY = row * options.grippyDotYSpacing;
        grippyDotsShape.moveTo( grippyX, grippyY );
        grippyDotsShape.arc( grippyX, grippyY, options.grippyDotRadius, 0, 2 * Math.PI );
      }
    }
    const grippyDotsNode = new Path( grippyDotsShape, {
      fill: options.grippyDotColor,
      center: handleNode.center
    } );
    handleNode.addChild( grippyDotsNode );

    // handle pointerArea
    if ( options.handleTouchAreaXDilation !== 0 || options.handleTouchAreaYDilation !== 0 ) {
      const touchAreaShiftY = ( options.handlePosition === 'top' ) ? -options.handleTouchAreaYDilation : options.handleTouchAreaYDilation;
      handleNode.touchArea = handleNode.localBounds.dilatedXY( options.handleTouchAreaXDilation, options.handleTouchAreaYDilation ).shiftedY( touchAreaShiftY );
    }
    if ( options.handleMouseAreaXDilation !== 0 || options.handleMouseAreaYDilation !== 0 ) {
      const mouseAreaShiftY = ( options.handlePosition === 'top' ) ? -options.handleMouseAreaYDilation : options.handleMouseAreaYDilation;
      handleNode.mouseArea = handleNode.localBounds.dilatedXY( options.handleMouseAreaXDilation, options.handleMouseAreaYDilation ).shiftedY( mouseAreaShiftY );
    }

    // layout, position the handle at center-top or center-bottom
    backgroundNode.x = 0;
    handleNode.centerX = backgroundNode.centerX;
    if ( options.handlePosition === 'top' ) {
      handleNode.top = 0;
      backgroundNode.top = handleNode.bottom - 1;
    }
    else {
      backgroundNode.top = 0;
      handleNode.top = backgroundNode.bottom - 1;
    }
    borderNode.center = backgroundNode.center;
    contentsNode.center = backgroundNode.center;

    // put all of the moving pieces together
    const drawerNode = new Node( {
      children: [ handleNode, backgroundNode, contentsNode, borderNode ]
    } );

    // wrap the drawer with a clipping area, to show/hide the container
    assert && assert( !options.children, 'Drawer sets children' );
    options.children = [ drawerNode ];
    assert && assert( !options.clipArea, 'Drawer sets clipArea' );
    options.clipArea = Shape.bounds( drawerNode.bounds );

    super( options );

    this.contentsNode = contentsNode; // @public (read-only)
    this._animationEnabled = options.animationEnabled; // @private

    const yOpen = 0;
    const yClosed = ( options.handlePosition === 'top' ) ? backgroundNode.height : -backgroundNode.height;
    drawerNode.y = options.open ? yOpen : yClosed;

    let animation = null; // {Animation} animation that opens/closes the drawer

    // @public is the drawer open?
    this.openProperty = new Property( options.open );

    // click on the handle to toggle between open and closed
    handleNode.addInputListener( new PressListener( {
      press: ( event, trail ) => this.openProperty.set( !this.openProperty.get() )
    } ) );

    // open/close the drawer
    const openObserver = open => {

      // stop any animation that's in progress
      animation && animation.stop();

      open && options.beforeOpen && options.beforeOpen();

      if ( this._animationEnabled ) {

        // Animate opening and closing of the drawer.
        animation = new Animation( {
          stepEmitter: options.stepEmitter,
          duration: options.animationDuration,
          easing: Easing.QUADRATIC_IN_OUT,
          setValue: function( value ) { drawerNode.y = value; },
          getValue: function() { return drawerNode.y; },
          to: open ? yOpen : yClosed
        } );
        animation.start();
      }
      else {

        // animation disabled, move immediately to new state
        drawerNode.y = open ? yOpen : yClosed;
        !open && options.afterClose && options.afterClose();
      }
    };
    this.openProperty.lazyLink( openObserver ); // unlink in dispose

    // @private
    this.disposeDrawer = () => {
      this.openProperty.unlink( openObserver );
      this.openProperty.dispose(); // will fail if clients haven't removed observers
      this.openProperty = null;
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'Drawer', this );
  }

  get animationEnabled() { return this.getAnimationEnabled(); }

  set animationEnabled( value ) { this.setAnimationEnabled( value ); }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeDrawer();
    super.dispose();
  }

  /**
   * @param {Object} [options]
   * @public
   */
  reset( options ) {

    options = merge( {
      animationEnabled: this.animationEnabled
    }, options );

    // set the drawer to it's initial open/closed state, with or without animation
    const saveAnimationEnabled = this.animationEnabled;
    this.animationEnabled = options.animationEnabled;
    this.openProperty.reset();
    this.animationEnabled = saveAnimationEnabled;
  }

  /**
   * Determines whether animation is enabled for opening/closing drawer.
   * @param {boolean} animationEnabled
   * @public
   */
  setAnimationEnabled( animationEnabled ) {
    this._animationEnabled = animationEnabled;
  }

  /**
   * Is animation enabled for opening/closing drawer?
   * @returns {boolean}
   * @public
   */
  getAnimationEnabled() {
    return this._animationEnabled;
  }
}

sceneryPhet.register( 'Drawer', Drawer );
export default Drawer;