// Copyright 2015-2025, University of Colorado Boulder

/**
 * Displays a Property of type {number} in a background rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import StringProperty from '../../axon/js/StringProperty.js';
import TinyProperty from '../../axon/js/TinyProperty.js';
import TProperty from '../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import Range from '../../dot/js/Range.js';
import Vector2 from '../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import IntentionalAny from '../../phet-core/js/types/IntentionalAny.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import ManualConstraint from '../../scenery/js/layout/constraints/ManualConstraint.js';
import Node, { NodeOptions } from '../../scenery/js/nodes/Node.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import RichText, { RichTextOptions } from '../../scenery/js/nodes/RichText.js';
import Text, { TextOptions } from '../../scenery/js/nodes/Text.js';
import Font from '../../scenery/js/util/Font.js';
import TPaint from '../../scenery/js/util/TPaint.js';
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

export type NumberDisplayStringPair = {
  valueString: string; // The typical visual output of the NumberDisplay
  accessibleValueString: string; // A value to fill into the accessibleValueStringProperty, for use in context responses
};
type NumberFormatter = ( n: number ) => string | NumberDisplayStringPair;

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
  // noValueString/Align/Pattern defined below. Please see also numberFormatterDependencies
  numberFormatter?: NumberFormatter | null;

  // If your numberFormatter depends on other Properties, you must specify them so that the text will update when those
  // dependencies change.
  numberFormatterDependencies?: TReadOnlyProperty<unknown>[];

  useRichText?: boolean;

  // If set to true, the smaller text height (from applying the maxWidth) will NOT be used, and instead
  // the height of the text (as if there was no maxWidth) will be used for layout and the background.
  // See https://github.com/phetsims/density/issues/34.
  useFullHeight?: boolean;

  // options passed to Text or RichText (depending on the value of options.useRichText) that displays the value
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
  public readonly valueStringProperty: TReadOnlyProperty<string>;

  // A read-only Property filled in with the 'accessibleValueString' from the numberFormatter (if available), falling
  // back to the visual value string. Available to be used for context responses.
  public readonly accessibleValueStringProperty: TReadOnlyProperty<string>;

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
      numberFormatterDependencies: [],
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
      tandem: Tandem.OPT_OUT,
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
        return StringUtils.wrapLTR( `${value}` );
      }
      else {
        return StringUtils.toFixedLTR( value, options.decimalPlaces );
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

    assert && assert( !!phet?.chipper?.queryParameters?.stringTest ||
                      valuePatternProperty.value.includes( SunConstants.VALUE_NAMED_PLACEHOLDER ),
      `missing value placeholder in options.valuePattern: ${valuePatternProperty.value}` );

    // Set default and validate
    if ( !options.noValuePattern ) {
      // So we don't have duplicated Properties in our DerivedProperty (it's not supported by that)
      options.noValuePattern = new DerivedProperty( [ valuePatternProperty ], x => x );
    }
    const noValuePatternProperty = typeof options.noValuePattern === 'string' ? new TinyProperty( options.noValuePattern ) : options.noValuePattern;

    assert && assert( !!phet?.chipper?.queryParameters?.stringTest ||
                      noValuePatternProperty.value.includes( SunConstants.VALUE_NAMED_PLACEHOLDER ),
      `missing value placeholder in options.noValuePattern: ${noValuePatternProperty.value}` );

    // determine the widest value
    const minStringProperty = DerivedProperty.deriveAny( [ numberFormatterProperty, ...options.numberFormatterDependencies ], () => {
      return valueToString( displayRange.min, options.noValueString, numberFormatterProperty.value );
    } );
    const maxStringProperty = DerivedProperty.deriveAny( [ numberFormatterProperty, ...options.numberFormatterDependencies ], () => {
      return valueToString( displayRange.max, options.noValueString, numberFormatterProperty.value );
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
    const ValueTextConstructor = options.useRichText ? RichText : Text;
    const valueTextTandem = options.textOptions.tandem || options.tandem.createTandem( 'valueText' );
    const accessibleValueStringProperty = new StringProperty( '' );
    const valueStringProperty = DerivedProperty.deriveAny(
      [ numberProperty, noValuePatternProperty, valuePatternProperty, numberFormatterProperty, ...options.numberFormatterDependencies ],
      () => {
        const value = numberProperty.value;
        const noValuePattern = noValuePatternProperty.value;
        const valuePatternValue = valuePatternProperty.value;
        const numberFormatter = numberFormatterProperty.value;

        const valuePattern = ( value === null && noValuePattern ) ? noValuePattern : valuePatternValue;

        const stringPair = valueToStringPair( value, options.noValueString, numberFormatter );
        accessibleValueStringProperty.value = stringPair?.accessibleValueString ?? options.noValueString;
        const stringValue = stringPair?.valueString ?? null;
        return StringUtils.fillIn( valuePattern, {
          value: stringValue
        } );
      }, {

        // These options were copied here when we moved from DerivedStringProperty to DerivedProperty.
        phetioFeatured: true,
        phetioValueType: StringIO,
        tandemNameSuffix: 'StringProperty',

        tandem: valueTextTandem.createTandem( Text.STRING_PROPERTY_TANDEM_NAME )
      } );

    const valueTextOptions = combineOptions<TextOptions | RichTextOptions>( {
      tandem: valueTextTandem
    }, options.textOptions, {
      maxWidth: null // we are handling maxWidth manually, so we don't want to provide it initially.
    } );

    const valueText: Text | RichText = new ValueTextConstructor( valueStringProperty, valueTextOptions );

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
      const demoText = new ValueTextConstructor( longestString, _.omit( valueTextOptions, 'tandem' ) );

      valueText.maxWidth = ( options.textOptions.maxWidth !== null ) ? options.textOptions.maxWidth! :
                           ( demoText.width !== 0 ) ? demoText.width : null;
      demoText.maxWidth = valueText.maxWidth;

      backgroundNode.rectWidth = Math.max( options.minBackgroundWidth, demoText.width + 2 * options.xMargin );
      backgroundNode.rectHeight = ( options.useFullHeight ? originalTextHeight : demoText.height ) + 2 * options.yMargin;
    } );

    // Avoid infinite loops like https://github.com/phetsims/axon/issues/447 by applying the maxWidth to a different Node
    // than the one that is used for layout.
    const valueTextContainer = new Node( {
      children: [ valueText ]
    } );
    options.children = [ backgroundNode, valueTextContainer ];

    super();

    this.numberFormatterProperty = numberFormatterProperty;
    this.valueText = valueText;
    this.backgroundNode = backgroundNode;
    this.valueStringProperty = valueStringProperty;
    this.accessibleValueStringProperty = accessibleValueStringProperty;

// Align the value in the background.
    ManualConstraint.create( this, [ valueTextContainer, backgroundNode ], ( valueTextContainerProxy, backgroundNodeProxy ) => {

      // Alignment depends on whether we have a non-null value.
      const align = ( numberProperty.value === null ) ? options.noValueAlign : options.align;

      // vertical alignment
      const centerY = backgroundNodeProxy.centerY;

      // horizontal alignment
      if ( align === 'center' ) {
        valueTextContainerProxy.center = new Vector2( backgroundNodeProxy.centerX, centerY );
      }
      else if ( align === 'left' ) {
        valueTextContainerProxy.leftCenter = new Vector2( backgroundNodeProxy.left + options.xMargin, centerY );
      }
      else { // right
        valueTextContainerProxy.rightCenter = new Vector2( backgroundNodeProxy.right - options.xMargin, centerY );
      }
    } );

    this.mutate( options );

    this.disposeNumberDisplay = () => {
      valueStringProperty.dispose();
      valuePatternProperty.dispose();
    };
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

  public static readonly NumberDisplayIO = new IOType<IntentionalAny, IntentionalAny>( 'NumberDisplayIO', {
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
 * @param numberFormatter - if provided, function that converts {number} => {string | StringPair}
 */
