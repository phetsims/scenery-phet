// Copyright 2018-2020, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */


// modules
// const BooleanRectangularToggleButton = require( '/sun/js/buttons/BooleanRectangularToggleButton' );
// const ExpandCollapseButton = require( '/sun/js/ExpandCollapseButton' );
// const FaucetNode = require( '/scenery-phet/js/FaucetNode' );
// const GaugeNode = require( '/scenery-phet/js/GaugeNode' );
// const HStrut = require( '/scenery/js/nodes/HStrut' );
// const KitControlNodeSides = require( '/scenery-phet/js/KitControlNodeSides' );
// const LeftRightSpinner = require( '/scenery-phet/js/LeftRightSpinner' );
// const MeasuringTapeNode = require( '/scenery-phet/js/MeasuringTapeNode' );
// const NumberPicker = require( '/scenery-phet/js/NumberPicker' );
// const PhetFont = require( '/scenery-phet/js/PhetFont' );
// const PushButtonInteractionStateProperty = require( '/sun/js/buttons/PushButtonInteractionStateProperty' );
// const PushButtonModel = require( '/sun/js/buttons/PushButtonModel' );
// const RadioButtonGroupMember = require( '/sun/js/buttons/RadioButtonGroupMember' );
// const Range = require( '/dot/js/Range' );
// const RestartButton = require( '/scenery-phet/js/buttons/RestartButton' );
// const RoundStickyToggleButton = require( '/sun/js/buttons/RoundStickyToggleButton' );
// const RoundButtonView = require( '/sun/js/buttons/RoundButtonView' );
// const ScientificNotationNode = require( '/scenery-phet/js/ScientificNotationNode' );
// const SoundToggleButton = require( '/scenery-phet/js/buttons/SoundToggleButton' );
// const Text = require( '/scenery/js/nodes/Text' );
// const ThermometerNode = require( '/scenery-phet/js/ThermometerNode' );
import BooleanProperty from '../../../axon/js/BooleanProperty.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import inherit from '../../../phet-core/js/inherit.js';
import TimerToggleButton from '../buttons/TimerToggleButton.js';
import sceneryPhet from '../sceneryPhet.js';
import sceneryPhetQueryParameters from '../sceneryPhetQueryParameters.js';

// const UpDownSpinner = require( '/scenery-phet/js/UpDownSpinner' );
// const WavelengthSlider = require( '/scenery-phet/js/WavelengthSlider' );

// const SoundToggleButton = require( '/scenery-phet/js/buttons/SoundToggleButton' );

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
  //   return new RestartButton();
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

export default inherit( ScreenView, MemoryTestsScreenView, {
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