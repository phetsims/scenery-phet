// Copyright 2019-2023, University of Colorado Boulder

/**
 * Capable of displaying a mixed-fraction display with three spots that can be filled with numbers (numerator,
 * denominator, and a whole number on the left).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Bounds2 from '../../dot/js/Bounds2.js';
import merge from '../../phet-core/js/merge.js';
import { AlignBox, HBox, Line, Text, VBox } from '../../scenery/js/imports.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

class MixedFractionNode extends HBox {
  /**
   * @param {Object} [options]
   */
  constructor( options ) {
    super( {
      spacing: 5
    } );

    options = merge( {
      // {number|null} - Main values for the fraction (can also be changed with setters). The spot will be empty if
      // null is the given value.
      whole: null,
      numerator: null,
      denominator: null,

      // {number|null} - If provided, it will ensure that spacing is provided from 0 up to the specified number for
      // that slot (e.g. if given maxNumerator:10, it will check the layout size for 0,1,2,...,10 and ensure that
      // changing the numerator between those values will not change the layout).
      maxWhole: null,
      maxNumerator: null,
      maxDenominator: null,

      // {ColorDef}
      wholeFill: 'black',
      numeratorFill: 'black',
      denominatorFill: 'black',
      separatorFill: 'black',

      // {number} - How far past the numbers' bounds that the vinculum should extend.
      vinculumExtension: 0,

      // {string} - The lineCap of the vinculum
      vinculumLineCap: 'butt'
    }, options );

    // @private {Text}
    this.wholeText = new Text( '1', {
      font: new PhetFont( 50 ),
      fill: options.wholeFill
    } );
    this.numeratorText = new Text( '1', {
      font: new PhetFont( 30 ),
      fill: options.numeratorFill
    } );
    this.denominatorText = new Text( '1', {
      font: new PhetFont( 30 ),
      fill: options.denominatorFill
    } );

    const maxTextBounds = ( textNode, maxNumber ) => {
      return _.reduce( _.range( 0, maxNumber + 1 ), ( bounds, number ) => {
        textNode.string = number;
        return bounds.union( textNode.bounds );
      }, Bounds2.NOTHING );
    };

    // @private {Node}
    this.wholeContainer = options.maxWhole ? new AlignBox( this.wholeText, {
      alignBounds: maxTextBounds( this.wholeText, options.maxWhole )
    } ) : this.wholeText;
    this.numeratorContainer = options.maxNumerator ? new AlignBox( this.numeratorText, {
      alignBounds: maxTextBounds( this.numeratorText, options.maxNumerator )
    } ) : this.numeratorText;
    this.denominatorContainer = options.maxDenominator ? new AlignBox( this.denominatorText, {
      alignBounds: maxTextBounds( this.denominatorText, options.maxDenominator )
    } ) : this.denominatorText;

    // @private {Line}
    this.vinculumNode = new Line( 0, 0, 10, 0, {
      stroke: options.separatorFill,
      lineWidth: 2,
      lineCap: options.vinculumLineCap
    } );

    // @private {VBox}
    this.vbox = new VBox( {
      children: [ this.numeratorContainer, this.vinculumNode, this.denominatorContainer ],
      spacing: 1
    } );

    // @private {number|null}
    this._whole = options.whole;
    this._numerator = options.numerator;
    this._denominator = options.denominator;

    // @private {number}
    this._vinculumExtension = options.vinculumExtension;

    this.update();

    this.mutate( options );
  }

  /**
   * Updates the view of the fraction when something changes.
   * @private
   */
  update() {
    const hasWhole = this._whole !== null;
    const hasNumerator = this._numerator !== null;
    const hasDenominator = this._denominator !== null;

    this.children = [
      ...( hasWhole ? [ this.wholeContainer ] : [] ),
      ...( hasNumerator || hasDenominator ? [ this.vbox ] : [] )
    ];
    this.wholeText.string = hasWhole ? this._whole : ' ';
    this.numeratorText.string = hasNumerator ? this._numerator : ' ';
    this.denominatorText.string = hasDenominator ? this._denominator : ' ';

    this.vinculumNode.x1 = -this._vinculumExtension;
    this.vinculumNode.x2 = Math.max( this.numeratorContainer.width, this.denominatorContainer.width ) + 2 + this._vinculumExtension;
  }

  /**
   * Sets the whole-number part of the mixed fraction.
   * @public
   *
   * @param {number|null} value
   */
  set whole( value ) {
    if ( this._whole !== value ) {
      this._whole = value;

      this.update();
    }
  }

  /**
   * Returns the current whole-number part of the mixed fraction.
   * @public
   *
   * @returns {number|null}
   */
  get whole() {
    return this._whole;
  }

  /**
   * Sets the numerator part of the mixed fraction.
   * @public
   *
   * @param {number|null} value
   */
  set numerator( value ) {
    if ( this._numerator !== value ) {
      this._numerator = value;

      this.update();
    }
  }

  /**
   * Returns the current numerator part of the mixed fraction.
   * @public
   *
   * @returns {number|null}
   */
  get numerator() {
    return this._numerator;
  }

  /**
   * Sets the denominator part of the mixed fraction.
   * @public
   *
   * @param {number|null} value
   */
  set denominator( value ) {
    if ( this._denominator !== value ) {
      this._denominator = value;

      this.update();
    }
  }

  /**
   * Returns the current denominator part of the mixed fraction.
   * @public
   *
   * @returns {number|null}
   */
  get denominator() {
    return this._denominator;
  }
}

sceneryPhet.register( 'MixedFractionNode', MixedFractionNode );
export default MixedFractionNode;