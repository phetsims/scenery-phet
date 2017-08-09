// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertions/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );
  // var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );
  var TVoid = require( 'ifphetio!PHET_IO/types/TVoid' );
  // var TFunctionWrapper = require( 'ifphetio!PHET_IO/types/TFunctionWrapper' );

  /**
   * Wrapper type for phet/scenery-phet's AriaHerald controller
   * @param ariaHerald
   * @param phetioID
   * @constructor
   */
  function TAriaHerald( ariaHerald, phetioID ) {
    TObject.call( this, ariaHerald, phetioID );
    assertInstanceOf( ariaHerald, Object );
  }

  phetioInherit( TObject, 'TAriaHerald', TAriaHerald, {

    announcePolite: {
      returnType: TVoid,
      parameterTypes: [ TString, TBoolean ],
      implementation: function( textContent, withClear ) {
        return this.instance.announcePolite( textContent, withClear );
      },
      documentation: 'Set the polite aria-live attribute in the sim frame\'s PDOM.'
    },

    setEnabled: {
      returnType: TVoid,
      parameterTypes: [ TBoolean ],
      implementation: function( enabled ) {
        this.instance.setEnabled (enabled) ;
      },
      documentation: 'Set whether the ariaHerald will be enabled.'
    }

  }, {
    documentation: 'Interfacing type to handle Aria alerts via the aria-live attribute.'
  } );

  sceneryPhet.register( 'TAriaHerald', TAriaHerald );

  return TAriaHerald;
} );

