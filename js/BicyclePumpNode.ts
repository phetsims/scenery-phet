// Copyright 2019-2022, University of Colorado Boulder

/**
 * This is a graphical representation of a bicycle pump. A user can move the handle up and down.
 *
 * @author John Blanco
 * @author Siddhartha Chinthapally (Actual Concepts)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Saurabh Totey
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import TProperty from '../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Utils from '../../dot/js/Utils.js';
import Range from '../../dot/js/Range.js';
import Vector2 from '../../dot/js/Vector2.js';
import { Shape } from '../../kite/js/imports.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import { Circle, DragListener, DragListenerOptions, TColor, LinearGradient, Node, NodeOptions, PaintColorProperty, Path, PressedDragListener, PressListenerEvent, Rectangle, SceneryConstants } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import sceneryPhet from './sceneryPhet.js';
import SegmentedBarGraphNode from './SegmentedBarGraphNode.js';

// The follow constants define the size and positions of the various components of the pump as proportions of the
// overall width and height of the node.
const PUMP_BASE_WIDTH_PROPORTION = 0.35;
const PUMP_BASE_HEIGHT_PROPORTION = 0.075;
const PUMP_BODY_HEIGHT_PROPORTION = 0.7;
const PUMP_BODY_WIDTH_PROPORTION = 0.07;
const PUMP_SHAFT_WIDTH_PROPORTION = PUMP_BODY_WIDTH_PROPORTION * 0.25;
const PUMP_SHAFT_HEIGHT_PROPORTION = PUMP_BODY_HEIGHT_PROPORTION;
const PUMP_HANDLE_HEIGHT_PROPORTION = 0.05;
const CONE_HEIGHT_PROPORTION = 0.09;
const HOSE_CONNECTOR_HEIGHT_PROPORTION = 0.04;
const HOSE_CONNECTOR_WIDTH_PROPORTION = 0.05;
const SHAFT_OPENING_TILT_FACTOR = 0.33;
const BODY_TO_HOSE_ATTACH_POINT_X = 13;
const BODY_TO_HOSE_ATTACH_POINT_Y = -26;

type SelfOptions = {

  width?: number;
  height?: number;

  // various colors used by the pump
  handleFill?: TColor;
  shaftFill?: TColor;
  bodyFill?: TColor;
  bodyTopFill?: TColor;
  indicatorBackgroundFill?: TColor;
  indicatorRemainingFill?: TColor;
  hoseFill?: TColor;
  baseFill?: TColor; // this color is also used for the cone shape and hose connectors

  // greater value = curvy hose, smaller value = straighter hose
  hoseCurviness?: number;

  // where the hose will attach externally relative to the origin of the pump
  hoseAttachmentOffset?: Vector2;

  // Determines whether the pump will interactive. If the pump's range changes, the pumps
  // indicator will update regardless of enabledProperty. If null, this Property will be created.
  nodeEnabledProperty?: TProperty<boolean> | null;

  // {BooleanProperty} - determines whether the pump is able to inject particles when the pump is still interactive.
  // This is needed for when a user is pumping in particles too quickly for a model to handle (so the injection
  // needs throttling), but the pump should not become non-interactive as a result,
  // see https://github.com/phetsims/states-of-matter/issues/276
  injectionEnabledProperty?: TProperty<boolean>;

  // pointer areas
  handleTouchAreaXDilation?: number;
  handleTouchAreaYDilation?: number;
  handleMouseAreaXDilation?: number;
  handleMouseAreaYDilation?: number;

  dragListenerOptions?: HandleDragListenerOptions;

  // cursor for the pump handle when it's enabled
  handleCursor?: 'ns-resize';
};

export type BicyclePumpNodeOptions = SelfOptions & NodeOptions;

export default class BicyclePumpNode extends Node {

  public readonly nodeEnabledProperty: TProperty<boolean>;
  public readonly hoseAttachmentOffset: Vector2;

  // parts of the pump needed by setPumpHandleToInitialPosition
  private readonly pumpBodyNode: Node;
  private readonly pumpShaftNode: Node;
  private readonly pumpHandleNode: Node;

  // DragListener for the pump handle
  private readonly handleDragListener: HandleDragListener;

  private readonly disposeBicyclePumpNode: () => void;

  /**
   * @param numberProperty - number of particles in the simulation
   * @param rangeProperty - allowed range
   * @param providedOptions
   */
  public constructor( numberProperty: TProperty<number>,
                      rangeProperty: TReadOnlyProperty<Range>,
                      providedOptions?: BicyclePumpNodeOptions ) {

    const options = optionize<BicyclePumpNodeOptions, SelfOptions, NodeOptions>()( {

      // SelfOptions
      width: 200,
      height: 250,
      handleFill: '#adafb1',
      shaftFill: '#cacaca',
      bodyFill: '#d50000',
      bodyTopFill: '#997677',
      indicatorBackgroundFill: '#443333',
      indicatorRemainingFill: '#999999',
      hoseFill: '#b3b3b3',
      baseFill: '#aaaaaa',
      hoseCurviness: 1,
      hoseAttachmentOffset: new Vector2( 100, 100 ),
      nodeEnabledProperty: null,
      injectionEnabledProperty: new BooleanProperty( true ),
      handleTouchAreaXDilation: 15,
      handleTouchAreaYDilation: 15,
      handleMouseAreaXDilation: 0,
      handleMouseAreaYDilation: 0,
      dragListenerOptions: {},
      handleCursor: 'ns-resize',

      // NodeOptions
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'PumpNode'
    }, providedOptions );

    const width = options.width;
    const height = options.height;

    super( options );

    // does this instance own nodeEnabledProperty?
    const ownsEnabledProperty = !options.nodeEnabledProperty;

    this.nodeEnabledProperty = options.nodeEnabledProperty || new BooleanProperty( true );

    this.hoseAttachmentOffset = options.hoseAttachmentOffset;

    // create the base of the pump
    const baseWidth = width * PUMP_BASE_WIDTH_PROPORTION;
    const baseHeight = height * PUMP_BASE_HEIGHT_PROPORTION;
    const baseFillColorProperty = new PaintColorProperty( options.baseFill );
    const pumpBaseNode = createPumpBaseNode( baseWidth, baseHeight, baseFillColorProperty );

    // sizing for the body of the pump
    const pumpBodyWidth = width * PUMP_BODY_WIDTH_PROPORTION;
    const pumpBodyHeight = height * PUMP_BODY_HEIGHT_PROPORTION;

    // create the cone
    const coneHeight = height * CONE_HEIGHT_PROPORTION;
    const coneNode = createConeNode( pumpBodyWidth, coneHeight, baseFillColorProperty );
    coneNode.bottom = pumpBaseNode.top + 8;

    // use PaintColorProperty so that colors can be updated dynamically
    const bodyFillColorProperty = new PaintColorProperty( options.bodyFill );
    const bodyFillBrighterColorProperty = new PaintColorProperty( bodyFillColorProperty, { luminanceFactor: 0.2 } );
    const bodyFillDarkerColorProperty = new PaintColorProperty( bodyFillColorProperty, { luminanceFactor: -0.2 } );

    this.pumpBodyNode = new Rectangle( 0, 0, pumpBodyWidth, pumpBodyHeight, 0, 0, {
      fill: new LinearGradient( 0, 0, pumpBodyWidth, 0 )
        .addColorStop( 0, bodyFillBrighterColorProperty )
        .addColorStop( 0.4, bodyFillColorProperty )
        .addColorStop( 0.7, bodyFillDarkerColorProperty )
    } );
    this.pumpBodyNode.centerX = coneNode.centerX;
    this.pumpBodyNode.bottom = coneNode.top + 18;

    // use PaintColorProperty so that colors can be updated dynamically
    const bodyTopFillColorProperty = new PaintColorProperty( options.bodyTopFill );
    const bodyTopStrokeColorProperty = new PaintColorProperty( bodyTopFillColorProperty, { luminanceFactor: -0.3 } );

    // create the back part of the top of the body
    const bodyTopBackNode = createBodyTopHalfNode( pumpBodyWidth, -1, bodyTopFillColorProperty, bodyTopStrokeColorProperty );
    bodyTopBackNode.centerX = this.pumpBodyNode.centerX;
    bodyTopBackNode.bottom = this.pumpBodyNode.top;

    // create the front part of the top of the body
    const bodyTopFrontNode = createBodyTopHalfNode( pumpBodyWidth, 1, bodyTopFillColorProperty, bodyTopStrokeColorProperty );
    bodyTopFrontNode.centerX = this.pumpBodyNode.centerX;
    bodyTopFrontNode.top = bodyTopBackNode.bottom - 0.4; // tweak slightly to prevent pump body from showing through

    // create the bottom cap on the body
    const bodyBottomCapNode = new Path( new Shape().ellipse( 0, 0, bodyTopFrontNode.width * 0.55, 3, 0 ), {
      fill: new PaintColorProperty( baseFillColorProperty, { luminanceFactor: -0.3 } ),
      centerX: bodyTopFrontNode.centerX,
      bottom: coneNode.top + 4
    } );

    // create the node that will be used to indicate the remaining capacity
    const remainingCapacityIndicator = new SegmentedBarGraphNode( numberProperty, rangeProperty, {
        width: pumpBodyWidth * 0.6,
        height: pumpBodyHeight * 0.7,
        centerX: this.pumpBodyNode.centerX,
        centerY: ( this.pumpBodyNode.top + coneNode.top ) / 2,
        numSegments: 36,
        backgroundColor: options.indicatorBackgroundFill,
        fullyLitIndicatorColor: options.indicatorRemainingFill,
        indicatorHeightProportion: 0.7
      }
    );

    // whether the hose should be attached to the left or right side of the pump cone
    const hoseAttachedOnRight = options.hoseAttachmentOffset.x > 0;
    const hoseConnectorWidth = width * HOSE_CONNECTOR_WIDTH_PROPORTION;
    const hoseConnectorHeight = height * HOSE_CONNECTOR_HEIGHT_PROPORTION;

    // create the hose
    const hoseNode = new Path( new Shape()
      .moveTo( hoseAttachedOnRight ? BODY_TO_HOSE_ATTACH_POINT_X : -BODY_TO_HOSE_ATTACH_POINT_X,
        BODY_TO_HOSE_ATTACH_POINT_Y )
      .cubicCurveTo( options.hoseCurviness * ( options.hoseAttachmentOffset.x - BODY_TO_HOSE_ATTACH_POINT_X ),
        BODY_TO_HOSE_ATTACH_POINT_Y,
        0, options.hoseAttachmentOffset.y,
        options.hoseAttachmentOffset.x - ( hoseAttachedOnRight ? hoseConnectorWidth : -hoseConnectorWidth ),
        options.hoseAttachmentOffset.y ), {
      lineWidth: 4,
      stroke: options.hoseFill
    } );

    // create the external hose connector, which connects the hose to an external point
    const externalHoseConnector = createHoseConnectorNode( hoseConnectorWidth, hoseConnectorHeight, baseFillColorProperty );
    externalHoseConnector.setTranslation(
      hoseAttachedOnRight ? options.hoseAttachmentOffset.x - externalHoseConnector.width : options.hoseAttachmentOffset.x,
      options.hoseAttachmentOffset.y - externalHoseConnector.height / 2
    );

    // create the local hose connector, which connects the hose to the cone
    const localHoseConnector = createHoseConnectorNode( hoseConnectorWidth, hoseConnectorHeight, baseFillColorProperty );
    const localHoseOffsetX = hoseAttachedOnRight ? BODY_TO_HOSE_ATTACH_POINT_X : -BODY_TO_HOSE_ATTACH_POINT_X;
    localHoseConnector.setTranslation(
      localHoseOffsetX - hoseConnectorWidth / 2,
      BODY_TO_HOSE_ATTACH_POINT_Y - localHoseConnector.height / 2
    );

    // sizing for the pump shaft
    const pumpShaftWidth = width * PUMP_SHAFT_WIDTH_PROPORTION;
    const pumpShaftHeight = height * PUMP_SHAFT_HEIGHT_PROPORTION;

    // use PaintColorProperty so that colors can be updated dynamically
    const shaftFillColorProperty = new PaintColorProperty( options.shaftFill );
    const shaftStrokeColorProperty = new PaintColorProperty( shaftFillColorProperty, { luminanceFactor: -0.38 } );

    // create the pump shaft, which is the part below the handle and inside the body
    this.pumpShaftNode = new Rectangle( 0, 0, pumpShaftWidth, pumpShaftHeight, {
      fill: shaftFillColorProperty,
      stroke: shaftStrokeColorProperty,
      pickable: false
    } );
    this.pumpShaftNode.x = -pumpShaftWidth / 2;

    // create the handle of the pump
    this.pumpHandleNode = createPumpHandleNode( options.handleFill );
    const pumpHandleHeight = height * PUMP_HANDLE_HEIGHT_PROPORTION;
    this.pumpHandleNode.touchArea =
      this.pumpHandleNode.localBounds.dilatedXY( options.handleTouchAreaXDilation, options.handleTouchAreaYDilation );
    this.pumpHandleNode.mouseArea =
      this.pumpHandleNode.localBounds.dilatedXY( options.handleMouseAreaXDilation, options.handleMouseAreaYDilation );
    this.pumpHandleNode.scale( pumpHandleHeight / this.pumpHandleNode.height );
    this.setPumpHandleToInitialPosition();

    // enable/disable behavior and appearance for the handle
    const enabledListener = ( enabled: boolean ) => {
      this.pumpHandleNode.interruptSubtreeInput();
      this.pumpHandleNode.pickable = enabled;
      this.pumpHandleNode.cursor = enabled ? options.handleCursor : 'default';
      this.pumpHandleNode.opacity = enabled ? 1 : SceneryConstants.DISABLED_OPACITY;
      this.pumpShaftNode.opacity = enabled ? 1 : SceneryConstants.DISABLED_OPACITY;
    };
    this.nodeEnabledProperty.link( enabledListener );

    // define the allowed range for the pump handle's movement
    const maxHandleYOffset = this.pumpHandleNode.centerY;
    const minHandleYOffset = maxHandleYOffset + ( -PUMP_SHAFT_HEIGHT_PROPORTION * pumpBodyHeight );

    this.handleDragListener = new HandleDragListener( numberProperty, rangeProperty, this.nodeEnabledProperty,
      options.injectionEnabledProperty, minHandleYOffset, maxHandleYOffset, this.pumpHandleNode, this.pumpShaftNode,
      combineOptions<HandleDragListenerOptions>( {
        tandem: options.tandem.createTandem( 'handleDragListener' )
      }, options.dragListenerOptions )
    );
    this.pumpHandleNode.addInputListener( this.handleDragListener );

    // add the pieces with the correct layering
    this.addChild( pumpBaseNode );
    this.addChild( bodyTopBackNode );
    this.addChild( bodyBottomCapNode );
    this.addChild( this.pumpShaftNode );
    this.addChild( this.pumpHandleNode );
    this.addChild( this.pumpBodyNode );
    this.addChild( remainingCapacityIndicator );
    this.addChild( bodyTopFrontNode );
    this.addChild( coneNode );
    this.addChild( hoseNode );
    this.addChild( externalHoseConnector );
    this.addChild( localHoseConnector );

    // With ?dev query parameter, place a red dot at the origin.
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
    }

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'BicyclePumpNode', this );

    this.disposeBicyclePumpNode = () => {
      this.handleDragListener.dispose(); // to unregister tandem

      if ( ownsEnabledProperty ) {
        this.nodeEnabledProperty.dispose();
      }
      else if ( this.nodeEnabledProperty.hasListener( enabledListener ) ) {
        this.nodeEnabledProperty.unlink( enabledListener );
      }
    };
  }

  /**
   * Sets handle and shaft to their initial position
   */
  private setPumpHandleToInitialPosition(): void {
    this.pumpHandleNode.bottom = this.pumpBodyNode.top - 18; // empirically determined
    this.pumpShaftNode.top = this.pumpHandleNode.bottom;
  }

  public reset(): void {
    this.setPumpHandleToInitialPosition();
    this.handleDragListener.reset();
  }

  public override dispose(): void {
    this.disposeBicyclePumpNode();
    super.dispose();
  }
}

