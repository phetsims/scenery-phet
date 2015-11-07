// Copyright 2013-2015, University of Colorado Boulder

/**
 * A 3D-looking sphere with a specular highlight.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @param {number} diameter
   * @param {Object} [options]
   * @constructor
   */
  function ShadedSphereNode( diameter, options ) {

    options = _.extend( {
      mainColor: 'gray',
      highlightColor: 'white',
      shadowColor: 'black',
      highlightXOffset: -0.4, // x-offset of the highlight from the center of the sphere, percentage of radius, [-1,1]
      highlightYOffset: -0.4  // y-offset of the highlight from the center of the sphere, percentage of radius, [-1,1]
    }, options );

    var radius = diameter / 2;
    var highlightX = radius * options.highlightXOffset;
    var highlightY = radius * options.highlightYOffset;
    options.fill = new RadialGradient( highlightX, highlightY, 0, highlightX, highlightY, diameter )
      .addColorStop( 0, options.highlightColor )
      .addColorStop( 0.5, options.mainColor )
      .addColorStop( 1, options.shadowColor );

    Circle.call( this, radius, options );
  }

  return inherit( Circle, ShadedSphereNode );
} );
