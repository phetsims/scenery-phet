// Copyright 2014-2018, University of Colorado Boulder

/**
 * U-Turn arrow shape, for use with "reset" or "undo" purposes
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {number} size A size factor (it'll be a bit bigger)
   * @constructor
   */
  function UTurnArrowShape( size ) {
    Shape.call( this );

    var strokeWidth = size * 0.3;
    var strokeOffset = strokeWidth / 2;
    var mainWidth = size * 0.6;
    var mainHeight = size;
    var headWidth = size * 0.5;
    var headHeight = size * 0.75;
    var halfHeadWidth = headWidth / 2;
    var halfHeadHeight = headHeight / 2;

    // starts adjacent to the arrowhead on the top, going clockwise
    this.moveTo( halfHeadWidth, -strokeOffset );
    this.lineTo( mainWidth, -strokeOffset );
    // arc (mainWidth,-strokeOffset) => (mainWidth,mainHeight+strokeOffset)
    this.arc( mainWidth, mainHeight / 2, mainHeight / 2 + strokeOffset, -Math.PI / 2, Math.PI / 2, false );
    this.lineTo( 0, mainHeight + strokeOffset );
    this.lineTo( 0, mainHeight - strokeOffset );
    this.lineTo( mainWidth, mainHeight - strokeOffset );
    // arc (mainWidth,mainHeight-strokeOffset) => (mainWidth,strokeOffset)
    this.arc( mainWidth, mainHeight / 2, mainHeight / 2 - strokeOffset, Math.PI / 2, -Math.PI / 2, true );
    this.lineTo( halfHeadWidth, strokeOffset );
    // three lines of the arrow head
    this.lineTo( halfHeadWidth, halfHeadHeight );
    this.lineTo( -halfHeadWidth, 0 );
    this.lineTo( halfHeadWidth, -halfHeadHeight );
    this.close();
  }

  sceneryPhet.register( 'UTurnArrowShape', UTurnArrowShape );

  return inherit( Shape, UTurnArrowShape );
} );
