// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for NumberControl
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

  class NumberControlIO extends NodeIO {}

  NumberControlIO.validator = { isValidValue: v => v instanceof phet.sceneryPhet.NumberControl };
  NumberControlIO.documentation = 'A number control with a title, slider and +/- buttons';
  NumberControlIO.typeName = 'NumberControlIO';
  ObjectIO.validateSubtype( NumberControlIO );

  return sceneryPhet.register( 'NumberControlIO', NumberControlIO );
} );