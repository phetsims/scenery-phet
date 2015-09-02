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
  var Bounds2 = require( 'DOT/Bounds2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  function SlidersView() {

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );

    // horizontal slider
    var hSliderProperty = new Property( 0 );
    var hSlider = new HSlider( hSliderProperty, { min: 0, max: 100 }, {
      left: 10,
      top: 10
    } );
    this.addChild( hSlider );

    // wavelength slider
    var wavelengthProperty = new Property( 500 );
    var wavelengthSlider = new WavelengthSlider( wavelengthProperty, {
      left: 10,
      top: hSlider.bottom + 10
    } );
    this.addChild( wavelengthSlider );

    // NumberControl
    var weightRange = new Range( 0, 300, 100 );
    var weightProperty = new Property( weightRange.defaultValue );
    var weightControl = new NumberControl( 'Weight:', weightProperty, weightRange, {
      titleFont: new PhetFont( 20 ),
      valueFont: new PhetFont( 20 ),
      units: 'lbs',
      majorTicks: [
        { value: weightRange.min, label: new Text( weightRange.min, new PhetFont( 20 ) ) },
        { value: weightRange.getCenter(), label: new Text( weightRange.getCenter(), new PhetFont( 20 ) ) },
        { value: weightRange.max, label: new Text( weightRange.max, new PhetFont( 20 ) ) }
      ],
      minorTickSpacing: 50,
      left: wavelengthSlider.left,
      top: wavelengthSlider.bottom + 30
    } );
    this.addChild( weightControl );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        hSliderProperty.reset();
        wavelengthProperty.reset();
        weightProperty.reset();
      },
      radius: 22,
      right:  this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, SlidersView );
} );