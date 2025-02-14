// Copyright 2015-2025, University of Colorado Boulder

/**
 * Conductivity tester. Light bulb connected to a battery, with draggable probes.
 * When the probes are both immersed in solution, the circuit is completed, and the bulb glows.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TProperty from '../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Range from '../../dot/js/Range.js';
import Vector2 from '../../dot/js/Vector2.js';
import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import PickRequired from '../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import ModelViewTransform2 from '../../phetcommon/js/view/ModelViewTransform2.js';
import InteractiveHighlighting from '../../scenery/js/accessibility/voicing/InteractiveHighlighting.js';
import DragListener from '../../scenery/js/listeners/DragListener.js';
import KeyboardDragListener, { KeyboardDragListenerOptions } from '../../scenery/js/listeners/KeyboardDragListener.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Image from '../../scenery/js/nodes/Image.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import Path, { PathOptions } from '../../scenery/js/nodes/Path.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Text from '../../scenery/js/nodes/Text.js';
import Font from '../../scenery/js/util/Font.js';
import TColor from '../../scenery/js/util/TColor.js';
import batteryDCell_png from '../images/batteryDCell_png.js';
import LightBulbNode from './LightBulbNode.js';
import MinusNode from './MinusNode.js';
import PhetFont from './PhetFont.js';
import PlusNode from './PlusNode.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';
import { clamp } from '../../dot/js/util/clamp.js';

// constants
const SHOW_TESTER_ORIGIN = false; // draws a red circle at the tester's origin, for debugging
const SHOW_PROBE_ORIGIN = false; // draws a red circle at the origin of probes, for debugging
const DEFAULT_SHORT_CIRCUIT_FONT = new PhetFont( 14 );

type SelfOptions = {

  modelViewTransform?: ModelViewTransform2;
  bulbImageScale?: number;
  batteryDCell_pngScale?: number;

  // common to both probes
  probeSize?: Dimension2; // probe dimensions, in view coordinates
  probeLineWidth?: number;
  probeDragYRange?: Range | null; // y-axis drag range, relative to positionProperty, in view coordinates. null means no constraint.
  probeCursor?: string;

  // positive probe
  positiveProbeFill?: TColor;
  positiveProbeStroke?: TColor;
  positiveLabelFill?: TColor;

  // negative probe
  negativeProbeFill?: TColor;
  negativeProbeStroke?: TColor;
  negativeLabelFill?: TColor;

  // wires
  wireStroke?: TColor;
  wireLineWidth?: number;
  bulbToBatteryWireLength?: number; // length of the wire between bulb and battery, in view coordinates

  // short-circuit indicator
  shortCircuitFont?: Font;
  shortCircuitFill?: TColor;

  keyboardDragListenerOptions?: StrictOmit<KeyboardDragListenerOptions, 'tandem'>;
};

export type ConductivityTesterNodeOptions = SelfOptions &
  StrictOmit<NodeOptions, 'children'> & PickRequired<NodeOptions, 'tandem'>;

export default class ConductivityTesterNode extends Node {

  private readonly shortCircuitNode: Node;

  /**
   * @param brightnessProperty brightness of bulb varies from 0 (off) to 1 (full on)
   * @param positionProperty position of the tester, at bottom-center of the bulb (model coordinate frame)
   * @param positiveProbePositionProperty position of bottom-center of the positive probe (model coordinate frame)
   * @param negativeProbePositionProperty position of bottom-center of the negative probe (model coordinate frame)
   * @param providedOptions
   */
  public constructor( brightnessProperty: TReadOnlyProperty<number>,
                      positionProperty: TProperty<Vector2>,
                      positiveProbePositionProperty: TProperty<Vector2>,
                      negativeProbePositionProperty: TProperty<Vector2>,
                      providedOptions?: ConductivityTesterNodeOptions ) {

    // NOTE! Since positionProperty determines translation, avoid options related to translation!
    const options = optionize<ConductivityTesterNodeOptions, StrictOmit<SelfOptions, 'keyboardDragListenerOptions'>, NodeOptions>()( {

      modelViewTransform: ModelViewTransform2.createIdentity(),
      bulbImageScale: 0.33,
      batteryDCell_pngScale: 0.6,

      // common to both probes
      probeSize: new Dimension2( 20, 68 ),
      probeLineWidth: 0.5,
      probeDragYRange: null,
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
      bulbToBatteryWireLength: 40,

      // short-circuit indicator
      shortCircuitFont: DEFAULT_SHORT_CIRCUIT_FONT,
      shortCircuitFill: 'black',

      // NodeOptions
      isDisposable: false,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    // bulb, origin at bottom center of base
    const lightBulbNode = new LightBulbNode( brightnessProperty, {
      bulbImageScale: options.bulbImageScale
    } );

    // short-circuit indicator, centered above the light bulb
    assert && assert( brightnessProperty.value === 0, 'layout will be incorrect if lightBulbNode has rays' );
    const shortCircuitNode = new Text( SceneryPhetStrings.shortCircuitStringProperty, {
      font: options.shortCircuitFont,
      fill: options.shortCircuitFill,
      visible: false // initial state is no short circuit
    } );
    shortCircuitNode.boundsProperty.link( bounds => {
      shortCircuitNode.centerX = lightBulbNode.centerX;
      shortCircuitNode.bottom = lightBulbNode.top;
    } );

    // battery
    const battery = new Image( batteryDCell_png, {
      scale: options.batteryDCell_pngScale,
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
      options.modelViewTransform.modelToViewX( positiveProbePositionProperty.value.x ) - options.modelViewTransform.modelToViewX( positionProperty.value.x ),
      options.modelViewTransform.modelToViewY( positiveProbePositionProperty.value.y ) - options.modelViewTransform.modelToViewY( positionProperty.value.y ) - options.probeSize.height,
      { stroke: options.wireStroke, lineWidth: options.wireLineWidth }
    );

    // wire from base of bulb (origin) to negative probe
    const negativeWire = new WireNode(
      -5, -5, // specific to bulb image file
      options.modelViewTransform.modelToViewX( negativeProbePositionProperty.value.x ) - options.modelViewTransform.modelToViewX( positionProperty.value.x ),
      options.modelViewTransform.modelToViewY( negativeProbePositionProperty.value.y ) - options.modelViewTransform.modelToViewY( positionProperty.value.y ) - options.probeSize.height,
      { stroke: options.wireStroke, lineWidth: options.wireLineWidth }
    );

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

    // drag listener for probes
    let clickYOffset = 0;
    const probeDragListener = new DragListener( {

      start: event => {
        const currentTarget = event.currentTarget!;
        clickYOffset = currentTarget.globalToParentPoint( event.pointer.point ).y - currentTarget.y;
      },

      // probes move together
      drag: ( event, listener ) => {

        // do dragging in view coordinate frame
        const positionView = options.modelViewTransform.modelToViewPosition( positionProperty.value );
        let yView = listener.currentTarget.globalToParentPoint( event.pointer.point ).y + positionView.y - clickYOffset;
        if ( options.probeDragYRange ) {
          yView = clamp( yView, positionView.y + options.probeDragYRange.min, positionView.y + options.probeDragYRange.max );
        }

        // convert to model coordinate frame
        const yModel = options.modelViewTransform.viewToModelY( yView );
        positiveProbePositionProperty.value = new Vector2( positiveProbePositionProperty.value.x, yModel );
        negativeProbePositionProperty.value = new Vector2( negativeProbePositionProperty.value.x, yModel );
      },

      tandem: options.tandem.createTandem( 'probeDragListener' )
    } );

    // Keyboard drag listener for probes, see https://github.com/phetsims/acid-base-solutions/issues/208
    const probeKeyboardDragListener = new KeyboardDragListener( combineOptions<KeyboardDragListenerOptions>( {
      transform: options.modelViewTransform,
      drag: ( event, listener ) => {

        // probes move together
        const y = positionProperty.value.y;

        const yPositiveProbe = positiveProbePositionProperty.value.y + listener.modelDelta.y;
        const yPositiveProbeConstrained = options.probeDragYRange ?
                                          clamp( yPositiveProbe, y + options.probeDragYRange.min, y + options.probeDragYRange.max ) :
                                          yPositiveProbe;
        positiveProbePositionProperty.value = new Vector2( positiveProbePositionProperty.value.x, yPositiveProbeConstrained );

        const yNegativeProbe = negativeProbePositionProperty.value.y + listener.modelDelta.y;
        const yNegativeProbeConstrained = options.probeDragYRange ?
                                          clamp( yNegativeProbe, y + options.probeDragYRange.min, y + options.probeDragYRange.max ) :
                                          yNegativeProbe;
        negativeProbePositionProperty.value = new Vector2( negativeProbePositionProperty.value.x, yNegativeProbeConstrained );
      },
      tandem: options.tandem.createTandem( 'probeKeyboardDragListener' )
    }, options.keyboardDragListenerOptions ) );

    positiveProbe.cursor = options.probeCursor;
    positiveProbe.addInputListener( probeDragListener );
    positiveProbe.addInputListener( probeKeyboardDragListener );

    negativeProbe.cursor = options.probeCursor;
    negativeProbe.addInputListener( probeDragListener );
    negativeProbe.addInputListener( probeKeyboardDragListener );

    options.children = [ negativeWire, positiveWire, negativeProbe, positiveProbe, apparatusNode ];

    super( options );

    // when the position changes ...
    positionProperty.link( ( position, oldPosition ) => {

      // move the entire tester
      this.translation = options.modelViewTransform.modelToViewPosition( position );

      // probes move with the tester
      if ( oldPosition ) {
        const dx = position.x - oldPosition.x;
        const dy = position.y - oldPosition.y;
        positiveProbePositionProperty.value = new Vector2( positiveProbePositionProperty.value.x + dx,
          positiveProbePositionProperty.value.y + dy );
        negativeProbePositionProperty.value = new Vector2( negativeProbePositionProperty.value.x + dx,
          negativeProbePositionProperty.value.y + dy );
      }
    } );

    // update positive wire if end point was changed
    const positiveProbeObserver = ( positiveProbePosition: Vector2 ) => {
      positiveProbe.centerX = options.modelViewTransform.modelToViewX( positiveProbePosition.x ) -
                              options.modelViewTransform.modelToViewX( positionProperty.value.x );
      positiveProbe.bottom = options.modelViewTransform.modelToViewY( positiveProbePosition.y ) -
                             options.modelViewTransform.modelToViewY( positionProperty.value.y );
      positiveWire.setEndPoint( positiveProbe.x, positiveProbe.y - options.probeSize.height );
    };
    positiveProbePositionProperty.link( positiveProbeObserver );

    // update negative wire if end point was changed
    const negativeProbeObserver = ( negativeProbePosition: Vector2 ) => {
      negativeProbe.centerX = options.modelViewTransform.modelToViewX( negativeProbePosition.x ) -
                              options.modelViewTransform.modelToViewX( positionProperty.value.x );
      negativeProbe.bottom = options.modelViewTransform.modelToViewY( negativeProbePosition.y ) -
                             options.modelViewTransform.modelToViewY( positionProperty.value.y );
      negativeWire.setEndPoint( negativeProbe.x, negativeProbe.y - options.probeSize.height );
    };
    negativeProbePositionProperty.link( negativeProbeObserver );

    this.shortCircuitNode = shortCircuitNode;

    // To prevent light from updating when invisible
    this.visibleProperty.link( visible => {
      lightBulbNode.visible = visible;
    } );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && window.phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ConductivityTesterNode', this );
  }

  /**
   * Is 'Short circuit' shown above the light bulb?
   */
  public get shortCircuit(): boolean { return this.shortCircuitNode.visible; }

  /**
   * Determines whether 'Short circuit' is shown above the light bulb. Note that it is the client's responsibility
   * to ensure that the bulb's brightness (as set by brightnessProperty) is appropriate for a short circuit.
   */
  public set shortCircuit( value: boolean ) { this.shortCircuitNode.visible = value; }
}

type ProbeNodeSelfOptions = {
  size?: Dimension2;
  fill?: TColor;
  stroke?: TColor;
  lineWidth?: number;
};

type ProbeNodeOptions = ProbeNodeSelfOptions & NodeOptions;

/**
 * Conductivity probe, origin at bottom center.
 */
class ProbeNode extends InteractiveHighlighting( Node ) {

  public constructor( labelNode: Node, providedOptions?: ProbeNodeOptions ) {

    const options = optionize<ProbeNodeOptions, ProbeNodeSelfOptions, NodeOptions>()( {
      size: new Dimension2( 20, 60 ),
      fill: 'white',
      stroke: 'black',
      lineWidth: 1.5,
      tagName: 'div',
      focusable: true
    }, providedOptions );

    super();

    // plate
    const plateNode = new Rectangle( -options.size.width / 2, -options.size.height, options.size.width, options.size.height, {
      fill: options.fill,
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    // scale the label to fit, place it towards bottom center
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

type WirePoint = { x: number; y: number };

/**
 * Wires that connect to the probes.
 */
class WireNode extends Path {

  private readonly startPoint: WirePoint;
  private readonly controlPointOffset: WirePoint;

  public constructor( startX: number, startY: number, endX: number, endY: number, providedOptions?: PathOptions ) {

    super( null );

    this.startPoint = { x: startX, y: startY };

    // control point offsets for when probe is to left of light bulb
    this.controlPointOffset = { x: 30, y: -50 };
    if ( endX < startX ) {
      // probe is to right of light bulb, flip sign on control point x-offset
      this.controlPointOffset.x = -this.controlPointOffset.x;
    }

    this.setEndPoint( endX, endY );

    this.mutate( providedOptions );
  }

  // Sets the end point coordinates, the point attached to the probe.
  public setEndPoint( endX: number, endY: number ): void {

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

sceneryPhet.register( 'ConductivityTesterNode', ConductivityTesterNode );