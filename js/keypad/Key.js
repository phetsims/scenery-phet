// Copyright 2016-2018, University of Colorado Boulder

/**
 * key object, intended for use in the PhET common-code keypad
 *
 * @author Aadish Gupta
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {Node|string} label - node or string that will appear on the key
   * @param {KeyID} identifier - ID for this key, see KeyID.js
   * @param {object} [options]
   * @constructor
   */
  function Key( label, identifier, options ) {

    options = _.extend( {
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
  }

  sceneryPhet.register( 'Key', Key );

  return inherit( Object, Key, {} );
} );