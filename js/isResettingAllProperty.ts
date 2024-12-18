// Copyright 2024, University of Colorado Boulder

/**
 * A flag that is true whenever any "reset all" is in progress.  This is often useful for muting sounds that shouldn't
 * be triggered by model value changes that occur due to a reset.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import TinyProperty from '../../axon/js/TinyProperty.js';
import TProperty from '../../axon/js/TProperty.js';

const isResettingAllProperty: TProperty<boolean> = new TinyProperty( false );

export default isResettingAllProperty;