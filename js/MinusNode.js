// Copyright 2002-2013, University of Colorado Boulder

/**
 * Minus sign, created using scenery.Rectangle because scenery.Text("-") looks awful
 * on Windows and cannot be accurately centered.
 * Origin at upper left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ){
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Dimension2} size
   * @param options
   * @constructor
   */
  function MinusNode( size, options ) {
    assert && assert( size.width >= size.height );
    options = _.extend( { fill: 'black' }, options );
    Rectangle.call( this, 0, 0, size.width, size.height, options );
  }

  return inherit( Rectangle, MinusNode );
});