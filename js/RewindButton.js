// Copyright 2002-2013, University of Colorado Boulder

/**
 * Play pause button for starting/stopping the sim.  Often appears at the bottom center of the screen.
 * Generated programmatically using RoundShinyButton (as opposed to using raster images).
 *
 * @author Sam Reid
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' ),
    RoundShinyButton = require( 'SCENERY_PHET/RoundShinyButton' ),
    Shape = require( 'KITE/Shape' ),
    Path = require( 'SCENERY/nodes/Path' ),
    Rectangle = require( 'SCENERY/nodes/Rectangle' ),
    HBox = require( 'SCENERY/nodes/HBox' );

  function RewindButton( stepFunction, playProperty ) {
    var stepButton = this;
    var scale = 0.75;
    var vscale = 1.15;
    var barWidth = 6 * scale;
    var barHeight = 18 * scale * vscale;

    var triangleWidth = 14 * scale;
    var triangleHeight = 18 * scale * vscale;

    var barPath = new Rectangle( 0, 0, barWidth, barHeight, {fill: 'black', stroke: '#bbbbbb', lineWidth: 1} );
    var trianglePath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( -triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {fill: 'black', stroke: '#bbbbbb', lineWidth: 1} );
    var trianglePath2 = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( -triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {fill: 'black', stroke: '#bbbbbb', lineWidth: 1} );

    RoundShinyButton.call( this, stepFunction, new HBox( {children: [barPath, trianglePath, trianglePath2], spacing: -1} ), {radius: RoundShinyButton.DEFAULT_RADIUS * 0.6, iconOffsetX: 0} );
    this.enabled = false;

    playProperty.link( function( value ) { stepButton.enabled = !value; } );
  }

  return inherit( RoundShinyButton, RewindButton );
} );