// Copyright 2019, University of Colorado Boulder

/**
 * A GaugeNode with a NumberDisplay located in the center bottom half of the GaugeNode to
 * display the numerical value. The NumberDisplay can be hidden but is visible by default.
 * 
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const GaugeNode = require( 'SCENERY_PHET/GaugeNode' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const NUMBER_DISPLAY_DEFAULT_OPTIONS = {
    font: new PhetFont( 16 ),
    backgroundStroke: 'black',
    align: 'center',
    cornerRadius: 5
  };

  class ValueGaugeNode extends GaugeNode {

    /**
     * @param  {Property.<Number>} valueProperty
     * @param  {string} label - label to display
     * @param  {Range} range
     * @param  {Object} options
     */
    constructor( valueProperty, label, range, options ) {

      options = _.extend( {

        // {*|null} options passed to the NumberDisplay, see NumberDisplay for full list
        numberDisplayOptions: null
      }, options );

      options.numberDisplayOptions = _.extend( {}, NUMBER_DISPLAY_DEFAULT_OPTIONS, options.numberDisplayOptions );

      super( valueProperty, label, range, options );

      // @private {boolean}
      this._numberDisplayVisible = true;

      // @private {NumberDisplay} - display for the valueProperty
      this.numberDisplay = new NumberDisplay( valueProperty, range, options.numberDisplayOptions );
      this.addChild( this.numberDisplay );

      assert && assert( this.numberDisplay.matrix.translation.equals( Vector2.ZERO ), 'ValueGaugeNode positions the NumberDisplay' );
      this.numberDisplay.center = new Vector2( 0, this.radius / 2 );
    }

    /**
     * Set whether or not the NumberDisplay inside this GaugeNode is visible.
     * 
     * @public
     * @param {boolean} visible
     */
    setNumberDisplayVisible( visible ) {
      if ( visible !== this._numberDisplayVisible ) {
        this._numberDisplayVisible = visible;
        this.numberDisplay.visible = visible;
      }
    }
    set numberDisplayVisible( visible ) { this.setNumberDisplayVisible( visible ); }

    /**
     * Get whether or not the number display inside this GaugeNode is visible.
     * 
     * @public
     * @returns {boolean}
     */
    getNumberDisplayVisible() {
      return this._numberDisplayVisible;
    }
    get numberDisplayVisible() { return this.getNumberDisplayVisible(); }

    /**
     * @public
     * @override
     */
    dispose() {
      this.numberDisplay.dispose();
      super.dispose();
    }
  }

  return sceneryPhet.register( 'ValueGaugeNode', ValueGaugeNode );
} );
