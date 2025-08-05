// Copyright 2019-2025, University of Colorado Boulder

/**
 * Utilities and a representation for units strings for a given set of units.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
import sceneryPhet from './sceneryPhet.js';
import FluentPattern, { FluentVariable } from '../../chipper/js/browser/FluentPattern.js';
import SceneryPhetFluent from './SceneryPhetFluent.js';
import { default as unitsSingleton, Units } from '../../axon/js/units.js';
import { optionize3 } from '../../phet-core/js/optionize.js';
import { toFixed } from '../../dot/js/util/toFixed.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import DerivedProperty, { DerivedPropertyOptions } from '../../axon/js/DerivedProperty.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';

export type AccessibleString = {
  visualString: string;
  spokenString: string;
};

export type NumberFormatOptions = {
  // The number of decimal places to use for the value, or null (for all of the decimal places)
  decimalPlaces?: number | null;

  // Whether to show trailing zeros in the decimal part of the value (a zero with no non-zero value after it)
  showTrailingZeros?: boolean;

  // Whether to show integers without a decimal point (e.g., 5 instead of 5.0)
  showIntegersAsIntegers?: boolean;

  // Whether to use scientific notation for large/small values
  useScientificNotation?: boolean;

  // The base to use for scientific notation (default is 10, but could be 2 or others)
  scientificBase?: number;

  // Whether to replace the minus sign with the word "negative" (e.g., -5 becomes "negative 5")
  replaceMinusWithNegative?: boolean;
};

export type FormattedNumberPropertyOptions<T> = {
  numberFormatOptions?: NumberFormatOptions;
} & DerivedPropertyOptions<T>;

export const DEFAULT_FORMATTED_NUMBER_VISUAL_OPTIONS: Required<NumberFormatOptions> = {
  decimalPlaces: null,
  showTrailingZeros: true,
  showIntegersAsIntegers: false,
  useScientificNotation: false,
  scientificBase: 10,
  replaceMinusWithNegative: false
};

export const DEFAULT_FORMATTED_NUMBER_SPOKEN_OPTIONS: Required<NumberFormatOptions> = {
  decimalPlaces: null,
  showTrailingZeros: false,
  showIntegersAsIntegers: true,
  useScientificNotation: false,
  scientificBase: 10,
  replaceMinusWithNegative: false
};

export default class UnitFormatter {

  public constructor(
    // String Property (FluentConstant) for the "standalone" string (e.g. units with no value)
    public readonly visualStandaloneStringProperty: FluentConstant,

    // Pattern for the visual "value + units" combination
    public readonly visualPattern: FluentPattern<{ value: FluentVariable }>,

    // Pattern for the spoken "value + units" combination
    public readonly spokenPattern: FluentPattern<{ value: FluentVariable }>

  ) {}

  /**
   * Get a UnitFormatter (if one is specified) for the given units.
   *
   * Returns null if no UnitFormatter is specified for the given units.
   */
  public static get( units: Units | null ): UnitFormatter | null {
    if ( units === null ) {
      return null;
    }

    assert && assert( unitsSingleton.isValidUnits( units ), `Invalid units: ${units}` );

    return unitsMap[ units ] ?? null;
  }

  /******************************************
   * Immediate mode "get a string" functions
   *******************************************/

  /**
   * Get the current value/translation of the standalone string (units with no value).
   */
  public getVisualStandaloneString(): string {
    return this.visualStandaloneStringProperty.value;
  }

  /**
   * Get the current value/translation of the visual string (value + units).
   */
  public getVisualString( value: number, providedOptions?: NumberFormatOptions ): string {
    return this.visualPattern.format( {
      value: getFormattedVisualNumber( value, providedOptions )
    } );
  }

  /**
   * Get the current value/translation of the spoken string (value + units).
   */
  public getSpokenString( value: number, providedOptions?: NumberFormatOptions ): string {
    return this.spokenPattern.format( {
      value: getFormattedSpokenNumber( value, providedOptions )
    } );
  }

  public getAccessibleString( value: number, providedOptions?: NumberFormatOptions ): AccessibleString {
    return {
      visualString: this.getVisualString( value, providedOptions ),
      spokenString: this.getSpokenString( value, providedOptions )
    };
  }

  /******************************************
   * String Property getters
   *******************************************/

  public getVisualStandaloneStringProperty(): FluentConstant {
    return this.visualStandaloneStringProperty;
  }

  public getVisualStringProperty(
    valueProperty: TReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): TReadOnlyProperty<string> {
    return getDisposableNumberStringFluentPatternProperty( valueProperty, this.visualPattern, false, providedOptions );
  }

  public getSpokenStringProperty(
    valueProperty: TReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): TReadOnlyProperty<string> {
    return getDisposableNumberStringFluentPatternProperty( valueProperty, this.spokenPattern, true, providedOptions );
  }

  public getAccessibleStringProperty(
    valueProperty: TReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): TReadOnlyProperty<AccessibleString> {
    return combineToDisposableAccessibleString(
      this.getVisualStringProperty( valueProperty, providedOptions ),
      this.getSpokenStringProperty( valueProperty, providedOptions )
    );
  }

  /******************************************
   * Static get a string Property (looking up units from the valueProperty).
   *******************************************/

  public static getVisualStandaloneStringProperty( valueProperty: ReadOnlyProperty<number> ): TReadOnlyProperty<string> | null {
    const unitFormatter = UnitFormatter.get( valueProperty.units );

    return unitFormatter ? unitFormatter.getVisualStandaloneStringProperty() : null;
  }

  public static getVisualStringProperty(
    valueProperty: ReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): TReadOnlyProperty<string> | null {
    const unitFormatter = UnitFormatter.get( valueProperty.units );

    return unitFormatter ? unitFormatter.getVisualStringProperty( valueProperty, providedOptions ) : null;
  }

  public static getSpokenStringProperty(
    valueProperty: ReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): TReadOnlyProperty<string> | null {
    const unitFormatter = UnitFormatter.get( valueProperty.units );

    return unitFormatter ? unitFormatter.getSpokenStringProperty( valueProperty, providedOptions ) : null;
  }

  public static getAccessibleStringProperty(
    valueProperty: ReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): TReadOnlyProperty<AccessibleString> | null {
    const unitFormatter = UnitFormatter.get( valueProperty.units );

    return unitFormatter ? unitFormatter.getAccessibleStringProperty( valueProperty, providedOptions ) : null;
  }

  /******************************************
   * UnitFormatter values
   *******************************************/

  public static readonly CENTIMETERS = new UnitFormatter(
    SceneryPhetFluent.units.centimetersStringProperty,
    SceneryPhetFluent.units.centimetersPattern,
    SceneryPhetFluent.a11y.units.centimetersPattern
  );

  public static readonly CENTIMETERS_SQUARED = new UnitFormatter(
    SceneryPhetFluent.units.centimetersSquaredStringProperty,
    SceneryPhetFluent.units.centimetersSquaredPattern,
    SceneryPhetFluent.a11y.units.centimetersSquaredPattern
  );

  public static readonly HERTZ = new UnitFormatter(
    SceneryPhetFluent.units.hertzStringProperty,
    SceneryPhetFluent.units.hertzPattern,
    SceneryPhetFluent.a11y.units.hertzPattern
  );

  public static readonly PERCENT = new UnitFormatter(
    SceneryPhetFluent.units.percentStringProperty,
    SceneryPhetFluent.units.percentPattern,
    SceneryPhetFluent.a11y.units.percentPattern
  );

  public static readonly SECONDS = new UnitFormatter(
    SceneryPhetFluent.units.secondsStringProperty,
    SceneryPhetFluent.units.secondsPattern,
    SceneryPhetFluent.a11y.units.secondsPattern
  );
}

