// Copyright 2014-2023, University of Colorado Boulder

/**
 * Shows a readout of the elapsed time, with play and pause buttons.  By default there are no units (which could be used
 * if all of a simulations time units are in 'seconds'), or you can specify a selection of units to choose from.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Anton Ulyanov (Mlearner)
 */

import Property from '../../axon/js/Property.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import Range from '../../dot/js/Range.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import Utils from '../../dot/js/Utils.js';
import Vector2 from '../../dot/js/Vector2.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import { Circle, DragListener, DragListenerOptions, HBox, InteractiveHighlighting, InteractiveHighlightingOptions, Node, NodeOptions, Path, PressedDragListener, PressListenerEvent, TColor, VBox } from '../../scenery/js/imports.js';
import BooleanRectangularToggleButton from '../../sun/js/buttons/BooleanRectangularToggleButton.js';
import RectangularPushButton from '../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
import DragBoundsProperty from './DragBoundsProperty.js';
import NumberDisplay, { NumberDisplayOptions } from './NumberDisplay.js';
import PauseIconShape from './PauseIconShape.js';
import PhetFont from './PhetFont.js';
import PlayIconShape from './PlayIconShape.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetStrings from './SceneryPhetStrings.js';
import ShadedRectangle from './ShadedRectangle.js';
import Stopwatch from './Stopwatch.js';
import UTurnArrowShape from './UTurnArrowShape.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {

  cursor?: string;
  numberDisplayRange?: Range; // used to size the NumberDisplay
  iconHeight?: number;
  iconFill?: TColor;
  iconLineWidth?: number;
  backgroundBaseColor?: TColor;
  buttonBaseColor?: TColor;
  xSpacing?: number; // horizontal space between the buttons
  ySpacing?: number; // vertical space between readout and buttons
  xMargin?: number;
  yMargin?: number;

  numberDisplayOptions?: NumberDisplayOptions;

  // If provided, the stopwatch is draggable within the bounds. If null, the stopwatch is not draggable.
  dragBoundsProperty?: Property<Bounds2> | null;

  // options propagated to the DragListener
  dragListenerOptions?: DragListenerOptions<PressedDragListener>;
};

type ParentOptions = InteractiveHighlightingOptions & NodeOptions;
export type StopwatchNodeOptions = SelfOptions & StrictOmit<ParentOptions, 'children' | 'interactiveHighlightEnabled'>;

type FormatterOptions = {

  // If true, the time value is converted to minutes and seconds, and the format looks like 59:59.00.
  // If false, time is formatted as a decimal value, like 123.45
  showAsMinutesAndSeconds?: boolean;
  numberOfDecimalPlaces?: number;
  bigNumberFont?: number;
  smallNumberFont?: number;
  unitsFont?: number;
  units?: string | TReadOnlyProperty<string>;
  valueUnitsPattern?: string | TReadOnlyProperty<string>;
};

export default class StopwatchNode extends InteractiveHighlighting( Node ) {

  // options propagated to the NumberDisplay
  private readonly numberDisplay: NumberDisplay;

  // Non-null if draggable. Can be used for forwarding press events when dragging out of a toolbox.
  public readonly dragListener: DragListener | null;

  private readonly disposeStopwatchNode: () => void;

  // We used to use Lucida Console, Arial, but Arial has smaller number width for "11" and hence was causing jitter.
  // Neither Trebuchet MS and Lucida Grande is a monospace font, but the digits all appear to be monospace.
  // Use Trebuchet first, since it has broader cross-platform support.
  // Another advantage of using a non-monospace font (with monospace digits) is that the : and . symbols aren't as
  // wide as the numerals. @ariel-phet and @samreid tested this combination of families on Mac/Chrome and Windows/Chrome
  // and it seemed to work nicely, with no jitter.
  public static readonly NUMBER_FONT_FAMILY = '"Trebuchet MS", "Lucida Grande", monospace';

  public static readonly DEFAULT_FONT = new PhetFont( { size: 20, family: StopwatchNode.NUMBER_FONT_FAMILY } );

  /**
   * A value for options.numberDisplayOptions.numberFormatter where time is interpreted as minutes and seconds.
   * The format is MM:SS.CC, where M=minutes, S=seconds, C=centiseconds. The returned string is plain text, so all
   * digits will be the same size, and the client is responsible for setting the font size.
   */
  public static readonly PLAIN_TEXT_MINUTES_AND_SECONDS = ( time: number ): string => {
    const minutesAndSeconds = toMinutesAndSeconds( time );
    const centiseconds = StopwatchNode.getDecimalPlaces( time, 2 );
    return minutesAndSeconds + centiseconds;
  };

