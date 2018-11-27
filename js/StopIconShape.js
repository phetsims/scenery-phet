// Copyright 2018, University of Colorado Boulder

/**
 * Shape for the 'stop' icon that appears on buttons and other UI components.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );

  class StopIconShape extends Shape {

    /**
     * @param {number} width
     */
    constructor( width ) {
      super();

      // rectangle
      this.rect( 0, 0, width, width );
    }
  }

  return sceneryPhet.register( 'StopIconShape', StopIconShape );
} );