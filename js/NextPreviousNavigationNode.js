// Copyright 2002-2013, University of Colorado Boulder

/**
 * Shows a central node surrounded with next/previous arrows. Need to implement next(),previous(),
 * and when availability changes modify hasNext and hasPrevious
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var extend = require( 'PHET_CORE/extend' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Color = require( 'SCENERY/util/Color' );
  var Shape = require( 'KITE/Shape' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );

  var arrowPadding = 8;

  /*
   * @param {Node} centerNode
   * @param {Object} selfOptions  Valid options are:
   *                                arrowColor         - color for the arrow's fill
   *                                arrowStrokColor    - color for the arrow's stroke
   *                                arroWidth          - the width of the arrow, from its point to its side
   *                                arrowHeight        - the height of the arrow, from tip to tip
   *                                next               - a function to be called when the "next" arrow is pressed
   *                                previous           - a function to be called when the "previous" arrow is pressed
   *                                touchAreaExtension - function( shape, isPrevious ) that returns the touch area for the specified arrow
   * @param {Object} nodeOptions  Passed to the Node constructor
   */
  function NextPreviousNavigationNode( centerNode, selfOptions, nodeOptions ) {
    var self = this;

    PropertySet.call( this, {
      hasNext: false,
      hasPrevious: false
    } );
    Node.call( this, {} );

    selfOptions = _.extend( {
      arrowColor: Color.YELLOW,
      arrowStrokeColor: Color.BLACK,
      arrowWidth: 14,
      arrowHeight: 18,
      next: null, // function() { ... }
      previous: null, // function() { ... }
      touchAreaExtension: function( shape, isPrevious ) {
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
      touchArea: selfOptions.touchAreaExtension( previousShape, true )
    } );
    previousKitNode.addInputListener( new ButtonListener( {
      fire: function() {
        if ( self.hasPrevious ) {
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
      touchArea: selfOptions.touchAreaExtension( nextShape, false )
    } );
    nextKitNode.addInputListener( new ButtonListener( {
      fire: function() {
        if ( self.hasNext ) {
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

    Node.prototype.mutate.call( this, nodeOptions );
  }

  inherit( PropertySet, NextPreviousNavigationNode, extend( {}, Node.prototype ) );

  return NextPreviousNavigationNode;
} );
