// Copyright 2014-2021, University of Colorado Boulder

/**
 * NumberPicker is a UI component for picking a number value from a range.
 * This is actually a number spinner, but PhET refers to it as a 'picker', so that's what this class is named.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import EnumerationProperty from '../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../axon/js/NumberProperty.js';
import Property from '../../axon/js/Property.js';
import Dimension2 from '../../dot/js/Dimension2.js';
import Range from '../../dot/js/Range.js';
import Utils from '../../dot/js/Utils.js';
import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import Enumeration from '../../phet-core/js/Enumeration.js';
import merge from '../../phet-core/js/merge.js';
import FocusHighlightPath from '../../scenery/js/accessibility/FocusHighlightPath.js';
import FireListener from '../../scenery/js/listeners/FireListener.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Text from '../../scenery/js/nodes/Text.js';
import SceneryConstants from '../../scenery/js/SceneryConstants.js';
import Color from '../../scenery/js/util/Color.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import PaintColorProperty from '../../scenery/js/util/PaintColorProperty.js';
import AccessibleNumberSpinner from '../../sun/js/accessibility/AccessibleNumberSpinner.js';
import generalBoundaryBoopSoundPlayer from '../../tambo/js/shared-sound-players/generalBoundaryBoopSoundPlayer.js';
import generalSoftClickSoundPlayer from '../../tambo/js/shared-sound-players/generalSoftClickSoundPlayer.js';
import PhetioObject from '../../tandem/js/PhetioObject.js';
import Tandem from '../../tandem/js/Tandem.js';
import MathSymbols from './MathSymbols.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const ButtonState = Enumeration.byKeys( [ 'UP', 'DOWN', 'OVER', 'OUT' ] );

class NumberPicker extends Node {

  /**
   * @param {Property.<number>} valueProperty
   * @param {Property.<Range>} rangeProperty - If the range is anticipated to change, it's best to have the range
   *                                           Property contain the (maximum) union of all potential changes, so that
   *                                           NumberPicker can iterate through all possible values and compute the
   *                                           bounds of the labels.
   * @param {Object} [options]
   * @mixes AccessibleNumberSpinner
   */
  constructor( valueProperty, rangeProperty, options ) {

    options = merge( {
      cursor: 'pointer',
      color: new Color( 0, 0, 255 ), // {ColorDef} color of arrows, and top/bottom gradient on pointer over
      backgroundColor: 'white', // {ColorDef} color of the background when pointer is not over it
      cornerRadius: 6,
      xMargin: 3,
      yMargin: 3,
      decimalPlaces: 0,
      font: new PhetFont( 24 ),
      incrementFunction: value => value + 1,
      decrementFunction: value => value - 1,
      timerDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      timerInterval: 100, // fire continuously at this frequency (milliseconds),
      noValueString: MathSymbols.NO_VALUE, // string to display if valueProperty.get is null or undefined
      align: 'center', // horizontal alignment of the value, 'center'|'right'|'left'
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      mouseAreaXDilation: 0,
      mouseAreaYDilation: 5,
      backgroundStroke: 'gray',
      backgroundLineWidth: 0.5,
      arrowHeight: 6,
      arrowYSpacing: 3,
      arrowStroke: 'black',
      arrowLineWidth: 0.25,
      valueMaxWidth: null, // {number|null} - If non-null, it will cap the value's maxWidth to this value

      /**
       * Converts a value to a string to be displayed in a Text node. NOTE: If this function can give different strings
       * to the same value depending on external state, it is recommended to rebuild the NumberPicker when that state
       * changes (as it uses formatValue over the initial range to determine the bounds that labels can take).
       *
       * @param {number} value - the current value
       * @returns {string}
       */
      formatValue: value => Utils.toFixed( value, options.decimalPlaces ),

      /**
       * {function(SceneryEvent)}
       * Listener that is called when the value changes due to user interaction with this number picker.
       */
      onChange: _.noop,

      /**
       * Determines whether the increment arrow is enabled.
       * @param {number} value - the current value
       * @param {Range} range - the picker's range
       * @returns {boolean}
       */
      incrementEnabledFunction: ( value, range ) => ( value !== null && value !== undefined && value < range.max ),

      /**
       * Determines whether the decrement arrow is enabled.
       * @param {number} value - the current value
       * @param {Range} range - the picker's range
       * @returns {boolean}
       */
      decrementEnabledFunction: ( value, range ) => ( value !== null && value !== undefined && value > range.min ),

      // Opacity used to indicate disabled, [0,1] exclusive
      disabledOpacity: SceneryConstants.DISABLED_OPACITY,

      // {Playable} - Sound generators for when the NumberPicker's value changes, and when it hits range extremities.
      // Use Playable.NO_SOUND to disable.
      valueChangedSoundPlayer: generalSoftClickSoundPlayer,
      boundarySoundPlayer: generalBoundaryBoopSoundPlayer,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioReadOnly: PhetioObject.DEFAULT_OPTIONS.phetioReadOnly,
      visiblePropertyOptions: { phetioFeatured: true },
      phetioEnabledPropertyInstrumented: true, // opt into default PhET-iO instrumented enabledProperty

      // pdom (passed to AccessibleNumberSpinner)
      pageKeyboardStep: 2 // {number} - change in value when using page up/page down, see AccessibleNumberSpinner
    }, options );

    // {ColorDef} color of arrows and top/bottom gradient when pressed
    let colorProperty = null;
    if ( options.pressedColor === undefined ) {
      colorProperty = new PaintColorProperty( options.color ); // dispose required!

      // No reference needs to be kept, since we dispose its dependency.
      options.pressedColor = new DerivedProperty( [ colorProperty ], color => color.darkerColor() );
    }

    super();

    // Overwrite the passed in change listener to make sure that sound implementation can't be blown away in the defaults.
    const passedInChangeListener = options.onChange;
    options.onChange = () => {
      passedInChangeListener();

      // Play the boundary sound If the value is at min or max, otherwise play the default sound.
      if ( valueProperty.value === rangeProperty.get().max || valueProperty.value === rangeProperty.get().min ) {
        options.boundarySoundPlayer.play();
      }
      else {
        options.valueChangedSoundPlayer.play();
      }
    };

    //------------------------------------------------------------
    // Properties

    const incrementButtonStateProperty = new EnumerationProperty( ButtonState, ButtonState.UP );
    const decrementButtonStateProperty = new EnumerationProperty( ButtonState, ButtonState.UP );

    // must be disposed
    const incrementEnabledProperty = new DerivedProperty( [ valueProperty, rangeProperty ], options.incrementEnabledFunction );

    // must be disposed
    const decrementEnabledProperty = new DerivedProperty( [ valueProperty, rangeProperty ], options.decrementEnabledFunction );

    //------------------------------------------------------------
    // Nodes

    // displays the value
    const valueNode = new Text( '', { font: options.font, pickable: false } );

    // compute max width of text based on the width of all possible values.
    // See https://github.com/phetsims/area-model-common/issues/5
    let currentSampleValue = rangeProperty.get().min;
    const sampleValues = [];
    while ( currentSampleValue <= rangeProperty.get().max ) {
      sampleValues.push( currentSampleValue );
      currentSampleValue = options.incrementFunction( currentSampleValue );
      assert && assert( sampleValues.length < 500000, 'Don\'t infinite loop here' );
    }
    let maxWidth = Math.max.apply( null, sampleValues.map( value => {
      valueNode.text = options.formatValue( value );
      return valueNode.width;
    } ) );
    // Cap the maxWidth if valueMaxWidth is provided, see https://github.com/phetsims/scenery-phet/issues/297
    if ( options.valueMaxWidth !== null ) {
      maxWidth = Math.min( maxWidth, options.valueMaxWidth );
    }

    // compute shape of the background behind the numeric value
    const backgroundWidth = maxWidth + ( 2 * options.xMargin );
    const backgroundHeight = valueNode.height + ( 2 * options.yMargin );
    const backgroundOverlap = 1;
    const backgroundCornerRadius = options.cornerRadius;

    // Apply the max-width AFTER computing the backgroundHeight, so it doesn't shrink vertically
    valueNode.maxWidth = maxWidth;

    // Top half of the background. Pressing here will increment the value.
    // Shape computed starting at upper-left, going clockwise.
    const incrementBackgroundNode = new Path( new Shape()
        .arc( backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, Math.PI, Math.PI * 3 / 2, false )
        .arc( backgroundWidth - backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, -Math.PI / 2, 0, false )
        .lineTo( backgroundWidth, ( backgroundHeight / 2 ) + backgroundOverlap )
        .lineTo( 0, ( backgroundHeight / 2 ) + backgroundOverlap )
        .close(),
      { pickable: false } );

    // Bottom half of the background. Pressing here will decrement the value.
    // Shape computed starting at bottom-right, going clockwise.
    const decrementBackgroundNode = new Path( new Shape()
        .arc( backgroundWidth - backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, 0, Math.PI / 2, false )
        .arc( backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, Math.PI / 2, Math.PI, false )
        .lineTo( 0, backgroundHeight / 2 )
        .lineTo( backgroundWidth, backgroundHeight / 2 )
        .close(),
      { pickable: false } );

    // separate rectangle for stroke around value background
    const strokedBackground = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, backgroundCornerRadius, backgroundCornerRadius, {
      pickable: false,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } );

    // compute size of arrows
    const arrowButtonSize = new Dimension2( 0.5 * backgroundWidth, options.arrowHeight );

    const arrowOptions = {
      stroke: options.arrowStroke,
      lineWidth: options.arrowLineWidth,
      pickable: false
    };

    // @private increment arrow, pointing up, described clockwise from tip
    this.incrementArrow = new Path( new Shape()
        .moveTo( arrowButtonSize.width / 2, 0 )
        .lineTo( arrowButtonSize.width, arrowButtonSize.height )
        .lineTo( 0, arrowButtonSize.height )
        .close(),
      arrowOptions );
    this.incrementArrow.centerX = incrementBackgroundNode.centerX;
    this.incrementArrow.bottom = incrementBackgroundNode.top - options.arrowYSpacing;

    // @private decrement arrow, pointing down, described clockwise from the tip
    this.decrementArrow = new Path( new Shape()
        .moveTo( arrowButtonSize.width / 2, arrowButtonSize.height )
        .lineTo( 0, 0 )
        .lineTo( arrowButtonSize.width, 0 )
        .close(),
      arrowOptions );
    this.decrementArrow.centerX = decrementBackgroundNode.centerX;
    this.decrementArrow.top = decrementBackgroundNode.bottom + options.arrowYSpacing;

    // parents for increment and decrement components
    const incrementParent = new Node( { children: [ incrementBackgroundNode, this.incrementArrow ] } );
    incrementParent.addChild( new Rectangle( incrementParent.localBounds ) ); // invisible overlay
    const decrementParent = new Node( { children: [ decrementBackgroundNode, this.decrementArrow ] } );
    decrementParent.addChild( new Rectangle( decrementParent.localBounds ) ); // invisible overlay

    // rendering order
    this.addChild( incrementParent );
    this.addChild( decrementParent );
    this.addChild( strokedBackground );
    this.addChild( valueNode );

    //------------------------------------------------------------
    // Pointer areas

    // touch areas
    incrementParent.touchArea = Shape.rectangle(
      incrementParent.left - ( options.touchAreaXDilation / 2 ), incrementParent.top - options.touchAreaYDilation,
      incrementParent.width + options.touchAreaXDilation, incrementParent.height + options.touchAreaYDilation );
    decrementParent.touchArea = Shape.rectangle(
      decrementParent.left - ( options.touchAreaXDilation / 2 ), decrementParent.top,
      decrementParent.width + options.touchAreaXDilation, decrementParent.height + options.touchAreaYDilation );

    // mouse areas
    incrementParent.mouseArea = Shape.rectangle(
      incrementParent.left - ( options.mouseAreaXDilation / 2 ), incrementParent.top - options.mouseAreaYDilation,
      incrementParent.width + options.mouseAreaXDilation, incrementParent.height + options.mouseAreaYDilation );
    decrementParent.mouseArea = Shape.rectangle(
      decrementParent.left - ( options.mouseAreaXDilation / 2 ), decrementParent.top,
      decrementParent.width + options.mouseAreaXDilation, decrementParent.height + options.mouseAreaYDilation );

    //------------------------------------------------------------
    // Colors

    // arrow colors, corresponding to ButtonState and incrementEnabledProperty/decrementEnabledProperty
    const arrowColors = {
      up: options.color,
      over: options.color,
      down: options.pressedColor,
      out: options.color,
      disabled: 'rgb(176,176,176)'
    };

    // background colors, corresponding to ButtonState and enabledProperty.value
    const highlightGradient = createVerticalGradient( options.color, options.backgroundColor, options.color, backgroundHeight );
    const pressedGradient = createVerticalGradient( options.pressedColor, options.backgroundColor, options.pressedColor, backgroundHeight );
    const backgroundColors = {
      up: options.backgroundColor,
      over: highlightGradient,
      down: pressedGradient,
      out: pressedGradient,
      disabled: options.backgroundColor
    };

    //------------------------------------------------------------
    // Observers and InputListeners

    const inputListenerOptions = {
      fireOnHold: true,
      fireOnHoldDelay: options.timerDelay,
      fireOnHoldInterval: options.timerInterval
    };

    // @private
    this.incrementInputListener = new NumberPickerInputListener( incrementButtonStateProperty, merge( {
      tandem: options.tandem.createTandem( 'incrementInputListener' ),
      fire: event => {
        valueProperty.set( Math.min( options.incrementFunction( valueProperty.get() ), rangeProperty.get().max ) );
        options.onChange( event );
      }
    }, inputListenerOptions ) );
    incrementParent.addInputListener( this.incrementInputListener );

    // @private
    this.decrementInputListener = new NumberPickerInputListener( decrementButtonStateProperty, merge( {
      tandem: options.tandem.createTandem( 'decrementInputListener' ),
      fire: event => {
        valueProperty.set( Math.max( options.decrementFunction( valueProperty.get() ), rangeProperty.get().min ) );
        options.onChange( event );
      }
    }, inputListenerOptions ) );
    decrementParent.addInputListener( this.decrementInputListener );

    // enable/disable listeners and interaction: unlink unnecessary, Properties are owned by this instance
    incrementEnabledProperty.link( enabled => {
      !enabled && this.incrementInputListener.interrupt();
      incrementParent.pickable = enabled;
    } );
    decrementEnabledProperty.link( enabled => {
      !enabled && this.decrementInputListener.interrupt();
      decrementParent.pickable = enabled;
    } );

    // Update text to match the value
    const valueObserver = value => {
      if ( value === null || value === undefined ) {
        valueNode.text = options.noValueString;
        valueNode.x = ( backgroundWidth - valueNode.width ) / 2; // horizontally centered
      }
      else {
        valueNode.text = options.formatValue( value );
        if ( options.align === 'center' ) {
          valueNode.centerX = incrementBackgroundNode.centerX;
        }
        else if ( options.align === 'right' ) {
          valueNode.right = incrementBackgroundNode.right - options.xMargin;
        }
        else if ( options.align === 'left' ) {
          valueNode.left = incrementBackgroundNode.left + options.xMargin;
        }
        else {
          throw new Error( `unsupported value for options.align: ${options.align}` );
        }
      }
      valueNode.centerY = backgroundHeight / 2;
    };
    valueProperty.link( valueObserver ); // must be unlinked in dispose

    // @private update colors for increment components
    Property.multilink( [ incrementButtonStateProperty, incrementEnabledProperty ], ( state, enabled ) => {
      updateColors( state, enabled, incrementBackgroundNode, this.incrementArrow, backgroundColors, arrowColors );
    } );

    // @private update colors for decrement components
    Property.multilink( [ decrementButtonStateProperty, decrementEnabledProperty ], ( state, enabled ) => {
      updateColors( state, enabled, decrementBackgroundNode, this.decrementArrow, backgroundColors, arrowColors );
    } );

    this.mutate( options );

    // Dilate based on consistent technique which brings into account transform of this node.
    const focusBounds = this.localBounds.dilated( FocusHighlightPath.getDilationCoefficient( this ) );

    // pdom - custom focus highlight that matches rounded background behind the numeric value
    this.focusHighlight = new FocusHighlightPath( Shape.roundedRectangleWithRadii(
      focusBounds.minX,
      focusBounds.minY,
      focusBounds.width,
      focusBounds.height, {
        topLeft: options.cornerRadius,
        topRight: options.cornerRadius,
        bottomLeft: options.cornerRadius,
        bottomRight: options.cornerRadius
      } )
    );

    // Initialize accessibility features. This must reach into incrementFunction to get the delta.
    // Both normal arrow and shift arrow keys use the delta computed with incrementFunction.
    const keyboardStep = options.incrementFunction( valueProperty.get() ) - valueProperty.get();
    this.initializeAccessibleNumberSpinner( valueProperty, rangeProperty, this.enabledProperty, merge( {
      keyboardStep: keyboardStep,
      shiftKeyboardStep: keyboardStep
    }, options ) );

    // update style with keyboard input, Emitters owned by this instance and disposed in AccessibleNumberSpinner
    this.incrementDownEmitter.addListener( isDown => {
      incrementButtonStateProperty.value = ( isDown ? ButtonState.DOWN : ButtonState.UP );
    } );
    this.decrementDownEmitter.addListener( isDown => {
      decrementButtonStateProperty.value = ( isDown ? ButtonState.DOWN : ButtonState.UP );
    } );

    this.addLinkedElement( valueProperty, {
      tandem: options.tandem.createTandem( 'valueProperty' )
    } );

    // @private
    this.disposeNumberPicker = () => {

      colorProperty && colorProperty.dispose();
      incrementEnabledProperty.dispose();
      decrementEnabledProperty.dispose();

      if ( valueProperty.hasListener( valueObserver ) ) {
        valueProperty.unlink( valueObserver );
      }

      // pdom mixin
      this.disposeAccessibleNumberSpinner();
    };

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'NumberPicker', this );
  }

  /**
   * @public
   * @param {number} value
   * @param {Object} [options]
   * @returns {NumberPicker}
   */
  static createIcon( value, options ) {
    options = merge( {

      // Highlight the increment button
      highlightIncrement: false,

      // Highlight the decrement button
      highlightDecrement: false,

      range: new Range( value - 1, value + 1 ),
      numberPickerOptions: {
        pickable: false,

        // phet-io
        tandem: Tandem.OPT_OUT // by default, icons don't need instrumentation
      }
    }, options );

    const numberPicker = new NumberPicker( new NumberProperty( value ), new Property( options.range ), options.numberPickerOptions );

    // we don't want this icon to have keyboard navigation, or description in the PDOM.
    numberPicker.removeFromPDOM();

    if ( options.highlightDecrement ) {
      numberPicker.decrementInputListener.isOverProperty.value = true;
    }
    if ( options.highlightIncrement ) {
      numberPicker.incrementInputListener.isOverProperty.value = true;
    }
    return numberPicker;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeNumberPicker();
    super.dispose();
  }

  /**
   * Sets visibility of the arrows.
   * @param {boolean} visible
   * @public
   */
  setArrowsVisible( visible ) {
    if ( !visible ) {
      this.incrementInputListener.interrupt();
      this.decrementInputListener.interrupt();
    }
    this.incrementArrow.visible = visible;
    this.decrementArrow.visible = visible;
  }
}

