// Copyright 2015-2020, University of Colorado Boulder

/**
 * Displays a Property of type {number} in a background rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../dot/js/Utils.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import Node from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import RichText from '../../scenery/js/nodes/RichText.js';
import Text from '../../scenery/js/nodes/Text.js';
import SunConstants from '../../sun/js/SunConstants.js';
import Tandem from '../../tandem/js/Tandem.js';
import MathSymbols from './MathSymbols.js';
import NumberDisplayIO from './NumberDisplayIO.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_FONT = new PhetFont( 20 );

// valid values for options.align and options.noValueAlign
const ALIGN_VALUES = [ 'center', 'left', 'right' ];

/**
 * @param {Property.<number|null>} numberProperty
 * @param {Range} displayRange - this range, with options.decimals applied, is used to determine the display width.
 *                               It is unrelated to the range of numberProperty.
 * @param {Object} [options]
 * @constructor
 */
function NumberDisplay( numberProperty, displayRange, options ) {

  options = merge( {
    align: 'right', // see ALIGN_VALUES

    // {string} Pattern used to format the value.
    // Must contain SunConstants.VALUE_NAMED_PLACEHOLDER or SunConstants.VALUE_NUMBERED_PLACEHOLDER.
    valuePattern: SunConstants.VALUE_NAMED_PLACEHOLDER,
    useRichText: false,

    // options passed to Text or RichText (depending on the value of options.useRichText) that displays the value
    textOptions: {
      font: DEFAULT_FONT,
      fill: 'black',
      maxWidth: null, // {number|null} if null, then it will be computed based on displayRange
      phetioReadOnly: true
    },

    // {number|null} the number of decimal places to show. If null, the full value is displayed.
    // We attempted to change the default to null, but there were too many usages that relied on the 0 default.
    // See https://github.com/phetsims/scenery-phet/issues/511
    decimalPlaces: 0,

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
    phetioType: NumberDisplayIO
  }, options );

  // Set default alignments and validate
  assert && assert( _.includes( ALIGN_VALUES, options.align ), 'invalid align: ' + options.align );
  if ( !options.noValueAlign ) {
    options.noValueAlign = options.align;
  }
  assert && assert( _.includes( ALIGN_VALUES, options.noValueAlign ), 'invalid noValueAlign: ' + options.noValueAlign );
  assert && assert( options.textOptions, 'did you accidentally set textOptions to null?' );

  // Support numbered (old-style) placeholder by replacing it with the corresponding named placeholder.
  // See https://github.com/phetsims/scenery-phet/issues/446
  if ( options.valuePattern.indexOf( SunConstants.VALUE_NUMBERED_PLACEHOLDER ) !== -1 ) {
    options.valuePattern = StringUtils.format( options.valuePattern, SunConstants.VALUE_NAMED_PLACEHOLDER );
  }
  assert && assert( !!phet.chipper.queryParameters.stringTest ||
                    options.valuePattern.indexOf( SunConstants.VALUE_NAMED_PLACEHOLDER ) !== -1,
    'missing value placeholder in options.valuePattern: ' + options.valuePattern );

  // Set default and validate
  if ( !options.noValuePattern ) {
    options.noValuePattern = options.valuePattern;
  }
  assert && assert( !!phet.chipper.queryParameters.stringTest ||
                    options.noValuePattern.indexOf( SunConstants.VALUE_NAMED_PLACEHOLDER ) !== -1,
    'missing value placeholder in options.noValuePattern: ' + options.noValuePattern );

  const self = this;

  // determine the widest value
  const minString = valueToString( displayRange.min, options.decimalPlaces, options.noValueString );
  const maxString = valueToString( displayRange.max, options.decimalPlaces, options.noValueString );
  const longestString = StringUtils.fillIn( options.valuePattern, {
    value: ( ( minString.length > maxString.length ) ? minString : maxString )
  } );

  // value
  const Constructor = options.useRichText ? RichText : Text;
  this.valueText = new Constructor( longestString, merge( {
    tandem: options.tandem.createTandem( 'valueText' )
  }, options.textOptions ) );

  // maxWidth for valueText
  if ( options.textOptions.maxWidth === null ) {
    this.valueText.maxWidth = this.valueText.width;
  }
  else {
    this.valueText.maxWidth = options.textOptions.maxWidth;
  }

  const backgroundWidth = Math.max( options.minBackgroundWidth, this.valueText.width + 2 * options.xMargin );

  // @private background
  this.backgroundNode = new Rectangle( 0, 0, backgroundWidth, this.valueText.height + 2 * options.yMargin, {
    cornerRadius: options.cornerRadius,
    fill: options.backgroundFill,
    stroke: options.backgroundStroke,
    lineWidth: options.backgroundLineWidth,
    lineDash: options.backgroundLineDash
  } );

  options.children = [ this.backgroundNode, this.valueText ];

  // display the value
  const numberObserver = function( value ) {

    const valuePattern = ( value === null ) ? options.noValuePattern : options.valuePattern;
    const stringValue = valueToString( value, options.decimalPlaces, options.noValueString );
    const align = ( value === null ) ? options.noValueAlign : options.align;

    // update the value
    self.valueText.text = StringUtils.fillIn( valuePattern, {
      value: stringValue
    } );

    // horizontally align value in background
    if ( align === 'center' ) {
      self.valueText.centerX = self.backgroundNode.centerX;
    }
    else if ( align === 'left' ) {
      self.valueText.left = self.backgroundNode.left + options.xMargin;
    }
    else { // right
      self.valueText.right = self.backgroundNode.right - options.xMargin;
    }
    self.valueText.centerY = self.backgroundNode.centerY;
  };
  numberProperty.link( numberObserver );

  // @private called by dispose
  this.disposeNumberDisplay = function() {
    numberProperty.unlink( numberObserver );
  };

  Node.call( this, options );
}

sceneryPhet.register( 'NumberDisplay', NumberDisplay );

/**
 * Converts a numeric value to a string.
 * @param {number} value
 * @param {number|null} decimalPlaces - if null, use the full value
 * @param {string} noValueString
 * @returns {*|string}
 */
function valueToString( value, decimalPlaces, noValueString ) {
  let stringValue = noValueString;
  if ( value !== null ) {
    if ( decimalPlaces === null ) {
      stringValue = '' + value;
    }
    else {
      stringValue = Utils.toFixed( value, decimalPlaces );
    }
  }
  return stringValue;
}

inherit( Node, NumberDisplay, {

  // @public
  dispose: function() {
    this.disposeNumberDisplay();
    Node.prototype.dispose.call( this );
  },

  /**
   * Sets the number text font.
   * @param {Font} font
   * @public
   */
  setNumberFont: function( font ) {
    this.valueText.font = font;
  },
  set numberFont( value ) { this.setNumberFont( value ); },

  /**
   * Sets the number text fill.
   * @param {Color|string} fill
   * @public
   */
  setNumberFill: function( fill ) {
    this.valueText.fill = fill;
  },
  set numberFill( value ) { this.setNumberFill( value ); },

  /**
   * Sets the background fill.
   * @param {Color|string} fill
   * @public
   */
  setBackgroundFill: function( fill ) {
    this.backgroundNode.fill = fill;
  },
  set backgroundFill( value ) { this.setBackgroundFill( value ); },

  /**
   * Sets the background stroke.
   * @param {Color|string} stroke
   * @public
   */
  setBackgroundStroke: function( stroke ) {
    this.backgroundNode.stroke = stroke;
  },
  set backgroundStroke( value ) { this.setBackgroundStroke( value ); }
} );

export default NumberDisplay;