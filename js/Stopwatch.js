// Copyright 2019-2021, University of Colorado Boulder

/**
 * Stopwatch is the model for the stopwatch. It is responsible for time, position, and visibility.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import NumberProperty from '../../axon/js/NumberProperty.js';
import Vector2 from '../../dot/js/Vector2.js';
import Range from '../../dot/js/Range.js';
import Vector2Property from '../../dot/js/Vector2Property.js';
import merge from '../../phet-core/js/merge.js';
import PhetioObject from '../../tandem/js/PhetioObject.js';
import Tandem from '../../tandem/js/Tandem.js';
import IOType from '../../tandem/js/types/IOType.js';
import ReferenceIO from '../../tandem/js/types/ReferenceIO.js';
import sceneryPhet from './sceneryPhet.js';

class Stopwatch extends PhetioObject {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      position: Vector2.ZERO,
      isVisible: false,
      timePropertyOptions: {

        // when time reaches range.max, the Stopwatch automatically pauses.
        range: new Range( 0, Number.POSITIVE_INFINITY ),
        units: 's',
        isValidValue: value => value >= 0,
        phetioReadOnly: true,
        phetioHighFrequency: true
      },

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioType: ReferenceIO( IOType.ObjectIO ),
      phetioState: false
    }, options );

    super( options );

    // @public - position of the stopwatch, in view coordinates
    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioDocumentation: `view coordinates for the upper-left of the stopwatch (initially ${options.position.x},${options.position.y})`
    } );

    // @public - whether the stopwatch is visible
    this.isVisibleProperty = new BooleanProperty( options.isVisible, {
      tandem: options.tandem.createTandem( 'isVisibleProperty' )
    } );

    // @public - whether the stopwatch is running
    this.isRunningProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isRunningProperty' )
    } );

    assert && assert( !options.timePropertyOptions.hasOwnProperty( 'tandem' ), 'Time property provides its own tandem' );

    // @public (read-only) time displayed on the stopwatch
    this.timeProperty = new NumberProperty( 0, merge( {
      tandem: options.tandem.createTandem( 'timeProperty' )
    }, options.timePropertyOptions ) );

    // When the stopwatch visibility changes, stop it and reset its value.
    const visibilityListener = () => {
      if ( !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.isRunningProperty.value = false;
        this.timeProperty.value = 0;
      }
    };
    this.isVisibleProperty.link( visibilityListener );

    // @private
    this.disposeStopwatch = () => {
      this.isVisibleProperty.unlink( visibilityListener );
      this.positionProperty.dispose();
      this.isVisibleProperty.dispose();
      this.isRunningProperty.dispose();
      this.timeProperty.dispose();
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeStopwatch();
    super.dispose();
  }

  /**
   * Resets the stopwatch.
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.isVisibleProperty.reset();
    this.isRunningProperty.reset();
    this.timeProperty.reset();
  }

  /**
   * Steps the stopwatch.
   * @param {number} dt - time delta, in the units appropriate for the corresponding model
   * @public
   */
  step( dt ) {
    assert && assert( typeof dt === 'number' && dt > 0, `invalid dt: ${dt}` );

    if ( this.isRunningProperty.value ) {

      // Increment time, but don't exceed the range
      this.timeProperty.value = this.timeProperty.range.constrainValue( this.timeProperty.value + dt );

      // If the max is reached, then pause
      if ( this.timeProperty.value === this.timeProperty.range.max ) {
        this.isRunningProperty.value = false;
      }
    }
  }
}

// @public
Stopwatch.ZERO_TO_ALMOST_SIXTY = new Range( 0, 3599.99 ); // Works out to be 59:59.99

sceneryPhet.register( 'Stopwatch', Stopwatch );
export default Stopwatch;