const valueToString = <S extends number | null>(
  value: S,
  noValueString: string,
  numberFormatter: NumberFormatter
): ( S extends null ? ( string | null ) : string ) => {
  if ( value !== null ) {
    const formattedValue = numberFormatter( value );
    if ( typeof formattedValue === 'string' ) {
      return formattedValue;
    }
    else {
      return formattedValue.valueString;
    }
  }
  else {
    return noValueString;
  }
};

/**
 * Converts a numeric value to a string pair (contains both a visual string and an accessible value string).
 * @param value
 * @param decimalPlaces - if null, use the full value
 * @param noValueString
 * @param numberFormatter - if provided, function that converts {number} => {string | StringPair}
 */
const valueToStringPair = <S extends number | null>(
  value: S,
  noValueString: string,
  numberFormatter: NumberFormatter
): ( S extends null ? ( NumberDisplayStringPair | null ) : NumberDisplayStringPair ) => {
  if ( value !== null ) {
    const formattedValue = numberFormatter( value );
    if ( typeof formattedValue === 'string' ) {
      return {
        valueString: formattedValue,
        accessibleValueString: formattedValue // for backwards compatibility, we return the same value for both
      };
    }
    else {
      return formattedValue;
    }
  }
  else {
    return {
      valueString: noValueString,
      accessibleValueString: noValueString
    };
  }
};