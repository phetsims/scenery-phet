// Copyright 2014-2015, University of Colorado Boulder

/**
 * Demonstration of scenery-phet sliders.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'slider' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var CheckBox = require( 'SUN/CheckBox' );
  var DemosView = require( 'SUN/demo/DemosView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  /**
   * @constructor
   */
  function SlidersView() {
    DemosView.call( this, 'slider', [

    /**
     * To add a demo, add an object literal here. Each object has these properties:
     *
     * {string} label - label in the combo box
     * {function(Bounds2): Node} getNode - creates the scene graph for the demo
     */
      { label: 'NumberControl', getNode: demoNumberControl },
      { label: 'WavelengthSlider', getNode: demoWavelengthSlider }
    ] );
  }

  sceneryPhet.register( 'SlidersView', SlidersView );

  // Creates a demo for NumberControl
  var demoNumberControl = function( layoutBounds ) {

    var weightRange = new RangeWithValue( 0, 300, 100 );
    var weightProperty = new Property( weightRange.defaultValue );
    var enabledProperty = new Property( true );

    var numberControl = new NumberControl( 'Weight:', weightProperty, weightRange, {
      enabledProperty: enabledProperty,
      titleFont: new PhetFont( 20 ),
      valueFont: new PhetFont( 20 ),
      valuePattern: '{0} lbs',
      majorTicks: [
        { value: weightRange.min, label: new Text( weightRange.min, new PhetFont( 20 ) ) },
        { value: weightRange.getCenter(), label: new Text( weightRange.getCenter(), new PhetFont( 20 ) ) },
        { value: weightRange.max, label: new Text( weightRange.max, new PhetFont( 20 ) ) }
      ],
      minorTickSpacing: 50
    } );

    var enabledCheckBox = new CheckBox( new Text( 'enabled', { font: new PhetFont( 20 ) } ), enabledProperty );

    return new VBox( {
      children: [ numberControl, enabledCheckBox ],
      spacing: 50,
      center: layoutBounds.center
    } );
  };

  // Creates a demo for WavelengthSlider
  var demoWavelengthSlider = function( layoutBounds ) {
    var wavelengthProperty = new Property( 500 );
    return new WavelengthSlider( wavelengthProperty, {
      center: layoutBounds.center
    } );
  };

  return inherit( DemosView, SlidersView );
} );