// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for WavelengthSlider
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  class WavelengthSliderIO extends NodeIO {}

  WavelengthSliderIO.documentation = 'A slider that shows wavelengths for selection';
  WavelengthSliderIO.validator = { valueType: WavelengthSlider };
  WavelengthSliderIO.typeName = 'WavelengthSliderIO';
  ObjectIO.validateSubtype( WavelengthSliderIO );

  return sceneryPhet.register( 'WavelengthSliderIO', WavelengthSliderIO );
} );

