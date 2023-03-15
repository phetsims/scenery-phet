// Copyright 2014-2023, University of Colorado Boulder

/**
 * A scenery node that is used to represent a draggable Measuring Tape. It contains a tip and a base that can be dragged
 * separately, with a text indicating the measurement. The motion of the measuring tape can be confined by drag bounds.
 * The position of the measuring tape should be set via the basePosition and tipPosition rather than the scenery
 * coordinates
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (ActualConcepts)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Martin Veillette (Berea College)
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Multilink from '../../axon/js/Multilink.js';
import Property from '../../axon/js/Property.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import Utils from '../../dot/js/Utils.js';
import Vector2 from '../../dot/js/Vector2.js';
import Vector2Property from '../../dot/js/Vector2Property.js';
import { Shape } from '../../kite/js/imports.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, DragListener, Font, Image, InteractiveHighlightingNode, KeyboardDragListener, Line, Node, NodeOptions, NodeTranslationOptions, Path, PressListenerEvent, Rectangle, TColor, Text } from '../../scenery/js/imports.js';
import Tandem from '../../tandem/js/Tandem.js';
import NumberIO from '../../tandem/js/types/NumberIO.js';
import StringIO from '../../tandem/js/types/StringIO.js';
import measuringTape_png from '../images/measuringTape_png.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';
import TProperty from '../../axon/js/TProperty.js';

export type MeasuringTapeUnits = {
  name: string;
  multiplier: number;
};

// motion when using a keyboard, in view coordinates per second
const KEYBOARD_DRAG_VELOCITY = 600;

type SelfOptions = {

  // base Position in model coordinate reference frame (rightBottom position of the measuring tape image)
  basePositionProperty?: Vector2Property;

  // tip Position in model coordinate reference frame (center position of the tip)
  tipPositionProperty?: Vector2Property;

  // use this to omit the value and units displayed below the tape measure, useful with createIcon
  hasValue?: boolean;

  // bounds for the measuring tape (in model coordinate reference frame), default value is everything,
  // effectively no bounds
  dragBounds?: Bounds2;
  textPosition?: Vector2; // position of the text relative to center of the base image in view units
  modelViewTransform?: ModelViewTransform2;
  significantFigures?: number; // number of significant figures in the length measurement
  textColor?: TColor; // {ColorDef} color of the length measurement and unit
  textBackgroundColor?: TColor; // {ColorDef} fill color of the text background
  textBackgroundXMargin?: number;
  textBackgroundYMargin?: number;
  textBackgroundCornerRadius?: number;
  textMaxWidth?: number;
  textFont?: Font; // font for the measurement text
  baseScale?: number; // control the size of the measuring tape Image (the base)
  lineColor?: TColor; // color of the tapeline itself
  tapeLineWidth?: number; // lineWidth of the tape line
  tipCircleColor?: TColor; // color of the circle at the tip
  tipCircleRadius?: number; // radius of the circle on the tip
  crosshairColor?: TColor; // orange, color of the two crosshairs
  crosshairSize?: number; // size of the crosshairs in scenery coordinates ( measured from center)
  crosshairLineWidth?: number; // lineWidth of the crosshairs
  isBaseCrosshairRotating?: boolean; // do crosshairs rotate around their own axis to line up with the tapeline
  isTipCrosshairRotating?: boolean; // do crosshairs rotate around their own axis to line up with the tapeline
  isTipDragBounded?: boolean; // is the tip subject to dragBounds
  interactive?: boolean; // specifies whether the node adds its own input listeners. Setting this to false may be helpful in creating an icon.
  baseDragStarted?: () => void; // called when the base drag starts
  baseDragEnded?: () => void; // called when the base drag ends, for testing whether it has dropped into the toolbox
};

/**
 * NOTE: NodeTranslationOptions are omitted because you must use basePositionProperty and tipPositionProperty to
 * position this Node.
 */
export type MeasuringTapeNodeOptions = SelfOptions & StrictOmit<NodeOptions, keyof NodeTranslationOptions>;

type MeasuringTapeIconSelfOptions = {
  tapeLength?: number; // length of the measuring tape
};

export type MeasuringTapeIconOptions = MeasuringTapeIconSelfOptions & StrictOmit<NodeOptions, 'children'>;

class MeasuringTapeNode extends Node {

  // the distance measured by the tape
  public readonly measuredDistanceProperty: TReadOnlyProperty<number>;
  public readonly isTipUserControlledProperty: TReadOnlyProperty<boolean>;
  public readonly isBaseUserControlledProperty: TReadOnlyProperty<boolean>;
  public readonly basePositionProperty: Vector2Property;
  public readonly tipPositionProperty: Vector2Property;
  public readonly modelViewTransformProperty: Property<ModelViewTransform2>;

  private readonly unitsProperty: TReadOnlyProperty<MeasuringTapeUnits>;
  private readonly significantFigures: number;
  public readonly _isTipUserControlledProperty: Property<boolean>;
  public readonly _isBaseUserControlledProperty: Property<boolean>;
  private readonly dragBoundsProperty: TProperty<Bounds2>;
  private readonly isTipDragBounded: boolean;
  private readonly baseDragListener: DragListener | null;
  private readonly baseImage: Image;
  private readonly valueNode: Text;
  private readonly valueBackgroundNode: Rectangle;
  private readonly valueContainer: Node; // parent that displays the text and its background
  private readonly disposeMeasuringTapeNode: () => void;

  public constructor( unitsProperty: TReadOnlyProperty<MeasuringTapeUnits>, providedOptions?: MeasuringTapeNodeOptions ) {

    const options = optionize<MeasuringTapeNodeOptions, SelfOptions, NodeOptions>()( {

      // base Position in model coordinate reference frame (rightBottom position of the measuring tape image)
      basePositionProperty: new Vector2Property( new Vector2( 0, 0 ) ),

      // tip Position in model coordinate reference frame (center position of the tip)
      tipPositionProperty: new Vector2Property( new Vector2( 1, 0 ) ),

      // use this to omit the value and units displayed below the tape measure, useful with createIcon
      hasValue: true,

      // bounds for the measuring tape (in model coordinate reference frame), default value is everything,
      // effectively no bounds
      dragBounds: Bounds2.EVERYTHING,
      textPosition: new Vector2( 0, 30 ), // position of the text relative to center of the base image in view units
      modelViewTransform: ModelViewTransform2.createIdentity(),
      significantFigures: 1, // number of significant figures in the length measurement
      textColor: 'white', // {ColorDef} color of the length measurement and unit
      textBackgroundColor: null, // {ColorDef} fill color of the text background
      textBackgroundXMargin: 4,
      textBackgroundYMargin: 2,
      textBackgroundCornerRadius: 2,
      textMaxWidth: 200,
      textFont: new PhetFont( { size: 16, weight: 'bold' } ), // font for the measurement text
      baseScale: 0.8, // control the size of the measuring tape Image (the base)
      lineColor: 'gray', // color of the tapeline itself
      tapeLineWidth: 2, // lineWidth of the tape line
      tipCircleColor: 'rgba(0,0,0,0.1)', // color of the circle at the tip
      tipCircleRadius: 10, // radius of the circle on the tip
      crosshairColor: 'rgb(224, 95, 32)', // orange, color of the two crosshairs
      crosshairSize: 5, // size of the crosshairs in scenery coordinates ( measured from center)
      crosshairLineWidth: 2, // linewidth of the crosshairs
      isBaseCrosshairRotating: true, // do crosshairs rotate around their own axis to line up with the tapeline
      isTipCrosshairRotating: true, // do crosshairs rotate around their own axis to line up with the tapeline
      isTipDragBounded: true, // is the tip subject to dragBounds
      interactive: true, // specifies whether the node adds its own input listeners. Setting this to false may be helpful in creating an icon.
      baseDragStarted: _.noop, // called when the base drag starts
      baseDragEnded: _.noop, // called when the base drag ends, for testing whether it has dropped into the toolbox
      tandem: Tandem.OPTIONAL
    }, providedOptions );

    super();

    assert && assert( Math.abs( options.modelViewTransform.modelToViewDeltaX( 1 ) ) ===
                      Math.abs( options.modelViewTransform.modelToViewDeltaY( 1 ) ), 'The y and x scale factor are not identical' );

    this.unitsProperty = unitsProperty;
    this.significantFigures = options.significantFigures;
    this.dragBoundsProperty = new Property( options.dragBounds );
    this.modelViewTransformProperty = new Property( options.modelViewTransform );
    this.isTipDragBounded = options.isTipDragBounded;
    this.basePositionProperty = options.basePositionProperty;
    this.tipPositionProperty = options.tipPositionProperty;

    // private Property and its public read-only interface
    this._isTipUserControlledProperty = new Property<boolean>( false );
    this.isTipUserControlledProperty = this._isTipUserControlledProperty;

    // private Property and its public read-only interface
    this._isBaseUserControlledProperty = new Property<boolean>( false );
    this.isBaseUserControlledProperty = this._isBaseUserControlledProperty;

    assert && assert( this.basePositionProperty.units === this.tipPositionProperty.units, 'units should match' );

    this.measuredDistanceProperty = new DerivedProperty(
      [ this.basePositionProperty, this.tipPositionProperty ],
      ( basePosition, tipPosition ) => basePosition.distance( tipPosition ), {
        tandem: options.tandem.createTandem( 'measuredDistanceProperty' ),
        phetioDocumentation: 'The distance measured by the measuring tape',
        phetioValueType: NumberIO,
        units: this.basePositionProperty.units
      } );

    const crosshairShape = new Shape()
      .moveTo( -options.crosshairSize, 0 )
      .moveTo( -options.crosshairSize, 0 )
      .lineTo( options.crosshairSize, 0 )
      .moveTo( 0, -options.crosshairSize )
      .lineTo( 0, options.crosshairSize );

    const baseCrosshair = new Path( crosshairShape, {
      stroke: options.crosshairColor,
      lineWidth: options.crosshairLineWidth
    } );

    const tipCrosshair = new Path( crosshairShape, {
      stroke: options.crosshairColor,
      lineWidth: options.crosshairLineWidth
    } );

    const tipCircle = new Circle( options.tipCircleRadius, { fill: options.tipCircleColor } );

    const baseImageParent = new InteractiveHighlightingNode( {

      // will only be enabled if interactive
      interactiveHighlightEnabled: false
    } );
    this.baseImage = new Image( measuringTape_png, {
      scale: options.baseScale,
      cursor: 'pointer',

      // pdom
      tagName: 'div',
      focusable: true,
      ariaRole: 'application',
      innerContent: SceneryPhetStrings.a11y.measuringTapeStringProperty,
      ariaLabel: SceneryPhetStrings.a11y.measuringTapeStringProperty
    } );
    baseImageParent.addChild( this.baseImage );

    // create tapeline (running from one crosshair to the other)
    const tapeLine = new Line( this.basePositionProperty.value, this.tipPositionProperty.value, {
      stroke: options.lineColor,
      lineWidth: options.tapeLineWidth
    } );

    // add tipCrosshair and tipCircle to the tip
    const tip = new InteractiveHighlightingNode( {
      children: [ tipCircle, tipCrosshair ],
      cursor: 'pointer',

      // interactive highlights - will only be enabled when interactive
      interactiveHighlightEnabled: false,

      // pdom
      tagName: 'div',
      focusable: true,
      ariaRole: 'application',
      innerContent: SceneryPhetStrings.a11y.measuringTapeTipStringProperty,
      ariaLabel: SceneryPhetStrings.a11y.measuringTapeTipStringProperty
    } );

    const readoutStringProperty = new DerivedProperty(
      [ this.unitsProperty, this.measuredDistanceProperty, SceneryPhetStrings.measuringTapeReadoutPatternStringProperty ],
      ( units, measuredDistance, measuringTapeReadoutPattern ) => {
        const distance = Utils.toFixed( units.multiplier * measuredDistance, this.significantFigures );
        return StringUtils.fillIn( measuringTapeReadoutPattern, {
          distance: distance,
          units: units.name
        } );
      }, {
        tandem: options.tandem.createTandem( 'readoutStringProperty' ),
        phetioValueType: StringIO,
        phetioDocumentation: 'The text content of the readout on the measuring tape'
      } );

    this.valueNode = new Text( readoutStringProperty, {
      font: options.textFont,
      fill: options.textColor,
      maxWidth: options.textMaxWidth
    } );

    this.valueBackgroundNode = new Rectangle( 0, 0, 1, 1, {
      cornerRadius: options.textBackgroundCornerRadius,
      fill: options.textBackgroundColor
    } );

    // Resizes the value background and centers it on the value
    const updateValueBackgroundNode = () => {
      const valueBackgroundWidth = this.valueNode.width + ( 2 * options.textBackgroundXMargin );
      const valueBackgroundHeight = this.valueNode.height + ( 2 * options.textBackgroundYMargin );
      this.valueBackgroundNode.setRect( 0, 0, valueBackgroundWidth, valueBackgroundHeight );
      this.valueBackgroundNode.center = this.valueNode.center;
    };
    this.valueNode.boundsProperty.lazyLink( updateValueBackgroundNode );
    updateValueBackgroundNode();

    // expand the area for touch
    tip.touchArea = tip.localBounds.dilated( 15 );
    this.baseImage.touchArea = this.baseImage.localBounds.dilated( 20 );
    this.baseImage.mouseArea = this.baseImage.localBounds.dilated( 10 );

    this.addChild( tapeLine ); // tapeline going from one crosshair to the other
    this.addChild( baseCrosshair ); // crosshair near the base, (set at basePosition)
    this.addChild( baseImageParent ); // base of the measuring tape

    this.valueContainer = new Node( { children: [ this.valueBackgroundNode, this.valueNode ] } );
    if ( options.hasValue ) {
      this.addChild( this.valueContainer );
    }
    this.addChild( tip ); // crosshair and circle at the tip (set at tipPosition)

    let baseStartOffset: Vector2;

    this.baseDragListener = null;
    if ( options.interactive ) {

      // interactive highlights - highlights are enabled only when the component is interactive
      baseImageParent.interactiveHighlightEnabled = true;
      tip.interactiveHighlightEnabled = true;

      const baseStart = () => {
        this.moveToFront();
        options.baseDragStarted();
        this._isBaseUserControlledProperty.value = true;
      };

      const baseEnd = () => {
        this._isBaseUserControlledProperty.value = false;
        options.baseDragEnded();
      };

      const handleTipOnBaseDrag = ( delta: Vector2 ) => {

        // translate the position of the tip if it is not being dragged
        // when the user is not holding onto the tip, dragging the body will also drag the tip
        if ( !this.isTipUserControlledProperty.value ) {
          const unconstrainedTipPosition = delta.plus( this.tipPositionProperty.value );
          if ( options.isTipDragBounded ) {
            const constrainedTipPosition = this.dragBoundsProperty.value.closestPointTo( unconstrainedTipPosition );
            // translation of the tipPosition (subject to the constraining drag bounds)
            this.tipPositionProperty.set( constrainedTipPosition );
          }
          else {
            this.tipPositionProperty.set( unconstrainedTipPosition );
          }
        }
      };

      // Drag listener for base
      this.baseDragListener = new DragListener( {
        tandem: options.tandem.createTandem( 'baseDragListener' ),
        start: event => {
          baseStart();
          const position = this.modelViewTransformProperty.value.modelToViewPosition( this.basePositionProperty.value );
          baseStartOffset = event.currentTarget!.globalToParentPoint( event.pointer.point ).minus( position );
        },
        drag: ( event, listener ) => {
          const parentPoint = listener.currentTarget.globalToParentPoint( event.pointer.point ).minus( baseStartOffset );
          const unconstrainedBasePosition = this.modelViewTransformProperty.value.viewToModelPosition( parentPoint );
          const constrainedBasePosition = this.dragBoundsProperty.value.closestPointTo( unconstrainedBasePosition );

          // the basePosition value has not been updated yet, hence it is the old value of the basePosition;
          const translationDelta = constrainedBasePosition.minus( this.basePositionProperty.value ); // in model reference frame

          // translation of the basePosition (subject to the constraining drag bounds)
          this.basePositionProperty.set( constrainedBasePosition );

          handleTipOnBaseDrag( translationDelta );
        },
        end: baseEnd
      } );
      this.baseImage.addInputListener( this.baseDragListener );

      // Drag listener for base
      const baseKeyboardDragListener = new KeyboardDragListener( {
        tandem: options.tandem.createTandem( 'baseKeyboardDragListener' ),
        positionProperty: this.basePositionProperty,
        transform: this.modelViewTransformProperty,
        dragBoundsProperty: this.dragBoundsProperty,
        dragVelocity: KEYBOARD_DRAG_VELOCITY,
        shiftDragVelocity: 300,
        start: baseStart,
        drag: handleTipOnBaseDrag,
        end: baseEnd
      } );

      this.baseImage.addInputListener( baseKeyboardDragListener );

      const tipEnd = () => {
        this._isTipUserControlledProperty.value = false;
      };

      let tipStartOffset: Vector2;

      // Drag listener for tip
      const tipDragListener = new DragListener( {
        tandem: options.tandem.createTandem( 'tipDragListener' ),

        start: event => {
          this.moveToFront();
          this._isTipUserControlledProperty.value = true;
          const position = this.modelViewTransformProperty.value.modelToViewPosition( this.tipPositionProperty.value );
          tipStartOffset = event.currentTarget!.globalToParentPoint( event.pointer.point ).minus( position );
        },

        drag: ( event, listener ) => {
          const parentPoint = listener.currentTarget.globalToParentPoint( event.pointer.point ).minus( tipStartOffset );
          const unconstrainedTipPosition = this.modelViewTransformProperty.value.viewToModelPosition( parentPoint );

          if ( options.isTipDragBounded ) {
            // translation of the tipPosition (subject to the constraining drag bounds)
            this.tipPositionProperty.value = this.dragBoundsProperty.value.closestPointTo( unconstrainedTipPosition );
          }
          else {
            this.tipPositionProperty.value = unconstrainedTipPosition;
          }
        },

        end: tipEnd
      } );
      tip.addInputListener( tipDragListener );

      const tipKeyboardDragListener = new KeyboardDragListener( {
        tandem: options.tandem.createTandem( 'tipKeyboardDragListener' ),
        positionProperty: this.tipPositionProperty,
        dragBoundsProperty: options.isTipDragBounded ? this.dragBoundsProperty : null,
        dragVelocity: KEYBOARD_DRAG_VELOCITY,
        transform: this.modelViewTransformProperty,
        shiftDragVelocity: 150,
        start: () => {
          this.moveToFront();
          this._isTipUserControlledProperty.value = true;
        },
        end: tipEnd
      } );
      tip.addInputListener( tipKeyboardDragListener );
    }

    const updateTextReadout = () => {
      this.valueNode.centerTop = this.baseImage.center.plus( options.textPosition.times( options.baseScale ) );
    };
    readoutStringProperty.link( updateTextReadout );

    // link the positions of base and tip to the measuring tape to the scenery update function.
    // Must be disposed.
    const multilink = Multilink.multilink(
      [ this.measuredDistanceProperty, unitsProperty, this.modelViewTransformProperty, this.tipPositionProperty, this.basePositionProperty ], (
        measuredDistance, units, modelViewTransform, tipPosition, basePosition ) => {

        const viewTipPosition = modelViewTransform.modelToViewPosition( tipPosition );
        const viewBasePosition = modelViewTransform.modelToViewPosition( basePosition );

        // calculate the orientation and change of orientation of the Measuring tape
        const oldAngle = this.baseImage.getRotation();
        const angle = Math.atan2( viewTipPosition.y - viewBasePosition.y, viewTipPosition.x - viewBasePosition.x );
        const deltaAngle = angle - oldAngle;

        // set position of the tip and the base crosshair
        baseCrosshair.center = viewBasePosition;
        tip.center = viewTipPosition;

        // in order to avoid all kind of geometrical issues with position,
        // let's reset the baseImage upright and then set its position and rotation
        this.baseImage.setRotation( 0 );
        this.baseImage.rightBottom = viewBasePosition;
        this.baseImage.rotateAround( this.baseImage.rightBottom, angle );

        // reposition the tapeline
        tapeLine.setLine( viewBasePosition.x, viewBasePosition.y, viewTipPosition.x, viewTipPosition.y );

        // rotate the crosshairs
        if ( options.isTipCrosshairRotating ) {
          tip.rotateAround( viewTipPosition, deltaAngle );
        }
        if ( options.isBaseCrosshairRotating ) {
          baseCrosshair.rotateAround( viewBasePosition, deltaAngle );
        }

        updateTextReadout();
      } );

    this.disposeMeasuringTapeNode = () => {
      multilink.dispose();
      readoutStringProperty.dispose();

      // interactive highlighting related listeners require disposal
      baseImageParent.dispose();
      tip.dispose();
    };

    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'MeasuringTapeNode', this );
  }

  public reset(): void {
    this.basePositionProperty.reset();
    this.tipPositionProperty.reset();
  }

  public override dispose(): void {
    this.disposeMeasuringTapeNode();
    super.dispose();
  }

  /**
   * Sets the dragBounds of the measuring tape.
   * In addition, it forces the tip and base of the measuring tape to be within the new bounds.
   */
  public setDragBounds( newDragBounds: Bounds2 ): void {
    const dragBounds = newDragBounds.copy();
    this.dragBoundsProperty.value = dragBounds;

    // sets the base position of the measuring tape, which may have changed if it was outside of the dragBounds
    this.basePositionProperty.value = dragBounds.closestPointTo( this.basePositionProperty.value );

    // sets a new tip position if the tip of the measuring tape is subject to dragBounds
    if ( this.isTipDragBounded ) {
      this.tipPositionProperty.value = dragBounds.closestPointTo( this.tipPositionProperty.value );
    }
  }

  /**
   * Gets the dragBounds of the measuring tape.
   */
  public getDragBounds(): Bounds2 {
    return this.dragBoundsProperty.value.copy();
  }

  /**
   * Returns the center of the base in the measuring tape's local coordinate frame.
   */
  public getLocalBaseCenter(): Vector2 {
    return new Vector2( -this.baseImage.imageWidth / 2, -this.baseImage.imageHeight / 2 );
  }

  /**
   * Returns the bounding box of the measuring tape's base within its local coordinate frame
   */
  public getLocalBaseBounds(): Bounds2 {
    return this.baseImage.bounds.copy();
  }

  /**
   * Initiates a drag of the base (whole measuring tape) from a Scenery event.
   */
  public startBaseDrag( event: PressListenerEvent ): void {
    this.baseDragListener && this.baseDragListener.press( event );
  }

  /**
   * Creates an icon of the measuring tape.
   */
  public static createIcon( providedOptions?: MeasuringTapeIconOptions ): Node {

    // See documentation above!
    const options = optionize<MeasuringTapeIconOptions, MeasuringTapeIconSelfOptions, NodeOptions>()( {
      tapeLength: 30
    }, providedOptions );

    // Create an actual measuring tape.
    const measuringTapeNode = new MeasuringTapeNode( new Property( { name: '', multiplier: 1 } ), {
      tipPositionProperty: new Vector2Property( new Vector2( options.tapeLength, 0 ) ),
      hasValue: false, // no value below the tape
      interactive: false
    } );
    options.children = [ measuringTapeNode ];

    // Create the icon, with measuringTape as its initial child.  This child will be replaced once the image becomes
    // available in the callback to toImage (see below). Since toImage happens asynchronously, this ensures that
    // the icon has initial bounds that will match the icon once the image is available.
    const measuringTapeIcon = new Node( options );

    // Convert measuringTapeNode to an image, and make it the child of measuringTapeIcon.
    measuringTapeNode.toImage( image => measuringTapeIcon.setChildren( [ new Image( image ) ] ) );

    return measuringTapeIcon;
  }
}

sceneryPhet.register( 'MeasuringTapeNode', MeasuringTapeNode );

export default MeasuringTapeNode;