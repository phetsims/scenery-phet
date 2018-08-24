// Copyright 2016-2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  // var KitControlNodeSides = require( 'SCENERY_PHET/KitControlNodeSides' );
  var KitSelectionNode = require( 'SCENERY_PHET/KitSelectionNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  // var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  // var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  // var GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  // var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  // var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Property = require( 'AXON/Property' );
  // var RadioButtonGroupMember = require( 'SUN/buttons/RadioButtonGroupMember' );
  // var Range = require( 'DOT/Range' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  // var ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  // var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  // var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  // var UpDownSpinner = require( 'SCENERY_PHET/UpDownSpinner' );
  // var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );
  var sceneryPhetQueryParameters = require( 'SCENERY_PHET/sceneryPhetQueryParameters' );

  function ComponentHolder( createFunction ) {
    var self = this;
    this.dispose = function() {
      self.instance.dispose();
    };
    this.create = function() {
      self.instance = createFunction();
    };
  }

  // var booleanProperty = new Property( false );
  var numberProperty = new Property( 1 );
  // var waveLengthProperty = new Property( 400 );

  var components = [
    // new ComponentHolder( function() {
    //   return new MeasuringTapeNode( new Property( {name: 'cm', multiplier: 100 } ), booleanProperty );
    // } ),
    // new ComponentHolder( function() {
    //   return new FaucetNode( 1, numberProperty, booleanProperty );
    // } ),
    // new ComponentHolder( function() {
    //   return new GaugeNode( numberProperty, 'label', { min: 0, max: 1 } );
    // } ),
    // new ComponentHolder( function() {
    //   return new ThermometerNode( 0, 1, numberProperty );
    // } ),
    // new ComponentHolder( function() {
    //   return new ScientificNotationNode( numberProperty );
    // } ),
    // new ComponentHolder( function() {
    //   return new NumberPicker( numberProperty, new Property( new Range( 0, 2 ) ) );
    // } ),
    // new ComponentHolder( function() {
    //   return new WavelengthSlider( waveLengthProperty );
    // } ) //,
    // new ComponentHolder( function() {
    //   return new LeftRightSpinner( numberProperty, booleanProperty, booleanProperty );
    // } )
    // new ComponentHolder( function() {
    //   return new UpDownSpinner( numberProperty, booleanProperty, booleanProperty );
    // } ),
    // new ComponentHolder( function() {
    //   return new KitControlNodeSides( 1, new Property( 0 ), 1 );
    // } )
    // new ComponentHolder( function() {
    //   return new SoundToggleButton( booleanProperty );
    // } )
    // new ComponentHolder( function() {
    //   return new ExpandCollapseButton( booleanProperty );
    // } ),
    // new ComponentHolder( function() {
    //   return new RadioButtonGroupMember( booleanProperty, false );
    // } )
    new ComponentHolder( function() {
      var kits = [
        { title: new Text( 'kit 0', { font: new PhetFont( 24 ) } ), content: new HStrut( 200 ) },
        { title: new Text( 'kit 1', { font: new PhetFont( 24 ) } ), content: new HStrut( 200 ) }
      ];
      return new KitSelectionNode( numberProperty, kits, { selectorPosition: 'top' } );
    } )
  ];

  /**
   * @constructor
   */
  function MemoryTestsScreenView() {
    ScreenView.call( this );

    this.numTests = 0;
    this.maxNumTests = sceneryPhetQueryParameters.memoryTestCreationMax;
  }

  sceneryPhet.register( 'MemoryTestsScreenView', MemoryTestsScreenView );

  return inherit( ScreenView, MemoryTestsScreenView, {
    step: function() {

      if ( this.numTests < this.maxNumTests ) {
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
        this.numTests++;
      }
    }
  } );
} );