/**
 * Draws the base of the pump. Many of the multipliers and point positions were arrived at empirically.
 *
 * @param width - the width of the base
 * @param height - the height of the base
 * @param fill
 */
function createPumpBaseNode( width: number, height: number, fill: TColor ): Node {

  // 3D effect is being used, so most of the height makes up the surface
  const topOfBaseHeight = height * 0.7;
  const halfOfBaseWidth = width / 2;

  // use PaintColorProperty so that colors can be updated dynamically
  const baseFillBrighterColorProperty = new PaintColorProperty( fill, { luminanceFactor: 0.05 } );
  const baseFillDarkerColorProperty = new PaintColorProperty( fill, { luminanceFactor: -0.2 } );
  const baseFillDarkestColorProperty = new PaintColorProperty( fill, { luminanceFactor: -0.4 } );

  // rounded rectangle that is the top of the base
  const topOfBaseNode = new Rectangle( -halfOfBaseWidth, -topOfBaseHeight / 2, width, topOfBaseHeight, 20, 20, {
    fill: new LinearGradient( -halfOfBaseWidth, 0, halfOfBaseWidth, 0 )
      .addColorStop( 0, baseFillBrighterColorProperty )
      .addColorStop( 0.5, fill )
      .addColorStop( 1, baseFillDarkerColorProperty )
  } );

  const pumpBaseEdgeHeight = height * 0.65;
  const pumpBaseSideEdgeYControlPoint = pumpBaseEdgeHeight * 1.05;
  const pumpBaseBottomEdgeXCurveStart = width * 0.35;

  // the front edge of the pump base, draw counter-clockwise starting at left edge
  const pumpEdgeShape = new Shape()
    .lineTo( -halfOfBaseWidth, 0 )
    .lineTo( -halfOfBaseWidth, pumpBaseEdgeHeight / 2 )
    .quadraticCurveTo( -halfOfBaseWidth, pumpBaseSideEdgeYControlPoint, -pumpBaseBottomEdgeXCurveStart, pumpBaseEdgeHeight )
    .lineTo( pumpBaseBottomEdgeXCurveStart, pumpBaseEdgeHeight )
    .quadraticCurveTo( halfOfBaseWidth, pumpBaseSideEdgeYControlPoint, halfOfBaseWidth, pumpBaseEdgeHeight / 2 )
    .lineTo( halfOfBaseWidth, 0 )
    .close();

  // color the front edge of the pump base
  const pumpEdgeNode = new Path( pumpEdgeShape, {
    fill: new LinearGradient( -halfOfBaseWidth, 0, halfOfBaseWidth, 0 )
      .addColorStop( 0, baseFillDarkestColorProperty )
      .addColorStop( 0.15, baseFillDarkerColorProperty )
      .addColorStop( 1, baseFillDarkestColorProperty )
  } );

  pumpEdgeNode.centerY = -pumpEdgeNode.height / 2;

  // 0.6 determined empirically for best positioning
  topOfBaseNode.bottom = pumpEdgeNode.bottom - pumpBaseEdgeHeight / 2 + 0.6;
  return new Node( { children: [ pumpEdgeNode, topOfBaseNode ] } );
}

