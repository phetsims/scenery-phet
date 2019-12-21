// Copyright 2019, University of Colorado Boulder

/**
 * Stopwatch is the model for the stopwatch. It is responsible for time, location, and visibility.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const PhetioObject = require( 'TANDEM/PhetioObject' );
  const ReferenceIO = require( 'TANDEM/types/ReferenceIO' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  class Stopwatch extends PhetioObject {

    /**
     * @param {Object} [options]
     */
    constructor( options ) {

      options = merge( {
        position: Vector2.ZERO,
        isVisible: false,
        timePropertyOptions: {},

        // phet-io
        tandem: Tandem.REQUIRED,
        phetioType: ReferenceIO
      }, options );

      super( options );

      // @public - position of the stopwatch, in view coordinates
      this.positionProperty = new Vector2Property( options.position, {
        tandem: options.tandem.createTandem( 'positionProperty' )
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
        units: 's',
        isValidValue: value => ( value >= 0 ),
        tandem: options.tandem.createTandem( 'timeProperty' ),
        phetioReadOnly: true,
        phetioHighFrequency: true
      }, options.timePropertyOptions ) );

      // When the stopwatch visibility changes, stop it and reset its value.
      const visibilityListener = () => {
        this.isRunningProperty.value = false;
        this.timeProperty.value = 0;
      };
      this.isVisibleProperty.link( visibilityListener );

      this.disposeStopwatch = () => {
        this.isVisibleProperty.unlink( visibilityListener );
      };
    }

    /**
     * @public
     */
    dispose() {
      this.disposeStopwatch();
      this.positionProperty.dispose();
      this.isVisibleProperty.dispose();
      this.isRunningProperty.dispose();
      this.timeProperty.dispose();
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
        this.timeProperty.value += dt;
      }
    }
  }

  return sceneryPhet.register( 'Stopwatch', Stopwatch );
} );