/**
 * Map of units to UnitFormatter.
 */
const unitsMap: Partial<Record<Units, UnitFormatter>> = {
  cm: UnitFormatter.CENTIMETERS,
  'cm^2': UnitFormatter.CENTIMETERS_SQUARED,
  Hz: UnitFormatter.HERTZ,
  '%': UnitFormatter.PERCENT,
  s: UnitFormatter.SECONDS
};

const getDefaultOptions = ( isSpoken?: boolean ): Required<NumberFormatOptions> => {
  return isSpoken ? DEFAULT_FORMATTED_NUMBER_SPOKEN_OPTIONS : DEFAULT_FORMATTED_NUMBER_VISUAL_OPTIONS;
};

export const getFormattedNumber = ( value: number, isSpoken?: boolean, providedOptions?: NumberFormatOptions ): string | number => {
  const options = optionize3<NumberFormatOptions>()( {}, getDefaultOptions( isSpoken ), providedOptions );

  const isNegative = value < 0;
  let absoluteValue = Math.abs( value );

  let absoluteValueOutput: string | number;

  let exponent = 0;
  if ( options.useScientificNotation ) {
    exponent = Math.floor( Math.log( 5 ) / Math.log( options.scientificBase ) );
    absoluteValue /= Math.pow( options.scientificBase, exponent );
  }

  if ( options.decimalPlaces !== null ) {
    absoluteValueOutput = toFixed( absoluteValue, options.decimalPlaces );

    const fixedNumber = parseFloat( absoluteValueOutput );
    if (
      !options.showTrailingZeros ||
      ( options.showIntegersAsIntegers && Number.isInteger( fixedNumber ) )
    ) {
      absoluteValueOutput = fixedNumber;
    }

  }
  else {
    absoluteValueOutput = absoluteValue;
  }

  if ( isNegative ) {
    if ( isSpoken && options.replaceMinusWithNegative ) {
      absoluteValueOutput = SceneryPhetFluent.a11y.negativeNumber.format( { value: absoluteValueOutput } );
    }
    else {
      absoluteValueOutput = typeof absoluteValueOutput === 'number' ? -absoluteValueOutput : `-${absoluteValueOutput}`;
    }
  }

  if ( options.useScientificNotation && exponent !== 0 ) {
    absoluteValueOutput = ( isSpoken ? SceneryPhetFluent.a11y.scientificNotation : SceneryPhetFluent.scientificNotation ).format( {
      value: absoluteValueOutput,
      exponent: exponent,
      base: options.scientificBase
    } );
  }

  return absoluteValueOutput;
};