/**
 * Creates half of the opening at the top of the pump body. Passing in -1 for the sign creates the back half, and
 * passing in 1 creates the front.
 */
function createBodyTopHalfNode( width: number, sign: 1 | -1, fill: TColor, stroke: TColor ): Node {
  const bodyTopShape = new Shape()
    .moveTo( 0, 0 )
    .cubicCurveTo(
      0,
      sign * width * SHAFT_OPENING_TILT_FACTOR,
      width,
      sign * width * SHAFT_OPENING_TILT_FACTOR,
      width,
      0
    );

  return new Path( bodyTopShape, {
    fill: fill,
    stroke: stroke
  } );
}

/**
 * Creates a hose connector. The hose has one on each of its ends.
 */
function createHoseConnectorNode( width: number, height: number, fill: TColor ): Node {

  // use PaintColorProperty so that colors can be updated dynamically
  const fillBrighterColorProperty = new PaintColorProperty( fill, { luminanceFactor: 0.1 } );
  const fillDarkerColorProperty = new PaintColorProperty( fill, { luminanceFactor: -0.2 } );
  const fillDarkestColorProperty = new PaintColorProperty( fill, { luminanceFactor: -0.4 } );

  return new Rectangle( 0, 0, width, height, 2, 2, {
    fill: new LinearGradient( 0, 0, 0, height )
      .addColorStop( 0, fillDarkerColorProperty )
      .addColorStop( 0.3, fill )
      .addColorStop( 0.35, fillBrighterColorProperty )
      .addColorStop( 0.4, fillBrighterColorProperty )
      .addColorStop( 1, fillDarkestColorProperty )
  } );
}

