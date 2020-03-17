// Copyright 2020, University of Colorado Boulder

/**
 * An Enumeration of the Speeds supported by TimeControlNode, when it includes speed controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import sceneryPhet from './sceneryPhet.js';
import Enumeration from '../../phet-core/js/Enumeration.js';

const TimeControlSpeed = Enumeration.byKeys( [ 'FAST', 'NORMAL', 'SLOW' ] );

sceneryPhet.register( 'TimeControlSpeed', TimeControlSpeed );
export default TimeControlSpeed;