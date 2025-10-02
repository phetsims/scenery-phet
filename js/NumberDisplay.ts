// Copyright 2015-2025, University of Colorado Boulder

/**
 * Displays a Property of type {number} in a background rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { DualString, DualStringNumber, DualValuePattern, DualValuePropertyPattern, NumberFormatOptions } from '../../axon/js/AccessibleStrings.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';
import Property from '../../axon/js/Property.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';
import StringProperty from '../../axon/js/StringProperty.js';
import { isTReadOnlyProperty, TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import FluentPattern from '../../chipper/js/browser/FluentPattern.js';
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
import { getFormattedAccessibleNumber, getFormattedVisualNumber } from './NumberFormatting.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const DEFAULT_FONT = new PhetFont( 20 );

// valid values for options.align and options.noValueAlign
const ALIGN_VALUES = [ 'center', 'left', 'right' ] as const;
type NumberDisplayAlign = typeof ALIGN_VALUES[number];

const DEFAULT_DECIMAL_PLACES = 0;

type NumberFormatter = ( n: number ) => string | DualStringNumber;
type ValuePattern = string | TReadOnlyProperty<string> | DualValuePattern;

type SelfOptions = {

  align?: NumberDisplayAlign;

  // Pattern used to format the value.
  // Must contain SunConstants.VALUE_NAMED_PLACEHOLDER or SunConstants.VALUE_NUMBERED_PLACEHOLDER.
  valuePattern?: ValuePattern;

  // The number of decimal places to show. If null, the full value is displayed.
  // We attempted to change the default to null, but there were too many usages that relied on the 0 default.
  // See https://github.com/phetsims/scenery-phet/issues/511
  decimalPlaces?: number | null;

  // Additional number formatting options, see NumberFormatOptions for details.
  // Ignored if options.numberFormatter is provided.
  numberFormatOptions?: NumberFormatOptions;

  // Takes a {number} and returns a {string} for full control. Mutually exclusive with valuePattern and
  // decimalPlaces.  Named "numberFormatter" instead of "formatter" to help clarify that it is separate from the
  // noValueString/Align/Pattern defined below. Please see also numberFormatterDependencies
  //
  // If formatting numbers, remember:
  // - Visual strings should be wrapped with StringUtils.wrapLTR, so that they display correctly in RTL locales.
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
  noValuePattern?: ValuePattern | null; // If null, defaults to options.valuePattern
};
export type NumberDisplayOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class NumberDisplay extends Node {

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
      numberFormatOptions: {},
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
      const numberFormatOptionsProvided = Object.keys( options.numberFormatOptions ).length > 0;
      const valuePatternProvided = options.valuePattern !== SunConstants.VALUE_NAMED_PLACEHOLDER;
      const formatInfoProvided = decimalPlacesProvided || valuePatternProvided || numberFormatOptionsProvided;
      if ( numberFormatterProvided || formatInfoProvided ) {
        assert && assert( numberFormatterProvided !== formatInfoProvided,
          'options.numberFormatter is mutually exclusive with options.valuePattern, options.decimalPlaces, and options.numberFormatOptions' );
      }
    }

    // Set default alignments and validate
    assert && assert( _.includes( ALIGN_VALUES, options.align ), `invalid align: ${options.align}` );
    if ( !options.noValueAlign ) {
      options.noValueAlign = options.align;
    }
    assert && assert( _.includes( ALIGN_VALUES, options.noValueAlign ), `invalid noValueAlign: ${options.noValueAlign}` );
    assert && assert( options.textOptions, 'did you accidentally set textOptions to null?' );

    const numberFormatterDependencies = options.numberFormatterDependencies.slice();

    const numberFormatOptions = combineOptions<NumberFormatOptions>( {
      decimalPlaces: options.decimalPlaces
    }, options.numberFormatOptions );

    let numberFormatter: NumberFormatter;
    if ( options.numberFormatter ) {
      numberFormatter = options.numberFormatter;
    }
    else if (
      numberProperty instanceof ReadOnlyProperty &&
      numberProperty.units !== null &&
      typeof numberProperty.units !== 'string' &&
      // Don't double-provide units if we have a valuePattern
      options.valuePattern === SunConstants.VALUE_NAMED_PLACEHOLDER
    ) {
      const unit = numberProperty.units;

      numberFormatter = ( value: number ) => unit.getDualString( value, numberFormatOptions );

      numberFormatterDependencies.push( ...unit.getDependentProperties() );
    }
    else {
      numberFormatter = ( value: number ) => {
        return {
          visualString: getFormattedVisualNumber( value, numberFormatOptions ),
          accessibleString: getFormattedAccessibleNumber( value, numberFormatOptions )
        };
      };
    }

    const valuePropertyPattern = dualValuePatternFromValuePattern( options.valuePattern );
    const noValuePropertyPattern = dualValuePatternFromValuePattern( options.noValuePattern ?? options.valuePattern );

    // determine the widest value
    const minStringProperty = DerivedProperty.deriveAny( [ ...numberFormatterDependencies ], () => {
      return valueToString( displayRange.min, options.noValueString, numberFormatter );
    } );
    const maxStringProperty = DerivedProperty.deriveAny( [ ...numberFormatterDependencies ], () => {
      return valueToString( displayRange.max, options.noValueString, numberFormatter );
    } );
    const noValueStringProperty = DerivedProperty.deriveAny( [ ...numberFormatterDependencies ], () => {
      return valueToString( null, options.noValueString, numberFormatter );
    } );

    const longestStringsProperty: TReadOnlyProperty<string[]> = new DerivedProperty( [
      valuePropertyPattern.visualPatternProperty,
      noValuePropertyPattern.visualPatternProperty,
      minStringProperty,
      maxStringProperty,
      noValueStringProperty
    ], ( valuePattern, noValuePattern, minString, maxString, noValueString ) => {
      return [
        StringUtils.fillIn( valuePattern, { value: minString } ),
        StringUtils.fillIn( valuePattern, { value: maxString } ),
        StringUtils.fillIn( noValuePattern, { value: noValueString } )
      ];
    } );

    // value
    const ValueTextConstructor = options.useRichText ? RichText : Text;
    const valueTextTandem = options.textOptions.tandem || options.tandem.createTandem( 'valueText' );
    const accessibleValueStringProperty = new StringProperty( '' );

    const valueStringProperty = DerivedProperty.deriveAny(
      _.uniq( [
        numberProperty,
        noValuePropertyPattern.visualPatternProperty,
        valuePropertyPattern.visualPatternProperty,
        ...getSingleOrDualOtherDependencies( valuePropertyPattern ),
        ...getSingleOrDualOtherDependencies( noValuePropertyPattern ),
        ...numberFormatterDependencies
      ] ),
      () => {
        const value = numberProperty.value;

        const visualValuePattern = valuePropertyPattern.visualPatternProperty.value;
        const noValueVisualPattern = noValuePropertyPattern.visualPatternProperty.value;

        const accessibleValuePattern = valuePropertyPattern instanceof ReadOnlyProperty ? visualValuePattern : valuePropertyPattern.accessiblePattern;
        const noValueAccessiblePattern = noValuePropertyPattern instanceof ReadOnlyProperty ? noValueVisualPattern : noValuePropertyPattern.accessiblePattern;

        const visualPattern = value === null ? noValueVisualPattern : visualValuePattern;
        const accessiblePattern = ( value === null ? noValueAccessiblePattern : accessibleValuePattern ) ?? visualPattern;

        const numberDualString = valueToDualString( value, options.noValueString, numberFormatter );

        accessibleValueStringProperty.value = accessiblePattern instanceof FluentPattern ? accessiblePattern.format( {
          value: numberDualString.accessibleString
        } ) : StringUtils.fillIn( accessiblePattern, {
          value: numberDualString.accessibleString
        } );

        return StringUtils.fillIn( visualPattern, {
          value: numberDualString.visualString
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
    longestStringsProperty.link( longestStrings => {
      const demoTexts = longestStrings.map( str => new ValueTextConstructor( str, _.omit( valueTextOptions, 'tandem' ) ) );
      const maxWidth = Math.max( ...demoTexts.map( text => text.width ) );

      // NOTE: We're doing some crazy maxWidth stuff here. Seems like we're checking line wrapping potentially (by
      // setting maxWidths and then checking afterward?)
      // NOTE: Might be able to simplify this?
      valueText.maxWidth = ( options.textOptions.maxWidth !== null ) ? options.textOptions.maxWidth! :
                           ( maxWidth !== 0 ) ? maxWidth : null;

      for ( const demoText of demoTexts ) {
        demoText.maxWidth = valueText.maxWidth;
      }

      const finalMaxWidth = Math.max( ...demoTexts.map( text => text.width ) );
      const finalMaxHeight = Math.max( ...demoTexts.map( text => text.height ) );

      backgroundNode.rectWidth = Math.max( options.minBackgroundWidth, finalMaxWidth + 2 * options.xMargin );
      backgroundNode.rectHeight = ( options.useFullHeight ? originalTextHeight : finalMaxHeight ) + 2 * options.yMargin;

      for ( const demoText of demoTexts ) {
        demoText.dispose();
      }
    } );

    // Avoid infinite loops like https://github.com/phetsims/axon/issues/447 by applying the maxWidth to a different Node
    // than the one that is used for layout.
    const valueTextContainer = new Node( {
      children: [ valueText ]
    } );
    options.children = [ backgroundNode, valueTextContainer ];

    super();

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
      accessibleValueStringProperty.dispose();
      minStringProperty.dispose();
      maxStringProperty.dispose();
      noValueStringProperty.dispose();
      longestStringsProperty.dispose();

      if ( valuePropertyPattern instanceof ReadOnlyProperty ) {
        valuePropertyPattern.dispose();
      }
      else {
        valuePropertyPattern.visualPatternProperty.dispose();
      }
      if ( noValuePropertyPattern instanceof ReadOnlyProperty ) {
        noValuePropertyPattern.dispose();
      }
      else {
        noValuePropertyPattern.visualPatternProperty.dispose();
      }
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
): string => {
  if ( value !== null ) {
    const formattedValue = numberFormatter( value );
    if ( typeof formattedValue === 'string' ) {
      return formattedValue;
    }
    else {
      return `${formattedValue.visualString}`;
    }
  }
  else {
    return noValueString;
  }
};

/**
 * Converts a numeric value to a string pair (contains both a visual string and an accessible value string).
 */
