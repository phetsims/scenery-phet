// Copyright 2013-2017, University of Colorado Boulder

/**
 * Shows a central node surrounded with next/previous arrows. Need to implement next(),previous(),
 * and when availability changes modify hasNextProperty and hasPreviousProperty
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );

  // constants
  var arrowPadding = 8;

  /**
   * @param {Node} centerNode
   * @param {Object} selfOptions  Valid options are:
   *                                arrowColor         - color for the arrow's fill
   *                                arrowStrokeColor   - color for the arrow's stroke
   *                                arrowWidth         - the width of the arrow, from its point to its side
   *                                arrowHeight        - the height of the arrow, from tip to tip
   *                                next               - a function to be called when the "next" arrow is pressed
   *                                previous           - a function to be called when the "previous" arrow is pressed
   *                                createTouchAreaShape - function( shape, isPrevious ) that returns the touch area for the specified arrow
   * @param {Object} nodeOptions  Passed to the Node constructor
   */
  function NextPreviousNavigationNode( centerNode, selfOptions, nodeOptions ) {
    Tandem.indicateUninstrumentedCode();

    var self = this;

    // @public
    this.hasNextProperty = new Property( false );
    this.hasPreviousProperty = new Property( false );

    Node.call( this );

    selfOptions = _.extend( {
      arrowColor: Color.YELLOW,
      arrowStrokeColor: Color.BLACK,
      arrowWidth: 14,
      arrowHeight: 18,
      next: null, // function() { ... }
      previous: null, // function() { ... }
      createTouchAreaShape: function( shape, isPrevious ) {
        return null; // pass in function that returns a shape given the shape of the arrow
      }
    }, selfOptions );

    var arrowWidth = selfOptions.arrowWidth;
    var arrowHeight = selfOptions.arrowHeight;

    /*---------------------------------------------------------------------------*
     * previous
     *----------------------------------------------------------------------------*/

    // triangle pointing to the left
    var previousShape = new Shape().moveTo( 0, arrowHeight / 2 )
      .lineTo( arrowWidth, 0 )
      .lineTo( arrowWidth, arrowHeight )
      .close();

    var previousKitNode = new Path( previousShape, {
      fill: selfOptions.arrowColor,
      stroke: selfOptions.arrowStrokeColor,
      cursor: 'pointer', // TODO: buttonListener adds this maybe?
      touchArea: selfOptions.createTouchAreaShape( previousShape, true )
    } );
    previousKitNode.addInputListener( new ButtonListener( {
      fire: function() {
        if ( self.hasPreviousProperty.value ) {
          selfOptions.previous && selfOptions.previous();
        }
      }
    } ) );
    this.hasPreviousProperty.link( function( available ) {
      previousKitNode.visible = available;
    } );

    this.addChild( previousKitNode );

    /*---------------------------------------------------------------------------*
     * center
     *----------------------------------------------------------------------------*/

    this.addChild( centerNode );

    /*---------------------------------------------------------------------------*
     * next
     *----------------------------------------------------------------------------*/

    // triangle pointing to the right
    var nextShape = new Shape().moveTo( arrowWidth, arrowHeight / 2 )
      .lineTo( 0, 0 )
      .lineTo( 0, arrowHeight )
      .close();

    var nextKitNode = new Path( nextShape, {
      fill: selfOptions.arrowColor,
      stroke: selfOptions.arrowStrokeColor,
      cursor: 'pointer', // TODO: buttonListener adds this maybe?
      touchArea: selfOptions.createTouchAreaShape( nextShape, false )
    } );
    nextKitNode.addInputListener( new ButtonListener( {
      fire: function() {
        if ( self.hasNextProperty.value ) {
          selfOptions.next && selfOptions.next();
        }
      }
    } ) );
    this.hasNextProperty.link( function( available ) {
      nextKitNode.visible = available;
    } );

    this.addChild( nextKitNode );

    /*---------------------------------------------------------------------------*
     * positioning
     *----------------------------------------------------------------------------*/

    var maxHeight = Math.max( arrowHeight, centerNode.height );

    previousKitNode.centerY = maxHeight / 2;
    centerNode.centerY = maxHeight / 2;
    nextKitNode.centerY = maxHeight / 2;

    // previousKitNode.x = 0;
    centerNode.x = arrowWidth + arrowPadding;
    nextKitNode.x = centerNode.right + arrowPadding;

    this.mutate( nodeOptions );
  }

  sceneryPhet.register( 'NextPreviousNavigationNode', NextPreviousNavigationNode );

  return inherit( Node, NextPreviousNavigationNode );
} );
