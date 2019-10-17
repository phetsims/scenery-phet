// Copyright 2014-2019, University of Colorado Boulder

/**
 * Demonstration of scenery-phet sliders.
 * Demos are selected from a combo box, and are instantiated on demand.
 * Use the 'slider' query parameter to set the initial selection of the combo box.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Checkbox = require( 'SUN/Checkbox' );
  const DemosScreenView = require( 'SUN/demo/DemosScreenView' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HSlider = require( 'SUN/HSlider' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberControl = require( 'SCENERY_PHET/NumberControl' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const sceneryPhetQueryParameters = require( 'SCENERY_PHET/sceneryPhetQueryParameters' );
  const SpectrumSliderThumb = require( 'SCENERY_PHET/SpectrumSliderThumb' );
  const SpectrumSliderTrack = require( 'SCENERY_PHET/SpectrumSliderTrack' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VisibleColor = require( 'SCENERY_PHET/VisibleColor' );
  const WavelengthNumberControl = require( 'SCENERY_PHET/WavelengthNumberControl' );

  /**
   * @constructor
   */
  function SlidersScreenView() {
    DemosScreenView.call( this, [

      /**
       * To add a demo, add an object literal here. Each object has these properties:
       *
       * {string} label - label in the combo box
       * {function(Bounds2): Node} createNode - creates the scene graph for the demo
       */
      { label: 'NumberControl', createNode: demoNumberControl },
      { label: 'WavelengthNumberControl', createNode: demoWavelengthSlider },
      { label: 'SliderWithSpectrumSliderTrack', createNode: demoSliderWithSpectrum },
      { label: 'NumberControlWithSpectrum', createNode: demoNumberControlWithSpectrum }
    ], {
      selectedDemoLabel: sceneryPhetQueryParameters.slider
    } );
  }

  sceneryPhet.register( 'SlidersScreenView', SlidersScreenView );

  // Creates a demo for NumberControl
  var demoNumberControl = function( layoutBounds ) {

    const weightRange = new RangeWithValue( 0, 300, 100 );

    // all NumberControls will be synchronized with these Properties
    const weightProperty = new Property( weightRange.defaultValue );
    const enabledProperty = new Property( true );

    // options shared by all NumberControls
    const numberControlOptions = {
      enabledProperty: enabledProperty,
      titleNodeOptions: {
        font: new PhetFont( 20 )
      },
      numberDisplayOptions: {
        font: new PhetFont( 20 ),
        valuePattern: '{0} lbs'
      },
      sliderOptions: {
        majorTicks: [
          { value: weightRange.min, label: new Text( weightRange.min, { font: new PhetFont( 20 ) } ) },
          { value: weightRange.getCenter(), label: new Text( weightRange.getCenter(), { font: new PhetFont( 20 ) } ) },
          { value: weightRange.max, label: new Text( weightRange.max, { font: new PhetFont( 20 ) } ) }
        ],
        minorTickSpacing: 50
      }
    };

    // NumberControl with default layout
    const numberControl1 = new NumberControl( 'Weight:', weightProperty, weightRange, numberControlOptions );

    // NumberControl with a predefined alternate layout
    const numberControl2 = new NumberControl( 'Weight:', weightProperty, weightRange,
      merge( {
        layoutFunction: NumberControl.createLayoutFunction2()
      }, numberControlOptions ) );

    // NumberControl with options provided for a predefined alternate layout
    const numberControl3 = new NumberControl( 'Weight:', weightProperty, weightRange, merge( {
      layoutFunction: NumberControl.createLayoutFunction3( {
        alignTitle: 'left'
      } )
    }, numberControlOptions ) );

    // NumberControl with alternate layout provided by the client
    const numberControl4 = new NumberControl( 'Weight:', weightProperty, weightRange, merge( {
      layoutFunction: function( titleNode, numberDisplay, slider, leftArrowButton, rightArrowButton ) {
        return new HBox( {
          spacing: 8,
          resize: false, // prevent sliders from causing a resize when thumb is at min or max
          children: [ titleNode, numberDisplay, leftArrowButton, slider, rightArrowButton ]
        } );
      }
    }, numberControlOptions ) );

    // Checkbox that will disable all NumberControls
    const enabledCheckbox = new Checkbox( new Text( 'enabled', { font: new PhetFont( 20 ) } ), enabledProperty );

    return new VBox( {
      spacing: 30,
      resize: false, // prevent sliders from causing a resize when thumb is at min or max
      children: [ numberControl1, numberControl2, numberControl3, numberControl4, enabledCheckbox ],
      center: layoutBounds.center
    } );
  };

  // Creates a demo for WavelengthNumberControl
  var demoWavelengthSlider = function( layoutBounds ) {
    const wavelengthProperty = new Property( 500 );
    return new WavelengthNumberControl( wavelengthProperty, {
      center: layoutBounds.center
    } );
  };

  /**
   * Creates a HSlider that uses a SpectrumSliderTrack and SpectrumSliderThumb.
   * @param layoutBounds
   */
  const demoSliderWithSpectrum = layoutBounds => {
    const property = new Property( 380 );
    const wavelengthToColor = VisibleColor.wavelengthToColor;
    const range = new Range( 380, 780 );
    return new HSlider( property, range, {
      center: layoutBounds.center,
      trackNode: new SpectrumSliderTrack( property, range, { valueToColor: wavelengthToColor } ),
      thumbNode: new SpectrumSliderThumb( property, { valueToColor: wavelengthToColor } )
    } );
  };

  /**
   * Creates a NumberControl that uses SpectrumSliderTrack and SpectrumSliderThumb.
   * @param layoutBounds
   */
  const demoNumberControlWithSpectrum = layoutBounds => {
    const property = new Property( 380 );
    const wavelengthToColor = VisibleColor.wavelengthToColor;

    // NumberControl with default layout
    const range = new Range( 380, 780 );
    return new NumberControl( '', property, range, {
      titleNodeOptions: {
        font: new PhetFont( 14 )
      },
      numberDisplayOptions: {
        font: new PhetFont( 14 ),
        valuePattern: '{0} nm'
      },
      sliderOptions: {
        trackNode: new SpectrumSliderTrack( property, range, { valueToColor: wavelengthToColor } ),
        thumbNode: new SpectrumSliderThumb( property, { valueToColor: wavelengthToColor } )
      },
      center: layoutBounds.center,
      layoutFunction: NumberControl.createLayoutFunction3( {
        alignTitle: 'left'
      } )
    } );
  };

  return inherit( DemosScreenView, SlidersScreenView );
} );