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

  /*
   * PlayPauseButton constructor
   *
   * @param {Property<Boolean>} runningProperty property that represents whether the sim is paused or not
   * @param {object} options node options
   * @constructor
   */
  function PlayPauseButton( runningProperty, options ) {

    options = _.extend( {

      //Instead of scaling the entire node, each component of this node can be scaled.  In some situations, this
      //may lead to better overall look & style (say, to increase the size of the button without increasing the size of the strokes)
      elementScale: 1.0

    }, options );

    //Overall scaling factor for individual elements (without scaling the entire node)
    var elementScale = options.elementScale;

    var triangleHeight = 28.8 * elementScale;
    var triangleWidth = triangleHeight * elementScale * 0.81;
    var barWidth = 9 * elementScale;
    var barHeight = triangleHeight;

    var playPath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {fill: 'black', stroke: '#bbbbbb', lineWidth: 1} );
    var bar = function() { return new Rectangle( 0, 0, barWidth, barHeight, {fill: 'black', stroke: '#bbbbbb', lineWidth: 1} ); };
    var bar1 = bar();
    var bar2 = bar();
    var pausePath = new HBox( {children: [ bar1, bar2], spacing: 1.8 * elementScale } );
    
    // options specific to the play button
    options.playOptions = _.extend( {
      radius: RoundShinyButton.DEFAULT_RADIUS * 1.035 * elementScale, iconOffsetX: 3.6 * elementScale,
      backgroundGradientColorStop0: 'rgb(220,220,230)',
      backgroundGradientColorStop1: 'rgb(245,245,255 )',
      //Drawing a line around the inner circle
      innerButtonStroke: 'black',
      innerButtonLineWidth: 0.5
    }, options.playOptions );
    
    // options specific to the play button
    options.pauseOptions = _.extend( {
      radius: RoundShinyButton.DEFAULT_RADIUS * 1.035 * elementScale, iconOffsetX: 0,
      backgroundGradientColorStop0: 'rgb(255,255,255)',
      backgroundGradientColorStop1: 'rgb(255,255,255 )',
      //Drawing a line around the inner circle
      innerButtonStroke: 'black',
      innerButtonLineWidth: 0.5
    }, options.pauseOptions );

    var pauseButton = new RoundShinyButton( function() {}, pausePath, options.pauseOptions );
    var playButton = new RoundShinyButton( function() {}, playPath, options.playOptions );

    //Highlight the icons
    var stateListener = function( state ) {
      var highlightColor = '#222233';
      var defaultColor = 'black';
      var iconColor = state === 'over' || state === 'down' ? highlightColor : defaultColor;
      playPath.fill = iconColor;
      bar1.fill = iconColor;
      bar2.fill = iconColor;

      playPath.stroke = state === 'over' || state === 'down' ? '#cccccc' : '#bbbbbb';
      bar1.stroke = state === 'over' || state === 'down' ? '#cccccc' : '#bbbbbb';
      bar2.stroke = state === 'over' || state === 'down' ? '#cccccc' : '#bbbbbb';
    };
    pauseButton.addStateListener( stateListener );
    playButton.addStateListener( stateListener );

    ToggleButton.call( this,
      pauseButton,
      playButton,
      runningProperty, options );
  }

  return inherit( ToggleButton, PlayPauseButton );
} );