sceneryPhet.register( 'NumberPicker', NumberPicker );

/**
 * Converts FireListener events to state changes.
 */
class NumberPickerInputListener extends FireListener {

  /**
   * @param {EnumerationProperty.<ButtonState>} buttonStateProperty
   * @param {Object} [options]
   */
  constructor( buttonStateProperty, options ) {
    super( options );
    Property.multilink(
      [ this.isOverProperty, this.isPressedProperty ],
      ( isOver, isPressed ) => {
        buttonStateProperty.set(
          isOver && !isPressed ? ButtonState.OVER :
          isOver && isPressed ? ButtonState.DOWN :
          !isOver && !isPressed ? ButtonState.UP :
          !isOver && isPressed ? ButtonState.OUT :
          assert && assert( 'bad state' )
        );
      } );
  }
}

/**
 * Creates a vertical gradient.
 * @param {ColorDef} topColor
 * @param {ColorDef} centerColor
 * @param {ColorDef} bottomColor
 * @param {number} height
 * @returns {LinearGradient}
 */
function createVerticalGradient( topColor, centerColor, bottomColor, height ) {
  return new LinearGradient( 0, 0, 0, height )
    .addColorStop( 0, topColor )
    .addColorStop( 0.5, centerColor )
    .addColorStop( 1, bottomColor );
}

