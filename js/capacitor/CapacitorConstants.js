// Copyright 2019, University of Colorado Boulder

/**
 * Constants related to CapacitorNode and its corresponding model.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const Range = require( 'DOT/Range' );
  const RangeWithValue = require( 'DOT/RangeWithValue' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  const CapacitorConstants = {

    // meters, with default value at 200 mm^2
    PLATE_WIDTH_RANGE: new RangeWithValue( 0.01, 0.02, Math.sqrt( 200 / 1000 / 1000 ) ),
    PLATE_HEIGHT: 0.0005, // meters
    POLARITY: new Enumeration( [ 'POSITIVE', 'NEGATIVE' ] ),
    NEGATIVE_CHARGE_SIZE: new Dimension2( 7, 2 ),
    NUMBER_OF_PLATE_CHARGES: new Range( 1, 625 ),  // maybe only used in one file?
    PLATE_SEPARATION_RANGE: new RangeWithValue( 0.002, 0.01, 0.006 ) // meters
  };

  return sceneryPhet.register( 'CapacitorConstants', CapacitorConstants );
} );