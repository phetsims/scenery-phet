// Copyright 2014-2017, University of Colorado Boulder

/**
 * Rewind button.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Object} [options] - see RoundPushButton
   * @constructor
   */
  function RewindButton( options ) {
    Tandem.indicateUninstrumentedCode();

    options = options || {};

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

    assert && assert( !options.content, 'this button creates its own content' );
    options.content = new HBox( { children: [ barPath, trianglePath, trianglePath2 ], spacing: -1 } );

    RoundPushButton.call( this, options );
  }

  sceneryPhet.register( 'RewindButton', RewindButton );

  return inherit( RoundPushButton, RewindButton );
} );