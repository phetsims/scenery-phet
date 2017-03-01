// Copyright 2016, University of Colorado Boulder

/**
 * Create Key to be used in a keypad.
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
   * @param {Keys} identifier look at Keys enum for types of identifier supported
   * @param {object} [options]
   * @constructor
   */
  function Key( displayNode, identifier, options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {
      horizontalSpan: 1,
      verticalSpan: 1
    }, options );

    this.displayNode = displayNode; // @public
    this.identifier = identifier; // @public
    this.horizontalSpan = options.horizontalSpan; // @public
    this.verticalSpan = options.verticalSpan; // @public
  }

  sceneryPhet.register( 'Key', Key );

  return inherit( Object, Key, {} );
} );