// Copyright 2015-2019, University of Colorado Boulder

/**
 * Light rays that indicate brightness of a light source such as a bulb.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Util = require( 'DOT/Util' );

  // constants, these are specific to bulb images
  var RAYS_START_ANGLE = 3 * Math.PI / 4;
  var RAYS_ARC_ANGLE = 3 * Math.PI / 2;

  // default options, do not modify!
  var DEFAULT_OPTIONS = Object.freeze( {
    raysStroke: 'yellow',
    minRays: 8,
    maxRays: 60,
    minRayLength: 0,
    maxRayLength: 200,
    longRayLineWidth: 1.5, // for long rays
    mediumRayLineWidth: 1, // for medium-length rays
    shortRayLineWidth: 0.5 // for short rays
  } );

  /**
   * Rays of light that come out of the light bulb.
   * @param {number} bulbRadius
   * @param {Object} [options]
   * @constructor
   */
  function LightRaysNode( bulbRadius, options ) {

    assert && assert( bulbRadius > 0 );

    options = _.extend( {
      tandem: Tandem.optional
    }, DEFAULT_OPTIONS, options );

    assert && assert( !options.stroke );
    options.stroke = options.raysStroke;

    this.bulbRadius = bulbRadius; //@private

    // @private cherry pick options specific to this type, needed by prototype functions
    this.lightRaysNodeOptions = _.pick( options, _.keys( DEFAULT_OPTIONS ) );

    Path.call( this, null );

    // Ensures there are set bounds at initialization
    this.setBrightness( 0 );

    this.mutate( options );
  }

  sceneryPhet.register( 'LightRaysNode', LightRaysNode );

  return inherit( Path, LightRaysNode, {

    // @public updates light rays based on {number} brightness, which varies from 0 to 1.
    setBrightness: function( brightness ) {

      assert && assert( brightness >= 0 && brightness <= 1 );

      // local vars to improve readability
      var minRays = this.lightRaysNodeOptions.minRays;
      var maxRays = this.lightRaysNodeOptions.maxRays;
      var minRayLength = this.lightRaysNodeOptions.minRayLength;
      var maxRayLength = this.lightRaysNodeOptions.maxRayLength;

      // number of rays is a function of brightness
      var numberOfRays = ( brightness === 0 ) ? 0 : minRays + Util.roundSymmetric( brightness * ( maxRays - minRays ) );

      // ray length is a function of brightness
      var rayLength = minRayLength + ( brightness * ( maxRayLength - minRayLength ) );

      var angle = RAYS_START_ANGLE;
      var deltaAngle = RAYS_ARC_ANGLE / ( numberOfRays - 1 );

      // The ray line width is a linear function within the allowed range
      var lineWidth = Util.linear(
        0.3 * maxRayLength,
        0.6 * maxRayLength,
        this.lightRaysNodeOptions.shortRayLineWidth,
        this.lightRaysNodeOptions.longRayLineWidth,
        rayLength
      );
      this.lineWidth = Util.clamp( lineWidth, this.lightRaysNodeOptions.shortRayLineWidth, this.lightRaysNodeOptions.longRayLineWidth );

      var shape = new Shape();

      // rays fill part of a circle, incrementing clockwise
      for ( var i = 0, x1, x2, y1, y2; i < maxRays; i++ ) {
        if ( i < numberOfRays ) {

          // determine the end points of the ray
          x1 = Math.cos( angle ) * this.bulbRadius;
          y1 = Math.sin( angle ) * this.bulbRadius;
          x2 = Math.cos( angle ) * ( this.bulbRadius + rayLength );
          y2 = Math.sin( angle ) * ( this.bulbRadius + rayLength );

          shape.moveTo( x1, y1 ).lineTo( x2, y2 );

          // increment the angle
          angle += deltaAngle;
        }
      }

      // Set shape to an invisible circle to maintain local bounds if there aren't any rays.
      this.setVisible( numberOfRays > 0 );
      if ( numberOfRays === 0 ) {
        shape.circle( 0, 0, this.bulbRadius );
      }

      // Set the shape of the path to the shape created above
      this.setShape( shape );
    }
  }, {

    DEFAULT_OPTIONS: DEFAULT_OPTIONS
  } );
} );