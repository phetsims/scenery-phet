// Copyright 2002-2014, University of Colorado Boulder

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
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Text = require( 'SCENERY/nodes/Text' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  // Creates a demo for HSlider
  var demoHSlider = function( layoutBounds ) {

    var property = new Property( 0 );
    var range = new Range( 0, 100 );
    var tickLabelOptions = { font: new PhetFont( 16 ) };
    var slider = new HSlider( property, range, {
      trackSize: new Dimension2( 300, 5 ),
      center: layoutBounds.center
    } );

    // major ticks
    slider.addMajorTick( range.min, new Text( range.min, tickLabelOptions ) );
    slider.addMajorTick( range.getCenter(), new Text( range.getCenter(), tickLabelOptions ) );
    slider.addMajorTick( range.max, new Text( range.max, tickLabelOptions ) );

    // minor ticks
    slider.addMinorTick( range.min + 0.25 * range.getLength() );
    slider.addMinorTick( range.min + 0.75 * range.getLength() );

    // show/hide major ticks
    var majorTicksVisibleProperty = new Property( true );
    majorTicksVisibleProperty.link( function( visible ) {
      slider.majorTicksVisible = visible;
    } );
    var majorTicksCheckBox = CheckBox.createTextCheckBox( 'Major ticks visible', { font: new PhetFont( 20 ) }, majorTicksVisibleProperty, {
      left: slider.left,
      top: slider.bottom + 40
    } );

    // show/hide minor ticks
    var minorTicksVisibleProperty = new Property( true );
    minorTicksVisibleProperty.link( function( visible ) {
      slider.minorTicksVisible = visible;
    } );
    var minorTicksCheckBox = CheckBox.createTextCheckBox( 'Minor ticks visible', { font: new PhetFont( 20 ) }, minorTicksVisibleProperty, {
      left: slider.left,
      top: majorTicksCheckBox.bottom + 40
    } );

    return new Node( { children: [ slider, majorTicksCheckBox, minorTicksCheckBox ] } );
  };

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

  function SlidersView() {
    DemosView.call( this, 'slider', [

      // To add a demo, create an entry here.
      // label is a {string} that will appear in the combo box.
      // getNode is a {function} that takes a {Bounds2} layoutBounds and returns a {Node}.
      { label: 'HSlider', getNode: demoHSlider },
      { label: 'NumberControl', getNode: demoNumberControl },
      { label: 'WavelengthSlider', getNode: demoWavelengthSlider }
    ] );
  }

  return inherit( DemosView, SlidersView );
} );