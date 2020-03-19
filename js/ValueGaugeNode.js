// Copyright 2019-2020, University of Colorado Boulder

/**
 * A GaugeNode with a NumberDisplay located in the center bottom half of the GaugeNode to
 * display the numerical value. The NumberDisplay can be hidden but is visible by default.
 *
 * @author Jesse Greenberg
 */

import Vector2 from '../../dot/js/Vector2.js';
import merge from '../../phet-core/js/merge.js';
import GaugeNode from './GaugeNode.js';
import NumberDisplay from './NumberDisplay.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

// constants
const NUMBER_DISPLAY_DEFAULT_OPTIONS = {
  textOptions: {
    font: new PhetFont( 16 )
  },
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

    options = merge( {

      // {*|null} options passed to the NumberDisplay, see NumberDisplay for full list
      numberDisplayOptions: null
    }, options );

    options.numberDisplayOptions = merge( {}, NUMBER_DISPLAY_DEFAULT_OPTIONS, options.numberDisplayOptions );

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

sceneryPhet.register( 'ValueGaugeNode', ValueGaugeNode );
export default ValueGaugeNode;