/**
 * Creates the cone, which connects the pump base to the pump body.
 * @param pumpBodyWidth - the width of the pump body (not quite as wide as the top of the cone)
 * @param height
 * @param fill
 */
function createConeNode( pumpBodyWidth: number, height: number, fill: TColor ): Node {
  const coneTopWidth = pumpBodyWidth * 1.2;
  const coneTopRadiusY = 3;
  const coneTopRadiusX = coneTopWidth / 2;
  const coneBottomWidth = pumpBodyWidth * 2;
  const coneBottomRadiusY = 4;
  const coneBottomRadiusX = coneBottomWidth / 2;

  const coneShape = new Shape()

    // start in upper right corner of shape, draw top ellipse right to left
    .ellipticalArc( 0, 0, coneTopRadiusX, coneTopRadiusY, 0, 0, Math.PI, false )
    .lineTo( -coneBottomRadiusX, height ) // line to bottom left corner of shape

    // draw bottom ellipse left to right
    .ellipticalArc( 0, height, coneBottomRadiusX, coneBottomRadiusY, 0, Math.PI, 0, true )
    .lineTo( coneTopRadiusX, 0 ); // line to upper right corner of shape

  // use PaintColorProperty so that colors can be updated dynamically
  const fillBrighterColorProperty = new PaintColorProperty( fill, { luminanceFactor: 0.1 } );
  const fillDarkerColorProperty = new PaintColorProperty( fill, { luminanceFactor: -0.4 } );
  const fillDarkestColorProperty = new PaintColorProperty( fill, { luminanceFactor: -0.5 } );

  const coneGradient = new LinearGradient( -coneBottomWidth / 2, 0, coneBottomWidth / 2, 0 )
    .addColorStop( 0, fillDarkerColorProperty )
    .addColorStop( 0.3, fill )
    .addColorStop( 0.35, fillBrighterColorProperty )
    .addColorStop( 0.45, fillBrighterColorProperty )
    .addColorStop( 0.5, fill )
    .addColorStop( 1, fillDarkestColorProperty );

  return new Path( coneShape, {
    fill: coneGradient
  } );
}

