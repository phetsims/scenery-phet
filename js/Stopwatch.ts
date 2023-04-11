// Copyright 2019-2023, University of Colorado Boulder

/**
 * Stopwatch is the model for the stopwatch. It is responsible for time, position, and visibility.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../axon/js/BooleanProperty.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import NumberProperty, { NumberPropertyOptions } from '../../axon/js/NumberProperty.js';
import Vector2 from '../../dot/js/Vector2.js';
import Range from '../../dot/js/Range.js';
import Vector2Property from '../../dot/js/Vector2Property.js';
import PhetioObject, { PhetioObjectOptions } from '../../tandem/js/PhetioObject.js';
import Tandem from '../../tandem/js/Tandem.js';
import IOType from '../../tandem/js/types/IOType.js';
import ReferenceIO from '../../tandem/js/types/ReferenceIO.js';
import sceneryPhet from './sceneryPhet.js';
import Property from '../../axon/js/Property.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';

const DEFAULT_TIME_RANGE = new Range( 0, Number.POSITIVE_INFINITY );

type SelfOptions = {
  position?: Vector2;
  isVisible?: boolean;
  timePropertyOptions?: StrictOmit<NumberPropertyOptions, 'tandem'>;
};

export type StopwatchOptions = SelfOptions & PhetioObjectOptions;

export default class Stopwatch extends PhetioObject {

  // position of the stopwatch, in view coordinates
  public readonly positionProperty: Property<Vector2>;

  // whether the stopwatch is visible
  public readonly isVisibleProperty: Property<boolean>;

  // whether the stopwatch is running
  public readonly isRunningProperty: Property<boolean>;

  // time displayed on the stopwatch, in units as specified by the client
  public readonly timeProperty: NumberProperty;

  private readonly disposeStopwatch: () => void;

  public static readonly ZERO_TO_ALMOST_SIXTY = new Range( 0, 3599.99 ); // works out to be 59:59.99

  public constructor( providedOptions?: StopwatchOptions ) {

    const options = optionize<StopwatchOptions, SelfOptions, PhetioObjectOptions>()( {

      // SelfOptions
      position: Vector2.ZERO,
      isVisible: false,
      timePropertyOptions: {
        range: DEFAULT_TIME_RANGE, // When time reaches range.max, the Stopwatch automatically pauses.
        units: 's',
        isValidValue: ( value: number ) => value >= 0,
        phetioReadOnly: true,
        phetioHighFrequency: true
      },

      // PhetioObjectOptions
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'Stopwatch',
      phetioType: ReferenceIO( IOType.ObjectIO ),
      phetioState: false
    }, providedOptions );

    super( options );

    this.positionProperty = new Vector2Property( options.position, {
      tandem: options.tandem.createTandem( 'positionProperty' ),
      phetioDocumentation: `view coordinates for the upper-left of the stopwatch (initially ${options.position.x},${options.position.y})`
    } );

    this.isVisibleProperty = new BooleanProperty( options.isVisible, {
      tandem: options.tandem.createTandem( 'isVisibleProperty' )
    } );

    this.isRunningProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'isRunningProperty' )
    } );

    this.timeProperty = new NumberProperty( 0, combineOptions<NumberPropertyOptions>( {
      tandem: options.tandem.createTandem( 'timeProperty' )
    }, options.timePropertyOptions ) );

    // When the stopwatch visibility changes, stop it and reset its value.
    const visibilityListener = () => {
      const joistGlobal = _.get( window, 'phet.joist', null ); // returns null if global isn't found

      if ( !joistGlobal || !joistGlobal.sim.isSettingPhetioStateProperty.value ) {
        this.isRunningProperty.value = false;
        this.timeProperty.value = 0;
      }
    };
    this.isVisibleProperty.link( visibilityListener );

    this.disposeStopwatch = () => {
      this.isVisibleProperty.unlink( visibilityListener );
      this.positionProperty.dispose();
      this.isVisibleProperty.dispose();
      this.isRunningProperty.dispose();
      this.timeProperty.dispose();
    };
  }

  public override dispose(): void {
    this.disposeStopwatch();
    super.dispose();
  }

  public reset(): void {
    this.positionProperty.reset();
    this.isVisibleProperty.reset();
    this.isRunningProperty.reset();
    this.timeProperty.reset();
  }

  /**
   * Steps the stopwatch.
   * @param dt - time delta, in units as specified by the client
   */
  public step( dt: number ): void {
    assert && assert( dt > 0, `invalid dt: ${dt}` );

    if ( this.isRunningProperty.value ) {

      // Increment time, but don't exceed the range.
      this.timeProperty.value = this.timeProperty.range.constrainValue( this.timeProperty.value + dt );

      // If the max is reached, then pause.
      if ( this.timeProperty.value >= this.timeProperty.range.max ) {
        this.isRunningProperty.value = false;
      }
    }
  }
}

sceneryPhet.register( 'Stopwatch', Stopwatch );