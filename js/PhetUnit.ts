// Copyright 2025, University of Colorado Boulder

/**
 * A rich enumeration value for units (which can be associated with Property instances).
 *
 * TODO: docs for how to add units under scenery-phet/js/units/ (and how to add strings)
 * TODO: ideally a markdown under units/
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import FluentPattern, { FluentVariable } from '../../chipper/js/browser/FluentPattern.js';
import { optionize3 } from '../../phet-core/js/optionize.js';
import { toFixed } from '../../dot/js/util/toFixed.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import { Unit, DualString, NumberFormatOptions, FormattedNumberPropertyOptions, DEFAULT_FORMATTED_NUMBER_VISUAL_OPTIONS, DEFAULT_FORMATTED_NUMBER_SPOKEN_OPTIONS } from '../../axon/js/Unit.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetFluent from './SceneryPhetFluent.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import PatternStringProperty from '../../axon/js/PatternStringProperty.js';

export type PhetUnitOptions = {
  visualStandaloneStringProperty?: TReadOnlyProperty<string>;
  visualPatternStringProperty?: TReadOnlyProperty<string>;
  accessiblePattern?: FluentPattern<{ value: FluentVariable }>;
};

export default class PhetUnit implements Unit {

  // Presence of support for methods that return strings
  public readonly hasVisualStandaloneString: boolean;
  public readonly hasVisualString: boolean;
  public readonly hasAccessibleString: boolean;

  // String Property for the "standalone" string (e.g. units with no value)
  public readonly visualStandaloneStringProperty?: TReadOnlyProperty<string>;

  // Pattern for the visual "value + units" combination
  public readonly visualPatternStringProperty?: TReadOnlyProperty<string>;

  // Pattern for the accessible "value + units" combination
  public readonly accessiblePattern?: FluentPattern<{ value: FluentVariable }>;

  public constructor(
    public readonly name: string, // Basic "backwards-compatible" name, e.g. "m" or "m/s^2"
    options?: PhetUnitOptions
  ) {
    this.visualStandaloneStringProperty = options?.visualStandaloneStringProperty;
    this.visualPatternStringProperty = options?.visualPatternStringProperty;
    this.accessiblePattern = options?.accessiblePattern;

    this.hasVisualStandaloneString = !!this.visualStandaloneStringProperty;
    this.hasVisualString = !!this.visualPatternStringProperty;
    this.hasAccessibleString = !!this.accessiblePattern;
  }

  /******************************************
   * Immediate mode "get a string" functions
   *******************************************/

  /**
   * Get the current value/translation of the standalone string (units with no value).
   */
  public getVisualStandaloneString(): string {
    if ( !this.visualStandaloneStringProperty ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for visual standalone strings.` );
    }

    return this.visualStandaloneStringProperty.value;
  }

  /**
   * Get the current value/translation of the visual string (value + units).
   */
  public getVisualString( value: number, providedOptions?: NumberFormatOptions ): string {
    if ( !this.visualPatternStringProperty ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for visual strings.` );
    }

    return StringUtils.fillIn( this.visualPatternStringProperty.value, {
      value: getFormattedVisualNumber( value, providedOptions )
    } );
  }

  /**
   * Get the current value/translation of the accessible string (value + units).
   */
  public getAccessibleString( value: number, providedOptions?: NumberFormatOptions ): string {
    if ( !this.accessiblePattern ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for accessible strings.` );
    }

    return this.accessiblePattern.format( {
      value: getFormattedAccessibleNumber( value, providedOptions )
    } );
  }

  /**
   * Get the current value/translation of the visual AND accessible string (value + units), as an AccessibleString.
   */
  public getDualString( value: number, providedOptions?: NumberFormatOptions ): DualString {
    return {
      visualString: this.getVisualString( value, providedOptions ),
      accessibleString: this.getAccessibleString( value, providedOptions )
    };
  }

  /******************************************
   * String Property getters
   *******************************************/

  /**
   * Get the string Property for the standalone visual string (units with no value).
   */
  public getVisualStandaloneStringProperty(): TReadOnlyProperty<string> {
    if ( !this.visualStandaloneStringProperty ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for visual standalone strings.` );
    }

    return this.visualStandaloneStringProperty;
  }

  /**
   * Get a string Property for a visual string (value + units) based on a value Property.
   */
  public getVisualStringProperty(
    valueProperty: TReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): TReadOnlyProperty<string> {
    if ( !this.visualPatternStringProperty ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for visual strings.` );
    }

    return getDisposableNumberStringPatternProperty( valueProperty, this.visualPatternStringProperty, false, providedOptions );
  }

  /**
   * Get a string Property for a accessible string (value + units) based on a value Property.
   */
  public getAccessibleStringProperty(
    valueProperty: TReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): TReadOnlyProperty<string> {
    if ( !this.accessiblePattern ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for accessible strings.` );
    }

    return getDisposableNumberStringFluentPatternProperty( valueProperty, this.accessiblePattern, true, providedOptions );
  }

  /**
   * Get an AccessibleString Property for a visual + accessible string (value + units) based on a value Property.
   */
  public getDualStringProperty(
    valueProperty: TReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): TReadOnlyProperty<DualString> {
    return combineToDisposableDualString(
      this.getVisualStringProperty( valueProperty, providedOptions ),
      this.getAccessibleStringProperty( valueProperty, providedOptions )
    );
  }
}

