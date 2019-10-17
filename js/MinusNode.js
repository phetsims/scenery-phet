// Copyright 2014-2019, University of Colorado Boulder

/**
 * Minus sign, created using scenery.Rectangle because scenery.Text("-") looks awful on Windows and cannot be accurately
 * centered. The origin is at the upper left.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function MinusNode( options ) {

    options = merge( {
      size: new Dimension2( 20, 5 ),
      fill: 'black'
    }, options );

    assert && assert( options.size.width >= options.size.height );

    Rectangle.call( this, 0, 0, options.size.width, options.size.height, options );
  }

  sceneryPhet.register( 'MinusNode', MinusNode );

  return inherit( Rectangle, MinusNode );
} );