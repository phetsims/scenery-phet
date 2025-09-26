// Copyright 2025, University of Colorado Boulder

/**
 * A rich enumeration value for units (which can be associated with Property instances).
 * Instances typically live in scenery-phet/js/units/.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import { TReadOnlyProperty } from '../../axon/js/TReadOnlyProperty.js';
import { Unit } from '../../axon/js/Unit.js';
import sceneryPhet from './sceneryPhet.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import ReadOnlyProperty from '../../axon/js/ReadOnlyProperty.js';
import { combineToDisposableDualString, getDisposableNumberStringFluentPatternProperty, getDisposableNumberStringPatternProperty, getFormattedAccessibleNumber, getFormattedAccessibleNumberStringProperty, getFormattedVisualNumber } from './NumberFormatting.js';
import { AccessibleValuePattern, DualString, FormattedNumberPropertyOptions, NumberFormatOptions } from '../../axon/js/AccessibleStrings.js';
import affirm from '../../perennial-alias/js/browser-and-node/affirm.js';
import units, { Units } from '../../axon/js/units.js';

export type PhetUnitOptions<InputPropertyType extends TReadOnlyProperty<string>> = {
  visualSymbolStringProperty: InputPropertyType;
  visualSymbolPatternStringProperty: InputPropertyType;
  accessiblePattern: AccessibleValuePattern;
};

// Parameterized so that we can get more specific methods on the input Properties.
export default class PhetUnit<InputPropertyType extends TReadOnlyProperty<string>> implements Unit {

  // String Property for the "standalone" string (e.g. units with no value)
  public readonly visualSymbolStringProperty?: InputPropertyType;

  // Pattern for the visual "value + units" combination
  public readonly visualSymbolPatternStringProperty?: InputPropertyType;

  // Pattern for the accessible "value + units" combination
  public readonly accessiblePattern?: AccessibleValuePattern;

  public constructor(
    public readonly name: string, // Basic "backwards-compatible" name, e.g. "m" or "m/s^2" (strings in axon/units.ts)
    options?: PhetUnitOptions<InputPropertyType>
  ) {
    affirm( units.values.includes( name as Units ), 'PhetUnit name should be in units.ts values for now, see https://github.com/phetsims/axon/issues/466' );

    this.visualSymbolStringProperty = options?.visualSymbolStringProperty;
    this.visualSymbolPatternStringProperty = options?.visualSymbolPatternStringProperty;
    this.accessiblePattern = options?.accessiblePattern;
  }

  /******************************************
   * Immediate mode "get a string" functions
   *******************************************/

  /**
   * Get the current value/translation of the standalone string (units with no value).
   */
  public getVisualSymbolString(): string {
    if ( !this.visualSymbolStringProperty ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for visual standalone strings.` );
    }

    return this.visualSymbolStringProperty.value;
  }

  /**
   * Get the current value/translation of the visual string (value + units).
   */
  public getVisualSymbolPatternString( value: number, providedOptions?: NumberFormatOptions ): string {
    if ( !this.visualSymbolPatternStringProperty ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for visual strings.` );
    }

    return StringUtils.fillIn( this.visualSymbolPatternStringProperty.value, {
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
      visualString: this.getVisualSymbolPatternString( value, providedOptions ),
      accessibleString: this.getAccessibleString( value, providedOptions )
    };
  }

  /******************************************
   * String Property getters
   *******************************************/

  /**
   * Get the string Property for the standalone visual string (units with no value).
   */
  public getVisualSymbolStringProperty(): InputPropertyType {
    if ( !this.visualSymbolStringProperty ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for visual standalone strings.` );
    }

    return this.visualSymbolStringProperty;
  }

  /**
   * Get a string Property for a visual string (value + units) based on a value Property.
   */
  public getVisualSymbolPatternStringProperty(
    valueProperty: TReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): ReadOnlyProperty<string> {
    if ( !this.visualSymbolPatternStringProperty ) {
      throw new Error( `This PhetUnit (${this.name}) does not have support for visual strings.` );
    }

    return getDisposableNumberStringPatternProperty( valueProperty, this.visualSymbolPatternStringProperty, false, providedOptions );
  }

  /**
   * Get a string Property for a accessible string (value + units) based on a value Property.
   */
  public getAccessibleStringProperty(
    valueProperty: TReadOnlyProperty<number>,
    providedOptions?: FormattedNumberPropertyOptions<string>
  ): ReadOnlyProperty<string> {
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
  ): ReadOnlyProperty<DualString> {
    return combineToDisposableDualString(
      this.getVisualSymbolPatternStringProperty( valueProperty, providedOptions ),
      this.getAccessibleStringProperty( valueProperty, providedOptions )
    );
  }

  /**
   * Get a list of the dependent properties that this unit relies on.
   */
  public getDependentProperties(): TReadOnlyProperty<unknown>[] {
    return [
      // Spreads for TS to typecheck a bit safer than a filter could
      ...( this.visualSymbolStringProperty ? [ this.visualSymbolStringProperty ] : [] ),
      ...( this.visualSymbolPatternStringProperty ? [ this.visualSymbolPatternStringProperty ] : [] ),
      ...( this.accessiblePattern ? this.accessiblePattern.getDependentProperties() : [] )
    ];
  }
}

sceneryPhet.register( 'PhetUnit', PhetUnit );

// Given a number Property, return an accessible string Property that either uses the unit's accessiblePattern (if available)
// or just formats the number (if not).
export const getFallbackAccessibleUnitsStringProperty = (
  valueProperty: TReadOnlyProperty<number>,
  providedOptions?: FormattedNumberPropertyOptions<string>
): ReadOnlyProperty<string> => {
  const units = ( valueProperty as unknown as ReadOnlyProperty<number> ).units;

  if ( units && typeof units !== 'string' ) {
    return units.getAccessibleStringProperty( valueProperty, providedOptions );
  }
  else {
    return getFormattedAccessibleNumberStringProperty( valueProperty, providedOptions );
  }
};