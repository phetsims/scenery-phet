// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for NumberDisplay
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const NodeIO = require( 'SCENERY/nodes/NodeIO' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  class NumberDisplayIO extends NodeIO {}

  NumberDisplayIO.validator = { isValidValue: v => v instanceof phet.sceneryPhet.NumberDisplay };
  NumberDisplayIO.documentation = 'A numeric readout with a background';
  NumberDisplayIO.typeName = 'NumberDisplayIO';
  ObjectIO.validateSubtype( NumberDisplayIO );

  return sceneryPhet.register( 'NumberDisplayIO', NumberDisplayIO );
} );