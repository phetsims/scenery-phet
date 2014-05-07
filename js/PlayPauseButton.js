// Copyright 2002-2013, University of Colorado Boulder

/**
 * Play pause button for starting/stopping the sim.  Often appears at the bottom center of the screen.
 * Generated programmatically using RoundPushButton (as opposed to using raster images).
 *
 * @author Sam Reid
 */

define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var BooleanRoundToggleButton = require( 'SUN/buttons/BooleanRoundToggleButton' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  var DEFAULT_RADIUS = 28;

  /*
   * PlayPauseButton constructor
   *
   * @param {Property<Boolean>} runningProperty property that represents whether the sim is paused or not
   * @param {object} options node options
   * @constructor
   */
  function PlayPauseButton( runningProperty, options ) {

    options = _.extend( {
      radius: DEFAULT_RADIUS
    }, options );

    //Overall scaling factor for individual elements (without scaling the entire node)
    var elementScale = options.radius / DEFAULT_RADIUS;

    var triangleHeight = 24.48 * elementScale;
    var triangleWidth = triangleHeight * elementScale * 0.6885;
    var barWidth = 7.65 * elementScale;
    var barHeight = triangleHeight;

    var playPath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {fill: 'black', stroke: '#bbbbbb', lineWidth: 1} );
    var bar = function() { return new Rectangle( 0, 0, barWidth, barHeight, {fill: 'black', stroke: '#bbbbbb', lineWidth: 1} ); };
    var bar1 = bar();
    var bar2 = bar();
    var pausePath = new HBox( {children: [ bar1, bar2], spacing: elementScale * 1.53} );

    //Shift the triangle to the right a bit
    playPath.center = pausePath.center.plusXY( 1.5, 0 );

    BooleanRoundToggleButton.call( this, pausePath, playPath, runningProperty, options );
  }

  return inherit( BooleanRoundToggleButton, PlayPauseButton );
} );