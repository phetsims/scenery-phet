// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for MultiLineText
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );
  var NodeProperty = require( 'SCENERY/util/NodeProperty' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );

  /**
   * @param {MultiLineText} multiLineText
   * @param {string} phetioID
   * @constructor
   */
  function MultiLineTextIO( multiLineText, phetioID ) {
    assert && assertInstanceOf( multiLineText, phet.sceneryPhet.MultiLineText );
    NodeIO.call( this, multiLineText, phetioID );

    // this uses a sub Property adapter as described in https://github.com/phetsims/phet-io/issues/1326
    var textProperty = new NodeProperty( multiLineText, 'text', 'text', {

      // pick the following values from the parent Node
      phetioReadOnly: multiLineText.phetioReadOnly,
      phetioState: multiLineText.phetioState,
      phetioType: PropertyIO( StringIO ),

      tandem: multiLineText.tandem.createTandem( 'textProperty' ),
      phetioInstanceDocumentation: 'Property for the displayed text.'
    } );

    // @private
    this.disposeMultiLineTextIO = function() {
      textProperty.dispose();
    };
  }

  phetioInherit( NodeIO, 'MultiLineTextIO', MultiLineTextIO, {

    /**
     * @public - called by PhetioObject when the wrapper is done
     */
    dispose: function() {
      this.disposeMultiLineTextIO();
      NodeIO.prototype.dispose.call( this );
    }

  }, {
    documentation: 'The tandem IO type for the scenery phet\'s MultiLineText node',
    events: [ 'changed' ]
  } );

  sceneryPhet.register( 'MultiLineTextIO', MultiLineTextIO );

  return MultiLineTextIO;
} );