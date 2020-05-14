// Copyright 2020, University of Colorado Boulder

/**
 * TimeSpeed is an enumeration of time speeds. These are supported by TimeControlNode, when it includes speed controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Enumeration from '../../phet-core/js/Enumeration.js';
import sceneryPhet from './sceneryPhet.js';

const TimeSpeed = Enumeration.byKeys( [ 'FAST', 'NORMAL', 'SLOW' ] );

sceneryPhet.register( 'TimeSpeed', TimeSpeed );
export default TimeSpeed;