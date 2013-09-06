// Copyright 2002-2013, University of Colorado Boulder

/**
 * A 3D-looking sphere with a specular highlight.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var inherit = require( 'PHET_CORE/inherit' );

  function ShadedSphereNode( diameter, options ) {

    options = _.extend( {
      mainColor: 'gray',
      highlightColor: 'white',
      shadowColor: 'black'
    }, options );

    var radius = diameter / 2;
    options.fill = new RadialGradient(
          radius * -0.4, radius * -0.4, 0,
          radius * -0.4, radius * -0.4, diameter )
          .addColorStop( 0, options.highlightColor )
          .addColorStop( 0.5, options.mainColor )
          .addColorStop( 1, options.shadowColor );

    Circle.call( this, radius, options );
  }

  return inherit( Circle, ShadedSphereNode );
} );
