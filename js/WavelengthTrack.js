
define( function( require ) {
  'use strict';

  var Node = require( 'SCENERY/nodes/Node' );
  var Util = require( 'DOT/Util' );
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Slider track that displays the visible spectrum.
   * @param width
   * @param height
   * @param minWavelength
   * @param maxWavelength
   * @param opacity 0-1
   * @constructor
   */
  function WavelengthTrack( width, height, minWavelength, maxWavelength, opacity ) {

    Node.call( this );

    // Draw the spectrum directly to a canvas, to improve performance.
    var canvas = document.createElement( 'canvas' );
    var context = canvas.getContext( '2d' );
    canvas.width = width;
    canvas.height = height;
    for ( var i = 0; i < width; i++ ) {
      var wavelength = Util.clamp( Util.linear( 0, width, minWavelength, maxWavelength, i ), minWavelength, maxWavelength );  // position -> wavelength
      context.fillStyle = VisibleColor.wavelengthToColor( wavelength ).withAlpha( opacity ).toCSS();
      context.fillRect( i, 0, 1, 50 );
    }

    this.addChild( new Image( canvas.toDataURL() ) );
  }

  inherit( Node, WavelengthTrack );

  return WavelengthTrack;
} );