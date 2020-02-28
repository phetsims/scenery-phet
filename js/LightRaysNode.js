// Copyright 2015-2020, University of Colorado Boulder

/**
 * Light rays that indicate brightness of a light source such as a bulb.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../dot/js/Utils.js';
import Shape from '../../kite/js/Shape.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Path from '../../scenery/js/nodes/Path.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';

// constants, these are specific to bulb images
const RAYS_START_ANGLE = 3 * Math.PI / 4;
const RAYS_ARC_ANGLE = 3 * Math.PI / 2;

// default options, do not modify!
const DEFAULT_OPTIONS = Object.freeze( {
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

  options = merge( {
    tandem: Tandem.OPTIONAL
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

export default inherit( Path, LightRaysNode, {

  // @public updates light rays based on {number} brightness, which varies from 0 to 1.
  setBrightness: function( brightness ) {

    assert && assert( brightness >= 0 && brightness <= 1 );

    // local vars to improve readability
    const minRays = this.lightRaysNodeOptions.minRays;
    const maxRays = this.lightRaysNodeOptions.maxRays;
    const minRayLength = this.lightRaysNodeOptions.minRayLength;
    const maxRayLength = this.lightRaysNodeOptions.maxRayLength;

    // number of rays is a function of brightness
    const numberOfRays = ( brightness === 0 ) ? 0 : minRays + Utils.roundSymmetric( brightness * ( maxRays - minRays ) );

    // ray length is a function of brightness
    const rayLength = minRayLength + ( brightness * ( maxRayLength - minRayLength ) );

    let angle = RAYS_START_ANGLE;
    const deltaAngle = RAYS_ARC_ANGLE / ( numberOfRays - 1 );

    // The ray line width is a linear function within the allowed range
    const lineWidth = Utils.linear(
      0.3 * maxRayLength,
      0.6 * maxRayLength,
      this.lightRaysNodeOptions.shortRayLineWidth,
      this.lightRaysNodeOptions.longRayLineWidth,
      rayLength
    );
    this.lineWidth = Utils.clamp( lineWidth, this.lightRaysNodeOptions.shortRayLineWidth, this.lightRaysNodeOptions.longRayLineWidth );

    const shape = new Shape();

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