/**
 * Defaults depend on whether the number is accessible or visual.
 */
const getDefaultOptions = ( isAccessible?: boolean ): Required<NumberFormatOptions> => {
  return isAccessible ? DEFAULT_FORMATTED_NUMBER_SPOKEN_OPTIONS : DEFAULT_FORMATTED_NUMBER_VISUAL_OPTIONS;
};

/**
 * Catch-all number formatter. NOTE: the output is a number OR a string, depending on the options.
 *
 * Returning a number is a useful feature for integration with Fluent -- numbers allow for Fluent to use its
 * pluralization features, which is especially important for proper grammar in natural languages (in English, this
 * will be "1 centimeter" vs "2 centimeters").
 *
 * See NumberFormatOptions for the options that can be provided.
 */
export const getFormattedNumber = (
  value: number,
  isAccessible?: boolean,
  providedOptions?: NumberFormatOptions
): string | number => {
  const options = optionize3<NumberFormatOptions>()( {}, getDefaultOptions( isAccessible ), providedOptions );

  const isNegative = value < 0;
  let absoluteValue = Math.abs( value );

  // If using scientific notation, divide off the base raised to the exponent (so we are left with the non-exponent part)
  let exponent = 0;
  if ( options.useScientificNotation ) {
    exponent = Math.floor( Math.log( 5 ) / Math.log( options.scientificBase ) );
    absoluteValue /= Math.pow( options.scientificBase, exponent );
  }

  // The current "working" value
  let absoluteValueOutput: string | number;

  if ( options.decimalPlaces !== null ) {
    // Round the number to the specified number of decimal places (as a string)
    absoluteValueOutput = toFixed( absoluteValue, options.decimalPlaces );

    // See if we can ignore the trailing zeros (if so, we can convert it to a number, for better Fluent support).
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

  // Handle potential "negative" string replacement
  if ( isNegative ) {
    if ( isAccessible && options.replaceMinusWithNegative ) {
      absoluteValueOutput = SceneryPhetFluent.a11y.negativeNumber.format( { value: absoluteValueOutput } );
    }
    else {
      absoluteValueOutput = typeof absoluteValueOutput === 'number' ? -absoluteValueOutput : `-${absoluteValueOutput}`;
    }
  }

  if ( options.useScientificNotation && exponent !== 0 ) {
    const formatArgs = {
      value: absoluteValueOutput,
      exponent: exponent,
      base: options.scientificBase
    };

    if ( isAccessible ) {
      absoluteValueOutput = SceneryPhetFluent.a11y.scientificNotation.format( formatArgs );
    }
    else {
      absoluteValueOutput = StringUtils.fillIn( SceneryPhetFluent.scientificNotationStringProperty.value, formatArgs );
    }
  }

  return absoluteValueOutput;
};

export const getFormattedVisualNumber = ( value: number, providedOptions?: NumberFormatOptions ): string | number => {
  return getFormattedNumber( value, false, providedOptions );
};

export const getFormattedAccessibleNumber = ( value: number, providedOptions?: NumberFormatOptions ): string | number => {
  return getFormattedNumber( value, true, providedOptions );
};

export const getFormattedNumberString = ( value: number, isAccessible?: boolean, options?: NumberFormatOptions ): string => {
  return `${getFormattedNumber( value, isAccessible, options )}`;
};

export const getFormattedVisualNumberString = ( value: number, options?: NumberFormatOptions ): string => {
  return `${getFormattedNumber( value, false, options )}`;
};

export const getFormattedAccessibleNumberString = ( value: number, options?: NumberFormatOptions ): string => {
  return `${getFormattedNumber( value, true, options )}`;
};

export const getFormattedNumberProperty = (
  valueProperty: TReadOnlyProperty<number>,
  isAccessible?: boolean,
  providedOptions?: FormattedNumberPropertyOptions<string | number>
): TReadOnlyProperty<string | number> => {
  const usesNegativeString = providedOptions?.numberFormatOptions?.replaceMinusWithNegative ?? getDefaultOptions( isAccessible ).replaceMinusWithNegative;
  return new DerivedProperty( [
    valueProperty,
    // Only include negative string in dependencies if it will be included with our options
    // Cast will remove it from the type (so it will type nicely)
    ...( usesNegativeString ? SceneryPhetFluent.a11y.negativeNumber.getDependentProperties() : [] )
  ] as [ typeof valueProperty ], value => {
    return getFormattedNumber( value, isAccessible, providedOptions?.numberFormatOptions );
  }, providedOptions );
};

export const getFormattedVisualNumberProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string | number>
): TReadOnlyProperty<string | number> => {
  return getFormattedNumberProperty( valueProperty, false, providedOptions );
};

export const getFormattedAccessibleNumberProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string | number>
): TReadOnlyProperty<string | number> => {
  return getFormattedNumberProperty( valueProperty, true, providedOptions );
};

export const getFormattedNumberStringProperty = (
  valueProperty: TReadOnlyProperty<number>,
  isAccessible?: boolean,
  providedOptions?: FormattedNumberPropertyOptions<string>
): TReadOnlyProperty<string> => {
  // We could derive this from getAccessibleNumberProperty, but that would create another unnecessary Property that
  // would be hard to dispose of.

  const usesNegativeString = providedOptions?.numberFormatOptions?.replaceMinusWithNegative ?? getDefaultOptions( isAccessible ).replaceMinusWithNegative;
  return new DerivedProperty( [
    valueProperty,
    // Only include negative string in dependencies if it will be included with our options
    // Cast will remove it from the type (so it will type nicely)
    ...( usesNegativeString ? SceneryPhetFluent.a11y.negativeNumber.getDependentProperties() : [] )
  ] as [ typeof valueProperty ], value => {
    return getFormattedNumberString( value, isAccessible, providedOptions?.numberFormatOptions );
  }, providedOptions );
};

export const getFormattedVisualNumberStringProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string>
): TReadOnlyProperty<string> => {
  return getFormattedNumberStringProperty( valueProperty, false, providedOptions );
};

export const getFormattedAccessibleNumberStringProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string>
): TReadOnlyProperty<string> => {
  return getFormattedNumberStringProperty( valueProperty, true, providedOptions );
};

export const getDisposableNumberStringPatternProperty = (
  valueProperty: TReadOnlyProperty<number>,
  patternStringProperty: TReadOnlyProperty<string>,
  isAccessible?: boolean,
  providedOptions?: FormattedNumberPropertyOptions<string>
): TReadOnlyProperty<string> => {
  const formattedNumberProperty = getFormattedNumberProperty( valueProperty, isAccessible, {
    numberFormatOptions: providedOptions?.numberFormatOptions
  } );

  const resultProperty = new PatternStringProperty( patternStringProperty, {
    value: formattedNumberProperty
  } );

  resultProperty.addDisposable( formattedNumberProperty );

  return resultProperty;
};

export const getDisposableNumberStringFluentPatternProperty = (
  valueProperty: TReadOnlyProperty<number>,
  fluentPattern: FluentPattern<{ value: FluentVariable }>,
  isAccessible?: boolean,
  providedOptions?: FormattedNumberPropertyOptions<string>
): TReadOnlyProperty<string> => {
  const formattedNumberProperty = getFormattedNumberProperty( valueProperty, isAccessible, {
    numberFormatOptions: providedOptions?.numberFormatOptions
  } );

  const derivedProperty = fluentPattern.createProperty( {
    value: formattedNumberProperty
  } );

  derivedProperty.addDisposable( formattedNumberProperty );

  return derivedProperty;
};

/**
 * Combines visual/accessible string Properties together, and will dispose together as a unit
 */
export const combineToDisposableDualString = (
  visualStringProperty: TReadOnlyProperty<string>,
  accessibleStringProperty: TReadOnlyProperty<string>
): TReadOnlyProperty<DualString> => {
  const derivedProperty = new DerivedProperty( [ visualStringProperty, accessibleStringProperty ], ( visualString, accessibleString ) => {
    return {
      visualString: visualString,
      accessibleString: accessibleString
    };
  } );

  derivedProperty.addDisposable( visualStringProperty, accessibleStringProperty );

  return derivedProperty;
};

sceneryPhet.register( 'PhetUnit', PhetUnit );