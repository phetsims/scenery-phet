// Copyright 2014-2024, University of Colorado Boulder

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
import { Circle, DragListener, HBox, InteractiveHighlighting, InteractiveHighlightingOptions, KeyboardDragListener, Node, NodeOptions, Path, PressListenerEvent, TColor, VBox } from '../../scenery/js/imports.js';
import BooleanRectangularToggleButton, { BooleanRectangularToggleButtonOptions } from '../../sun/js/buttons/BooleanRectangularToggleButton.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../sun/js/buttons/RectangularPushButton.js';
import Tandem from '../../tandem/js/Tandem.js';
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
import TSoundPlayer from '../../tambo/js/TSoundPlayer.js';
import pushButtonSoundPlayer from '../../tambo/js/shared-sound-players/pushButtonSoundPlayer.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';
import RichDragListener, { PressedRichDragListener, RichDragListenerOptions } from '../../scenery-phet/js/RichDragListener.js';
import RichKeyboardDragListener, { RichKeyboardDragListenerOptions } from '../../scenery-phet/js/RichKeyboardDragListener.js';

type SelfOptions = {

  cursor?: string;
  numberDisplayRange?: Range; // used to size the NumberDisplay
  iconHeight?: number;
  iconFill?: TColor;
  iconLineWidth?: number;
  backgroundBaseColor?: TColor;
  buttonBaseColor?: TColor;
  resetButtonSoundPlayer?: TSoundPlayer;
  xSpacing?: number; // horizontal space between the buttons
  ySpacing?: number; // vertical space between readout and buttons
  xMargin?: number;
  yMargin?: number;

  numberDisplayOptions?: NumberDisplayOptions;

  // If provided, the stopwatch is draggable within the bounds. If null, the stopwatch is not draggable.
  dragBoundsProperty?: Property<Bounds2> | null;

  // options propagated to the drag listeners
  dragListenerOptions?: RichDragListenerOptions;
  keyboardDragListenerOptions?: RichKeyboardDragListenerOptions;

  // Passed to their respective buttons
  playPauseButtonOptions?: BooleanRectangularToggleButtonOptions;
  resetButtonOptions?: RectangularPushButtonOptions;

  // See https://github.com/phetsims/scenery-phet/issues/843
  includePlayPauseResetButtons?: boolean;

  // Additional controls to show below the play/pause/rewind buttons in that VBox.
  // See https://github.com/phetsims/scenery-phet/issues/843
  otherControls?: Node[];
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
  public readonly keyboardDragListener: KeyboardDragListener | null;

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

    const options = optionize<StopwatchNodeOptions, StrictOmit<SelfOptions, 'playPauseButtonOptions' | 'resetButtonOptions'>, ParentOptions>()( {

      // SelfOptions
      cursor: 'pointer',
      numberDisplayRange: Stopwatch.ZERO_TO_ALMOST_SIXTY, // sized for 59:59.99 (mm:ss) or 3599.99 (decimal)
      iconHeight: 10,
      iconFill: 'black',
      iconLineWidth: 1,
      backgroundBaseColor: 'rgb( 80, 130, 230 )',
      buttonBaseColor: '#DFE0E1',
      resetButtonSoundPlayer: pushButtonSoundPlayer,
      xSpacing: 6, // horizontal space between the buttons
      ySpacing: 6, // vertical space between readout and buttons
      xMargin: 8,
      yMargin: 8,
      numberDisplayOptions: {
        numberFormatter: StopwatchNode.RICH_TEXT_MINUTES_AND_SECONDS,
        numberFormatterDependencies: [

          // Used in the numberFormatter above
          SceneryPhetStrings.stopwatchValueUnitsPatternStringProperty
        ],
        useRichText: true,
        textOptions: {
          font: StopwatchNode.DEFAULT_FONT
        },
        align: 'right',
        cornerRadius: 4,
        xMargin: 4,
        yMargin: 2,
        maxWidth: 150, // please override as necessary
        pickable: false // allow dragging by the number display
      },
      dragBoundsProperty: null,
      dragListenerOptions: {
        start: _.noop
      },
      keyboardDragListenerOptions: {},

      // highlight will only be visible if the component is interactive (provide dragBoundsProperty)
      interactiveHighlightEnabled: false,

      otherControls: [],

      includePlayPauseResetButtons: true,
      visibleProperty: stopwatch.isVisibleProperty,

      // Tandem is required to make sure the buttons are instrumented
      tandem: Tandem.REQUIRED,
      phetioFeatured: true
    }, providedOptions );
    assert && assert( !options.hasOwnProperty( 'maxValue' ), 'options.maxValue no longer supported' );

    assert && assert( options.xSpacing >= 0, 'Buttons cannot overlap' );
    assert && assert( options.ySpacing >= 0, 'Buttons cannot overlap the readout' );

    const numberDisplay = new NumberDisplay( stopwatch.timeProperty, options.numberDisplayRange, options.numberDisplayOptions );

    let playPauseResetButtonContainer: Node | null = null;
    let disposePlayPauseResetButtons: ( () => void ) | null = null;
    if ( options.includePlayPauseResetButtons ) {

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

      const playPauseButton = new BooleanRectangularToggleButton( stopwatch.isRunningProperty, pausePath, playPath,
        combineOptions<BooleanRectangularToggleButtonOptions>( {
          baseColor: options.buttonBaseColor,
          touchAreaXDilation: 5,
          touchAreaXShift: 5,
          touchAreaYDilation: 8,
          tandem: options.tandem.createTandem( 'playPauseButton' ),
          phetioVisiblePropertyInstrumented: false,
          phetioEnabledPropertyInstrumented: false
        }, options.playPauseButtonOptions ) );

      const resetButton = new RectangularPushButton( combineOptions<RectangularPushButtonOptions>( {
        listener: () => {
          stopwatch.isRunningProperty.set( false );
          stopwatch.timeProperty.set( 0 );
        },
        touchAreaXDilation: 5,
        touchAreaXShift: -5,
        touchAreaYDilation: 8,
        content: resetPath,
        baseColor: options.buttonBaseColor,
        soundPlayer: options.resetButtonSoundPlayer,
        tandem: options.tandem.createTandem( 'resetButton' ),
        phetioVisiblePropertyInstrumented: false,
        phetioEnabledPropertyInstrumented: false
      }, options.resetButtonOptions ) );

      playPauseResetButtonContainer = new HBox( {
        spacing: options.xSpacing,
        children: [ resetButton, playPauseButton ]
      } );

      // Disable the reset button when time is zero, and enable the play/pause button when not at the max time
      const timeListener = ( time: number ) => {
        resetButton.enabled = ( time > 0 );
        playPauseButton.enabled = ( time < stopwatch.timeProperty.range.max );
      };
      stopwatch.timeProperty.link( timeListener );

      disposePlayPauseResetButtons = () => {
        stopwatch.timeProperty.unlink( timeListener );
        resetButton.dispose();
        playPauseButton.dispose();
      };
    }

    const contents = new VBox( {
      spacing: options.ySpacing,
      children: [
        numberDisplay,

        // Include the play/pause and reset buttons if specified in the options
        ...( playPauseResetButtonContainer ? [ playPauseResetButtonContainer ] : [] ),

        // Include any additional controls as specified
        ...options.otherControls
      ]
    } );

    // Background panel ----------------------------------------------------------------------------

    const backgroundNode = new Node();

    contents.boundsProperty.link( () => {
      const bounds = new Bounds2(
        -options.xMargin,
        -options.yMargin,
        contents.width + options.xMargin,
        contents.height + options.yMargin
      );

      backgroundNode.children = [
        new ShadedRectangle( bounds, {
          baseColor: options.backgroundBaseColor,
          tagName: 'div',
          focusable: true
        } )
      ];
    } );

    options.children = [ backgroundNode, contents ];

    super( options );

    // Put a red dot at the origin, for debugging layout.
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Circle( 3, { fill: 'red' } ) );
    }

    const stopwatchVisibleListener = ( visible: boolean ) => {
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
    this.keyboardDragListener = null;

    let adjustedDragBoundsProperty: TReadOnlyProperty<Bounds2> | null = null;
    if ( options.dragBoundsProperty ) {

      // interactive highlights - adding a DragListener to make this interactive, enable highlights for mouse and touch
      this.interactiveHighlightEnabled = true;

      // Adjustment to keep the entire StopwatchNode inside the drag bounds.
      adjustedDragBoundsProperty = new DerivedProperty(
        [ this.boundsProperty, options.dragBoundsProperty ],
        ( thisBounds, dragBounds ) => {

          // Get the origin in the parent coordinate frame, to determine our bounds offsets in that coordinate frame.
          // This way we'll properly handle scaling/rotation/etc.
          const targetOriginInParentCoordinates = this.localToParentPoint( Vector2.ZERO );

          return new Bounds2(
            dragBounds.minX - ( thisBounds.minX - targetOriginInParentCoordinates.x ),
            dragBounds.minY - ( thisBounds.minY - targetOriginInParentCoordinates.y ),
            dragBounds.maxX - ( thisBounds.maxX - targetOriginInParentCoordinates.x ),
            dragBounds.maxY - ( thisBounds.maxY - targetOriginInParentCoordinates.y )
          );
        }, {
          valueComparisonStrategy: 'equalsFunction', // Don't make spurious changes, we often won't be changing.
          strictAxonDependencies: false // see https://github.com/phetsims/scenery-phet/issues/832
        } );

      // interrupt user interactions when the visible bounds changes, such as a device orientation change or window resize
      options.dragBoundsProperty.link( () => this.interruptSubtreeInput() );

      // If the stopwatch is outside the drag bounds, move it inside.
      adjustedDragBoundsProperty.link( dragBounds => {
        if ( !dragBounds.containsPoint( stopwatch.positionProperty.value ) ) {
          stopwatch.positionProperty.value = dragBounds.closestPointTo( stopwatch.positionProperty.value );
        }
      } );

      // dragging, added to background so that other UI components get input events on touch devices
      const dragListenerOptions = combineOptions<RichDragListenerOptions>( {
        targetNode: this,
        positionProperty: stopwatch.positionProperty,
        dragBoundsProperty: adjustedDragBoundsProperty,
        tandem: options.tandem.createTandem( 'dragListener' )
      }, options.dragListenerOptions );

      // Add moveToFront to any start function that the client provided.
      const optionsStart = dragListenerOptions.start!;
      dragListenerOptions.start = ( event: PressListenerEvent, listener: PressedRichDragListener ) => {
        this.moveToFront();
        optionsStart( event, listener );
      };

      // Dragging, added to background so that other UI components get input events on touch devices.
      // If added to 'this', touchSnag will lock out listeners for other UI components.
      this.dragListener = new RichDragListener( dragListenerOptions );
      backgroundNode.addInputListener( this.dragListener );

      const keyboardDragListenerOptions = combineOptions<RichKeyboardDragListenerOptions>( {
        positionProperty: stopwatch.positionProperty,
        dragBoundsProperty: adjustedDragBoundsProperty,
        tandem: options.tandem.createTandem( 'keyboardDragListener' )
      }, options.keyboardDragListenerOptions );

      this.keyboardDragListener = new RichKeyboardDragListener( keyboardDragListenerOptions );
      this.addInputListener( this.keyboardDragListener );

      // The group focus highlight makes it clear the stopwatch is highlighted even if the children are focused
      this.groupFocusHighlight = true;

      // Move to front on pointer down, anywhere on this Node, including interactive subcomponents.
      this.addInputListener( {
        down: () => this.moveToFront()
      } );
      backgroundNode.addInputListener( {
        focus: () => this.moveToFront()
      } );
    }

    this.addLinkedElement( stopwatch, {
      tandemName: 'stopwatch'
    } );

    this.disposeStopwatchNode = () => {
      stopwatch.isVisibleProperty.unlink( stopwatchVisibleListener );
      stopwatch.positionProperty.unlink( stopwatchPositionListener );

      numberDisplay.dispose();

      if ( this.dragListener ) {
        backgroundNode.removeInputListener( this.dragListener );
        this.dragListener.dispose();
      }
      if ( this.keyboardDragListener ) {
        this.removeInputListener( this.keyboardDragListener );
        this.keyboardDragListener.dispose();
      }

      adjustedDragBoundsProperty && adjustedDragBoundsProperty.dispose();
      disposePlayPauseResetButtons && disposePlayPauseResetButtons();
    };

    this.numberDisplay = numberDisplay;

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet?.chipper?.queryParameters?.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'StopwatchNode', this );
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
   * Creates a custom value for options.numberDisplayOptions.numberFormatter, passed to NumberDisplay. When using
   * this method, you will also need to use NumberDisplayOptions.numberFormatterDependencies, to tell NumberDisplay
   * about the dependencies herein. See https://github.com/phetsims/scenery-phet/issues/781.
   * This will typically be something like:
   *
   * numberFormatter: StopwatchNode.createRichTextNumberFormatter( {
   *   units: unitsProperty,
   *   ...
   * } ),
   * numberFormatterDependencies: [
   *   SceneryPhetStrings.stopwatchValueUnitsPatternStringProperty,
   *   unitsProperty
   * ],
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

      const fontSize = `${options.smallNumberFont}px`;

      // Single quotes around CSS style so the double-quotes in the CSS font family work. Himalaya doesn't like &quot;
      // See https://github.com/phetsims/collision-lab/issues/140.
      return StringUtils.fillIn( options.valueUnitsPattern, {
        value: `<span style='font-size: ${options.bigNumberFont}px; font-family:${StopwatchNode.NUMBER_FONT_FAMILY};'>${minutesAndSeconds}</span><span style='font-size: ${fontSize};font-family:${StopwatchNode.NUMBER_FONT_FAMILY};'>${centiseconds}</span>`,
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