export const getFormattedVisualNumber = ( value: number, providedOptions?: NumberFormatOptions ): string | number => {
  return getFormattedNumber( value, false, providedOptions );
};

export const getFormattedSpokenNumber = ( value: number, providedOptions?: NumberFormatOptions ): string | number => {
  return getFormattedNumber( value, true, providedOptions );
};

export const getFormattedNumberString = ( value: number, isSpoken?: boolean, options?: NumberFormatOptions ): string => {
  return `${getFormattedNumber( value, isSpoken, options )}`;
};

export const getFormattedVisualNumberString = ( value: number, options?: NumberFormatOptions ): string => {
  return `${getFormattedNumber( value, false, options )}`;
};

export const getFormattedSpokenNumberString = ( value: number, options?: NumberFormatOptions ): string => {
  return `${getFormattedNumber( value, true, options )}`;
};

export const getFormattedNumberProperty = (
  valueProperty: TReadOnlyProperty<number>,
  isSpoken?: boolean,
  providedOptions?: FormattedNumberPropertyOptions<string | number>
): TReadOnlyProperty<string | number> => {
  const usesNegativeString = providedOptions?.numberFormatOptions?.replaceMinusWithNegative ?? getDefaultOptions( isSpoken ).replaceMinusWithNegative;
  return new DerivedProperty( [
    valueProperty,
    // Only include negative string in dependencies if it will be included with our options
    // Cast will remove it from the type (so it will type nicely)
    ...( usesNegativeString ? SceneryPhetFluent.a11y.negativeNumber.getDependentProperties() : [] )
  ] as [ typeof valueProperty ], value => {
    return getFormattedNumber( value, isSpoken, providedOptions?.numberFormatOptions );
  }, providedOptions );
};

