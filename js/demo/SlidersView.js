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
  var ComboBox = require( 'SUN/ComboBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  function SlidersView() {

    ScreenView.call( this );

    var layoutBounds = this.layoutBounds;

    // To add a demo, create an entry here.
    // Demos are instantiated on demand.
    // A node field will be added to each of these entries when the demo is instantiated.
    var demos = [
      { label: 'HSlider', getNode: function() { return demoHSlider( layoutBounds ); } },
      { label: 'NumberControl', getNode: function() { return demoNumberControl( layoutBounds ); } },
      { label: 'WavelengthSlider', getNode: function() { return demoWavelengthSlider( layoutBounds ); } }
    ];

    // Sort the demos by label, so that they appear in the combo box in alphabetical order
    demos = _.sortBy( demos, function( demo ) {
      return demo.label;
    } );

    // All demos will be children of this node, to maintain rendering order with combo box list
    var demosParent = new Node();
    this.addChild( demosParent );

    // add each demo to the combo box
    var comboBoxItems = [];
    demos.forEach( function( demo ) {
      comboBoxItems.push( ComboBox.createItem( new Text( demo.label, { font: new PhetFont( 20 ) } ), demo ) );
    } );

    // Parent for the combo box popup list
    var listParent = new Node();
    this.addChild( listParent );

    // Set the initial demo based on the (optional) 'slider' query parameter, whose value is a demo 'label' field value.
    var component = phet.chipper.getQueryParameter( 'slider' );
    var selectedDemo = demos.find( function( demo ) {
      return ( demo.label === component );
    } );
    selectedDemo = selectedDemo || demos[ 0 ];

    // Combo box for selecting which slider to view
    var selectedDemoProperty = new Property( selectedDemo );
    var comboBox = new ComboBox( comboBoxItems, selectedDemoProperty, listParent, {
      buttonFill: 'rgb( 218, 236, 255 )',
      top: 20,
      left: 20
    } );
    this.addChild( comboBox );

    // Make the selected demo visible
    selectedDemoProperty.link( function( demo, oldDemo ) {

      // make the previous selection invisible
      if ( oldDemo ) {
        oldDemo.node.visible = false;
      }

      if ( demo.node ) {

        // If the selected demo has an associated node, make it visible.
        demo.node.visible = true;
      }
      else {

        // If the selected demo doesn't doesn't have an associated node, create it.
        demo.node = demo.getNode();
        demosParent.addChild( demo.node );
      }
    } );
  }

  // Creates a demo for HSlider
  var demoHSlider = function( layoutBounds ) {
    var property = new Property( 0 );
    var range = new Range( 0, 100 );
    var tickLabelOptions = { font: new PhetFont( 16 ) };
    var slider = new HSlider( property, range, {
      trackSize: new Dimension2( 300, 5 ),
      center: layoutBounds.center
    } );
    slider.addMajorTick( range.min, new Text( range.min, tickLabelOptions ) );
    slider.addMajorTick( range.getCenter(), new Text( range.getCenter(), tickLabelOptions ) );
    slider.addMajorTick( range.max, new Text( range.max, tickLabelOptions ) );
    return slider;
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

  return inherit( ScreenView, SlidersView );
} );