const valueToDualString = (
  value: number | null,
  noValueString: string,
  numberFormatter: NumberFormatter
): DualString => {
  if ( value !== null ) {
    const formattedValue = numberFormatter( value );
    if ( typeof formattedValue === 'string' ) {
      return {
        visualString: formattedValue,
        accessibleString: formattedValue // for backwards compatibility, we return the same value for both
      };
    }
    else {
      return {
        visualString: `${formattedValue.visualString}`,
        accessibleString: `${formattedValue.accessibleString}`
      };
    }
  }
  else {
    return {
      visualString: noValueString,
      accessibleString: noValueString
    };
  }
};

const dualValuePatternFromValuePattern = ( valuePattern: ValuePattern ): DualValuePropertyPattern => {

  const checkVisualString = ( string: string ) => {

    // When running with ?stringTest, the string may have been disrupted. Otherwise, test for the placeholder.
    if ( assert && !phet?.chipper?.queryParameters?.stringTest ) {
      assert( string.includes( SunConstants.VALUE_NAMED_PLACEHOLDER ) );
    }
  };

  const replaceNumberedPlaceholder = ( pattern: string ) => {
    if ( pattern.includes( SunConstants.VALUE_NUMBERED_PLACEHOLDER ) ) {
      return StringUtils.format( pattern, SunConstants.VALUE_NAMED_PLACEHOLDER );
    }
    else {
      assert && checkVisualString( pattern );
      return pattern;
    }
  };

  const replaceStringOrProperty = ( stringOrProperty: string | TReadOnlyProperty<string> ): ReadOnlyProperty<string> => {
    if ( typeof stringOrProperty === 'string' ) {
      return new Property( replaceNumberedPlaceholder( stringOrProperty ) );
    }
    else {
      return new DerivedProperty( [ stringOrProperty ], replaceNumberedPlaceholder );
    }
  };

  if ( typeof valuePattern === 'string' || isTReadOnlyProperty( valuePattern ) ) {
    return {
      visualPatternProperty: replaceStringOrProperty( valuePattern ),
      accessiblePattern: null
    };
  }
  else {
    return {
      visualPatternProperty: replaceStringOrProperty( valuePattern.visualPattern ),
      accessiblePattern: valuePattern.accessiblePattern
    };
  }
};

const getSingleOrDualOtherDependencies = (
  valuePatternSingleOrDual: DualValuePropertyPattern
): TReadOnlyProperty<unknown>[] => {
  return valuePatternSingleOrDual.accessiblePattern?.getDependentProperties() ?? [];
};