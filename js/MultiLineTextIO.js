// Copyright 2017, University of Colorado Boulder

/**
 * IO type for scenery-phet's MultiLineText node.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );
  var VoidIO = require( 'ifphetio!PHET_IO/types/VoidIO' );

  /**
   * @param {MultiLineText} multiLineText
   * @param {string} phetioID
   * @constructor
   */
  function MultiLineTextIO( multiLineText, phetioID ) {
    assert && assertInstanceOf( multiLineText, phet.sceneryPhet.MultiLineText );
    NodeIO.call( this, multiLineText, phetioID );
  }

  phetioInherit( NodeIO, 'MultiLineTextIO', MultiLineTextIO, {
    setText: {
      returnType: VoidIO,
      parameterTypes: [ StringIO ],
      implementation: function( text ) {
        this.instance.text = text;
      },
      documentation: 'Set the text content'
    },

    getText: {
      returnType: StringIO,
      parameterTypes: [],
      implementation: function() {
        return this.instance.text;
      },
      documentation: 'Get the text content'
    }
  }, {
    documentation: 'The tandem IO type for the scenery phet\'s MultiLineText node',
    events: [ 'changed' ]
  } );

  sceneryPhet.register( 'MultiLineTextIO', MultiLineTextIO );

  return MultiLineTextIO;
} );