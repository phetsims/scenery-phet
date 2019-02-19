// Copyright 2018-2019, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  // var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  // var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  // var FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  // var GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  // var HStrut = require( 'SCENERY/nodes/HStrut' );
  // var KitControlNodeSides = require( 'SCENERY_PHET/KitControlNodeSides' );
  // var KitSelectionNode = require( 'SCENERY_PHET/KitSelectionNode' );
  // var LeftRightSpinner = require( 'SCENERY_PHET/LeftRightSpinner' );
  // var MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  // var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  // var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  // var PushButtonInteractionStateProperty = require( 'SUN/buttons/PushButtonInteractionStateProperty' );
  // var PushButtonModel = require( 'SUN/buttons/PushButtonModel' );
  // var RadioButtonGroupMember = require( 'SUN/buttons/RadioButtonGroupMember' );
  // var Range = require( 'DOT/Range' );
  // var RewindButton = require( 'SCENERY_PHET/buttons/RewindButton' );
  // var RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  // var RoundButtonView = require( 'SUN/buttons/RoundButtonView' );
  // var ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );
  // var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  // var Text = require( 'SCENERY/nodes/Text' );
  // var ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  var TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  // var UpDownSpinner = require( 'SCENERY_PHET/UpDownSpinner' );
  // var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var sceneryPhetQueryParameters = require( 'SCENERY_PHET/sceneryPhetQueryParameters' );
  var ScreenView = require( 'JOIST/ScreenView' );

  // var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );

  function ComponentHolder( createFunction ) {
    var self = this;
    this.dispose = function() {
      self.instance.dispose();
    };
    this.create = function() {
      self.instance = createFunction();
    };
  }

  var booleanProperty = new BooleanProperty( false );
  // var numberProperty = new Property( 1 );
  // var waveLengthProperty = new Property( 400 );

  var components = [
    // new ComponentHolder( function() {
    //   return new MeasuringTapeNode( new Property( {name: 'cm', multiplier: 100 } ), booleanProperty );
    // } ),
    // new ComponentHolder( function() {
    //   return new FaucetNode( 1, numberProperty, booleanProperty );
    // } ),
    // new ComponentHolder( function() {
    //   return new GaugeNode( numberProperty, 'label', new Range( 0, 1 ) );
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
    // } )
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
    // new ComponentHolder( function() {
    //   var kits = [
    //     { title: new Text( 'kit 0', { font: new PhetFont( 24 ) } ), content: new HStrut( 200 ) },
    //     { title: new Text( 'kit 1', { font: new PhetFont( 24 ) } ), content: new HStrut( 200 ) }
    //   ];
    //   return new KitSelectionNode( numberProperty, kits, { selectorPosition: 'sides' } );
    // } )
    // new ComponentHolder( function() {
    //   return new RewindButton();
    // } )
    // new ComponentHolder( function() {
    //   var pushButtonModel = new PushButtonModel();
    //   var pushButtonInteractionStateProperty = new PushButtonInteractionStateProperty( pushButtonModel );
    //   return new RoundButtonView( pushButtonModel, pushButtonInteractionStateProperty );
    // } ),
    new ComponentHolder( function() {
      return new TimerToggleButton( booleanProperty );
    } )
    // new ComponentHolder( function() {
    //   return new RoundStickyToggleButton(
    //     0,
    //     1,
    //     booleanProperty
    //   );
    // } )
    // new ComponentHolder( function() {
    //   return new BooleanRectangularToggleButton( new Text( 'true' ), new Text( 'false' ), booleanProperty );
    // } )

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