/**
 * Updates arrow and background colors
 * @param {ButtonState} buttonState
 * @param {boolean} enabled
 * @param {ColorDef} background
 * @param {Path} arrow
 * @param {Object} backgroundColors - see backgroundColors in constructor
 * @param {Object} arrowColors - see arrowColors in constructor
 */
function updateColors( buttonState, enabled, background, arrow, backgroundColors, arrowColors ) {
  if ( enabled ) {
    arrow.stroke = 'black';
    if ( buttonState === ButtonState.UP ) {
      background.fill = backgroundColors.up;
      arrow.fill = arrowColors.up;
    }
    else if ( buttonState === ButtonState.OVER ) {
      background.fill = backgroundColors.over;
      arrow.fill = arrowColors.over;
    }
    else if ( buttonState === ButtonState.DOWN ) {
      background.fill = backgroundColors.down;
      arrow.fill = arrowColors.down;
    }
    else if ( buttonState === ButtonState.OUT ) {
      background.fill = backgroundColors.out;
      arrow.fill = arrowColors.out;
    }
    else {
      throw new Error( `unsupported buttonState: ${buttonState}` );
    }
  }
  else {
    background.fill = backgroundColors.disabled;
    arrow.fill = arrowColors.disabled;
    arrow.stroke = arrowColors.disabled; // stroke so that arrow size will look the same when it's enabled/disabled
  }
}

AccessibleNumberSpinner.mixInto( NumberPicker );

export default NumberPicker;