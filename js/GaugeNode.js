// Copyright 2013-2020, University of Colorado Boulder

/**
 * GaugeNode is a circular gauge that depicts some dynamic value.
 * This was originally ported from the speedometer node in forces-and-motion-basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import Matrix3 from '../../dot/js/Matrix3.js';
import Range from '../../dot/js/Range.js';
import Utils from '../../dot/js/Utils.js';
import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import Text from '../../scenery/js/nodes/Text.js';
import Tandem from '../../tandem/js/Tandem.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @param {Property.<number>} valueProperty
 * @param {string} label - label to display, scaled to fit if necessary
 * @param {Range} range - range of the needle. If valueProperty exceeds this range, the needle will stop at min or max.
 * @param {Object} [options]
 * @constructor
 */
function GaugeNode( valueProperty, label, range, options ) {

  options = merge( {

    // Defaults
    radius: 100,
    backgroundFill: 'white',
    backgroundStroke: 'rgb( 85, 85, 85 )',
    backgroundLineWidth: 2,
    maxLabelWidthScale: 1.3, // {number} defines max width of the label, relative to the radius

    // ticks
    numberOfTicks: 21, // 10 ticks each on the right side and left side, plus one in the center
    majorTickStroke: 'gray',
    minorTickStroke: 'gray',
    majorTickLength: 10,
    minorTickLength: 5,
    majorTickLineWidth: 2,
    minorTickLineWidth: 1,

    // the top half of the gauge, plus PI/8 extended below the top half on each side
    span: Math.PI + Math.PI / 4, // {number} the visible span of the gauge value range, in radians

    needleLineWidth: 3,

    // {BooleanProperty|null} Determines whether the gauge will be updated when the value changes.
    // Use this to (for example) disable updates while a gauge is not visible.
    // If null, BooleanProperty(true) will be created.
    enabledProperty: null,

    tandem: Tandem.REQUIRED
  }, options );

  assert && assert( range instanceof Range, 'range must be of type Range: ' + range );
  assert && assert( options.span <= 2 * Math.PI, 'options.span must be <= 2 * Math.PI: ' + options.span );

  Node.call( this );

  // @public (read-only) {number}
  this.radius = options.radius;

  // Whether enabledProperty was provided by the client (false) or created by GaugeNode (true)
  const ownsEnabledProperty = !options.enabledProperty;

  // @public enabled/disables updates of the needle
  this.enabledProperty = options.enabledProperty || new BooleanProperty( true );

  const anglePerTick = options.span / options.numberOfTicks;
  const tandem = options.tandem;

  this.addChild( new Circle( this.radius, {
    fill: options.backgroundFill,
    stroke: options.backgroundStroke,
    lineWidth: options.backgroundLineWidth
  } ) );

  const foregroundNode = new Node( {
    pickable: false
  } );
  this.addChild( foregroundNode );

  const needle = new Path( Shape.lineSegment( 0, 0, this.radius - options.majorTickLength / 2, 0 ), {
    stroke: 'red',
    lineWidth: options.needleLineWidth
  } );

  const labelNode = new Text( label, {
    font: new PhetFont( 20 ),
    maxWidth: this.radius * options.maxLabelWidthScale,
    tandem: tandem.createTandem( 'labelNode' )
  } ).mutate( {
    centerX: 0,
    centerY: -this.radius / 3
  } );
  foregroundNode.addChild( labelNode );

  const pin = new Circle( 2, { fill: 'black' } );
  foregroundNode.addChild( pin );

  const totalAngle = ( options.numberOfTicks - 1 ) * anglePerTick;
  const startAngle = -1 / 2 * Math.PI - totalAngle / 2;
  const endAngle = startAngle + totalAngle;

  const scratchMatrix = new Matrix3();

  const updateNeedle = () => {
    if ( this.enabledProperty.get() ) {
      if ( typeof ( valueProperty.get() ) === 'number' ) {

        // clamp value to valid range and map it to an angle
        const clampedValue = Utils.clamp( valueProperty.get(), range.min, range.max );
        const needleAngle = Utils.linear( range.min, range.max, startAngle, endAngle, clampedValue );

        // 2d rotation, but reusing our matrix above
        needle.setMatrix( scratchMatrix.setToRotationZ( needleAngle ) );
        needle.visible = true;
      }
      else {

        // Hide the needle if there is no number value.
        needle.visible = false;
      }
    }
  };

  valueProperty.link( updateNeedle );
  this.enabledProperty.link( updateNeedle );

  // Render all of the ticks into Shapes layers (since they have different strokes)
  // see https://github.com/phetsims/energy-skate-park-basics/issues/208
  const bigTicksShape = new Shape();
  const smallTicksShape = new Shape();

  // Add the tick marks
  for ( let i = 0; i < options.numberOfTicks; i++ ) {
    const tickAngle = i * anglePerTick + startAngle;

    const tickLength = i % 2 === 0 ? options.majorTickLength : options.minorTickLength;
    const x1 = ( this.radius - tickLength ) * Math.cos( tickAngle );
    const y1 = ( this.radius - tickLength ) * Math.sin( tickAngle );
    const x2 = this.radius * Math.cos( tickAngle );
    const y2 = this.radius * Math.sin( tickAngle );
    if ( i % 2 === 0 ) {
      bigTicksShape.moveTo( x1, y1 );
      bigTicksShape.lineTo( x2, y2 );
    }
    else {
      smallTicksShape.moveTo( x1, y1 );
      smallTicksShape.lineTo( x2, y2 );
    }
  }

  foregroundNode.addChild( new Path( bigTicksShape, {
    stroke: options.majorTickStroke,
    lineWidth: options.majorTickLineWidth
  } ) );
  foregroundNode.addChild( new Path( smallTicksShape, {
    stroke: options.minorTickStroke,
    lineWidth: options.minorTickLineWidth
  } ) );

  // Add needle last, so it's on top of ticks. See https://github.com/phetsims/scenery-phet/issues/502
  foregroundNode.addChild( needle );

  this.mutate( options );

  // @private
  this.disposeGaugeNode = () => {
    if ( valueProperty.hasListener( updateNeedle ) ) {
      valueProperty.unlink( updateNeedle );
    }

    if ( ownsEnabledProperty ) {
      this.enabledProperty.dispose();
    }
    else if ( options.enabledProperty.hasListener( updateNeedle ) ) {
      this.enabledProperty.unlink( updateNeedle );
    }

    // de-register phet-io tandems
    foregroundNode.dispose();
    labelNode.dispose();
  };

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'GaugeNode', this );
}

sceneryPhet.register( 'GaugeNode', GaugeNode );

inherit( Node, GaugeNode, {

  // @public
  dispose: function() {
    this.disposeGaugeNode();
    Node.prototype.dispose.call( this );
  }
} );

export default GaugeNode;