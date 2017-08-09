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
   * Wrapper type for phet/scenery's Node
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
    }

    // setVisible: {
    //   returnType: TVoid,
    //   parameterTypes: [ TBoolean ],
    //   implementation: function( visible ) {
    //     this.instance.visible = visible;
    //   },
    //   documentation: 'Set whether the ariaHerald will be visible (and interactive)'
    // },
    //
    // setPickable: {
    //   returnType: TVoid,
    //   parameterTypes: [ TBoolean ],
    //   implementation: function( pickable ) {
    //     this.instance.pickable = pickable;
    //   },
    //   documentation: 'Set whether the ariaHerald will be pickable (and hence interactive)'
    // },
    //
    // isPickable: {
    //   returnType: TBoolean,
    //   parameterTypes: [],
    //   implementation: function() {
    //     return this.instance.pickable;
    //   },
    //   documentation: 'Gets whether the ariaHerald is pickable (and hence interactive)'
    // },
    //
    // addPickableListener: {
    //   returnType: TVoid,
    //   parameterTypes: [ TFunctionWrapper( TVoid, [ TBoolean ] ) ],
    //   implementation: function( callback ) {
    //     var inst = this.instance;
    //     this.instance.on( 'pickability', function() {
    //       callback( inst.isPickable() );
    //     } );
    //   },
    //   documentation: 'Adds a listener for when pickability of the ariaHerald changes'
    // },
    //
    // addVisibleListener: {
    //   returnType: TVoid,
    //   parameterTypes: [ TFunctionWrapper( TVoid, [ TBoolean ] ) ],
    //   implementation: function( callback ) {
    //     var inst = this.instance;
    //     this.instance.on( 'visibility', function() {
    //       callback( inst.isVisible() );
    //     } );
    //   },
    //   documentation: 'Adds a listener for when visibility of the ariaHerald changes'
    // },
    //
    // setOpacity: {
    //   returnType: TVoid,
    //   parameterTypes: [ TNumber() ],
    //   implementation: function( opacity ) {
    //     this.instance.opacity = opacity;
    //   },
    //   documentation: 'Set opacity between 0-1 (inclusive)'
    // },
    //
    // setRotation: {
    //   returnType: TVoid,
    //   parameterTypes: [ TNumber() ],
    //   implementation: function( rotation ) {
    //     this.instance.rotation = rotation;
    //   },
    //   documentation: 'Set the rotation of the ariaHerald, in radians'
    // }
  }, {
    documentation: 'Interfacing type to handle Aria alerts via the aria-live attribute.'
  } );

  sceneryPhet.register( 'TAriaHerald', TAriaHerald );

  return TAriaHerald;
} );

