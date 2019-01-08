// Copyright 2018, University of Colorado Boulder

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
  const HBox = require( 'SCENERY/nodes/HBox' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

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
        spacing: 10 // {number} horizontal space between subcomponents
      }, options );

      if ( !options.range ) {
        assert && assert( valueProperty.range, 'valueProperty.range or options.range must be provided' );
        options.range = valueProperty.range;
      }

      assert && assert( options.deltaFine > 0, 'invalid deltaFine: ' + options.deltaFine );
      assert && assert( options.deltaCoarse > 0, 'invalid deltaCoarse: ' + options.deltaCoarse );
      assert && assert( !options.arrowButtonOptions || options.arrowButtonOptions.numberOfArrows === undefined,
        'FineCoarseSpinner sets arrowButtonOptions.numberOfArrows' );

      // options for the 'fine' arrow buttons, which show 1 arrow
      const fineButtonOptions = _.extend( {
        numberOfArrows: 1,
        arrowWidth: 12, // width of base
        arrowHeight: 14 // from tip to base
      }, options.arrowButtonOptions );

      // options for the 'coarse' arrow buttons, which show 2 arrows
      const coarseButtonOptions = _.extend( {}, fineButtonOptions, {
        numberOfArrows: 2,
        arrowSpacing: -0.5 * fineButtonOptions.arrowHeight // arrows overlap
      } );

      // <
      const leftFineButton = new ArrowButton( 'left', function() {
        valueProperty.value = valueProperty.value - options.deltaFine;
      }, fineButtonOptions );

      // <<
      const leftCoarseButton = new ArrowButton( 'left', function() {
        const delta = Math.min( options.deltaCoarse, valueProperty.value - options.range.min );
        valueProperty.value = valueProperty.value - delta;
      }, coarseButtonOptions );

      // [ value ]
      const numberDisplay = new NumberDisplay( valueProperty, options.range, options.numberDisplayOptions );

      // >
      const rightFineButton = new ArrowButton( 'right', function() {
        valueProperty.value = valueProperty.value + options.deltaFine;
      }, fineButtonOptions );

      // >>
      const rightCoarseButton = new ArrowButton( 'right', function() {
        const delta = Math.min( options.deltaCoarse, options.range.max - valueProperty.value );
        valueProperty.value = valueProperty.value + delta;
      }, coarseButtonOptions );

      // <  <<  [ value ]  >>  >
      const layoutBox = new HBox( {
        spacing: options.spacing,
        children: [ leftFineButton, leftCoarseButton, numberDisplay, rightCoarseButton, rightFineButton ]
      } );

      // Wrap in Node to hide HBox API.
      assert && assert( !options.children, 'FineCoarseSpinner sets children' );
      options.children = [ layoutBox ];

      super( options );

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
        valueProperty.unlink( valuePropertyListener );
      };
    }

    // @public
    dispose() {
      this.disposeFineCoarseSpinner();
      super.dispose();
    }
  }

  return sceneryPhet.register( 'FineCoarseSpinner', FineCoarseSpinner );
} ); 