// Copyright 2019, University of Colorado Boulder

/**
 * Puts a Node on a rectangular background, dynamically sized to fit the Node.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  class BackgroundNode extends Node {

    /**
     * @param {Node} node - the Node that will be put on the background
     * @param {Object} [options]
     */
    constructor( node, options ) {

      options = merge( {
        xMargin: 2, // set the x margin between the Node content and background edge
        yMargin: 2, // set the y margin between the Node content and background edge

        // Options passed to the background Rectangle
        backgroundOptions: {
          fill: 'white',
          opacity: 0.75
        }
      }, options );

      super();

      // @public (read-only) {Rectangle} - translucent rectangle
      this.background = new Rectangle( 0, 0, 1, 1, options.backgroundOptions );

      // size the rectangle to fit the node
      node.on( 'bounds', () => {
        this.background.setRect( 0, 0, node.width + 2 * options.xMargin, node.height + 2 * options.yMargin );
        node.center = this.background.center;
      } );

      assert && assert( !options.children, 'BackgroundNode sets children' );
      options.children = [ this.background, node ];
      this.mutate( options );
    }
  }

  return sceneryPhet.register( 'BackgroundNode', BackgroundNode );
} );