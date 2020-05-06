// Copyright 2016-2020, University of Colorado Boulder

/**
 * key object, intended for use in the PhET common-code keypad
 *
 * @author Aadish Gupta
 * @author John Blanco
 */

import merge from '../../../phet-core/js/merge.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @param {Node|string} label - node or string that will appear on the key
 * @param {KeyID} identifier - ID for this key, see KeyID.js
 * @param {object} [options]
 * @constructor
 */
function Key( label, identifier, options ) {

  options = merge( {
    horizontalSpan: 1,
    verticalSpan: 1
  }, options );

  // @public (read-only) {Node|string}
  this.label = label; // @public

  // @public (read-only) {KeyID}
  this.identifier = identifier;

  // @public (read-only) {number} - number of horizontal cells in the keypad grid that this key occupies
  this.horizontalSpan = options.horizontalSpan;

  // @public (read-only) {number} - number of vertical cells in the keypad grid that this key occupies
  this.verticalSpan = options.verticalSpan;

  // @public (read-only) {number} - the tandem component name to use when creating a button from this key.
  this.buttonTandemName = `${_.camelCase( this.identifier )}Button`;
}

sceneryPhet.register( 'Key', Key );
export default Key;