// Copyright 2002-2013, University of Colorado Boulder

/**
 * Play pause button for starting/stopping the sim.  Often appears at the bottom center of the screen.
 * Generated programmatically using RoundPushButton (as opposed to using raster images).
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var HBox = require( 'SCENERY/nodes/HBox' );

  function StepButton( stepFunction, playProperty, options ) {
    var stepButton = this;
    var barWidth = 6;
    var barHeight = 18;

    var triangleWidth = 14;
    var triangleHeight = 18;

    var barPath = new Rectangle( 0, 0, barWidth, barHeight, {fill: 'black', stroke: '#bbbbbb', lineWidth: 1} );
    var trianglePath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {fill: 'black', stroke: '#bbbbbb', lineWidth: 1} );

    RoundPushButton.call( this, _.extend( {
      content: new HBox( {children: [barPath, trianglePath], spacing: 1} ),
      listener: stepFunction,

      //Make it a bit bigger than the icon
      radius: 20,

      //The icon is asymmetrical, and the layout looks off unless you shift it a little bit
      xContentOffset: 1.5
    }, options ) );
    this.enabled = false;

    playProperty.link( function( value ) { stepButton.enabled = !value; } );
  }

  return inherit( RoundPushButton, StepButton );
} );