  /**
   * A value for options.numberDisplayOptions.numberFormatter where time is interpreted as minutes and seconds.
   * The format is format MM:SS.cc, where M=minutes, S=seconds, c=centiseconds. The string returned is in RichText
   * format, with the 'c' digits in a smaller font.
   */
  public static readonly RICH_TEXT_MINUTES_AND_SECONDS = StopwatchNode.createRichTextNumberFormatter( {
    showAsMinutesAndSeconds: true,
    numberOfDecimalPlaces: 2
  } );

  public constructor( stopwatch: Stopwatch, providedOptions?: StopwatchNodeOptions ) {

    const options = optionize<StopwatchNodeOptions, SelfOptions, ParentOptions>()( {

      // SelfOptions
      cursor: 'pointer',
      numberDisplayRange: Stopwatch.ZERO_TO_ALMOST_SIXTY, // sized for 59:59.99 (mm:ss) or 3599.99 (decimal)
      iconHeight: 10,
      iconFill: 'black',
      iconLineWidth: 1,
      backgroundBaseColor: 'rgb( 80, 130, 230 )',
      buttonBaseColor: '#DFE0E1',
      xSpacing: 6, // horizontal space between the buttons
      ySpacing: 6, // vertical space between readout and buttons
      xMargin: 8,
      yMargin: 8,
      numberDisplayOptions: {
        numberFormatter: StopwatchNode.RICH_TEXT_MINUTES_AND_SECONDS,
        useRichText: true,
        textOptions: {
          font: StopwatchNode.DEFAULT_FONT
        },
        align: 'right',
        cornerRadius: 4,
        xMargin: 4,
        yMargin: 2,
        pickable: false // allow dragging by the number display
      },
      dragBoundsProperty: null,
      dragListenerOptions: {
        start: _.noop
      },

      // highlight will only be visible if the component is interactive (provide dragBoundsProperty)
      interactiveHighlightEnabled: false,

      // Tandem is required to make sure the buttons are instrumented
      tandem: Tandem.REQUIRED
    }, providedOptions );
    assert && assert( !options.hasOwnProperty( 'maxValue' ), 'options.maxValue no longer supported' );

    assert && assert( options.xSpacing >= 0, 'Buttons cannot overlap' );
    assert && assert( options.ySpacing >= 0, 'Buttons cannot overlap the readout' );

    const numberDisplay = new NumberDisplay( stopwatch.timeProperty, options.numberDisplayRange, options.numberDisplayOptions );

    // Buttons ----------------------------------------------------------------------------

    const resetPath = new Path( new UTurnArrowShape( options.iconHeight ), {
      fill: options.iconFill
    } );

    const playIconHeight = resetPath.height;
    const playIconWidth = 0.8 * playIconHeight;
    const playPath = new Path( new PlayIconShape( playIconWidth, playIconHeight ), {
      fill: options.iconFill
    } );

    const pausePath = new Path( new PauseIconShape( 0.75 * playIconWidth, playIconHeight ), {
      fill: options.iconFill
    } );

    const playPauseButton = new BooleanRectangularToggleButton( stopwatch.isRunningProperty, pausePath, playPath, {
      baseColor: options.buttonBaseColor,
      touchAreaXDilation: 5,
      touchAreaXShift: 5,
      touchAreaYDilation: 8,
      tandem: options.tandem.createTandem( 'playPauseButton' )
    } );

    const resetButton = new RectangularPushButton( {
      listener: () => {
        stopwatch.isRunningProperty.set( false );
        stopwatch.timeProperty.set( 0 );
      },
      touchAreaXDilation: 5,
      touchAreaXShift: -5,
      touchAreaYDilation: 8,
      content: resetPath,
      baseColor: options.buttonBaseColor,
      tandem: options.tandem.createTandem( 'resetButton' )
    } );

    const contents = new VBox( {
      spacing: options.ySpacing,
      children: [
        numberDisplay,
        new HBox( {
          spacing: options.xSpacing,
          children: [ resetButton, playPauseButton ]
        } )
      ]
    } );

    // Background panel ----------------------------------------------------------------------------

    const backgroundNode = new ShadedRectangle( new Bounds2( 0, 0,
      contents.width + 2 * options.xMargin, contents.height + 2 * options.yMargin ), {
      baseColor: options.backgroundBaseColor
    } );
    contents.center = backgroundNode.center;

    options.children = [ backgroundNode, contents ];

    super( options );

    // Disable the reset button when time is zero, and enable the play/pause button when not at the max time
    const timeListener = ( time: number ) => {
      resetButton.enabled = ( time > 0 );
      playPauseButton.enabled = ( time < stopwatch.timeProperty.range.max );
    };
    stopwatch.timeProperty.link( timeListener );

    // Put a red dot at the origin, for debugging layout.
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Circle( 3, { fill: 'red' } ) );
    }

    const stopwatchVisibleListener = ( visible: boolean ) => {
      this.visible = visible;
      if ( visible ) {
        this.moveToFront();
      }
      else {

        // interrupt user interactions when the stopwatch is made invisible
        this.interruptSubtreeInput();
      }
    };
    stopwatch.isVisibleProperty.link( stopwatchVisibleListener );

    // Move to the stopwatch's position
    const stopwatchPositionListener = ( position: Vector2 ) => this.setTranslation( position );
    stopwatch.positionProperty.link( stopwatchPositionListener );

    this.dragListener = null;

    let adjustedDragBoundsProperty: DragBoundsProperty | null = null;
    if ( options.dragBoundsProperty ) {

      // interactive highlights - adding a DragListener to make this interactive, enable highlights for mouse and touch
      this.interactiveHighlightEnabled = true;

      // drag bounds, adjusted to keep this entire Node inside visible bounds
      adjustedDragBoundsProperty = new DragBoundsProperty( this, options.dragBoundsProperty );

      // interrupt user interactions when the visible bounds changes, such as a device orientation change or window resize
      options.dragBoundsProperty.link( () => this.interruptSubtreeInput() );

      // If the stopwatch is outside the drag bounds, move it inside.
      adjustedDragBoundsProperty.link( dragBounds => {
        if ( !dragBounds.containsPoint( stopwatch.positionProperty.value ) ) {
          stopwatch.positionProperty.value = dragBounds.closestPointTo( stopwatch.positionProperty.value );
        }
      } );

      // dragging, added to background so that other UI components get input events on touch devices
      const dragListenerOptions = combineOptions<DragListenerOptions<PressedDragListener>>( {
        targetNode: this,
        positionProperty: stopwatch.positionProperty,
        dragBoundsProperty: adjustedDragBoundsProperty,
        tandem: options.tandem.createTandem( 'dragListener' )
      }, options.dragListenerOptions );

      // Add moveToFront to any start function that the client provided.
      const optionsStart = dragListenerOptions.start!;
      dragListenerOptions.start = ( event: PressListenerEvent, listener: PressedDragListener ) => {
        this.moveToFront();
        optionsStart( event, listener );
      };

      // Dragging, added to background so that other UI components get input events on touch devices.
      // If added to 'this', touchSnag will lock out listeners for other UI components.
      this.dragListener = new DragListener( dragListenerOptions );
      backgroundNode.addInputListener( this.dragListener );

      // Move to front on pointer down, anywhere on this Node, including interactive subcomponents.
      this.addInputListener( {
        down: () => this.moveToFront()
      } );
    }

    this.addLinkedElement( stopwatch, {
      tandem: options.tandem.createTandem( 'stopwatch' )
    } );

    this.disposeStopwatchNode = () => {
      stopwatch.isVisibleProperty.unlink( stopwatchVisibleListener );
      stopwatch.timeProperty.unlink( timeListener );
      stopwatch.positionProperty.unlink( stopwatchPositionListener );

      numberDisplay.dispose();
      resetButton.dispose();
      playPauseButton.dispose();

      if ( this.dragListener ) {
        backgroundNode.removeInputListener( this.dragListener );
        this.dragListener.dispose();
      }

      adjustedDragBoundsProperty && adjustedDragBoundsProperty.dispose();
    };

    this.numberDisplay = numberDisplay;

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'StopwatchNode', this );
  }

  /**
   * Sets the formatter for the NumberDisplay.
   */
  public setNumberFormatter( numberFormatter: ( n: number ) => string ): void {
    this.numberDisplay.setNumberFormatter( numberFormatter );
  }

  // Redraw the text when something other than the numberProperty changes (such as units, formatter, etc).
  public redrawNumberDisplay(): void {
    this.numberDisplay.recomputeText();
  }

  public override dispose(): void {
    this.disposeStopwatchNode();
    super.dispose();
  }

  /**
   * Gets the centiseconds (hundredths-of-a-second) string for a time value.
   */
  public static getDecimalPlaces( time: number, numberDecimalPlaces: number ): string {

    const max = Math.pow( 10, numberDecimalPlaces );

    // Round to the nearest centisecond, see https://github.com/phetsims/masses-and-springs/issues/156
    time = Utils.roundSymmetric( time * max ) / max;

    // Rounding after mod, in case there is floating-point error
    let decimalValue = `${Utils.roundSymmetric( time % 1 * max )}`;
    while ( decimalValue.length < numberDecimalPlaces ) {
      decimalValue = `0${decimalValue}`;
    }
    return `.${decimalValue}`;
  }

  /**
   * Creates a custom value for options.numberDisplayOptions.numberFormatter, passed to NumberDisplay.
   *
   * TODO https://github.com/phetsims/scenery-phet/issues/781
   * Because this is called by NumberDisplay when its valueProperty changes, there's no way to make
   * this API update immediately when options.valueUnitsPattern or options.units changes. The NumberDisplay
   * will not show changes to those strings until the value changes. If this is a problem, we'll need to
   * come up with a new API for updating the NumberDisplay when associated StringProperties change.
   */
  public static createRichTextNumberFormatter( providedOptions?: FormatterOptions ): ( time: number ) => string {

    const options = optionize<FormatterOptions>()( {

      // If true, the time value is converted to minutes and seconds, and the format looks like 59:59.00.
      // If false, time is formatted as a decimal value, like 123.45
      showAsMinutesAndSeconds: true,
      numberOfDecimalPlaces: 2,
      bigNumberFont: 20,
      smallNumberFont: 14,
      unitsFont: 14,
      units: '',

      // Units cannot be baked into the i18n string because they can change independently
      valueUnitsPattern: SceneryPhetStrings.stopwatchValueUnitsPatternStringProperty
    }, providedOptions );

    return ( time: number ) => {
      const minutesAndSeconds = options.showAsMinutesAndSeconds ? toMinutesAndSeconds( time ) : Math.floor( time );
      const centiseconds = StopwatchNode.getDecimalPlaces( time, options.numberOfDecimalPlaces );
      const units = ( typeof options.units === 'string' ) ? options.units : options.units.value;

      // Single quotes around CSS style so the double-quotes in the CSS font family work. Himalaya doesn't like &quot;
      // See https://github.com/phetsims/collision-lab/issues/140.
      return StringUtils.fillIn( options.valueUnitsPattern, {
        value: `<span style='font-size: ${options.bigNumberFont}px; font-family:${StopwatchNode.NUMBER_FONT_FAMILY};'>${minutesAndSeconds}</span><span style='font-size: ${options.smallNumberFont}px;font-family:${StopwatchNode.NUMBER_FONT_FAMILY};'>${centiseconds}</span>`,
        units: `<span style='font-size: ${options.unitsFont}px; font-family:${StopwatchNode.NUMBER_FONT_FAMILY};'>${units}</span>`
      } );
    };
  }
}

/**
 * Converts a time to a string in {{minutes}}:{{seconds}} format.
 */
function toMinutesAndSeconds( time: number ): string {

  // Round to the nearest centi-part (if time is in seconds, this would be centiseconds)
  // see https://github.com/phetsims/masses-and-springs/issues/156
  time = Utils.roundSymmetric( time * 100 ) / 100;

  // When showing units, don't show the "00:" prefix, see https://github.com/phetsims/scenery-phet/issues/378
  const timeInSeconds = time;

  // If no units are provided, then we assume the time is in seconds, and should be shown in mm:ss.cs
  const minutes = Math.floor( timeInSeconds / 60 );
  const seconds = Math.floor( timeInSeconds ) % 60;

  const minutesString = ( minutes < 10 ) ? `0${minutes}` : `${minutes}`;
  const secondsString = ( seconds < 10 ) ? `0${seconds}` : `${seconds}`;
  return `${minutesString}:${secondsString}`;
}

sceneryPhet.register( 'StopwatchNode', StopwatchNode );