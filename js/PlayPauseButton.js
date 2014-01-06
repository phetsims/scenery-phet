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
    ToggleButton = require( 'SUN/ToggleButton' ),
    RoundShinyButton = require( 'SCENERY_PHET/RoundShinyButton' ),
    Shape = require( 'KITE/Shape' ),
    Path = require( 'SCENERY/nodes/Path' ),
    HBox = require( 'SCENERY/nodes/HBox' ),
    Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function PlayPauseButton( playProperty ) {

    var triangleHeight = 32;
    var triangleWidth = triangleHeight * 0.9;
    var barWidth = 10;
    var barHeight = triangleHeight;

    var playPath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {fill: 'black', stroke: '#bbbbbb', lineWidth: 1} );
    var bar = function() { return new Rectangle( 0, 0, barWidth, barHeight, {fill: 'black', stroke: '#bbbbbb', lineWidth: 1} ); };
    var pausePath = new HBox( {children: [bar(), bar()], spacing: 2} );
    ToggleButton.call( this,
      new RoundShinyButton( function() {}, pausePath, {radius: RoundShinyButton.DEFAULT_RADIUS * 1.15, iconOffsetX: 0} ),
      new RoundShinyButton( function() {}, playPath, {radius: RoundShinyButton.DEFAULT_RADIUS * 1.15, iconOffsetX: 4} ),
      playProperty );
  }

  return inherit( ToggleButton, PlayPauseButton );
} );