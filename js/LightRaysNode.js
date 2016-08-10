// Copyright 2015-2016, University of Colorado Boulder

/**
 * Light rays that indicate brightness of a light source such as a bulb.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Util = require( 'DOT/Util' );

  // constants, these are specific to bulb images
  var RAYS_START_ANGLE = 3 * Math.PI / 4;
  var RAYS_ARC_ANGLE = 3 * Math.PI / 2;

  /**
   * Rays of light that come out of the light bulb.
   * @param {number} bulbRadius
   * @param {Object} [options]
   * @constructor
   */
  function LightRaysNode( bulbRadius, options ) {

    assert && assert( bulbRadius > 0 );
    assert && assert( options ); // assumes that options are properly populated by LightBulbNode

    this.bulbRadius = bulbRadius; //@private
    this.options = options; // @private

    Node.call( this, options );

    // @private pre-calculate reusable rays {Line}
    this.cachedLines = [];
    for ( var i = options.maxRays; i--; ) {
      this.cachedLines[ i ] = new Line( 0, 0, 0, 0, { stroke: options.rayStroke } );
      this.addChild( this.cachedLines[ i ] );
    }
  }

  sceneryPhet.register( 'LightRaysNode', LightRaysNode );

  inherit( Node, LightRaysNode, {

    // @public updates light rays based on {number} brightness, which varies from 0 to 1.
    setBrightness: function( brightness ) {

      assert && assert( brightness >= 0 && brightness <= 1 );

      // local vars to improve readability
      var minRays = this.options.minRays;
      var maxRays = this.options.maxRays;
      var minRayLength = this.options.minRayLength;
      var maxRayLength = this.options.maxRayLength;

      // number of rays is a function of brightness
      var numberOfRays = ( brightness === 0 ) ? 0 : minRays + Math.round( brightness * ( maxRays - minRays ) );
      // ray length is a function of brightness
      var rayLength = minRayLength + ( brightness * ( maxRayLength - minRayLength ) );

      var angle = RAYS_START_ANGLE;
      var deltaAngle = RAYS_ARC_ANGLE / ( numberOfRays - 1 );

      // The ray line width is a linear function within the allowed range
      var lineWidth = Util.linear(
        0.3 * maxRayLength,
        0.6 * maxRayLength,
        this.options.shortRayLineWidth,
        this.options.longRayLineWidth,
        rayLength
      );
      lineWidth = Util.clamp( lineWidth, this.options.shortRayLineWidth, this.options.longRayLineWidth );

      // rays fill part of a circle, incrementing clockwise
      for ( var i = 0, x1, x2, y1, y2; i < maxRays; i++ ) {
        if ( i < numberOfRays ) {

          // determine the end points of the ray
          x1 = Math.cos( angle ) * this.bulbRadius;
          y1 = Math.sin( angle ) * this.bulbRadius;
          x2 = Math.cos( angle ) * ( this.bulbRadius + rayLength );
          y2 = Math.sin( angle ) * ( this.bulbRadius + rayLength );

          // set properties of line from the cache
          this.cachedLines[ i ].visible = true;
          this.cachedLines[ i ].lineWidth = lineWidth;
          this.cachedLines[ i ].setLine( x1, y1, x2, y2 );

          // increment the angle
          angle += deltaAngle;
        }
        else {
          // hide unusable lined
          this.cachedLines[ i ].visible = false;
        }
      }
    }
  } );

  return LightRaysNode;
} );