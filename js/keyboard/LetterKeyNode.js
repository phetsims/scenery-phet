// Copyright 2017-2019, University of Colorado Boulder

/**
 * Node that looks like a keyboard key with a single letter. By default, a letter key is square, with a bit less
 * horizontal padding than a key with a full word.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const TextKeyNode = require( 'SCENERY_PHET/keyboard/TextKeyNode' );

  /**
   * Constructor.
   *
   * @param {string} string - the letter for the key
   * @param {Object} options
   */
  function LetterKeyNode( string, options ) {

    options = _.extend( {
      xPadding: 5,
      forceSquareKey: true
    }, options );

    TextKeyNode.call( this, string, options );
  }

  sceneryPhet.register( 'LetterKeyNode', LetterKeyNode );

  return inherit( TextKeyNode, LetterKeyNode );

} );
