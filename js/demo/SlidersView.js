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
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  function SlidersView() {

    ScreenView.call( this, { renderer: 'svg' } );

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

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        hSliderProperty.reset();
        wavelengthProperty.reset();
      },
      radius: 22,
      right: this.layoutBounds.right - 10,
      bottom: this.layoutBounds.bottom - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, SlidersView );
} );