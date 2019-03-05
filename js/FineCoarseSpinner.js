// Copyright 2019, University of Colorado Boulder

/**
 * A type of spinner UI component that supports 'fine' and 'coarse' changes to a numeric value.
 *
 *   <  <<  [ value ]  >>  >
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const ArrowButton = require( 'SUN/buttons/ArrowButton' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Tandem = require( 'TANDEM/Tandem' );

  class FineCoarseSpinner extends Node {

    /**
     * @param {NumberProperty} valueProperty
     * @param {Object} [options]
     */
    constructor( valueProperty, options ) {

      options = _.extend( {
        range: null, // {Range|null} if null, valueProperty.range must exist
        numberDisplayOptions: null, // {*|null} options propagated to the NumberDisplay subcomponent
        arrowButtonOptions: null, // {*|null} options propagated to all ArrowButton subcomponents
        deltaFine: 1, // {number} amount to increment/decrement when the 'fine' tweakers are pressed
        deltaCoarse: 10, // {number} amount to increment/decrement when the 'coarse' tweakers are pressed
        spacing: 10, // {number} horizontal space between subcomponents
        enabledProperty: null, // {BooleanProperty|null} is this control enabled?
        disabledOpacity: 0.5, // {number} opacity used to make the control look disabled
        tandem: Tandem.required
      }, options );

      if ( !options.range ) {
        assert && assert( valueProperty.range, 'valueProperty.range or options.range must be provided' );
        options.range = valueProperty.range;
      }

      // So we know whether we can dispose of the enabledProperty and its tandem
      var ownsEnabledProperty = !options.enabledProperty;

      // Provide a default if not specified
      options.enabledProperty = options.enabledProperty || new BooleanProperty( true, {
        tandem: options.tandem.createTandem( 'enabledProperty' )
      } );

      assert && assert( options.deltaFine > 0, 'invalid deltaFine: ' + options.deltaFine );
      assert && assert( options.deltaCoarse > 0, 'invalid deltaCoarse: ' + options.deltaCoarse );
      assert && assert( !options.arrowButtonOptions || options.arrowButtonOptions.numberOfArrows === undefined,
        'FineCoarseSpinner sets arrowButtonOptions.numberOfArrows' );
      assert && assert( !options.arrowButtonOptions || options.arrowButtonOptions.tandem === undefined,
        'FineCoarseSpinner sets arrowButtonOptions.tandem' );
      assert && assert( !options.numberDisplayOptions || options.numberDisplayOptions.tandem === undefined,
        'FineCoarseSpinner sets numberDisplayOptions.tandem' );

      options.numberDisplayOptions = _.extend( {
        tandem: options.tandem.createTandem( 'numberDisplay' )
      }, options.numberDisplayOptions );

      // options for the 'fine' arrow buttons, which show 1 arrow
      const fineButtonOptions = _.extend( {
        numberOfArrows: 1,
        arrowWidth: 12, // width of base
        arrowHeight: 14, // from tip to base

        // pointer areas
        touchAreaXDilation: 3,
        touchAreaYDilation: 3,
        mouseAreaXDilation: 0,
        mouseAreaYDilation: 0
      }, options.arrowButtonOptions );

      // options for the 'coarse' arrow buttons, which show 2 arrows
      const coarseButtonOptions = _.extend( {}, fineButtonOptions, {
        numberOfArrows: 2,
        arrowSpacing: -0.5 * fineButtonOptions.arrowHeight // arrows overlap
      } );

      // <
      const leftFineButton = new ArrowButton( 'left', function() {
        valueProperty.value = valueProperty.value - options.deltaFine;
      }, _.extend( {}, fineButtonOptions, { tandem: options.tandem.createTandem( 'leftFineButton' ) } ) );

      // <<
      const leftCoarseButton = new ArrowButton( 'left', function() {
        const delta = Math.min( options.deltaCoarse, valueProperty.value - options.range.min );
        valueProperty.value = valueProperty.value - delta;
      }, _.extend( {}, coarseButtonOptions, { tandem: options.tandem.createTandem( 'leftCoarseButton' ) } ) );

      // [ value ]
      const numberDisplay = new NumberDisplay( valueProperty, options.range, options.numberDisplayOptions );

      // >
      const rightFineButton = new ArrowButton( 'right', function() {
        valueProperty.value = valueProperty.value + options.deltaFine;
      }, _.extend( {}, fineButtonOptions, { tandem: options.tandem.createTandem( 'rightFineButton' ) } ) );

      // >>
      const rightCoarseButton = new ArrowButton( 'right', function() {
        const delta = Math.min( options.deltaCoarse, options.range.max - valueProperty.value );
        valueProperty.value = valueProperty.value + delta;
      }, _.extend( {}, coarseButtonOptions, { tandem: options.tandem.createTandem( 'rightCoarseButton' ) } ) );

      // <  <<  [ value ]  >>  >
      const layoutBox = new HBox( {
        spacing: options.spacing,
        children: [ leftFineButton, leftCoarseButton, numberDisplay, rightCoarseButton, rightFineButton ]
      } );

      // Wrap in Node to hide HBox API.
      assert && assert( !options.children, 'FineCoarseSpinner sets children' );
      options.children = [ layoutBox ];

      super( options );

      // @public
      this.enabledProperty = options.enabledProperty;
      const enabledObserver = enabled => {
        this.interruptSubtreeInput(); // interrupt interaction
        this.pickable = enabled;
        this.opacity = enabled ? 1.0 : options.disabledOpacity;
      };
      this.enabledProperty.link( enabledObserver );

      // Disable the buttons when the value is at min or max of the range
      const valuePropertyListener = value => {

        // left buttons
        leftFineButton.enabled = leftCoarseButton.enabled = ( value !== options.range.min );

        // right buttons
        rightFineButton.enabled = rightCoarseButton.enabled = ( value !== options.range.max );
      };
      valueProperty.link( valuePropertyListener ); // unlink required in dispose

      // @private
      this.disposeFineCoarseSpinner = () => {

        if ( valueProperty.hasListener( valuePropertyListener ) ) {
          valueProperty.unlink( valuePropertyListener );
        }
        
        if ( ownsEnabledProperty ) {
          this.enabledProperty.dispose();
        }
        else if ( this.enabledProperty.hasListener( enabledObserver ) ) {
          this.enabledProperty.unlink( enabledObserver );
        }

        // unregister tandems
        numberDisplay.dispose();
        leftFineButton.dispose();
        leftCoarseButton.dispose();
        rightFineButton.dispose();
        rightCoarseButton.dispose();
      };
    }

    // @public
    dispose() {
      this.disposeFineCoarseSpinner();
      super.dispose();
    }

    /**
     * Sets whether this Node is enabled or disabled.
     * @param {boolean} enabled
     * @public
     */
    setEnabled( enabled ) { this.enabledProperty.set( enabled ); }

    set enabled( value ) { this.setEnabled( value ); }

    /**
     * Gets whether this Node is enabled or disabled.
     * @returns {boolean}
     * @public
     */
    getEnabled() { return this.enabledProperty.get(); }

    get enabled() { return this.getEnabled(); }
  }

  return sceneryPhet.register( 'FineCoarseSpinner', FineCoarseSpinner );
} ); 