export const getFormattedVisualNumberProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string | number>
): TReadOnlyProperty<string | number> => {
  return getFormattedNumberProperty( valueProperty, false, providedOptions );
};

export const getFormattedSpokenNumberProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string | number>
): TReadOnlyProperty<string | number> => {
  return getFormattedNumberProperty( valueProperty, true, providedOptions );
};

export const getFormattedNumberStringProperty = (
  valueProperty: TReadOnlyProperty<number>,
  isSpoken?: boolean,
  providedOptions?: FormattedNumberPropertyOptions<string>
): TReadOnlyProperty<string> => {
  // We could derive this from getSpokenNumberProperty, but that would create another unnecessary Property that
  // would be hard to dispose of.

  const usesNegativeString = providedOptions?.numberFormatOptions?.replaceMinusWithNegative ?? getDefaultOptions( isSpoken ).replaceMinusWithNegative;
  return new DerivedProperty( [
    valueProperty,
    // Only include negative string in dependencies if it will be included with our options
    // Cast will remove it from the type (so it will type nicely)
    ...( usesNegativeString ? SceneryPhetFluent.a11y.negativeNumber.getDependentProperties() : [] )
  ] as [ typeof valueProperty ], value => {
    return getFormattedNumberString( value, isSpoken, providedOptions?.numberFormatOptions );
  }, providedOptions );
};

export const getFormattedVisualNumberStringProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string>
): TReadOnlyProperty<string> => {
  return getFormattedNumberStringProperty( valueProperty, false, providedOptions );
};

export const getFormattedSpokenNumberStringProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string>
): TReadOnlyProperty<string> => {
  return getFormattedNumberStringProperty( valueProperty, true, providedOptions );
};

export const getDisposableNumberStringFluentPatternProperty = (
  valueProperty: TReadOnlyProperty<number>,
  fluentPattern: FluentPattern<{ value: FluentVariable }>,
  isSpoken?: boolean,
  providedOptions?: FormattedNumberPropertyOptions<string>
): TReadOnlyProperty<string> => {
  const formattedNumberProperty = getFormattedNumberProperty( valueProperty, isSpoken, {
    numberFormatOptions: providedOptions?.numberFormatOptions
  } );

  const derivedProperty = fluentPattern.createProperty( {
    value: formattedNumberProperty
  } );

  // Dispose of the formatted number property when we dispose the outer value
  const previousDispose = derivedProperty.dispose.bind( derivedProperty );
  derivedProperty.dispose = () => {
    previousDispose();
    formattedNumberProperty.dispose();
  };

  return derivedProperty;
};

/**
 * Combines visual/spoken string Properties together, and will dispose together as a unit
 */
export const combineToDisposableAccessibleString = (
  visualStringProperty: TReadOnlyProperty<string>,
  spokenStringProperty: TReadOnlyProperty<string>
): TReadOnlyProperty<AccessibleString> => {
  const derivedProperty = new DerivedProperty( [ visualStringProperty, spokenStringProperty ], ( visualString, spokenString ) => {
    return {
      visualString: visualString,
      spokenString: spokenString
    };
  } );

  // Dispose of the number properties when we dispose the outer value
  const previousDispose = derivedProperty.dispose.bind( derivedProperty );
  derivedProperty.dispose = () => {
    previousDispose();
    visualStringProperty.dispose();
    spokenStringProperty.dispose();
  };

  return derivedProperty;
};

sceneryPhet.register( 'UnitFormatter', UnitFormatter );