// Copyright 2018, University of Colorado Boulder

/**
 * Shape for the 'play' icon that appears on buttons and other UI components.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );

  class PlayIconShape extends Shape {

    /**
     * @param {number} width
     * @param {number} height
     */
    constructor( width, height ) {
      super();

      // triangle that points to the right
      this.moveTo( 0, 0 );
      this.lineTo( width, height / 2 );
      this.lineTo( 0, height );
      this.close();
    }
  }

  return sceneryPhet.register( 'PlayIconShape', PlayIconShape );
} );