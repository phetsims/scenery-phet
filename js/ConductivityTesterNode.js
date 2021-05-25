// Copyright 2015-2021, University of Colorado Boulder

/**
 * Conductivity tester. Light bulb connected to a battery, with draggable probes.
 * When the probes are both immersed in solution, the circuit is completed, and the bulb glows.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../axon/js/Property.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Utils from '../../dot/js/Utils.js';
import Vector2 from '../../dot/js/Vector2.js';
import Vector2Property from '../../dot/js/Vector2Property.js';
import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../phetcommon/js/view/ModelViewTransform2.js';
import DragListener from '../../scenery/js/listeners/DragListener.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Image from '../../scenery/js/nodes/Image.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Text from '../../scenery/js/nodes/Text.js';
import batteryImage from '../images/battery-D-cell_png.js';
import LightBulbNode from './LightBulbNode.js';
import MinusNode from './MinusNode.js';
import PhetFont from './PhetFont.js';
import PlusNode from './PlusNode.js';
import sceneryPhet from './sceneryPhet.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';

const shortCircuitString = sceneryPhetStrings.shortCircuit;

// constants
const SHOW_TESTER_ORIGIN = false; // draws a red circle at the tester's origin, for debugging
const SHOW_PROBE_ORIGIN = false; // draws a red circle at the origin of probes, for debugging

class ConductivityTesterNode extends Node {

  /**
   * @param {Property.<number>} brightnessProperty brightness of bulb varies from 0 (off) to 1 (full on)
   * @param {Property.<Vector2>} positionProperty position of the tester, at bottom-center of the bulb (model coordinate frame)
   * @param {Property.<Vector2>} positiveProbePositionProperty position of bottom-center of the positive probe (model coordinate frame)
   * @param {Property.<Vector2>} negativeProbePositionProperty position of bottom-center of the negative probe (model coordinate frame)
   * @param {Object} [options]
   */
  constructor( brightnessProperty, positionProperty, positiveProbePositionProperty, negativeProbePositionProperty, options ) {

    // NOTE! Since positionProperty determines translation, so avoid options related to translation!
    options = merge( {

      modelViewTransform: ModelViewTransform2.createIdentity(),
      interactive: true, // set to false if you're creating an icon
      bulbImageScale: 0.33,
      batteryImageScale: 0.6,

      // common to both probes
      probeSize: new Dimension2( 20, 68 ), // {Dimension2} probe dimensions, in view coordinates
      probeLineWidth: 0.5,
      probeDragYRange: null, // {DOT.Range} y-axis drag range, relative to positionProperty, in view coordinates. null means no constraint.
      probeCursor: 'pointer',

      // positive probe
      positiveProbeFill: 'red',
      positiveProbeStroke: 'black',
      positiveLabelFill: 'white',

      // negative probe
      negativeProbeFill: 'black',
      negativeProbeStroke: 'black',
      negativeLabelFill: 'white',

      // wires
      wireStroke: 'black',
      wireLineWidth: 1.5,
      bulbToBatteryWireLength: 40, // length of the wire between bulb and battery, in view coordinates

      // short-circuit indicator
      shortCircuitFont: new PhetFont( 14 ),
      shortCircuitFill: 'black'
    }, options );

    // bulb, origin at bottom center of base
    const lightBulbNode = new LightBulbNode( brightnessProperty, {
      bulbImageScale: options.bulbImageScale
    } );

    // short-circuit indicator, centered above the light bulb
    assert && assert( brightnessProperty.get() === 0, 'layout will be incorrect if lightBulbNode has rays' );
    const shortCircuitNode = new Text( shortCircuitString, {
      font: options.shortCircuitFont,
      fill: options.shortCircuitFill,
      centerX: lightBulbNode.centerX,
      bottom: lightBulbNode.top,
      visible: false // initial state is no short circuit
    } );

    // battery
    const battery = new Image( batteryImage, {
      scale: options.batteryImageScale,
      left: options.bulbToBatteryWireLength,
      centerY: 0
    } );

    // wire from bulb base to battery
    const bulbBatteryWire = new Path( new Shape().moveTo( 0, 0 ).lineTo( options.bulbToBatteryWireLength, 0 ), {
      stroke: options.wireStroke,
      lineWidth: options.wireLineWidth
    } );

    // apparatus (bulb + battery), origin at bottom center of bulb's base
    const apparatusNode = new Node( {
      children: [
        bulbBatteryWire,
        battery,
        lightBulbNode,
        shortCircuitNode
      ]
    } );
    if ( SHOW_TESTER_ORIGIN ) {
      apparatusNode.addChild( new Circle( 2, { fill: 'red' } ) );
    }

    // wire from battery terminal to positive probe
    const positiveWire = new WireNode(
      battery.getGlobalBounds().right,
      battery.getGlobalBounds().centerY,
      options.modelViewTransform.modelToViewX( positiveProbePositionProperty.get().x ) - options.modelViewTransform.modelToViewX( positionProperty.get().x ),
      options.modelViewTransform.modelToViewY( positiveProbePositionProperty.get().y ) - options.modelViewTransform.modelToViewY( positionProperty.get().y ) - options.probeSize.height,
      { stroke: options.wireStroke, lineWidth: options.wireLineWidth }
    );

    // wire from base of bulb (origin) to negative probe
    const negativeWire = new WireNode(
      -5, -5, // specific to bulb image file
      options.modelViewTransform.modelToViewX( negativeProbePositionProperty.get().x ) - options.modelViewTransform.modelToViewX( positionProperty.get().x ),
      options.modelViewTransform.modelToViewY( negativeProbePositionProperty.get().y ) - options.modelViewTransform.modelToViewY( positionProperty.get().y ) - options.probeSize.height,
      { stroke: options.wireStroke, lineWidth: options.wireLineWidth }
    );

    // drag listener for probes
    let clickYOffset = 0;
    const probeDragListener = new DragListener( {

      start: event => {
        clickYOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).y - event.currentTarget.y;
      },

      // probes move together
      drag: ( event, listener ) => {

        // do dragging in view coordinate frame
        const positionView = options.modelViewTransform.modelToViewPosition( positionProperty.get() );
        let yView = listener.currentTarget.globalToParentPoint( event.pointer.point ).y + positionView.y - clickYOffset;
        if ( options.probeDragYRange ) {
          yView = Utils.clamp( yView, positionView.y + options.probeDragYRange.min, positionView.y + options.probeDragYRange.max );
        }

        // convert to model coordinate frame
        const yModel = options.modelViewTransform.viewToModelY( yView );
        positiveProbePositionProperty.set( new Vector2( positiveProbePositionProperty.get().x, yModel ) );
        negativeProbePositionProperty.set( new Vector2( negativeProbePositionProperty.get().x, yModel ) );
      }
    } );

    // probes
    const positiveProbe = new ProbeNode( new PlusNode( { fill: options.positiveLabelFill } ), {
      size: options.probeSize,
      fill: options.positiveProbeFill,
      stroke: options.positiveProbeStroke,
      lineWidth: options.probeLineWidth
    } );
    const negativeProbe = new ProbeNode( new MinusNode( { fill: options.negativeLabelFill } ), {
      size: options.probeSize,
      fill: options.negativeProbeFill,
      stroke: options.negativeProbeStroke,
      lineWidth: options.probeLineWidth
    } );
    if ( options.interactive ) {
      positiveProbe.cursor = options.probeCursor;
      positiveProbe.addInputListener( probeDragListener );
      negativeProbe.cursor = options.probeCursor;
      negativeProbe.addInputListener( probeDragListener );
    }

    assert && assert( !options.children, 'ConductivityTesterNode sets children' );
    options.children = [ positiveWire, negativeWire, positiveProbe, negativeProbe, apparatusNode ];

    super( options );

    // when the position changes ...
    const positionObserver = ( position, oldPosition ) => {

      // move the entire tester
      this.translation = options.modelViewTransform.modelToViewPosition( position );

      // probes move with the tester
      if ( oldPosition ) {
        const dx = position.x - oldPosition.x;
        const dy = position.y - oldPosition.y;
        positiveProbePositionProperty.set( new Vector2( positiveProbePositionProperty.get().x + dx,
          positiveProbePositionProperty.get().y + dy ) );
        negativeProbePositionProperty.set( new Vector2( negativeProbePositionProperty.get().x + dx,
          negativeProbePositionProperty.get().y + dy ) );
      }
    };
    positionProperty.link( positionObserver );

    // update positive wire if end point was changed
    const positiveProbeObserver = positiveProbePosition => {
      positiveProbe.centerX = options.modelViewTransform.modelToViewX( positiveProbePosition.x ) -
                              options.modelViewTransform.modelToViewX( positionProperty.get().x );
      positiveProbe.bottom = options.modelViewTransform.modelToViewY( positiveProbePosition.y ) -
                             options.modelViewTransform.modelToViewY( positionProperty.get().y );
      positiveWire.setEndPoint( positiveProbe.x, positiveProbe.y - options.probeSize.height );
    };
    positiveProbePositionProperty.link( positiveProbeObserver );

    // update negative wire if end point was changed
    const negativeProbeObserver = negativeProbePosition => {
      negativeProbe.centerX = options.modelViewTransform.modelToViewX( negativeProbePosition.x ) -
                              options.modelViewTransform.modelToViewX( positionProperty.get().x );
      negativeProbe.bottom = options.modelViewTransform.modelToViewY( negativeProbePosition.y ) -
                             options.modelViewTransform.modelToViewY( positionProperty.get().y );
      negativeWire.setEndPoint( negativeProbe.x, negativeProbe.y - options.probeSize.height );
    };
    negativeProbePositionProperty.link( negativeProbeObserver );

    // @private
    this.shortCircuitNode = shortCircuitNode;

    // To prevent light from updating when invisible
    this.visibleProperty.link( visible => {
      lightBulbNode.visible = visible;
    } );

    this.disposeConductivityTesterNode = () => {

      // unlink from axon properties
      positionProperty.unlink( positionObserver );
      positiveProbePositionProperty.unlink( positiveProbeObserver );
      negativeProbePositionProperty.unlink( negativeProbeObserver );

      // dispose of sub-components
      lightBulbNode.dispose();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ConductivityTesterNode', this );
  }

  /**
   * Is 'Short circuit' shown above the light bulb?
   * @returns {boolean}
   * @public
   */
  get shortCircuit() { return this.shortCircuitNode.visible; }

  /**
   * Determines whether 'Short circuit' is shown above the light bulb. Note that it is the client's responsibility
   * to ensure that the bulb's brightness (as set by brightnessProperty) is appropriate for a short circuit.
   * @param {boolean} value
   * @public
   */
  set shortCircuit( value ) { this.shortCircuitNode.visible = value; }

  /**
   * Convenience function for creating an icon.
   * @param {number} brightness 0-1 (off to full on)
   * @param {number} positiveProbeXOffset x-offset of the positive probe, relative to the bulb's tip
   * @param {number} negativeProbeXOffset x-offset of the negative probe, relative to the bulb's tip
   * @param {number} bothProbesYOffset y-offset of both probes, relative to the bulb's tip
   * @param {Object} [options] same options as ConductivityTesterNode constructor
   * @returns {ConductivityTesterNode}
   * @public
   */
  static createIcon( brightness, positiveProbeXOffset, negativeProbeXOffset, bothProbesYOffset, options ) {

    options = options || {};

    assert && assert( options.interactive === undefined, 'ConductivityTesterNode sets interactive' );
    options.interactive = false;

    return new ConductivityTesterNode(
      new Property( brightness ),
      new Vector2Property( new Vector2( 0, 0 ) ),
      new Vector2Property( new Vector2( positiveProbeXOffset, bothProbesYOffset ) ),
      new Vector2Property( new Vector2( negativeProbeXOffset, bothProbesYOffset ) ),
      options
    );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeConductivityTesterNode();
    super.dispose();
  }
}

