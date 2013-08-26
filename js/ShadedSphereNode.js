// Copyright 2002-2013, University of Colorado Boulder

/**
 * A 3D-looking sphere with a specular highlight.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'scenery-phet' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var inherit = require( 'PHET_CORE/inherit' );

  function ShadedSphereNode( radius, options ) {

    options = _.extend( {
      baseColor: 'gray',
      highlightColor: 'white',
      highlightXOffset: -0.4, // x-offset of the highlight from the center of the sphere, percentage of radius, [-1,1]
      highlightYOffset: -0.4  // y-offset of the highlight from the center of the sphere, percentage of radius, [-1,1]
    }, options );

    // highlight must be inside the sphere
    assert && assert( Math.abs( options.highlightXOffset ) <= 1 && Math.abs( options.highlightYOffset ) <= 1 );

    var gradient = new RadialGradient(
      radius * options.highlightXOffset, radius * options.highlightYOffset, 0,
      radius * options.highlightXOffset, radius * options.highlightYOffset, 2 * radius )
      .addColorStop( 0, options.highlightColor )
      .addColorStop( 1, options.baseColor );
    options.fill = gradient;

    Circle.call( this, radius, options ); //TODO remove subtype-specific options before passing to supertype
  }

  return inherit( Circle, ShadedSphereNode );
} );
