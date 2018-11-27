// Copyright 2018, University of Colorado Boulder

/**
 * Shape for the 'pause' icon that appears on buttons and other UI components.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );

  class PauseIconShape extends Shape {

    /**
     * @param {number} width
     * @param {number} height
     */
    constructor( width, height ) {
      super();

      // 2 vertical bars
      const barWidth = width / 3;
      this.rect( 0, 0, barWidth, height );
      this.rect( 2 * barWidth, 0, barWidth, height );
    }
  }

  return sceneryPhet.register( 'PauseIconShape', PauseIconShape );
} );