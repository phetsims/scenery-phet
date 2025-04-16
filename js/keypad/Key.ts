// Copyright 2022-2025, University of Colorado Boulder

/**
 * key object, intended for use in the PhET common-code keypad
 *
 * @author Aadish Gupta
 * @author John Blanco
 */

import optionize from '../../../phet-core/js/optionize.js';
import { OneKeyStroke } from '../../../scenery/js/input/KeyDescriptor.js';
import Node from '../../../scenery/js/nodes/Node.js';
import sceneryPhet from '../sceneryPhet.js';
import { KeyIDValue } from './KeyID.js';

type SelfOptions = {
  horizontalSpan?: number;
  verticalSpan?: number;
  keyboardIDs?: OneKeyStroke[];
};

export type KeyOptions = SelfOptions;

class Key {

  // number of horizontal cells in the keypad grid that this key occupies
  public readonly horizontalSpan: number;

  // number of vertical cells in the keypad grid that this key occupies
  public readonly verticalSpan: number;

  // The tandem component name to use when creating a button from this key.
  public readonly buttonTandemName: string;

  // For keyboard input, this is used to identify the keystroke to activate this key (see KeyboardListener.ts)
  public readonly keyboardIDs: OneKeyStroke[];

  /**
   * @param label - node or string that will appear on the key
   * @param keyID - ID for this key, see KeyID.js
   * @param [providedOptions]
   */
  public constructor(
    public readonly label: Node | string,
    public readonly keyID: KeyIDValue,
    providedOptions?: KeyOptions ) {

    const options = optionize<KeyOptions, SelfOptions>()( {
      horizontalSpan: 1,
      verticalSpan: 1,
      keyboardIDs: []
    }, providedOptions );

    this.horizontalSpan = options.horizontalSpan;
    this.verticalSpan = options.verticalSpan;
    this.keyboardIDs = options.keyboardIDs;

    this.buttonTandemName = `${_.camelCase( this.keyID )}Button`;
  }
}

sceneryPhet.register( 'Key', Key );
export default Key;