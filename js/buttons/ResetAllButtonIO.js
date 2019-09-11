// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for RoundMomentaryButton
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

  class ResetAllButtonIO extends NodeIO {}

  ResetAllButtonIO.documentation = 'Button that performs an action while it is being pressed, and stops the action when released';
  ResetAllButtonIO.events = [ 'pressed', 'released', 'releasedDisabled' ];
  ResetAllButtonIO.validator = { isValidValue: v => v instanceof phet.sceneryPhet.ResetAllButton };
  ResetAllButtonIO.typeName = 'ResetAllButtonIO';
  ObjectIO.validateSubtype( ResetAllButtonIO );

  return sceneryPhet.register( 'ResetAllButtonIO', ResetAllButtonIO );
} );