/**
 * Create the handle of the pump. This is the node that the user will interact with in order to use the pump.
 */
function createPumpHandleNode( fill: TColor ): Node {

  // empirically determined constants
  const centerSectionWidth = 35;
  const centerCurveWidth = 14;
  const centerCurveHeight = 8;
  const numberOfGripBumps = 4;
  const gripSingleBumpWidth = 16;
  const gripSingleBumpHalfWidth = gripSingleBumpWidth / 2;
  const gripInterBumpWidth = gripSingleBumpWidth * 0.31;
  const gripEndHeight = 23;

  // start the handle from the center bottom, drawing around counterclockwise
  const pumpHandleShape = new Shape().moveTo( 0, 0 );

  /**
   * Add a "bump" to the top or bottom of the grip
   * @param shape - the shape to append to
   * @param sign - +1 for bottom side of grip, -1 for top side of grip
   */
  const addGripBump = ( shape: Shape, sign: 1 | -1 ) => {

    // control points for quadratic curve shape on grip
    const controlPointX = gripSingleBumpWidth / 2;
    const controlPointY = gripSingleBumpWidth / 2;

    // this is a grip bump
    shape.quadraticCurveToRelative(
      sign * controlPointX,
      sign * controlPointY,
      sign * gripSingleBumpWidth,
      0 );
  };

  // this is the lower right part of the handle, including half of the middle section and the grip bumps
  pumpHandleShape.lineToRelative( centerSectionWidth / 2, 0 );
  pumpHandleShape.quadraticCurveToRelative( centerCurveWidth / 2, 0, centerCurveWidth, -centerCurveHeight );
  pumpHandleShape.lineToRelative( gripInterBumpWidth, 0 );
  for ( let i = 0; i < numberOfGripBumps - 1; i++ ) {
    addGripBump( pumpHandleShape, 1 );
    pumpHandleShape.lineToRelative( gripInterBumpWidth, 0 );
  }
  addGripBump( pumpHandleShape, 1 );

  // this is the right edge of the handle
  pumpHandleShape.lineToRelative( 0, -gripEndHeight );

  // this is the upper right part of the handle, including only the grip bumps
  for ( let i = 0; i < numberOfGripBumps; i++ ) {
    addGripBump( pumpHandleShape, -1 );
    pumpHandleShape.lineToRelative( -gripInterBumpWidth, 0 );
  }

  // this is the upper middle section of the handle
  pumpHandleShape.quadraticCurveToRelative( -centerCurveWidth / 2, -centerCurveHeight, -centerCurveWidth, -centerCurveHeight );
  pumpHandleShape.lineToRelative( -centerSectionWidth, 0 );
  pumpHandleShape.quadraticCurveToRelative( -centerCurveWidth / 2, 0, -centerCurveWidth, centerCurveHeight );
  pumpHandleShape.lineToRelative( -gripInterBumpWidth, 0 );

  // this is the upper left part of the handle, including only the grip bumps
  for ( let i = 0; i < numberOfGripBumps - 1; i++ ) {
    addGripBump( pumpHandleShape, -1 );
    pumpHandleShape.lineToRelative( -gripInterBumpWidth, 0 );
  }
  addGripBump( pumpHandleShape, -1 );

  // this is the left edge of the handle
  pumpHandleShape.lineToRelative( 0, gripEndHeight );

  // this is the lower left part of the handle, including the grip bumps and half of the middle section
  for ( let i = 0; i < numberOfGripBumps; i++ ) {
    addGripBump( pumpHandleShape, 1 );
    pumpHandleShape.lineToRelative( gripInterBumpWidth, 0 );
  }
  pumpHandleShape.quadraticCurveToRelative( centerCurveWidth / 2, centerCurveHeight, centerCurveWidth, centerCurveHeight );
  pumpHandleShape.lineToRelative( centerSectionWidth / 2, 0 );
  pumpHandleShape.close();

  // used to track where the current position is on the handle when drawing its gradient
  let handleGradientPosition = 0;

  /**
   * Adds a color stop to the given gradient at
   * @param gradient - the gradient being appended to
   * @param deltaDistance - the distance of this added color stop
   * @param totalDistance - the total width of the gradient
   * @param color - the color of this color stop
   */
  const addRelativeColorStop = ( gradient: LinearGradient, deltaDistance: number, totalDistance: number, color: TColor ) => {
    const newPosition = handleGradientPosition + deltaDistance;
    let ratio = newPosition / totalDistance;
    ratio = ratio > 1 ? 1 : ratio;

    gradient.addColorStop( ratio, color );
    handleGradientPosition = newPosition;
  };

  // set up the gradient for the handle
  const pumpHandleWidth = pumpHandleShape.bounds.width;
  const pumpHandleGradient = new LinearGradient( -pumpHandleWidth / 2, 0, pumpHandleWidth / 2, 0 );

  // use PaintColorProperty so that colors can be updated dynamically
  const handleFillColorProperty = new PaintColorProperty( fill );
  const handleFillDarkerColorProperty = new PaintColorProperty( handleFillColorProperty, { luminanceFactor: -0.35 } );

  // fill the left side handle gradient
  for ( let i = 0; i < numberOfGripBumps; i++ ) {
    addRelativeColorStop( pumpHandleGradient, 0, pumpHandleWidth, handleFillColorProperty );
    addRelativeColorStop( pumpHandleGradient, gripSingleBumpHalfWidth, pumpHandleWidth, handleFillColorProperty );
    addRelativeColorStop( pumpHandleGradient, gripSingleBumpHalfWidth, pumpHandleWidth, handleFillDarkerColorProperty );
    addRelativeColorStop( pumpHandleGradient, 0, pumpHandleWidth, handleFillColorProperty );
    addRelativeColorStop( pumpHandleGradient, gripInterBumpWidth, pumpHandleWidth, handleFillDarkerColorProperty );
  }

  // fill the center section handle gradient
  addRelativeColorStop( pumpHandleGradient, 0, pumpHandleWidth, handleFillColorProperty );
  addRelativeColorStop( pumpHandleGradient, centerCurveWidth + centerSectionWidth, pumpHandleWidth, handleFillColorProperty );
  addRelativeColorStop( pumpHandleGradient, centerCurveWidth, pumpHandleWidth, handleFillDarkerColorProperty );

  // fill the right side handle gradient
  for ( let i = 0; i < numberOfGripBumps; i++ ) {
    addRelativeColorStop( pumpHandleGradient, 0, pumpHandleWidth, handleFillColorProperty );
    addRelativeColorStop( pumpHandleGradient, gripInterBumpWidth, pumpHandleWidth, handleFillDarkerColorProperty );
    addRelativeColorStop( pumpHandleGradient, 0, pumpHandleWidth, handleFillColorProperty );
    addRelativeColorStop( pumpHandleGradient, gripSingleBumpHalfWidth, pumpHandleWidth, handleFillColorProperty );
    addRelativeColorStop( pumpHandleGradient, gripSingleBumpHalfWidth, pumpHandleWidth, handleFillDarkerColorProperty );
  }

  return new Path( pumpHandleShape, {
    lineWidth: 2,
    stroke: 'black',
    fill: pumpHandleGradient
  } );
}

