// Copyright 2013-2016, University of Colorado Boulder

/**
 * The gauge node is a scenery node that represents a circular gauge that depicts some dynamic value.  This was
 * originally ported from the speedometer node in forces-and-motion-basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Property.<number>} valueProperty which is portrayed
   * @param {string} label label to display (scaled to fit if necessary)
   * @param {Object} range contains min and max values that define the range
   * @param {Object} [options]
   * @constructor
   */
  function GaugeNode( valueProperty, label, range, options ) {
    Node.call( this );

    options = _.extend( {
      // Defaults
      radius: 67,
      backgroundFill: 'white',
      backgroundStroke: 'rgb( 85, 85, 85 )',
      backgroundLineWidth: 2,
      anglePerTick: Math.PI * 2 / 4 / 8,

      // defines max width of the label, relative to the radius
      maxLabelWidthScale: 1.3,

      // 8 ticks goes to 9 o'clock (on the left side), and two more ticks appear below that mark.
      // The ticks are duplicated for the right side, and one tick appears in the middle at the top
      numTicks: ( 8 + 2 ) * 2 + 1,

      majorTickLength: 10,
      minorTickLength: 5,
      majorTickLineWidth: 2,
      minorTickLineWidth: 1, 

      // Determines whether the gauge will be updated when the value changes.
      // Use this to (for example) disable updates while a gauge is not visible.
      updateEnabledProperty: new Property( true ),
      tandem: Tandem.tandemRequired()
    }, options );

    var tandem = options.tandem;

    this.addChild( new Circle( options.radius, {
      fill: options.backgroundFill,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } ) );

    var foregroundNode = new Node( { pickable: false, tandem: tandem.createTandem( 'foregroundNode' ) } );
    this.addChild( foregroundNode );

    var needle = new Path( Shape.lineSegment( 0, 0, options.radius, 0 ),
      {
        stroke: 'red',
        lineWidth: 3,
        tandem: tandem.createTandem( 'needle' )
      } );
    foregroundNode.addChild( needle );

    var labelNode = new Text( label, {
      font: new PhetFont( 20 ),
      maxWidth: options.radius * options.maxLabelWidthScale,
      tandem: tandem.createTandem( 'labelNode' )
    } ).mutate( {
      centerX: 0,
      centerY: -options.radius / 3
    } );
    foregroundNode.addChild( labelNode );

    var pin = new Circle( 2, { fill: 'black' } );
    foregroundNode.addChild( pin );

    var totalAngle = (options.numTicks - 1) * options.anglePerTick;
    var startAngle = -1 / 2 * Math.PI - totalAngle / 2;
    var endAngle = startAngle + totalAngle;

    var scratchMatrix = new Matrix3();

    var updateNeedle = function() {
      if ( options.updateEnabledProperty.get() ) {
        if ( typeof( valueProperty.get() ) === 'number' ) {
          needle.visible = true;
          var needleAngle = Util.linear( range.min, range.max, startAngle, endAngle, Math.abs( valueProperty.get() ) );

          // 2d rotation, but reusing our matrix above
          needle.setMatrix( scratchMatrix.setToRotationZ( needleAngle ) );
        }
        else {

          // Hide the needle if there is no value number value to portray.
          needle.visible = false;
        }
      }
    };

    valueProperty.link( updateNeedle );
    options.updateEnabledProperty.link( updateNeedle );

    // Render all of the ticks into two layers (since they have different strokes)
    // see https://github.com/phetsims/energy-skate-park-basics/issues/208
    var bigTicksShape = new Shape();
    var smallTicksShape = new Shape();

    // Add the tick marks
    for ( var i = 0; i < options.numTicks; i++ ) {
      var tickAngle = i * options.anglePerTick + startAngle;

      var tickLength = i % 2 === 0 ? options.majorTickLength : options.minorTickLength;
      var x1 = (options.radius - tickLength) * Math.cos( tickAngle );
      var y1 = (options.radius - tickLength) * Math.sin( tickAngle );
      var x2 = options.radius * Math.cos( tickAngle );
      var y2 = options.radius * Math.sin( tickAngle );
      if ( i % 2 === 0 ) {
        bigTicksShape.moveTo( x1, y1 );
        bigTicksShape.lineTo( x2, y2 );
      }
      else {
        smallTicksShape.moveTo( x1, y1 );
        smallTicksShape.lineTo( x2, y2 );
      }
    }

    foregroundNode.addChild( new Path( bigTicksShape, { stroke: 'gray', lineWidth: options.majorTickLineWidth } ) );
    foregroundNode.addChild( new Path( smallTicksShape, { stroke: 'gray', lineWidth: options.minorTickLineWidth } ) );
    this.mutate( options );

    // @private
    this.disposeGaugeNode = function() {
      valueProperty.unlink( updateNeedle );
      options.updateEnabledProperty.unlink( updateNeedle );
    };
  }

  sceneryPhet.register( 'GaugeNode', GaugeNode );

  return inherit( Node, GaugeNode, {

    // @public
    dispose: function() {
      this.disposeGaugeNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );