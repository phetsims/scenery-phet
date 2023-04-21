// Copyright 2013-2023, University of Colorado Boulder

/**
 * SpectrumSlider is a slider-like control used for choosing a value that corresponds to a displayed color.
 * It is the base class for WavelengthSlider.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */

import TProperty from '../../axon/js/TProperty.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Property from '../../axon/js/Property.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Range from '../../dot/js/Range.js';
import Utils from '../../dot/js/Utils.js';
import { Shape } from '../../kite/js/imports.js';
import deprecationWarning from '../../phet-core/js/deprecationWarning.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import { Color, DragListener, FocusHighlightFromNode, Font, TColor, Node, NodeOptions, Path, PathOptions, Rectangle, RectangleOptions, SceneryEvent, Text, TextOptions } from '../../scenery/js/imports.js';
import AccessibleSlider, { AccessibleSliderOptions } from '../../sun/js/accessibility/AccessibleSlider.js';
import ArrowButton from '../../sun/js/buttons/ArrowButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import SpectrumNode from './SpectrumNode.js';

const DEFAULT_MIN_VALUE = 0;
const DEFAULT_MAX_VALUE = 1;

type SelfOptions = {

  // The minimum value to be displayed
  minValue?: number;

  // The maximum value to be displayed
  maxValue?: number;

  // Maps value to string that is optionally displayed by the slider
  valueToString?: ( value: number ) => string;

  // Maps value to Color that is rendered in the spectrum and in the thumb
  valueToColor?: ( value: number ) => Color;

  // track properties
  trackWidth?: number;
  trackHeight?: number;
  trackOpacity?: number; // [0,1]
  trackBorderStroke?: TColor;

  // thumb
  thumbWidth?: number;
  thumbHeight?: number;
  thumbTouchAreaXDilation?: number;
  thumbTouchAreaYDilation?: number;
  thumbMouseAreaXDilation?: number;
  thumbMouseAreaYDilation?: number;

  // value
  valueFont?: Font;
  valueFill?: TColor;
  valueVisible?: boolean;
  valueYSpacing?: number; // space between value and top of track

  // tweakers
  tweakersVisible?: boolean;
  tweakerValueDelta?: number; // the amount that value changes when a tweaker button is pressed
  tweakersXSpacing?: number; // space between tweakers and track
  maxTweakersHeight?: number;
  tweakersTouchAreaXDilation?: number;
  tweakersTouchAreaYDilation?: number;
  tweakersMouseAreaXDilation?: number;
  tweakersMouseAreaYDilation?: number;

  // cursor, the rectangle than follows the thumb in the track
  cursorVisible?: boolean;
  cursorStroke?: TColor;
};
type ParentOptions = AccessibleSliderOptions & NodeOptions;
export type SpectrumSliderOptions = SelfOptions & StrictOmit<ParentOptions, 'valueProperty' | 'enabledRangeProperty'>;

/**
 * @deprecated use WavelengthNumberControl, or Slider.js with SpectrumSliderTrack and SpectrumSliderTrack,
 *   see https://github.com/phetsims/scenery-phet/issues/729
 */
export default class SpectrumSlider extends AccessibleSlider( Node, 0 ) {

  private readonly disposeSpectrumSlider: () => void;

  /**
   * @param valueProperty
   * @param providedOptions
   */
  public constructor( valueProperty: TProperty<number>, providedOptions?: SpectrumSliderOptions ) {
    assert && deprecationWarning( 'SpectrumSlider is deprecated, please use Slider with SpectrumSlideTrack/Thumb instead' );

    const enabledRangeMin = providedOptions?.minValue ?? DEFAULT_MIN_VALUE;
    const enabledRangeMax = providedOptions?.maxValue ?? DEFAULT_MAX_VALUE;
    const enabledRangeProperty = new Property( new Range( enabledRangeMin, enabledRangeMax ) );

    // options that are specific to this type
    const options = optionize<SpectrumSliderOptions, SelfOptions, ParentOptions>()( {

      // SelfOptions
      minValue: DEFAULT_MIN_VALUE,
      maxValue: DEFAULT_MAX_VALUE,
      valueToString: ( value: number ) => `${value}`,
      valueToColor: ( value: number ) => new Color( 0, 0, 255 * value ),

      // track
      trackWidth: 150,
      trackHeight: 30,
      trackOpacity: 1,
      trackBorderStroke: 'black',

      // thumb
      thumbWidth: 35,
      thumbHeight: 45,
      thumbTouchAreaXDilation: 12,
      thumbTouchAreaYDilation: 10,
      thumbMouseAreaXDilation: 0,
      thumbMouseAreaYDilation: 0,

      // value
      valueFont: new PhetFont( 20 ),
      valueFill: 'black',
      valueVisible: true,
      valueYSpacing: 2, // {number} space between value and top of track

      // tweakers
      tweakersVisible: true,
      tweakerValueDelta: 1, // {number} the amount that value changes when a tweaker button is pressed
      tweakersXSpacing: 8, // {number} space between tweakers and track
      maxTweakersHeight: 30,
      tweakersTouchAreaXDilation: 7,
      tweakersTouchAreaYDilation: 7,
      tweakersMouseAreaXDilation: 0,
      tweakersMouseAreaYDilation: 0,

      // cursor, the rectangle than follows the thumb in the track
      cursorVisible: true,
      cursorStroke: 'black',

      // ParentOptions
      valueProperty: valueProperty,
      enabledRangeProperty: enabledRangeProperty,
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'Slider'

    }, providedOptions );

    // validate values
    assert && assert( options.minValue < options.maxValue );

    // These options require valid Bounds, and will be applied later via mutate.
    const boundsRequiredOptionKeys = _.pick( options, Node.REQUIRES_BOUNDS_OPTION_KEYS );

    super( _.omit( options, Node.REQUIRES_BOUNDS_OPTION_KEYS ) );

    const track = new SpectrumNode( {
      valueToColor: options.valueToColor,
      size: new Dimension2( options.trackWidth, options.trackHeight ),
      minValue: options.minValue,
      maxValue: options.maxValue,
      opacity: options.trackOpacity,
      cursor: 'pointer'
    } );

    /*
     * Put a border around the track.
     * We don't stroke the track itself because stroking the track will affect its bounds,
     * and will thus affect the drag handle behavior.
     * Having a separate border also gives subclasses a place to add markings (eg, tick marks)
     * without affecting the track's bounds.
     */
    const trackBorder = new Rectangle( 0, 0, track.width, track.height, {
      stroke: options.trackBorderStroke,
      lineWidth: 1,
      pickable: false
    } );

    let valueDisplay: Node | null = null;
    if ( options.valueVisible ) {
      valueDisplay = new ValueDisplay( valueProperty, options.valueToString, {
        font: options.valueFont,
        fill: options.valueFill,
        bottom: track.top - options.valueYSpacing
      } );
    }

    let cursor: Cursor | null = null;
    if ( options.cursorVisible ) {
      cursor = new Cursor( 3, track.height, {
        stroke: options.cursorStroke,
        top: track.top
      } );
    }

    const thumb = new Thumb( options.thumbWidth, options.thumbHeight, {
      cursor: 'pointer',
      top: track.bottom
    } );

    // thumb touchArea
    if ( options.thumbTouchAreaXDilation || options.thumbTouchAreaYDilation ) {
      thumb.touchArea = thumb.localBounds
        .dilatedXY( options.thumbTouchAreaXDilation, options.thumbTouchAreaYDilation )
        .shiftedY( options.thumbTouchAreaYDilation );
    }

    // thumb mouseArea
    if ( options.thumbMouseAreaXDilation || options.thumbMouseAreaYDilation ) {
      thumb.mouseArea = thumb.localBounds
        .dilatedXY( options.thumbMouseAreaXDilation, options.thumbMouseAreaYDilation )
        .shiftedY( options.thumbMouseAreaYDilation );
    }

    // tweaker buttons for single-unit increments
    let plusButton: Node | null = null;
    let minusButton: Node | null = null;
    if ( options.tweakersVisible ) {

      plusButton = new ArrowButton( 'right', ( () => {

        // Increase the value, but keep it in range
        valueProperty.set( Math.min( options.maxValue, valueProperty.get() + options.tweakerValueDelta ) );
      } ), {
        left: track.right + options.tweakersXSpacing,
        centerY: track.centerY,
        maxHeight: options.maxTweakersHeight,
        tandem: options.tandem.createTandem( 'plusButton' )
      } );

      minusButton = new ArrowButton( 'left', ( () => {

        // Decrease the value, but keep it in range
        valueProperty.set( Math.max( options.minValue, valueProperty.get() - options.tweakerValueDelta ) );
      } ), {
        right: track.left - options.tweakersXSpacing,
        centerY: track.centerY,
        maxHeight: options.maxTweakersHeight,
        tandem: options.tandem.createTandem( 'minusButton' )
      } );

      // tweakers touchArea
      plusButton.touchArea = plusButton.localBounds
        .dilatedXY( options.tweakersTouchAreaXDilation, options.tweakersTouchAreaYDilation )
        .shiftedX( options.tweakersTouchAreaXDilation );
      minusButton.touchArea = minusButton.localBounds
        .dilatedXY( options.tweakersTouchAreaXDilation, options.tweakersTouchAreaYDilation )
        .shiftedX( -options.tweakersTouchAreaXDilation );

      // tweakers mouseArea
      plusButton.mouseArea = plusButton.localBounds
        .dilatedXY( options.tweakersMouseAreaXDilation, options.tweakersMouseAreaYDilation )
        .shiftedX( options.tweakersMouseAreaXDilation );
      minusButton.mouseArea = minusButton.localBounds
        .dilatedXY( options.tweakersMouseAreaXDilation, options.tweakersMouseAreaYDilation )
        .shiftedX( -options.tweakersMouseAreaXDilation );
    }

    // rendering order
    this.addChild( track );
    this.addChild( trackBorder );
    this.addChild( thumb );
    valueDisplay && this.addChild( valueDisplay );
    cursor && this.addChild( cursor );
    plusButton && this.addChild( plusButton );
    minusButton && this.addChild( minusButton );

    // transforms between position and value
    const positionToValue = ( x: number ) =>
      Utils.clamp( Utils.linear( 0, track.width, options.minValue, options.maxValue, x ), options.minValue, options.maxValue );
    const valueToPosition = ( value: number ) =>
      Utils.clamp( Utils.linear( options.minValue, options.maxValue, 0, track.width, value ), 0, track.width );

    // click in the track to change the value, continue dragging if desired
    const handleTrackEvent = ( event: SceneryEvent ) => {
      const x = thumb.globalToParentPoint( event.pointer.point ).x;
      const value = positionToValue( x );
      valueProperty.set( value );
    };

    track.addInputListener( new DragListener( {
      allowTouchSnag: false,
      start: event => handleTrackEvent( event ),
      drag: event => handleTrackEvent( event ),
      tandem: options.tandem.createTandem( 'dragListener' )
    } ) );

    // thumb drag handler
    let clickXOffset = 0; // x-offset between initial click and thumb's origin
    thumb.addInputListener( new DragListener( {

      tandem: options.tandem.createTandem( 'thumbInputListener' ),

      start: event => {
        clickXOffset = thumb.globalToParentPoint( event.pointer.point ).x - thumb.x;
      },

      drag: event => {
        const x = thumb.globalToParentPoint( event.pointer.point ).x - clickXOffset;
        const value = positionToValue( x );
        valueProperty.set( value );
      }
    } ) );

    // custom focus highlight that surrounds and moves with the thumb
    this.focusHighlight = new FocusHighlightFromNode( thumb );

    // sync with model
    const updateUI = ( value: number ) => {

      // positions
      const x = valueToPosition( value );
      thumb.centerX = x;
      if ( cursor ) { cursor.centerX = x; }
      if ( valueDisplay ) { valueDisplay.centerX = x; }

      // thumb color
      thumb.fill = options.valueToColor( value );

      // tweaker buttons
      if ( plusButton ) {
        plusButton.enabled = ( value < options.maxValue );
      }
      if ( minusButton ) {
        minusButton.enabled = ( value > options.minValue );
      }
    };
    const valueListener = ( value: number ) => updateUI( value );
    valueProperty.link( valueListener );

    /*
     * The horizontal bounds of the value control changes as the slider knob is dragged.
     * To prevent this, we determine the extents of the control's bounds at min and max values,
     * then add an invisible horizontal strut.
     */
    // determine bounds at min and max values
    updateUI( options.minValue );
    const minX = this.left;
    updateUI( options.maxValue );
    const maxX = this.right;

    // restore the initial value
    updateUI( valueProperty.get() );

    // add a horizontal strut
    const strut = new Rectangle( minX, 0, maxX - minX, 1, { pickable: false } );
    this.addChild( strut );
    strut.moveToBack();

    this.disposeSpectrumSlider = () => {
      valueDisplay && valueDisplay.dispose();
      plusButton && plusButton.dispose();
      minusButton && minusButton.dispose();
      valueProperty.unlink( valueListener );
    };

    // We already set other options via super(). Now that we have valid Bounds, apply these options.
    this.mutate( boundsRequiredOptionKeys );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'SpectrumSlider', this );
  }

  public override dispose(): void {
    this.disposeSpectrumSlider();
    super.dispose();
  }
}

