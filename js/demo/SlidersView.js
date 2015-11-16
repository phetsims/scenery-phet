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
  var DemosView = require( 'SUN/demo/DemosView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Text = require( 'SCENERY/nodes/Text' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  // Creates a demo for NumberControl
  var demoNumberControl = function( layoutBounds ) {

    var weightRange = new Range( 0, 300, 100 );
    var weightProperty = new Property( weightRange.defaultValue );

    return new NumberControl( 'Weight:', weightProperty, weightRange, {
      titleFont: new PhetFont( 20 ),
      valueFont: new PhetFont( 20 ),
      units: 'lbs',
      majorTicks: [
        { value: weightRange.min, label: new Text( weightRange.min, new PhetFont( 20 ) ) },
        { value: weightRange.getCenter(), label: new Text( weightRange.getCenter(), new PhetFont( 20 ) ) },
        { value: weightRange.max, label: new Text( weightRange.max, new PhetFont( 20 ) ) }
      ],
      minorTickSpacing: 50,
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

  /**
   * @constructor
   */
  function SlidersView() {
    DemosView.call( this, 'slider', [

      // To add a demo, create an entry here.
      // label is a {string} that will appear in the combo box.
      // getNode is a {function} that takes a {Bounds2} layoutBounds and returns a {Node}.
      { label: 'NumberControl', getNode: demoNumberControl },
      { label: 'WavelengthSlider', getNode: demoWavelengthSlider }
    ] );
  }

  sceneryPhet.register( 'SlidersView', SlidersView );

  return inherit( DemosView, SlidersView );
} );