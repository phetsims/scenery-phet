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
  var Path = require( 'SCENERY/nodes/Path' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {Object} options
   * @constructor
   */
  function StopSignNode( options ) {

    options = _.extend( {
      fillRadius: 23,
      innerStrokeRadius: 2,
      outerStrokeRadius: 1,

      fill: 'red',
      outerStroke: 'black',
      innerStroke: 'white',

      tandem: Tandem.tandemRequired()
    }, options );
    var createStopSignPath = function( fill, radius ) {
      return new Path( Shape.regularPolygon( 8, radius ), {
        fill: fill,
        rotation: Math.PI / 8,

        // To support centering when stacked in z-order
        centerX: 0,
        centerY: 0
      } );
    };

    options.children = [
      createStopSignPath( options.outerStroke, options.fillRadius + options.innerStrokeRadius + options.outerStrokeRadius ),
      createStopSignPath( options.innerStroke, options.fillRadius + options.innerStrokeRadius ),
      createStopSignPath( options.fill, options.fillRadius )
    ];

    Node.call( this, options );
  }

  sceneryPhet.register( 'StopSignNode', StopSignNode );

  return inherit( Node, StopSignNode );
} );