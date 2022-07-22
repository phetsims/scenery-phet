// Copyright 2013-2022, University of Colorado Boulder

/**
 * Shows a central node surrounded with next/previous arrows. Need to implement next(),previous(),
 * and when availability changes modify hasNextProperty and hasPreviousProperty
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Property from '../../axon/js/Property.js';
import { Shape } from '../../kite/js/imports.js';
import merge from '../../phet-core/js/merge.js';
import { Color, FireListener, Node, Path } from '../../scenery/js/imports.js';
import sceneryPhet from './sceneryPhet.js';
import deprecationWarning from '../../phet-core/js/deprecationWarning.js';

/**
 * @deprecated Do not use in new code until https://github.com/phetsims/scenery-phet/issues/763 is addressed.
 * This is currently used only in build-a-molecule.
 */
class NextPreviousNavigationNode extends Node {

  /**
   * @param {Node} centerNode
   * @param {Object} [selfOptions]  Valid options are:
   *                                arrowColor         - color for the arrow's fill
   *                                arrowStrokeColor   - color for the arrow's stroke
   *                                arrowWidth         - the width of the arrow, from its point to its side
   *                                arrowHeight        - the height of the arrow, from tip to tip
   *                                next               - a function to be called when the "next" arrow is pressed
   *                                previous           - a function to be called when the "previous" arrow is pressed
   *                                createTouchAreaShape - function( shape, isPrevious ) that returns the touch area for the specified arrow
   * @param {Object} [nodeOptions] passed to the Node (super) constructor
   */
  constructor( centerNode, selfOptions, nodeOptions ) {
    assert && deprecationWarning( 'NextPreviousNavigationNode is deprecated, see https://github.com/phetsims/scenery-phet/issues/763' );

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

    super();

    // @public
    this.hasNextProperty = new Property( false );
    this.hasPreviousProperty = new Property( false );

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
      cursor: 'pointer',
      touchArea: selfOptions.createTouchAreaShape( previousShape, true )
    } );
    previousKitNode.addInputListener( new FireListener( {
      fire: () => {
        if ( this.hasPreviousProperty.value ) {
          selfOptions.previous && selfOptions.previous();
        }
      }
    } ) );
    this.hasPreviousProperty.link( available => {
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
      cursor: 'pointer',
      touchArea: selfOptions.createTouchAreaShape( nextShape, false )
    } );
    nextKitNode.addInputListener( new FireListener( {
      fire: () => {
        if ( this.hasNextProperty.value ) {
          selfOptions.next && selfOptions.next();
        }
      }
    } ) );
    this.hasNextProperty.link( available => {
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
}

sceneryPhet.register( 'NextPreviousNavigationNode', NextPreviousNavigationNode );
export default NextPreviousNavigationNode;