// Copyright 2017, University of Colorado Boulder

/**
 * An octagonal, red stop sign node with a white internal border
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );

  // constants
  var NUMBER_OF_SIDES = 8;

  /**
   * @param {Object} options
   * @constructor
   */
  function StopSignNode( options ) {
    options = _.extend( {
      fillRadius: 23,
      innerStrokeWidth: 2,
      outerStrokeWidth: 1,

      fill: 'red',
      innerStroke: 'white',
      outerStroke: 'black',

      tandem: Tandem.required
    }, options );

    options.children = [
      createStopSignPath( options.outerStroke, options.fillRadius + options.innerStrokeWidth + options.outerStrokeWidth ),
      createStopSignPath( options.innerStroke, options.fillRadius + options.innerStrokeWidth ),
      createStopSignPath( options.fill, options.fillRadius )
    ];

    Node.call( this, options );
  }

  sceneryPhet.register( 'StopSignNode', StopSignNode );

  var createStopSignPath = function( fill, radius ) {
    return new Path( Shape.regularPolygon( NUMBER_OF_SIDES, radius ), {
      fill: fill,
      rotation: Math.PI / NUMBER_OF_SIDES,

      // To support centering when stacked in z-order
      centerX: 0,
      centerY: 0
    } );
  };

  return inherit( Node, StopSignNode );
} );