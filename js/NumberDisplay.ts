// Copyright 2015-2023, University of Colorado Boulder

/**
 * Displays a Property of type {number} in a background rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import TinyProperty from '../../axon/js/TinyProperty.js';
import TProperty from '../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Range from '../../dot/js/Range.js';
import Utils from '../../dot/js/Utils.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import { Font, TPaint, Node, NodeOptions, Rectangle, RichText, RichTextOptions, Text, TextOptions, ManualConstraint } from '../../scenery/js/imports.js';
import SunConstants from '../../sun/js/SunConstants.js';
import Tandem from '../../tandem/js/Tandem.js';
import IOType from '../../tandem/js/types/IOType.js';
import StringIO from '../../tandem/js/types/StringIO.js';
import MathSymbols from './MathSymbols.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_FONT = new PhetFont( 20 );

// valid values for options.align and options.noValueAlign
const ALIGN_VALUES = [ 'center', 'left', 'right' ] as const;
type NumberDisplayAlign = typeof ALIGN_VALUES[number];

const DEFAULT_DECIMAL_PLACES = 0;

type NumberFormatter = ( n: number ) => string;

type SelfOptions = {

  align?: NumberDisplayAlign;

  // Pattern used to format the value.
  // Must contain SunConstants.VALUE_NAMED_PLACEHOLDER or SunConstants.VALUE_NUMBERED_PLACEHOLDER.
  valuePattern?: string | TReadOnlyProperty<string>;

  // The number of decimal places to show. If null, the full value is displayed.
  // We attempted to change the default to null, but there were too many usages that relied on the 0 default.
  // See https://github.com/phetsims/scenery-phet/issues/511
  decimalPlaces?: number | null;

  // Takes a {number} and returns a {string} for full control. Mutually exclusive with valuePattern and
  // decimalPlaces.  Named "numberFormatter" instead of "formatter" to help clarify that it is separate from the
  // noValueString/Align/Pattern defined below.
  numberFormatter?: ( ( n: number ) => string ) | null;

  useRichText?: boolean;

  // If set to true, the smaller text height (from applying the maxWidth) will NOT be used, and instead
  // the height of the text (as if there was no maxWidth) will be used for layout and the background.
  // See https://github.com/phetsims/density/issues/34.
  useFullHeight?: boolean;

  // // options passed to Text or RichText (depending on the value of options.useRichText) that displays the value
  textOptions?: TextOptions | RichTextOptions;

  xMargin?: number;
  yMargin?: number;
  cornerRadius?: number;
  backgroundFill?: TPaint;
  backgroundStroke?: TPaint;
  backgroundLineWidth?: number;
  backgroundLineDash?: number[];
  minBackgroundWidth?: number;

  // options related to display when numberProperty.value === null
  noValueString?: string; // default is the PhET standard, do not override lightly.
  noValueAlign?: NumberDisplayAlign | null; // see ALIGN_VALUES. If null, defaults to options.align
  noValuePattern?: string | TReadOnlyProperty<string> | null; // If null, defaults to options.valuePattern
};
export type NumberDisplayOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class NumberDisplay extends Node {

  private readonly numberFormatterProperty: TProperty<NumberFormatter>;
  private readonly valueText: RichText | Text;
  private readonly backgroundNode: Rectangle;
  private readonly disposeNumberDisplay: () => void; // called by dispose

  /**
   * @param numberProperty
   * @param displayRange - this range, with options.decimals or numberFormatter applied, is used to determine
   *                     - the display width. It is unrelated to the range of numberProperty.
   * @param providedOptions
   */
  public constructor( numberProperty: TReadOnlyProperty<number | null>, displayRange: Range, providedOptions?: NumberDisplayOptions ) {

    const options = optionize<NumberDisplayOptions, SelfOptions, NodeOptions>()( {
      align: 'right',
      valuePattern: SunConstants.VALUE_NAMED_PLACEHOLDER,
      decimalPlaces: DEFAULT_DECIMAL_PLACES,
      numberFormatter: null,
      useRichText: false,
      useFullHeight: false,
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

      noValueString: MathSymbols.NO_VALUE,
      noValueAlign: null,
      noValuePattern: null,

      // phet-io
      tandem: Tandem.OPTIONAL,
      phetioType: NumberDisplay.NumberDisplayIO
    }, providedOptions );

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

    const numberFormatterProperty = new TinyProperty( options.numberFormatter ? options.numberFormatter : ( value: number ) => {
      if ( options.decimalPlaces === null ) {
        return `${value}`;
      }
      else {
        return Utils.toFixed( value, options.decimalPlaces );
      }
    } );

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
    const replaceValuePatternValue = ( valuePattern: string ) => {
      if ( valuePattern.includes( SunConstants.VALUE_NUMBERED_PLACEHOLDER ) ) {
        return StringUtils.format( valuePattern, SunConstants.VALUE_NAMED_PLACEHOLDER );
      }
      else {
        return valuePattern;
      }
    };

    const valuePatternProperty = ( typeof options.valuePattern === 'string' )
                                 ? new TinyProperty( replaceValuePatternValue( options.valuePattern ) )
                                 : new DerivedProperty( [ options.valuePattern ], replaceValuePatternValue );

    assert && assert( !!phet.chipper.queryParameters.stringTest ||
                      valuePatternProperty.value.includes( SunConstants.VALUE_NAMED_PLACEHOLDER ),
      `missing value placeholder in options.valuePattern: ${valuePatternProperty.value}` );

    // Set default and validate
    if ( !options.noValuePattern ) {
      // So we don't have duplicated Properties in our DerivedProperty (it's not supported by that)
      options.noValuePattern = new DerivedProperty( [ valuePatternProperty ], x => x );
    }
    const noValuePatternProperty = typeof options.noValuePattern === 'string' ? new TinyProperty( options.noValuePattern ) : options.noValuePattern;

    assert && assert( !!phet.chipper.queryParameters.stringTest ||
                      noValuePatternProperty.value.includes( SunConstants.VALUE_NAMED_PLACEHOLDER ),
      `missing value placeholder in options.noValuePattern: ${noValuePatternProperty.value}` );

    // determine the widest value
    const minStringProperty = new DerivedProperty( [ numberFormatterProperty ], numberFormatter => {
      return valueToString( displayRange.min, options.noValueString, numberFormatter );
    } );
    const maxStringProperty = new DerivedProperty( [ numberFormatterProperty ], numberFormatter => {
      return valueToString( displayRange.max, options.noValueString, numberFormatter );
    } );
    const longestStringProperty = new DerivedProperty( [
      valuePatternProperty,
      minStringProperty,
      maxStringProperty
    ], ( valuePattern, minString, maxString ) => {
      return StringUtils.fillIn( valuePattern, {
        value: ( ( minString.length > maxString.length ) ? minString : maxString )
      } );
    } );

    // value
    const Constructor = options.useRichText ? RichText : Text;
    const valueTextTandem = options.tandem.createTandem( 'valueText' );
    const valueStringProperty = new DerivedProperty( [
      numberProperty,
      noValuePatternProperty,
      valuePatternProperty,
      numberFormatterProperty
    ], ( value, noValuePattern, valuePatternValue, numberFormatter ) => {
      const valuePattern = ( value === null && noValuePattern ) ? noValuePattern : valuePatternValue;
      // NOTE: this.numberFormatter could change, so we support a recomputeText() below that recomputes this derivation
      const stringValue = valueToString( value, options.noValueString, numberFormatter );
      return StringUtils.fillIn( valuePattern, {
        value: stringValue
      } );
    }, {
      tandem: valueTextTandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME ),
      phetioValueType: StringIO
    } );

    const valueTextOptions = combineOptions<TextOptions | RichTextOptions>( {}, options.textOptions, {
      maxWidth: null // we are handling maxWidth manually, so we don't want to provide it initially.
    } );

    const valueText: Text | RichText = new Constructor( valueStringProperty, combineOptions<TextOptions | RichTextOptions>( {
      tandem: valueTextTandem
    }, valueTextOptions ) );

    const originalTextHeight = valueText.height;

    // background rectangle
    const backgroundNode = new Rectangle( {
      cornerRadius: options.cornerRadius,
      fill: options.backgroundFill,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth,
      lineDash: options.backgroundLineDash
    } );

    // Manually set maxWidth later, adjusting it to the width of the longest string if it's null
    longestStringProperty.link( longestString => {
      const demoText = new Constructor( longestString, _.omit( valueTextOptions, 'tandem' ) );

      valueText.maxWidth = ( options.textOptions.maxWidth !== null ) ? options.textOptions.maxWidth! :
                           ( demoText.width !== 0 ) ? demoText.width : null;
      demoText.maxWidth = valueText.maxWidth;

      backgroundNode.rectWidth = Math.max( options.minBackgroundWidth, demoText.width + 2 * options.xMargin );
      backgroundNode.rectHeight = ( options.useFullHeight ? originalTextHeight : demoText.height ) + 2 * options.yMargin;
    } );

    options.children = [ backgroundNode, valueText ];

    super();

    this.numberFormatterProperty = numberFormatterProperty;
    this.valueText = valueText;
    this.backgroundNode = backgroundNode;

    // Align the value in the background.
    ManualConstraint.create( this, [ valueText, backgroundNode ], ( valueTextProxy, backgroundNodeProxy ) => {

      // Alignment depends on whether we have a non-null value.
      const align = ( numberProperty.value === null ) ? options.noValueAlign : options.align;

      // horizontal alignment
      if ( align === 'center' ) {
        valueTextProxy.centerX = backgroundNodeProxy.centerX;
      }
      else if ( align === 'left' ) {
        valueTextProxy.left = backgroundNodeProxy.left + options.xMargin;
      }
      else { // right
        valueTextProxy.right = backgroundNodeProxy.right - options.xMargin;
      }

      // vertical alignment
      valueTextProxy.centerY = backgroundNodeProxy.centerY;
    } );

    this.mutate( options );

    this.disposeNumberDisplay = () => {
      valueStringProperty.dispose();
      valuePatternProperty.dispose();
    };
  }

  public setNumberFormatter( numberFormatter: ( n: number ) => string ): void {
    this.numberFormatterProperty.value = numberFormatter;
  }

  // Redraw the text when something other than the numberProperty changes (such as units, formatter, etc).
  // @deprecated
  public recomputeText(): void {
    // no-op, not needed now
  }

  public override dispose(): void {
    this.disposeNumberDisplay();
    super.dispose();
  }

  /**
   * Sets the number text font.
   */
  public setNumberFont( font: Font ): void {
    this.valueText.font = font;
  }

  public set numberFont( value: Font ) { this.setNumberFont( value ); }

  /**
   * Sets the number text fill.
   */
  public setNumberFill( fill: TPaint ): void {
    this.valueText.fill = fill;
  }

  public set numberFill( value: TPaint ) { this.setNumberFill( value ); }

  /**
   * Sets the background fill.
   */
  public setBackgroundFill( fill: TPaint ): void {
    this.backgroundNode.fill = fill;
  }

  public set backgroundFill( value: TPaint ) { this.setBackgroundFill( value ); }

  public get backgroundFill(): TPaint {
    return this.getBackgroundFill();
  }

  /**
   * Gets the background fill.
   */
  public getBackgroundFill(): TPaint {
    return this.backgroundNode.fill;
  }

  /**
   * Sets the background stroke.
   */
  public setBackgroundStroke( stroke: TPaint ): void {
    this.backgroundNode.stroke = stroke;
  }

  public set backgroundStroke( value: TPaint ) { this.setBackgroundStroke( value ); }

  /**
   * Get the width of the background.
   */
  public getBackgroundWidth(): number {
    return this.backgroundNode.getRectWidth();
  }

  /**
   * Set the width of the background node.
   */
  public setBackgroundWidth( width: number ): void {
    this.backgroundNode.setRectWidth( width );
  }

  public get backgroundWidth(): number { return this.getBackgroundWidth(); }
  public set backgroundWidth( width: number ) { this.setBackgroundWidth( width ); }

  public static readonly NumberDisplayIO = new IOType( 'NumberDisplayIO', {
    valueType: NumberDisplay,
    supertype: Node.NodeIO,
    documentation: 'A numeric readout with a background'
  } );
}

sceneryPhet.register( 'NumberDisplay', NumberDisplay );

/**
 * Converts a numeric value to a string.
 * @param value
 * @param decimalPlaces - if null, use the full value
 * @param noValueString
 * @param numberFormatter - if provided, function that converts {number} => {string}
 */
const valueToString = <S extends number | null>( value: S, noValueString: string, numberFormatter: NumberFormatter ): ( S extends null ? ( string | null ) : string ) => {
  let stringValue = noValueString;
  if ( value !== null ) {
    stringValue = numberFormatter( value );
  }
  return stringValue;
};
