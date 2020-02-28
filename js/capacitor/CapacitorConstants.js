// Copyright 2019-2020, University of Colorado Boulder

/**
 * Constants related to CapacitorNode and its corresponding model.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import Enumeration from '../../../phet-core/js/Enumeration.js';
import sceneryPhet from '../sceneryPhet.js';

const CapacitorConstants = {

  // meters, with default corresponding to an area of 200 mm^2
  PLATE_WIDTH_RANGE: new RangeWithValue( 0.01, 0.02, Math.sqrt( 200 / 1000 / 1000 ) ),
  PLATE_HEIGHT: 0.0005, // meters
  POLARITY: Enumeration.byKeys( [ 'POSITIVE', 'NEGATIVE' ] ),
  PLATE_SEPARATION_RANGE: new RangeWithValue( 0.002, 0.01, 0.006 ) // meters
};

sceneryPhet.register( 'CapacitorConstants', CapacitorConstants );
export default CapacitorConstants;