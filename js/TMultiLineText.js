// Copyright 2017, University of Colorado Boulder

/**
 * Wrapper type for scenery-phet's MultiLineText node.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var TNode = require( 'SCENERY/nodes/TNode' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var phetioEvents = require( 'ifphetio!PHET_IO/phetioEvents' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );
  var TVoid = require( 'ifphetio!PHET_IO/types/TVoid' );

  /**
   * Wrapper type for scenery's Text node.
   * @param {Text} text
   * @param {string} phetioID
   * @constructor
   */
  function TMultiLineText( text, phetioID ) {
    TNode.call( this, text, phetioID );
    assertInstanceOf( text, phet.sceneryPhet.MultiLineText );
    text.on( 'text', function( oldText, newText ) {
      phetioEvents.trigger( 'model', phetioID, TMultiLineText, 'textChanged', {
        oldText: oldText,
        newText: newText
      } );
    } );
  }

  phetioInherit( TNode, 'TMultiLineText', TMultiLineText, {
    setText: {
      returnType: TVoid,
      parameterTypes: [ TString ],
      implementation: function( text ) {
        this.instance.text = text;
      },
      documentation: 'Set the text content'
    },

    getText: {
      returnType: TString,
      parameterTypes: [],
      implementation: function() {
        return this.instance.text;
      },
      documentation: 'Get the text content'
    }
  }, {
    documentation: 'The tandem wrapper type for the scenery phet\'s MultiLineText node'
  } );

  sceneryPhet.register( 'TMultiLineText', TMultiLineText );

  return TMultiLineText;
} );