type HandleDragListenerSelfOptions = {

  // {number} number of particles released by the pump during one pumping action
  numberOfParticlesPerPumpAction?: number;

  // {boolean} if false, particles are added as a batch at the end of each pumping motion
  addParticlesOneAtATime?: boolean;
};

type HandleDragListenerOptions = HandleDragListenerSelfOptions & StrictOmit<DragListenerOptions<PressedDragListener>, 'drag'>;

/**
 * Drag listener for the pump's handle.
 */
class HandleDragListener extends DragListener {

  private lastHandlePosition: number | null;

  public constructor( numberProperty: TProperty<number>,
                      rangeProperty: TReadOnlyProperty<Range>,
                      nodeEnabledProperty: TReadOnlyProperty<boolean>,
                      injectionEnabledProperty: TReadOnlyProperty<boolean>,
                      minHandleYOffset: number,
                      maxHandleYOffset: number,
                      pumpHandleNode: Node,
                      pumpShaftNode: Node,
                      providedOptions?: HandleDragListenerOptions
  ) {

    assert && assert( maxHandleYOffset > minHandleYOffset, 'bogus offsets' );

    const options = optionize<HandleDragListenerOptions, HandleDragListenerSelfOptions, DragListenerOptions<PressedDragListener>>()( {

      // HandleDragListenerSelfOptions
      numberOfParticlesPerPumpAction: 10,
      addParticlesOneAtATime: true
    }, providedOptions );

    let pumpingDistanceAccumulation = 0;

    // How far the pump shaft needs to travel before the pump releases a particle.
    // The subtracted constant was empirically determined to ensure that numberOfParticlesPerPumpAction is correct.
    const pumpingDistanceRequiredToAddParticle =
      ( maxHandleYOffset - minHandleYOffset ) / options.numberOfParticlesPerPumpAction - 0.01;

    options.drag = ( event: PressListenerEvent ) => {

      // update the handle and shaft position based on the user's pointer position
      const dragPositionY = pumpHandleNode.globalToParentPoint( event.pointer.point ).y;
      const handlePosition = Utils.clamp( dragPositionY, minHandleYOffset, maxHandleYOffset );
      pumpHandleNode.centerY = handlePosition;
      pumpShaftNode.top = pumpHandleNode.bottom;

      let numberOfBatchParticles = 0; // number of particles to add all at once

      if ( this.lastHandlePosition !== null ) {
        const travelDistance = handlePosition - this.lastHandlePosition;
        if ( travelDistance > 0 ) {

          // This motion is in the downward direction, so add its distance to the pumping distance.
          pumpingDistanceAccumulation += travelDistance;
          while ( pumpingDistanceAccumulation >= pumpingDistanceRequiredToAddParticle ) {

            // add a particle
            if ( nodeEnabledProperty.value && injectionEnabledProperty.value &&
                 numberProperty.value + numberOfBatchParticles < rangeProperty.value.max ) {
              if ( options.addParticlesOneAtATime ) {
                numberProperty.value++;
              }
              else {
                numberOfBatchParticles++;
              }
            }
            pumpingDistanceAccumulation -= pumpingDistanceRequiredToAddParticle;
          }
        }
        else {
          pumpingDistanceAccumulation = 0;
        }
      }

      // Add particles in one batch.
      if ( !options.addParticlesOneAtATime ) {
        numberProperty.value += numberOfBatchParticles;
      }
      else {
        assert && assert( numberOfBatchParticles === 0, 'unexpected batched particles' );
      }

      this.lastHandlePosition = handlePosition;
    };

    super( options );

    this.lastHandlePosition = null;
  }

  public reset(): void {
    this.lastHandlePosition = null;
  }
}

sceneryPhet.register( 'BicyclePumpNode', BicyclePumpNode );