/**
 * The slider thumb, origin at top center.
 */
class Thumb extends Path {

  public constructor( width: number, height: number, providedOptions?: PathOptions ) {

    const options = combineOptions<PathOptions>( {
      fill: 'black',
      stroke: 'black',
      lineWidth: 1
    }, providedOptions );

    // Set the radius of the arcs based on the height or width, whichever is smaller.
    const radiusScale = 0.15;
    const radius = ( width < height ) ? radiusScale * width : radiusScale * height;

    // Calculate some parameters of the upper triangles of the thumb for getting arc offsets.
    const hypotenuse = Math.sqrt( Math.pow( 0.5 * width, 2 ) + Math.pow( 0.3 * height, 2 ) );
    const angle = Math.acos( width * 0.5 / hypotenuse );
    const heightOffset = radius * Math.sin( angle );

    // Draw the thumb shape starting at the right upper corner of the pentagon below the arc,
    // this way we can get the arc coordinates for the arc in this corner from the other side,
    // which will be easier to calculate arcing from bottom to top.
    const shape = new Shape()
      .moveTo( 0.5 * width, 0.3 * height + heightOffset )
      .lineTo( 0.5 * width, height - radius )
      .arc( 0.5 * width - radius, height - radius, radius, 0, Math.PI / 2 )
      .lineTo( -0.5 * width + radius, height )
      .arc( -0.5 * width + radius, height - radius, radius, Math.PI / 2, Math.PI )
      .lineTo( -0.5 * width, 0.3 * height + heightOffset )
      .arc( -0.5 * width + radius, 0.3 * height + heightOffset, radius, Math.PI, Math.PI + angle );

    // Save the coordinates for the point above the left side arc, for use on the other side.
    const sideArcPoint = shape.getLastPoint()!;
    assert && assert( sideArcPoint );

    shape.lineTo( 0, 0 )
      .lineTo( -sideArcPoint.x, sideArcPoint.y )
      .arc( 0.5 * width - radius, 0.3 * height + heightOffset, radius, -angle, 0 )
      .close();

    super( shape, options );
  }
}

/**
 * Displays the value and units.
 */
class ValueDisplay extends Text {

  private readonly disposeValueDisplay: () => void;

  /**
   * @param valueProperty
   * @param valueToString - converts value {number} to text {string} for display
   * @param providedOptions
   */
  public constructor( valueProperty: TReadOnlyProperty<number>,
                      valueToString: ( value: number ) => string,
                      providedOptions?: TextOptions ) {

    super( '?', providedOptions );

    const valueObserver = ( value: number ) => {
      this.string = valueToString( value );
    };
    valueProperty.link( valueObserver );

    this.disposeValueDisplay = () => valueProperty.unlink( valueObserver );
  }

  public override dispose(): void {
    this.disposeValueDisplay();
    super.dispose();
  }
}

/**
 * Rectangular 'cursor' that appears in the track directly above the thumb. Origin is at top center.
 */
class Cursor extends Rectangle {
  public constructor( width: number, height: number, providedOptions: RectangleOptions ) {
    super( -width / 2, 0, width, height, providedOptions );
  }
}

sceneryPhet.register( 'SpectrumSlider', SpectrumSlider );