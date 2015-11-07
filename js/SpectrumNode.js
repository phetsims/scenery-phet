// Copyright 2014-2015, University of Colorado Boulder

/**
 * SpectrumNode displays a rectangle of the visible spectrum.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  var Node = require( 'SCENERY/nodes/Node' );
  var Util = require( 'DOT/Util' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Slider track that displays the visible spectrum.
   * @param {number} width
   * @param {number} height
   * @param {number} minWavelength
   * @param {number} maxWavelength
   * @param {number} opacity 0-1
   * @constructor
   */
  function SpectrumNode( width, height, minWavelength, maxWavelength, opacity ) {

    Node.call( this );

    // Draw the spectrum directly to a canvas, to improve performance.
    var canvas = document.createElement( 'canvas' );
    var context = canvas.getContext( '2d' );
    canvas.width = width;
    canvas.height = height;
    for ( var i = 0; i < width; i++ ) {
      var wavelength = Util.clamp( Util.linear( 0, width, minWavelength, maxWavelength, i ), minWavelength, maxWavelength );  // position -> wavelength
      context.fillStyle = VisibleColor.wavelengthToColor( wavelength ).withAlpha( opacity ).toCSS();
      context.fillRect( i, 0, 1, height );
    }

    this.addChild( new Image( canvas.toDataURL() ) );

    // since the Image's bounds aren't immediately computed, we override it here
    this.setLocalBounds( new Bounds2( 0, 0, width, height ) );
  }

  inherit( Node, SpectrumNode );

  return SpectrumNode;
} );
