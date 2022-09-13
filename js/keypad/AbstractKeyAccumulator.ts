// Copyright 2016-2022, University of Colorado Boulder

/**
 * base type for an object that accumulates key presses, works in conjunction with the common-code keypad
 *
 * @author John Blanco
 * @author Aadish Gupta
 */

import Property from '../../../axon/js/Property.js';
import ReadOnlyProperty from '../../../axon/js/ReadOnlyProperty.js';
import sceneryPhet from '../sceneryPhet.js';
import KeyID, { KeyIDValue } from './KeyID.js';

abstract class AbstractKeyAccumulator {

  // string representation of the keys entered by the user
  public abstract readonly stringProperty: ReadOnlyProperty<string>;

  // numerical value of the keys entered by the user
  public abstract readonly valueProperty: ReadOnlyProperty<number | null>;

  // Property that tracks the accumulated key presses as an array
  public readonly accumulatedKeysProperty: Property<KeyIDValue[]> = new Property<KeyIDValue[]>( [] );

  // When true, the next key press (expect backspace) will clear the accumulated value
  public _clearOnNextKeyPress = false;

  public constructor( protected readonly validators: ( ( keys: KeyIDValue[] ) => boolean )[] ) {

  }

  public get clearOnNextKeyPress(): boolean { return this.getClearOnNextKeyPress(); }

  public set clearOnNextKeyPress( value: boolean ) { this.setClearOnNextKeyPress( value ); }

  /**
   * Clears the accumulated keys.
   */
  public clear(): void {
    this.accumulatedKeysProperty.reset();
  }

  /**
   * Sets/clears the flag that determines whether pressing a key (except for backspace) will clear the accumulated keys.
   */
  public setClearOnNextKeyPress( clearOnNextKeyPress: boolean ): void {
    this._clearOnNextKeyPress = clearOnNextKeyPress;
  }

  /**
   * Gets the value of the flag determines whether pressing a key (except for backspace) will clear the accumulated keys.
   */
  public getClearOnNextKeyPress(): boolean {
    return this._clearOnNextKeyPress;
  }

  /**
   * validates a proposed set of keys and (if valid) update the property that represents the accumulated keys
   * @param proposedKeys - the proposed set of keys, to be validated
   *
   * @returns boolean
   */
  protected validateKeys( proposedKeys: KeyIDValue[] ): boolean {

    // Ensures that proposedKeys exist before validation
    let valid = !!proposedKeys;

    // If any validator returns false then the proposedKey is not valid
    this.validators.forEach( validator => {
      valid = valid && validator( proposedKeys );
    } );
    return valid;
  }

  /**
   * update the property that represents the accumulated keys
   * @param proposedKeys - the proposed set of keys
   */
  protected updateKeys( proposedKeys: KeyIDValue[] ): void {
    this.accumulatedKeysProperty.set( proposedKeys );
  }

  /**
   * Called by the key accumulator when this key is pressed.
   */
  public abstract handleKeyPressed( keyIdentifier: KeyIDValue ): void;

  /**
   * creates an empty array if clearOnNextKeyPress is true, the behavior differs if Backspace key is pressed
   */
  protected handleClearOnNextKeyPress( keyIdentifier: KeyIDValue ): KeyIDValue[] {
    let proposedArray: KeyIDValue[];
    if ( !this.getClearOnNextKeyPress() || keyIdentifier === KeyID.BACKSPACE ) {
      proposedArray = _.clone( this.accumulatedKeysProperty.get() );
    }
    else {
      proposedArray = [];
    }
    this.setClearOnNextKeyPress( false );
    return proposedArray;
  }

  public dispose(): void {
    this.accumulatedKeysProperty.dispose();
  }
}

sceneryPhet.register( 'AbstractKeyAccumulator', AbstractKeyAccumulator );
export default AbstractKeyAccumulator;