// Copyright 2002-2015, University of Colorado Boulder

//TODO sun#197 ideally, only 2 corners of the button should be rounded (the corners in the direction of the arrow)
/**
 * Next/previous button in a Carousel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RectangularButtonView = require( 'SUN/buttons/RectangularButtonView' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Shape = require( 'KITE/Shape' );

  // maps arrow directions to rotation angles, in radians
  var ANGLES = {
    up: 0, // arrow shape is created in 'up' direction
    down: Math.PI,
    left: -Math.PI / 2,
    right: Math.PI / 2
  };

  /**
   * @param {Object} [options]
   * @constructor
   */
  function CarouselButton( options ) {

    // see supertype for additional options
    options = _.extend( {

      // button
      baseColor: 'rgba( 200, 200, 200, 0.5 )', // {Color|string} button fill color
      stroke: 'black', // {Color|string|null} button stroke
      buttonAppearanceStrategy: RectangularButtonView.flatAppearanceStrategy,

      // arrow
      arrowDirection: 'up', // {string} direction that the arrow points, 'up'|'down'|'left'|'right'
      arrowSize: new Dimension2( 20, 7 ), // {Dimension2} size of the arrow, in 'up' directions
      arrowStroke: 'black', // {Color|string} color used for the arrow icons
      arrowLineWidth: 3, // {number} line width used to stroke the arrow icons
      arrowLineCap: 'round' // {string} 'butt'|'round'|'square'

    }, options );

    // validate options
    assert && assert( ANGLES.hasOwnProperty( options.arrowDirection ), 'invalid direction: ' + options.direction );

    // Generic arrow shape, points 'up'
    var arrowShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( options.arrowSize.width / 2, -options.arrowSize.height )
      .lineTo( options.arrowSize.width, 0 );

    // Transform arrow shape to match direction
    arrowShape = arrowShape.transformed( Matrix3.rotation2( ANGLES[ options.arrowDirection ] ) );

    // Arrow node
    options.content = new Path( arrowShape, {
      stroke: options.arrowStroke,
      lineWidth: options.arrowLineWidth,
      lineCap: options.arrowLineCap
    } );

    RectangularPushButton.call( this, options );
  }

  return inherit( RectangularPushButton, CarouselButton );
} );
