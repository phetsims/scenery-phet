// Copyright 2015-2022, University of Colorado Boulder

/**
 * Displays a Property of type {number} in a background rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IReadOnlyProperty from '../../axon/js/IReadOnlyProperty.js';
import Range from '../../dot/js/Range.js';
import Utils from '../../dot/js/Utils.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import { Font, IPaint, Node, NodeOptions, Rectangle, RichText, RichTextOptions, Text, TextOptions } from '../../scenery/js/imports.js';
import SunConstants from '../../sun/js/SunConstants.js';
import Tandem from '../../tandem/js/Tandem.js';
import IOType from '../../tandem/js/types/IOType.js';
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
type NumberFormatterOption = NumberFormatter | null;

type SelfOptions = {
  // see ALIGN_VALUES
  align?: NumberDisplayAlign;

  // Pattern used to format the value.
  // Must contain SunConstants.VALUE_NAMED_PLACEHOLDER or SunConstants.VALUE_NUMBERED_PLACEHOLDER.
  valuePattern?: string;

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
  backgroundFill?: IPaint;
  backgroundStroke?: IPaint;
  backgroundLineWidth?: number;
  backgroundLineDash?: number[];
  minBackgroundWidth?: number;

  // options related to display when numberProperty.value === null
  noValueString?: string; // default is the PhET standard, do not override lightly.
  noValueAlign?: NumberDisplayAlign | null; // see ALIGN_VALUES. If null, defaults to options.align
  noValuePattern?: string | null; // If null, defaults to options.valuePattern
};
export type NumberDisplayOptions = SelfOptions & NodeOptions;

export default class NumberDisplay extends Node {

  private numberFormatter: ( ( n: number ) => string ) | null;
  private readonly valueText: RichText | Text;
  private readonly backgroundNode: Rectangle;
  private readonly _recomputeText: () => void;
  private readonly disposeNumberDisplay: () => void; // called by dispose

  /**
   * @param numberProperty
   * @param displayRange - this range, with options.decimals or numberFormatter applied, is used to determine
   *                     - the display width. It is unrelated to the range of numberProperty.
   * @param providedOptions
   */
  public constructor( numberProperty: IReadOnlyProperty<number | null>, displayRange: Range, providedOptions?: NumberDisplayOptions ) {

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
    if ( options.valuePattern.includes( SunConstants.VALUE_NUMBERED_PLACEHOLDER ) ) {
      options.valuePattern = StringUtils.format( options.valuePattern, SunConstants.VALUE_NAMED_PLACEHOLDER );
    }
    // @ts-ignore convert chipper query parameters
    assert && assert( !!phet.chipper.queryParameters.stringTest ||
                      options.valuePattern.includes( SunConstants.VALUE_NAMED_PLACEHOLDER ),
      `missing value placeholder in options.valuePattern: ${options.valuePattern}` );

    // Set default and validate
    if ( !options.noValuePattern ) {
      options.noValuePattern = options.valuePattern;
    }
    // @ts-ignore convert chipper query parameters
    assert && assert( !!phet.chipper.queryParameters.stringTest ||
                      options.noValuePattern.includes( SunConstants.VALUE_NAMED_PLACEHOLDER ),
      `missing value placeholder in options.noValuePattern: ${options.noValuePattern}` );

    // determine the widest value
    const minString = valueToString( displayRange.min, options.decimalPlaces, options.noValueString, options.numberFormatter );
    const maxString = valueToString( displayRange.max, options.decimalPlaces, options.noValueString, options.numberFormatter );
    const longestString = StringUtils.fillIn( options.valuePattern, {
      value: ( ( minString.length > maxString.length ) ? minString : maxString )
    } );

    // value
    const Constructor = options.useRichText ? RichText : Text;
    const valueText: Text | RichText = new Constructor( longestString, combineOptions<TextOptions | RichTextOptions>( {
      tandem: options.tandem.createTandem( 'valueText' )
    }, options.textOptions, {
      maxWidth: null // we are handling maxWidth manually, so we don't want to provide it initially.
    } ) );

    const originalTextHeight = valueText.height;

    // Manually set maxWidth later, adjusting it to the width of the longest string if it's null
    valueText.maxWidth = options.textOptions.maxWidth === null ? valueText.width : options.textOptions.maxWidth!;

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

    this.numberFormatter = options.numberFormatter;

    // Display the value.
    const numberObserver = ( value: number | null ) => {
      const valuePattern = ( value === null && options.noValuePattern ) ? options.noValuePattern : options.valuePattern;
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

    this.valueText = valueText;
    this.backgroundNode = backgroundNode;

    this._recomputeText = () => numberObserver( numberProperty.value );
    this.disposeNumberDisplay = () => numberProperty.unlink( numberObserver );
  }

  public setNumberFormatter( numberFormatter: ( n: number ) => string ): void {
    this.numberFormatter = numberFormatter;
    this.recomputeText();
  }

  // Redraw the text when something other than the numberProperty changes (such as units, formatter, etc).
  public recomputeText(): void {
    this._recomputeText();
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
  public setNumberFill( fill: IPaint ): void {
    this.valueText.fill = fill;
  }

  public set numberFill( value: IPaint ) { this.setNumberFill( value ); }

  /**
   * Sets the background fill.
   */
  public setBackgroundFill( fill: IPaint ): void {
    this.backgroundNode.fill = fill;
  }

  public set backgroundFill( value: IPaint ) { this.setBackgroundFill( value ); }

  public get backgroundFill(): IPaint {
    return this.getBackgroundFill();
  }

  /**
   * Gets the background fill.
   */
  public getBackgroundFill(): IPaint {
    return this.backgroundNode.fill;
  }

  /**
   * Sets the background stroke.
   */
  public setBackgroundStroke( stroke: IPaint ): void {
    this.backgroundNode.stroke = stroke;
  }

  public set backgroundStroke( value: IPaint ) { this.setBackgroundStroke( value ); }

  public static NumberDisplayIO: IOType;
}

sceneryPhet.register( 'NumberDisplay', NumberDisplay );

/**
 * Converts a numeric value to a string.
 * @param value
 * @param decimalPlaces - if null, use the full value
 * @param noValueString
 * @param numberFormatter - if provided, function that converts {number} => {string}
 */
const valueToString = <S extends number | null>( value: S, decimalPlaces: number | null, noValueString: string, numberFormatter: NumberFormatterOption ): ( S extends null ? ( string | null ) : string ) => {
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
