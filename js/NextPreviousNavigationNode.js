// Copyright 2013-2020, University of Colorado Boulder

/**
 * Shows a central node surrounded with next/previous arrows. Need to implement next(),previous(),
 * and when availability changes modify hasNextProperty and hasPreviousProperty
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Property from '../../axon/js/Property.js';
import Shape from '../../kite/js/Shape.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import ButtonListener from '../../scenery/js/input/ButtonListener.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import Color from '../../scenery/js/util/Color.js';
import sceneryPhet from './sceneryPhet.js';

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
  const self = this;

  // @public
  this.hasNextProperty = new Property( false );
  this.hasPreviousProperty = new Property( false );

  Node.call( this );

  selfOptions = merge( {
    arrowColor: Color.YELLOW,
    arrowStrokeColor: Color.BLACK,
    arrowWidth: 14,
    arrowHeight: 18,
    arrowPadding: 15,
    next: null, // function() { ... }
    previous: null, // function() { ... }
    createTouchAreaShape: function( shape, isPrevious ) {
      return null; // pass in function that returns a shape given the shape of the arrow
    }
  }, selfOptions );

  const arrowWidth = selfOptions.arrowWidth;
  const arrowHeight = selfOptions.arrowHeight;

  /*---------------------------------------------------------------------------*
   * previous
   *----------------------------------------------------------------------------*/

  // triangle pointing to the left
  const previousShape = new Shape().moveTo( 0, arrowHeight / 2 )
    .lineTo( arrowWidth, 0 )
    .lineTo( arrowWidth, arrowHeight )
    .close();

  const previousKitNode = new Path( previousShape, {
    fill: selfOptions.arrowColor,
    stroke: selfOptions.arrowStrokeColor,
    cursor: 'pointer', // TODO: buttonListener adds this maybe? https://github.com/phetsims/scenery-phet/issues/587
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
  const nextShape = new Shape().moveTo( arrowWidth, arrowHeight / 2 )
    .lineTo( 0, 0 )
    .lineTo( 0, arrowHeight )
    .close();

  const nextKitNode = new Path( nextShape, {
    fill: selfOptions.arrowColor,
    stroke: selfOptions.arrowStrokeColor,
    cursor: 'pointer', // TODO: buttonListener adds this maybe? https://github.com/phetsims/scenery-phet/issues/587
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

  const maxHeight = Math.max( arrowHeight, centerNode.height );

  previousKitNode.centerY = maxHeight / 2;
  centerNode.centerY = maxHeight / 2;
  nextKitNode.centerY = maxHeight / 2;

  // previousKitNode.x = 0;
  centerNode.x = arrowWidth + selfOptions.arrowPadding;
  nextKitNode.x = centerNode.right + selfOptions.arrowPadding;

  this.mutate( nodeOptions );
}

sceneryPhet.register( 'NextPreviousNavigationNode', NextPreviousNavigationNode );

inherit( Node, NextPreviousNavigationNode );
export default NextPreviousNavigationNode;