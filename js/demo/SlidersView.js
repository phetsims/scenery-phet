// Copyright 2002-2014, University of Colorado Boulder

/**
 * Demonstration of scenery-phet sliders
 *
 * @author Sam Reid
 * @author Chris Malley
 */
define( function( require ) {
  'use strict';

  // modules
  var ComboBox = require( 'SUN/ComboBox' );
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

    var thisView = this;
    ScreenView.call( this );

     // To add a demo, create an entry here.
    var demos = [
      { label: 'HSlider', node: demoHSlider( this.layoutBounds ) },
      { label: 'NumberControl', node: demoNumberControl( this.layoutBounds ) },
      { label: 'WavelengthSlider', node: demoWavelengthSlider( this.layoutBounds ) }
    ];

    var comboBoxItems = [];

    demos.forEach( function( demo ) {

      // add demo to the combo box
      comboBoxItems.push( ComboBox.createItem( new Text( demo.label, { font: new PhetFont( 20 ) } ), demo.node ) );

      // add demo to the scenegraph
      thisView.addChild( demo.node );

      // demo is invisible until selected via the combo box
      demo.node.visible = false;
    } );

    // Parent for the combo box popup list
    var listParent = new Node();
    this.addChild( listParent );

    // Combo box for selecting which component to view
    var selectedDemoProperty = new Property( demos[ 0 ].node );
    var comboBox = new ComboBox( comboBoxItems, selectedDemoProperty, listParent, {
      buttonFill: 'rgb( 218, 236, 255 )',
      top: 20,
      left: 20
    } );
    this.addChild( comboBox );

    // Make the selected demo visible
    selectedDemoProperty.link( function( demo, oldDemo ) {
      if ( oldDemo ) { oldDemo.visible = false; }
      demo.visible = true;
    } );
  }

  // Creates a demo for HSlider
  var demoHSlider = function( layoutBounds ) {
    var hSliderProperty = new Property( 0 );
    return new HSlider( hSliderProperty, { min: 0, max: 100 }, {
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

  return inherit( ScreenView, SlidersView );
} );