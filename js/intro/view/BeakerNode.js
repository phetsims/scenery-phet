// Copyright 2017, University of Colorado Boulder

/**
 * Draw the beaker
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  // modules
  var fractionsCommon = require( 'FRACTIONS_COMMON/fractionsCommon' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroConstants = require( 'FRACTIONS_COMMON/intro/IntroConstants' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var EMPTY_BEAKER_COLOR = 'rgba(150,150,150,0.15)';
  var WATER_SIDE_COLOR = 'rgba(30,163,255,0.8)';
  var WATER_TOP_COLOR = WATER_SIDE_COLOR;
  var BEAKER_SHINE_COLOR = 'rgba(255,255,255,0.7)';

  /**
   * @constructor
   * @extends {Node}
   *
   * @param {number} numerator
   * @param {number} denominator
   * @param {Object} [options]
   */
  function BeakerNode( numerator, denominator, options ) {

    options = _.extend( {
      fullHeight: IntroConstants.BEAKER_HEIGHT,
      xRadius: 40,
      yRadius: 12
    }, options );

    var height = options.fullHeight * numerator / denominator;
    var xRadius = options.xRadius;
    var yRadius = options.yRadius;

    var glassGradient = new LinearGradient( -xRadius, 0, xRadius, 0 ).addColorStop( 0, EMPTY_BEAKER_COLOR )
      .addColorStop( 0.666, BEAKER_SHINE_COLOR )
      .addColorStop( 0.782, BEAKER_SHINE_COLOR )
      .addColorStop( 1, EMPTY_BEAKER_COLOR );

    var bucketFrontShape = new Shape().ellipticalArc( 0, 0, xRadius, yRadius, 0, 0, Math.PI, false )
      .ellipticalArc( 0, -options.fullHeight, xRadius, yRadius, 0, Math.PI, 0, true ).close();
    var bucketBackShape = new Shape().ellipticalArc( 0, -options.fullHeight, xRadius, yRadius, 0, Math.PI, 0, false )
      .ellipticalArc( 0, 0, xRadius, yRadius, 0, 0, Math.PI, true ).close();
    var bucketBottomShape = new Shape().ellipticalArc( 0, 0, xRadius, yRadius, 0, 0, 2 * Math.PI, false );

    var numTicks = denominator;

    var waterTopShape = new Shape().ellipticalArc( 0, -height, xRadius, yRadius, 0, 0, Math.PI * 2, false ).close();
    var waterSideShape = new Shape().ellipticalArc( 0, -height, xRadius, yRadius, 0, Math.PI, 0, true )
      .ellipticalArc( 0, 0, xRadius, yRadius, 0, 0, Math.PI, false ).close();
    var ticksShape = new Shape();
    var y = 0;
    for ( var i = 0; i < numTicks; i++ ) {
      y -= options.fullHeight / numTicks;
      ticksShape.moveTo( -xRadius, y ).ellipticalArc( 0, y, xRadius, yRadius, 0, Math.PI, Math.PI * ( i % 2 === 0 ? 0.8 : 0.7 ), true );
    }

    var bucketFront = new Path( bucketFrontShape, {
      stroke: 'grey',
      fill: glassGradient
    } );
    var bucketBack = new Path( bucketBackShape, {
      stroke: 'grey',
      fill: glassGradient
    } );
    bucketBack.setScaleMagnitude( -1, 1 );
    var bucketBottom = new Path( bucketBottomShape, {
      stroke: 'grey',
      fill: EMPTY_BEAKER_COLOR,
      pickable: false
    } );
    var waterSide = new Path( waterSideShape, {
      stroke: 'black',
      fill: WATER_SIDE_COLOR,
      pickable: false
    } );
    var waterTop = new Path( waterTopShape, {
      fill: WATER_TOP_COLOR,
      pickable: false
    } );
    var ticks = new Path( ticksShape, {
      stroke: 'black',
      lineWidth: 1.5,
      pickable: false
    } );

    Node.call( this, {
      children: numerator > 0 ? [
        bucketBack,
        bucketBottom,
        waterSide,
        waterTop,
        bucketFront,
        ticks
      ] : [
        // no water if numerator is 0
        bucketBack,
        bucketBottom,
        bucketFront,
        ticks
      ]
    } );

    // @public
    this.midPointOffset = this.center;

    this.mutate( options );
  }

  fractionsCommon.register( 'BeakerNode', BeakerNode );

  return inherit( Node, BeakerNode );
} );
