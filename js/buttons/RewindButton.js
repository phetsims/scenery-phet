// Copyright 2014-2015, University of Colorado Boulder

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
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   *
   * @param stepFunction
   * @param {Property.<boolean>} playProperty
   * @constructor
   */
  function RewindButton( stepFunction, playProperty ) {
    var stepButton = this;
    var scale = 0.75;
    var vscale = 1.15;
    var barWidth = 6 * scale;
    var barHeight = 18 * scale * vscale;

    var triangleWidth = 14 * scale;
    var triangleHeight = 18 * scale * vscale;

    var barPath = new Rectangle( 0, 0, barWidth, barHeight, { fill: 'black', stroke: '#bbbbbb', lineWidth: 1 } );
    var trianglePath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( -triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {
      fill: 'black',
      stroke: '#bbbbbb',
      lineWidth: 1
    } );
    var trianglePath2 = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( -triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(), {
      fill: 'black',
      stroke: '#bbbbbb',
      lineWidth: 1
    } );

    RoundPushButton.call( this, {
      content: new HBox( { children: [ barPath, trianglePath, trianglePath2 ], spacing: -1 } ),
      listener: stepFunction,
      enabled: false
    } );

    playProperty.link( function( value ) { stepButton.enabled = !value; } );
  }

  sceneryPhet.register( 'RewindButton', RewindButton );

  return inherit( RoundPushButton, RewindButton );
} );