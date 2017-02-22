// Copyright 2016, University of Colorado Boulder

/**
 * Base type for keys used in a keypad.
 *
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Node} displayNode - node that will appear on the key
   * @param {string} identifier TODO document me
   * @param options
   * @constructor
   */
  function Key( displayNode, identifier, options ) {
    Tandem.indicateUninstrumentedCode();

    // make sure identifier passed exists in the Keys enum

    //assert && assert( Keys[ identifier ], 'This type of key does not exist yet. Please refer to Keys Enum' );
    options = _.extend( {
      horizontalSpan: 1,
      verticalSpan: 1
    }, options );

    //TODO visibility annotations?
    this.displayNode = displayNode;
    this.identifier = identifier;
    this.horizontalSpan = options.horizontalSpan;
    this.verticalSpan = options.verticalSpan;
  }

  sceneryPhet.register( 'Key', Key );

  return inherit( Object, Key, {

  } );
} );