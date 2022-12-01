// Copyright 2020-2022, University of Colorado Boulder

/**
 * TimeSpeed is an enumeration of time speeds. These are supported by TimeControlNode, when it includes speed controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../phet-core/js/EnumerationValue.js';
import sceneryPhet from './sceneryPhet.js';

export default class TimeSpeed extends EnumerationValue {

  public static readonly FAST = new TimeSpeed();
  public static readonly NORMAL = new TimeSpeed();
  public static readonly SLOW = new TimeSpeed();

  // Gets a list of keys, values and mapping between them. For use in EnumerationProperty and PhET-iO
  public static readonly enumeration = new Enumeration( TimeSpeed );
}

sceneryPhet.register( 'TimeSpeed', TimeSpeed );