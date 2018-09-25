// Copyright 2014-2018, University of Colorado Boulder

/**
 * Star shape (full, 5-pointed)
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function StarShape( options ) {

    var self = this;

    options = _.extend( {

      // Distance from the center to the tip of a star limb
      outerRadius: 15,

      // Distance from the center to the closest point on the exterior of the star.  Sets the "thickness" of the star limbs
      innerRadius: 7.5,

      // Number of star points, must be an integer
      numberStarPoints: 5
    }, options );

    Tandem.disallowTandem( options );

    Shape.call( this );

    var numSegments = 2 * options.numberStarPoints; // number of segments

    // start at the top and proceed clockwise
    _.times( numSegments, function( i ) {
      var angle = i / numSegments * Math.PI * 2 - Math.PI / 2;
      var radius = i % 2 === 0 ? options.outerRadius : options.innerRadius;

      self.lineTo(
        radius * Math.cos( angle ),
        radius * Math.sin( angle )
      );
    } );
    this.close();
    this.makeImmutable(); // So Paths won't need to add listeners
  }

  sceneryPhet.register( 'StarShape', StarShape );

  return inherit( Shape, StarShape );
} );
