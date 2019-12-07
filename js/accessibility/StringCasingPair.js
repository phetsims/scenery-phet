// Copyright 2019, University of Colorado Boulder

/**
 * A data structure that holds a string in its lowercase and capitalized form.
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  class StringCasingPair {

    /**
     * @param {string} lowercase
     * @param {string} capitalized
     */
    constructor( lowercase, capitalized ) {

      assert && assert( typeof lowercase === 'string' );
      assert && assert( typeof capitalized === 'string' );

      // @public (read-only)
      this.lowercase = lowercase;
      this.capitalized = capitalized;
    }
  }

  return sceneryPhet.register( 'StringCasingPair', StringCasingPair );
} );