sceneryPhet.register( 'ConductivityTesterNode', ConductivityTesterNode );

/**
 * Conductivity probe, origin at bottom center.
 */
class ProbeNode extends Node {

  /**
   * @param {Node} labelNode
   * @param {Object} [options]
   */
  constructor( labelNode, options ) {

    options = merge( {
      size: new Dimension2( 20, 60 ),
      fill: 'white',
      stroke: 'black',
      lineWidth: 1.5
    }, options );

    super();

    // plate
    const plateNode = new Rectangle( -options.size.width / 2, -options.size.height, options.size.width, options.size.height, {
      fill: options.fill,
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    // scale the label to fix, place it towards bottom center
    labelNode.setScaleMagnitude( 0.5 * options.size.width / labelNode.width );
    labelNode.centerX = plateNode.centerX;
    labelNode.bottom = plateNode.bottom - 10;

    // rendering order
    this.addChild( plateNode );
    this.addChild( labelNode );
    if ( SHOW_PROBE_ORIGIN ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
    }

    // expand touch area
    this.touchArea = this.localBounds.dilatedXY( 10, 10 );

    this.mutate( options );
  }
}

/**
 * Wires that connect to the probes.
 */
class WireNode extends Path {

  /**
   * @param startX
   * @param startY
   * @param endX
   * @param endY
   * @param {Object} [options]
   */
  constructor( startX, startY, endX, endY, options ) {

    super( null );

    // @private
    this.startPoint = { x: startX, y: startY };

    // @private control point offsets for when probe is to left of light bulb
    this.controlPointOffset = { x: 30, y: -50 };
    if ( endX < startX ) {
      // probe is to right of light bulb, flip sign on control point x-offset
      this.controlPointOffset.x = -this.controlPointOffset.x;
    }

    this.setEndPoint( endX, endY );

    this.mutate( options );
  }

  // @private Sets the end point coordinates, the point attached to the probe.
  setEndPoint( endX, endY ) {

    const startX = this.startPoint.x;
    const startY = this.startPoint.y;
    const controlPointXOffset = this.controlPointOffset.x;
    const controlPointYOffset = this.controlPointOffset.y;

    this.setShape( new Shape()
      .moveTo( startX, startY )
      .cubicCurveTo( startX + controlPointXOffset, startY, endX, endY + controlPointYOffset, endX, endY )
    );
  }
}

export default ConductivityTesterNode;