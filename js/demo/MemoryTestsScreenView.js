// Copyright 2016-2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  var GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );
  var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );

  function ComponentHolder( createFunction ) {
    var self = this;
    this.dispose = function() {
      self.instance.dispose();
    };
    this.create = function() {
      self.instance = createFunction();
    };
  }

  var booleanProperty = new Property( false );
  var numberProperty = new Property( 1 );

  var components = [
    new ComponentHolder( function() {
      return new MeasuringTapeNode( new Property( {name: 'cm', multiplier: 100 } ), booleanProperty );
    } ),
    new ComponentHolder( function() {
      return new FaucetNode( 1, numberProperty, booleanProperty );
    } ),
    new ComponentHolder( function() {
      return new GaugeNode( numberProperty, 'label', { min: 0, max: 1 } );
    } ),
    new ComponentHolder( function() {
      return new ThermometerNode( 0, 1, numberProperty );
    } ),
    new ComponentHolder( function() {
      return new ScientificNotationNode( numberProperty );
    } )
  ];

  /**
   * @constructor
   */
  function MemoryTestsScreenView() {
    ScreenView.call( this );
  }

  sceneryPhet.register( 'MemoryTestsScreenView', MemoryTestsScreenView );

  return inherit( ScreenView, MemoryTestsScreenView, {
    step: function() {

      for ( var i = 0; i < components.length; i++ ) {
        var holder = components[ i ];

        // dispose first, then create and add at the end of the loop so components will be visible on the screen during
        // animation.
        holder.instance && this.removeChild( holder.instance );
        holder.instance && holder.dispose();

        holder.create();
        this.addChild( holder.instance );
      }
      console.log( 'create' );
    }
  } );
} );

