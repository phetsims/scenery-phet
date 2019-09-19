// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for WavelengthSlider
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const NodeIO = require( 'SCENERY/nodes/NodeIO' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const WavelengthSlider = require( 'SCENERY_PHET/WavelengthSlider' );

  class WavelengthSliderIO extends NodeIO {}

  WavelengthSliderIO.documentation = 'A slider that shows wavelengths for selection';
  WavelengthSliderIO.validator = { valueType: WavelengthSlider };
  WavelengthSliderIO.typeName = 'WavelengthSliderIO';
  ObjectIO.validateSubtype( WavelengthSliderIO );

  return sceneryPhet.register( 'WavelengthSliderIO', WavelengthSliderIO );
} );

