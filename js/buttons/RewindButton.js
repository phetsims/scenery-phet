// Copyright 2014-2019, University of Colorado Boulder

/**
 * Rewind button.
 *
 * @author Sam Reid
 */
define( require => {
  'use strict';

  // modules
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options] - see RoundPushButton
   * @constructor
   */
  function RewindButton( options ) {
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

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'RewindButton', this );
  }

  sceneryPhet.register( 'RewindButton', RewindButton );

  return inherit( RoundPushButton, RewindButton );
} );