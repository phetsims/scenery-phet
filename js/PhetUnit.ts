// Copyright 2018-2025, University of Colorado Boulder

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
import { Unit, AccessibleString, NumberFormatOptions, FormattedNumberPropertyOptions, DEFAULT_FORMATTED_NUMBER_VISUAL_OPTIONS, DEFAULT_FORMATTED_NUMBER_SPOKEN_OPTIONS } from '../../axon/js/Unit.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';
import sceneryPhet from './sceneryPhet.js';
import SceneryPhetFluent from './SceneryPhetFluent.js';

export type PhetUnitOptions = {
  visualStandaloneStringProperty?: TReadOnlyProperty<string>;
  visualPattern: FluentPattern<{ value: FluentVariable }>;
  spokenPattern: FluentPattern<{ value: FluentVariable }>;
};

export default class PhetUnit implements Unit {

  // Presence of support for methods that return strings
  public readonly hasVisualStandaloneString: boolean;
  public readonly hasVisualString: boolean;
  public readonly hasSpokenString: boolean;

  // String Property for the "standalone" string (e.g. units with no value)
  public readonly visualStandaloneStringProperty?: TReadOnlyProperty<string>;

  // Pattern for the visual "value + units" combination
  public readonly visualPattern?: FluentPattern<{ value: FluentVariable }>;

  // Pattern for the spoken "value + units" combination
  public readonly spokenPattern?: FluentPattern<{ value: FluentVariable }>;

  public constructor(
    public readonly name: string, // e.g. 'm'
    options?: PhetUnitOptions
  ) {
    this.visualStandaloneStringProperty = options?.visualStandaloneStringProperty;
    this.visualPattern = options?.visualPattern;
    this.spokenPattern = options?.spokenPattern;

    this.hasVisualStandaloneString = !!this.visualStandaloneStringProperty;
    this.hasVisualString = !!this.visualPattern;
    this.hasSpokenString = !!this.spokenPattern;
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
    if ( !this.visualPattern ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for visual strings.` );
    }

    return this.visualPattern.format( {
      value: getFormattedVisualNumber( value, providedOptions )
    } );
  }

  /**
   * Get the current value/translation of the spoken string (value + units).
   */
  public getSpokenString( value: number, providedOptions?: NumberFormatOptions ): string {
    if ( !this.spokenPattern ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for spoken strings.` );
    }

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

  public getVisualStandaloneStringProperty(): TReadOnlyProperty<string> {
    if ( !this.visualStandaloneStringProperty ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for visual standalone strings.` );
    }

    return this.visualStandaloneStringProperty;
  }

  public getVisualStringProperty(
    valueProperty: TReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): TReadOnlyProperty<string> {
    if ( !this.visualPattern ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for visual strings.` );
    }

    return getDisposableNumberStringFluentPatternProperty( valueProperty, this.visualPattern, false, providedOptions );
  }

  public getSpokenStringProperty(
    valueProperty: TReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): TReadOnlyProperty<string> {
    if ( !this.spokenPattern ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for spoken strings.` );
    }

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
}

const getDefaultOptions = ( isSpoken?: boolean ): Required<NumberFormatOptions> => {
  return isSpoken ? DEFAULT_FORMATTED_NUMBER_SPOKEN_OPTIONS : DEFAULT_FORMATTED_NUMBER_VISUAL_OPTIONS;
};

export const getFormattedNumber = (
  value: number,
  isSpoken?: boolean,
  providedOptions?: NumberFormatOptions
): string | number => {
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

sceneryPhet.register( 'PhetUnit', PhetUnit );