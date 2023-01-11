// Copyright 2015-2023, University of Colorado Boulder

/**
 * Conductivity tester. Light bulb connected to a battery, with draggable probes.
 * When the probes are both immersed in solution, the circuit is completed, and the bulb glows.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TProperty from '../../axon/js/TProperty.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Property from '../../axon/js/Property.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Utils from '../../dot/js/Utils.js';
import Range from '../../dot/js/Range.js';
import Vector2 from '../../dot/js/Vector2.js';
import Vector2Property from '../../dot/js/Vector2Property.js';
import { Shape } from '../../kite/js/imports.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, DragListener, Font, Image, Node, NodeOptions, Path, PathOptions, Rectangle, TColor, Text } from '../../scenery/js/imports.js';
import batteryDCell_png from '../images/batteryDCell_png.js';
import LightBulbNode from './LightBulbNode.js';
import MinusNode from './MinusNode.js';
import PhetFont from './PhetFont.js';
import PlusNode from './PlusNode.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import PickRequired from '../../phet-core/js/types/PickRequired.js';

// constants
const SHOW_TESTER_ORIGIN = false; // draws a red circle at the tester's origin, for debugging
const SHOW_PROBE_ORIGIN = false; // draws a red circle at the origin of probes, for debugging
const DEFAULT_SHORT_CIRCUIT_FONT = new PhetFont( 14 );

type SelfOptions = {

  modelViewTransform?: ModelViewTransform2;
  interactive?: boolean; // set to false if you're creating an icon
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
};

export type ConductivityTesterNodeOptions = SelfOptions &
  StrictOmit<NodeOptions, 'children'> & PickRequired<NodeOptions, 'tandem'>;

class ConductivityTesterNode extends Node {

  private readonly shortCircuitNode: Node;
  private readonly disposeConductivityTesterNode: () => void;

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
    const options = optionize<ConductivityTesterNodeOptions, SelfOptions, NodeOptions>()( {

      modelViewTransform: ModelViewTransform2.createIdentity(),
      interactive: true, // set to false if you're creating an icon
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
      shortCircuitFill: 'black'
    }, providedOptions );

    // bulb, origin at bottom center of base
    const lightBulbNode = new LightBulbNode( brightnessProperty, {
      bulbImageScale: options.bulbImageScale
    } );

    // short-circuit indicator, centered above the light bulb
    assert && assert( brightnessProperty.get() === 0, 'layout will be incorrect if lightBulbNode has rays' );
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
        const currentTarget = event.currentTarget!;
        clickYOffset = currentTarget.globalToParentPoint( event.pointer.point ).y - currentTarget.y;
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
      },

      tandem: options.tandem.createTandem( 'probeDragListener' )
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

    options.children = [ positiveWire, negativeWire, positiveProbe, negativeProbe, apparatusNode ];

    super( options );

    // when the position changes ...
    const positionObserver = ( position: Vector2, oldPosition: Vector2 | null ) => {

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
    const positiveProbeObserver = ( positiveProbePosition: Vector2 ) => {
      positiveProbe.centerX = options.modelViewTransform.modelToViewX( positiveProbePosition.x ) -
                              options.modelViewTransform.modelToViewX( positionProperty.get().x );
      positiveProbe.bottom = options.modelViewTransform.modelToViewY( positiveProbePosition.y ) -
                             options.modelViewTransform.modelToViewY( positionProperty.get().y );
      positiveWire.setEndPoint( positiveProbe.x, positiveProbe.y - options.probeSize.height );
    };
    positiveProbePositionProperty.link( positiveProbeObserver );

    // update negative wire if end point was changed
    const negativeProbeObserver = ( negativeProbePosition: Vector2 ) => {
      negativeProbe.centerX = options.modelViewTransform.modelToViewX( negativeProbePosition.x ) -
                              options.modelViewTransform.modelToViewX( positionProperty.get().x );
      negativeProbe.bottom = options.modelViewTransform.modelToViewY( negativeProbePosition.y ) -
                             options.modelViewTransform.modelToViewY( positionProperty.get().y );
      negativeWire.setEndPoint( negativeProbe.x, negativeProbe.y - options.probeSize.height );
    };
    negativeProbePositionProperty.link( negativeProbeObserver );

    this.shortCircuitNode = shortCircuitNode;

    // To prevent light from updating when invisible
    this.visibleProperty.link( visible => {
      lightBulbNode.visible = visible;
    } );

    this.disposeConductivityTesterNode = () => {

      shortCircuitNode.dispose();

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
   */
  public get shortCircuit(): boolean { return this.shortCircuitNode.visible; }

  /**
   * Determines whether 'Short circuit' is shown above the light bulb. Note that it is the client's responsibility
   * to ensure that the bulb's brightness (as set by brightnessProperty) is appropriate for a short circuit.
   */
  public set shortCircuit( value: boolean ) { this.shortCircuitNode.visible = value; }

  /**
   * Convenience function for creating an icon.
   * @param brightness 0-1 (off to full on)
   * @param positiveProbeXOffset x-offset of the positive probe, relative to the bulb's tip
   * @param negativeProbeXOffset x-offset of the negative probe, relative to the bulb's tip
   * @param bothProbesYOffset y-offset of both probes, relative to the bulb's tip
   * @param providedOptions
   */
  public static createIcon( brightness: number,
                            positiveProbeXOffset: number, negativeProbeXOffset: number,
                            bothProbesYOffset: number,
                            providedOptions: StrictOmit<ConductivityTesterNodeOptions, 'interactive'> ): Node {

    const options = combineOptions<ConductivityTesterNodeOptions>( {
      interactive: false
    }, providedOptions );

    return new ConductivityTesterNode(
      new Property( brightness ),
      new Vector2Property( new Vector2( 0, 0 ) ),
      new Vector2Property( new Vector2( positiveProbeXOffset, bothProbesYOffset ) ),
      new Vector2Property( new Vector2( negativeProbeXOffset, bothProbesYOffset ) ),
      options
    );
  }

  public override dispose(): void {
    this.disposeConductivityTesterNode();
    super.dispose();
  }
}

sceneryPhet.register( 'ConductivityTesterNode', ConductivityTesterNode );

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
class ProbeNode extends Node {

  public constructor( labelNode: Node, providedOptions?: ProbeNodeOptions ) {

    const options = optionize<ProbeNodeOptions, ProbeNodeSelfOptions, NodeOptions>()( {
      size: new Dimension2( 20, 60 ),
      fill: 'white',
      stroke: 'black',
      lineWidth: 1.5
    }, providedOptions );

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

export default ConductivityTesterNode;