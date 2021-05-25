// Copyright 2015-2021, University of Colorado Boulder

/**
 * Displays a Property of type {number} in a background rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../dot/js/Utils.js';
import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import RichText from '../../scenery/js/nodes/RichText.js';
import Text from '../../scenery/js/nodes/Text.js';
import SunConstants from '../../sun/js/SunConstants.js';
import Tandem from '../../tandem/js/Tandem.js';
import IOType from '../../tandem/js/types/IOType.js';
import MathSymbols from './MathSymbols.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_FONT = new PhetFont( 20 );

// valid values for options.align and options.noValueAlign
const ALIGN_VALUES = [ 'center', 'left', 'right' ];

const DEFAULT_DECIMAL_PLACES = 0;

class NumberDisplay extends Node {

  /**
   * @param {Property.<number|null>} numberProperty
   * @param {Range} displayRange - this range, with options.decimals or numberFormatter applied, is used to determine
   *                             - the display width. It is unrelated to the range of numberProperty.
   * @param {Object} [options]
   */
  constructor( numberProperty, displayRange, options ) {

    options = merge( {
      align: 'right', // see ALIGN_VALUES

      // {string} Pattern used to format the value.
      // Must contain SunConstants.VALUE_NAMED_PLACEHOLDER or SunConstants.VALUE_NUMBERED_PLACEHOLDER.
      valuePattern: SunConstants.VALUE_NAMED_PLACEHOLDER,

      // {number|null} the number of decimal places to show. If null, the full value is displayed.
      // We attempted to change the default to null, but there were too many usages that relied on the 0 default.
      // See https://github.com/phetsims/scenery-phet/issues/511
      decimalPlaces: DEFAULT_DECIMAL_PLACES,

      // {function} Takes a {number} and returns a {string} for full control. Mutually exclusive with valuePattern and
      // decimalPlaces.  Named "numberFormatter" instead of "formatter" to help clarify that it is separate from the
      // noValueString/Align/Pattern defined below.
      numberFormatter: null,

      useRichText: false,

      // {boolean} - If set to true, the smaller text height (from applying the maxWidth) will NOT be used, and instead
      // the height of the text (as if there was no maxWidth) will be used for layout and the background.
      // See https://github.com/phetsims/density/issues/34.
      useFullHeight: false,

      // options passed to Text or RichText (depending on the value of options.useRichText) that displays the value
      textOptions: {
        font: DEFAULT_FONT,
        fill: 'black',
        maxWidth: null, // {number|null} if null, then it will be computed based on displayRange
        phetioReadOnly: true
      },

      xMargin: 8,
      yMargin: 2,
      cornerRadius: 0,
      backgroundFill: 'white',
      backgroundStroke: 'lightGray',
      backgroundLineWidth: 1,
      backgroundLineDash: [],
      minBackgroundWidth: 0,

      // options related to display when numberProperty.value === null
      noValueString: MathSymbols.NO_VALUE, // {string} default is the PhET standard, do no override lightly.
      noValueAlign: null, // {string|null} see ALIGN_VALUES. If null, defaults to options.align
      noValuePattern: null, // {string|null} If null, defaults to options.valuePattern

      // phet-io
      tandem: Tandem.OPTIONAL,
      phetioType: NumberDisplay.NumberDisplayIO
    }, options );

    // valuePattern|decimalPlaces is mutually exclusive with numberFormatter
    if ( assert ) {
      const numberFormatterProvided = !!options.numberFormatter;
      const decimalPlacesProvided = options.decimalPlaces !== DEFAULT_DECIMAL_PLACES;
      const valuePatternProvided = options.valuePattern !== SunConstants.VALUE_NAMED_PLACEHOLDER;
      const decimalOrValueProvided = decimalPlacesProvided || valuePatternProvided;
      if ( numberFormatterProvided || decimalOrValueProvided ) {
        assert && assert( numberFormatterProvided !== decimalOrValueProvided,
          'options.numberFormatter is mutually exclusive with options.valuePattern and options.decimalPlaces' );
      }
    }

    assert && assert( !options.hasOwnProperty( 'unitsNode' ), 'unitsNode is not a supported option' );

    // Set default alignments and validate
    assert && assert( _.includes( ALIGN_VALUES, options.align ), `invalid align: ${options.align}` );
    if ( !options.noValueAlign ) {
      options.noValueAlign = options.align;
    }
    assert && assert( _.includes( ALIGN_VALUES, options.noValueAlign ), `invalid noValueAlign: ${options.noValueAlign}` );
    assert && assert( options.textOptions, 'did you accidentally set textOptions to null?' );

    // Support numbered (old-style) placeholder by replacing it with the corresponding named placeholder.
    // See https://github.com/phetsims/scenery-phet/issues/446
    if ( options.valuePattern.indexOf( SunConstants.VALUE_NUMBERED_PLACEHOLDER ) !== -1 ) {
      options.valuePattern = StringUtils.format( options.valuePattern, SunConstants.VALUE_NAMED_PLACEHOLDER );
    }
    assert && assert( !!phet.chipper.queryParameters.stringTest ||
                      options.valuePattern.indexOf( SunConstants.VALUE_NAMED_PLACEHOLDER ) !== -1,
      `missing value placeholder in options.valuePattern: ${options.valuePattern}` );

    // Set default and validate
    if ( !options.noValuePattern ) {
      options.noValuePattern = options.valuePattern;
    }
    assert && assert( !!phet.chipper.queryParameters.stringTest ||
                      options.noValuePattern.indexOf( SunConstants.VALUE_NAMED_PLACEHOLDER ) !== -1,
      `missing value placeholder in options.noValuePattern: ${options.noValuePattern}` );

    // determine the widest value
    const minString = valueToString( displayRange.min, options.decimalPlaces, options.noValueString, options.numberFormatter );
    const maxString = valueToString( displayRange.max, options.decimalPlaces, options.noValueString, options.numberFormatter );
    const longestString = StringUtils.fillIn( options.valuePattern, {
      value: ( ( minString.length > maxString.length ) ? minString : maxString )
    } );

    // value
    const Constructor = options.useRichText ? RichText : Text;
    const valueText = new Constructor( longestString, merge( {
      tandem: options.tandem.createTandem( 'valueText' )
    }, options.textOptions, {
      maxWidth: null // we are handling maxWidth manually, so we don't want to provide it initially.
    } ) );

    const originalTextHeight = valueText.height;

    // Manually set maxWidth later, adjusting it to the width of the longest string if it's null
    valueText.maxWidth = options.textOptions.maxWidth === null ? valueText.width : options.textOptions.maxWidth;

    const backgroundWidth = Math.max( options.minBackgroundWidth, valueText.width + 2 * options.xMargin );
    const backgroundHeight = ( options.useFullHeight ? originalTextHeight : valueText.height ) + 2 * options.yMargin;

    // background rectangle
    const backgroundNode = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, {
      cornerRadius: options.cornerRadius,
      fill: options.backgroundFill,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth,
      lineDash: options.backgroundLineDash
    } );

    options.children = [ backgroundNode, valueText ];

    super();

    // @private
    this.numberFormatter = options.numberFormatter;

    // Display the value.
    const numberObserver = value => {
      const valuePattern = ( value === null ) ? options.noValuePattern : options.valuePattern;
      const stringValue = valueToString( value, options.decimalPlaces, options.noValueString, this.numberFormatter );
      valueText.text = StringUtils.fillIn( valuePattern, {
        value: stringValue
      } );
    };
    numberProperty.link( numberObserver );

    // Align the value in the background.
    valueText.boundsProperty.link( () => {

      // Alignment depends on whether we have a non-null value.
      const align = ( numberProperty.value === null ) ? options.noValueAlign : options.align;

      // horizontal alignment
      if ( align === 'center' ) {
        valueText.centerX = backgroundNode.centerX;
      }
      else if ( align === 'left' ) {
        valueText.left = backgroundNode.left + options.xMargin;
      }
      else { // right
        valueText.right = backgroundNode.right - options.xMargin;
      }

      // vertical alignment
      valueText.centerY = backgroundNode.centerY;
    } );

    this.mutate( options );

    // @private
    this.valueText = valueText;

    // @private
    this.backgroundNode = backgroundNode;

    // @private
    this._recomputeText = () => numberObserver( numberProperty.value );

    // @private called by dispose
    this.disposeNumberDisplay = () => numberProperty.unlink( numberObserver );
  }

  /**
   * @param {function(number):string} numberFormatter
   * @public
   */
  setNumberFormatter( numberFormatter ) {
    this.numberFormatter = numberFormatter;
    this.recomputeText();
  }

  // @public - redraw the text when something other than the numberProperty changes (such as units, formatter, etc).
  recomputeText() {
    this._recomputeText();
  }

  // @public
  dispose() {
    this.disposeNumberDisplay();
    super.dispose();
  }

  /**
   * Sets the number text font.
   * @param {Font} font
   * @public
   */
  setNumberFont( font ) {
    this.valueText.font = font;
  }

  set numberFont( value ) { this.setNumberFont( value ); }

  /**
   * Sets the number text fill.
   * @param {ColorDef} fill
   * @public
   */
  setNumberFill( fill ) {
    this.valueText.fill = fill;
  }

  set numberFill( value ) { this.setNumberFill( value ); }

  /**
   * Sets the background fill.
   * @param {ColorDef} fill
   * @public
   */
  setBackgroundFill( fill ) {
    this.backgroundNode.fill = fill;
  }

  set backgroundFill( value ) { this.setBackgroundFill( value ); }

  /**
   * Gets the background fill.
   * @returns {ColorDef}
   * @public
   */
  getBackgroundFill() {
    return this.backgroundNode.fill;
  }

  get backgroundFill() {
    return this.getBackgroundFill();
  }

  /**
   * Sets the background stroke.
   * @param {ColorDef} stroke
   * @public
   */
  setBackgroundStroke( stroke ) {
    this.backgroundNode.stroke = stroke;
  }

  set backgroundStroke( value ) { this.setBackgroundStroke( value ); }

}

sceneryPhet.register( 'NumberDisplay', NumberDisplay );

/**
 * Converts a numeric value to a string.
 * @param {number|null} value
 * @param {number|null} decimalPlaces - if null, use the full value
 * @param {string} noValueString
 * @param {function|null} numberFormatter - if provided, function that converts {number} => {string}
 * @returns {*|string}
 */
const valueToString = ( value, decimalPlaces, noValueString, numberFormatter ) => {
  let stringValue = noValueString;
  if ( value !== null ) {
    if ( numberFormatter ) {
      stringValue = numberFormatter( value );
    }
    else if ( decimalPlaces === null ) {
      stringValue = `${value}`;
    }
    else {
      stringValue = Utils.toFixed( value, decimalPlaces );
    }
  }
  return stringValue;
};

NumberDisplay.NumberDisplayIO = new IOType( 'NumberDisplayIO', {
  valueType: NumberDisplay,
  supertype: Node.NodeIO,
  documentation: 'A numeric readout with a background'
} );

export default NumberDisplay;