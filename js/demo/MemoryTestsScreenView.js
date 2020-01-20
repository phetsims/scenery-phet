// Copyright 2018-2019, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  // const BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  // const ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  // const FaucetNode = require( 'SCENERY_PHET/FaucetNode' );
  // const GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  // const HStrut = require( 'SCENERY/nodes/HStrut' );
  // const KitControlNodeSides = require( 'SCENERY_PHET/KitControlNodeSides' );
  // const LeftRightSpinner = require( 'SCENERY_PHET/LeftRightSpinner' );
  // const MeasuringTapeNode = require( 'SCENERY_PHET/MeasuringTapeNode' );
  // const NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  // const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  // const PushButtonInteractionStateProperty = require( 'SUN/buttons/PushButtonInteractionStateProperty' );
  // const PushButtonModel = require( 'SUN/buttons/PushButtonModel' );
  // const RadioButtonGroupMember = require( 'SUN/buttons/RadioButtonGroupMember' );
  // const Range = require( 'DOT/Range' );
  // const RewindButton = require( 'SCENERY_PHET/buttons/RewindButton' );
  // const RoundStickyToggleButton = require( 'SUN/buttons/RoundStickyToggleButton' );
  // const RoundButtonView = require( 'SUN/buttons/RoundButtonView' );
  // const ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );
  // const SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  // const Text = require( 'SCENERY/nodes/Text' );
  // const ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );
  const TimerToggleButton = require( 'SCENERY_PHET/buttons/TimerToggleButton' );
  // const UpDownSpinner = require( 'SCENERY_PHET/UpDownSpinner' );
  // const WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );
  const inherit = require( 'PHET_CORE/inherit' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const sceneryPhetQueryParameters = require( 'SCENERY_PHET/sceneryPhetQueryParameters' );
  const ScreenView = require( 'JOIST/ScreenView' );

  // const SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );

  function ComponentHolder( createFunction ) {
    const self = this;
    this.dispose = function() {
      self.instance.dispose();
    };
    this.create = function() {
      self.instance = createFunction();
    };
  }

  const booleanProperty = new BooleanProperty( false );
  // var numberProperty = new Property( 1 );
  // var waveLengthProperty = new Property( 400 );

  const components = [
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
        for ( let i = 0; i < components.length; i++ ) {
          const holder = components[ i ];

          // dispose first, then create and add at the end of the loop so components will be visible on the screen during
          // animation.
          holder.instance && this.removeChild( holder.instance );
          holder.instance && holder.dispose();

          holder.create();
          this.addChild( holder.instance );
        }
        this.numTests++;
      }
    }
  } );
} );

