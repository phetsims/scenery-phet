// Copyright 2025, University of Colorado Boulder

/**
 * Number formatting utilities (based on getFormattedNumber), for both immediate mode and Property-based formatting.
 *
 * NOTE: This exists in scenery-phet (as opposed to phetcommon or axon) because it has a dependency on accessible strings
 * that are defined in scenery-phet.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { optionize3 } from '../../phet-core/js/optionize.js';
import { toFixed } from '../../dot/js/util/toFixed.js';
import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';
import SceneryPhetFluent from './SceneryPhetFluent.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import PatternStringProperty from '../../axon/js/PatternStringProperty.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';
import { AccessibleValuePattern, DEFAULT_FORMATTED_NUMBER_ACCESSIBLE_OPTIONS, DEFAULT_FORMATTED_NUMBER_VISUAL_OPTIONS, DualString, FormattedNumberPropertyOptions, NumberFormatOptions } from '../../axon/js/AccessibleStrings.js';

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
    exponent = Math.floor( Math.log( absoluteValue ) / Math.log( options.scientificBase ) );
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

  // Wrap with LTR marks if enabled, so it will show up correctly in RTL languages.
  if ( options.wrapLTR ) {
    absoluteValueOutput = StringUtils.wrapLTR( `${absoluteValueOutput}` );
  }

  return absoluteValueOutput;
};

/**
 * Defaults depend on whether the number is accessible or visual.
 */
const getDefaultOptions = ( isAccessible?: boolean ): Required<NumberFormatOptions> => {
  return isAccessible ? DEFAULT_FORMATTED_NUMBER_ACCESSIBLE_OPTIONS : DEFAULT_FORMATTED_NUMBER_VISUAL_OPTIONS;
};

/**
 * Convenience function for getFormattedNumber with isAccessible = false
 */
export const getFormattedVisualNumber = ( value: number, providedOptions?: NumberFormatOptions ): string | number => {
  return getFormattedNumber( value, false, providedOptions );
};

/**
 * Convenience function for getFormattedNumber with isAccessible = true
 */
export const getFormattedAccessibleNumber = ( value: number, providedOptions?: NumberFormatOptions ): string | number => {
  return getFormattedNumber( value, true, providedOptions );
};

/**
 * Convenience function for getFormattedNumber that always returns a string.
 */
export const getFormattedNumberString = ( value: number, isAccessible?: boolean, options?: NumberFormatOptions ): string => {
  return `${getFormattedNumber( value, isAccessible, options )}`;
};

/**
 * Convenience function for getFormattedNumber (with isAccessible=false) that always returns a string.
 */
export const getFormattedVisualNumberString = ( value: number, options?: NumberFormatOptions ): string => {
  return `${getFormattedNumber( value, false, options )}`;
};

/**
 * Convenience function for getFormattedNumber (with isAccessible=true) that always returns a string.
 */
export const getFormattedAccessibleNumberString = ( value: number, options?: NumberFormatOptions ): string => {
  return `${getFormattedNumber( value, true, options )}`;
};

/**
 * DerivedProperty that applies getFormattedNumber to a number Property.
 */
export const getFormattedNumberProperty = (
  valueProperty: TReadOnlyProperty<number>,
  isAccessible?: boolean,
  providedOptions?: FormattedNumberPropertyOptions<string | number>
): ReadOnlyProperty<string | number> => {
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

/**
 * Convenience function for getFormattedNumberProperty with isAccessible = false
 */
export const getFormattedVisualNumberProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string | number>
): ReadOnlyProperty<string | number> => {
  return getFormattedNumberProperty( valueProperty, false, providedOptions );
};

/**
 * Convenience function for getFormattedNumberProperty with isAccessible = false
 */
export const getFormattedAccessibleNumberProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string | number>
): ReadOnlyProperty<string | number> => {
  return getFormattedNumberProperty( valueProperty, true, providedOptions );
};

/**
 * Convenience function for getFormattedNumberProperty that always returns a string.
 */
export const getFormattedNumberStringProperty = (
  valueProperty: TReadOnlyProperty<number>,
  isAccessible?: boolean,
  providedOptions?: FormattedNumberPropertyOptions<string>
): ReadOnlyProperty<string> => {
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

/**
 * Convenience function for getFormattedNumberStringProperty with isAccessible = false
 */
export const getFormattedVisualNumberStringProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string>
): ReadOnlyProperty<string> => {
  return getFormattedNumberStringProperty( valueProperty, false, providedOptions );
};

/**
 * Convenience function for getFormattedNumberStringProperty with isAccessible = true
 */
export const getFormattedAccessibleNumberStringProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string>
): ReadOnlyProperty<string> => {
  return getFormattedNumberStringProperty( valueProperty, true, providedOptions );
};

/**
 * Wraps a number formatting PatternStringProperty so that disposing it also disposes the internal formatted number Property.
 *
 * For use in APIs where we return a single object to the user for them to dispose when they are done.
 */
export const getDisposableNumberStringPatternProperty = (
  valueProperty: TReadOnlyProperty<number>,
  patternStringProperty: TReadOnlyProperty<string>,
  isAccessible?: boolean,
  providedOptions?: FormattedNumberPropertyOptions<string>
): ReadOnlyProperty<string> => {
  const formattedNumberProperty = getFormattedNumberProperty( valueProperty, isAccessible, {
    numberFormatOptions: providedOptions?.numberFormatOptions
  } );

  const resultProperty = new PatternStringProperty( patternStringProperty, {
    value: formattedNumberProperty
  } );

  resultProperty.addDisposable( formattedNumberProperty );

  return resultProperty;
};

/**
 * Wraps a number formatting FluentPattern.createProperty so that disposing it also disposes the internal formatted number Property.
 *
 * For use in APIs where we return a single object to the user for them to dispose when they are done.
 */
export const getDisposableNumberStringFluentPatternProperty = (
  valueProperty: TReadOnlyProperty<number>,
  fluentPattern: AccessibleValuePattern,
  isAccessible?: boolean,
  providedOptions?: FormattedNumberPropertyOptions<string>
): ReadOnlyProperty<string> => {
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
 * Combines visual/accessible string Properties together, and will dispose together as a unit.
 */
export const combineToDisposableDualString = (
  visualStringProperty: TReadOnlyProperty<string>,
  accessibleStringProperty: TReadOnlyProperty<string>
): ReadOnlyProperty<DualString> => {
  const derivedProperty = new DerivedProperty( [ visualStringProperty, accessibleStringProperty ], ( visualString, accessibleString ) => {
    return {
      visualString: visualString,
      accessibleString: accessibleString
    };
  } );

  derivedProperty.addDisposable( visualStringProperty, accessibleStringProperty );

  return derivedProperty;
};