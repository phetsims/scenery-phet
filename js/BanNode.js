// Copyright 2019, University of Colorado Boulder

/**
 * Shows a circle with a line through it.  Implemented as a scenery node to overlay the line.
 * TODO: Would this be better written as a shape?
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Line = require( 'SCENERY/nodes/Line' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Vector2 = require( 'DOT/Vector2' );

  class BanNode extends Node {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {
      options = merge( {
        lineWidth: 5,
        radius: 20,
        stroke: 'black'
      }, options );

      assert && assert( !options.children, 'BanNode provides its own children' );
      super();

      // Options that apply to both the circle and the line
      const sharedOptions = {
        lineWidth: options.lineWidth,
        stroke: options.stroke,
        center: Vector2.ZERO
      };

      this.addChild( new Line( 0, 0, options.radius * 2, 0, merge( { rotation: Math.PI / 4 }, sharedOptions ) ) );

      // Put the circle across the line in case there is any "seam"
      this.addChild( new Circle( options.radius, sharedOptions ) );

      this.mutate( options );
    }
  }

  return sceneryPhet.register( 'BanNode', BanNode );
} );