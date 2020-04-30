// Copyright 2014-2020, University of Colorado Boulder

/**
 * Displays a number in scientific notation, M x 10^E, where M is the mantissa and E is the exponent (e.g. 2.34 x 10^-4).
 * To conserve memory, creates one set of scenery.Text nodes, modifies their text as needed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../dot/js/Utils.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Text from '../../scenery/js/nodes/Text.js';
import MathSymbols from './MathSymbols.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @param {Property.<number|null>} valueProperty
 * @param {Object} [options]
 * @constructor
 */
function ScientificNotationNode( valueProperty, options ) {
  options = merge( {
    fill: 'black',
    font: new PhetFont( 20 ),
    exponent: null,
    mantissaDecimalPlaces: 1,
    exponentScale: 0.75, // scale of the exponent, relative to the size of the '10'
    showIntegersAsMantissaOnly: false, // if true, show 8000 as '8000', otherwise '8 x 10^3'
    showZeroAsInteger: true, // if true, show '0 x 10^E' as '0'
    showZeroExponent: false, // if false, show 'M x 10^0' as 'M'
    exponentXSpacing: 2, // space to left of exponent
    exponentYOffset: 0, // offset of exponent's center from cap line
    capHeightScale: 0.75, // fudge factor for computing cap height, compensates for inaccuracy of Text.height
    nullValueString: MathSymbols.NO_VALUE // if the value is null, display this string
  }, options );
  this.options = options; // @private

  const textOptions = { font: options.font, fill: options.fill };
  this.valueProperty = valueProperty; // @public

  // must be recomputed if font changes!
  const tmpText = new Text( ' ', textOptions );
  this.mantissaXSpacing = tmpText.width; // @private width of space between mantissa and 'x 10'
  this.capLineYOffset = options.capHeightScale * ( tmpText.top - tmpText.y ); // @private cap line offset from baseline

  // scenery.Text nodes
  this.mantissaNode = new Text( '?', textOptions );
  this.timesTenNode = new Text( '?', textOptions );
  this.exponentNode = new Text( '?', merge( { scale: options.exponentScale }, textOptions ) ); // exponent is scaled
  this.exponentNode.centerY = this.timesTenNode.y + this.capLineYOffset + options.exponentYOffset;

  Node.call( this, merge( options, { children: [ this.mantissaNode, this.exponentNode, this.timesTenNode ] } ) ); // this replaces options.children

  const valuePropertyObserver = this.update.bind( this );
  valueProperty.link( valuePropertyObserver );

  // @private
  this.disposeScientificNotationNode = function() {
    if ( valueProperty.hasListener( valuePropertyObserver ) ) {
      valueProperty.unlink( valuePropertyObserver );
    }
  };

  // support for binder documentation, stripped out in builds and only runs when ?binder is specified
  assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'ScientificNotationNode', this );
}

sceneryPhet.register( 'ScientificNotationNode', ScientificNotationNode );

inherit( Node, ScientificNotationNode, {

  /**
   * @public
   */
  dispose: function() {
    this.disposeScientificNotationNode();
    Node.prototype.dispose.call( this );
  },

  /**
   * @param {number|null} value
   * @private
   */
  update: function( value ) {

    const options = this.options;

    //NOTE: adding and removing nodes is more expensive than changing visibility, but results in correct bounds.
    // start will all nodes included
    if ( !this.hasChild( this.mantissaNode ) ) { this.addChild( this.mantissaNode ); }
    if ( !this.hasChild( this.exponentNode ) ) { this.addChild( this.exponentNode ); }
    if ( !this.hasChild( this.timesTenNode ) ) { this.addChild( this.timesTenNode ); }

    if ( value === null ) {
      // no value
      this.mantissaNode.text = options.nullValueString;
      this.removeChild( this.timesTenNode );
      this.removeChild( this.exponentNode );
    }
    else if ( Math.floor( value ) === value && options.showIntegersAsMantissaOnly ) {
      // show integers as mantissa only
      this.mantissaNode.text = value;
      this.removeChild( this.timesTenNode );
      this.removeChild( this.exponentNode );
    }
    else {
      const scientificNotation = ScientificNotationNode.toScientificNotation( value, options );
      const mantissaNumber = Utils.toFixedNumber( scientificNotation.mantissa, options.mantissaDecimalPlaces );
      const exponentNumber = parseInt( scientificNotation.exponent, 10 );

      if ( mantissaNumber === 0 && options.showZeroAsInteger ) {
        // show '0 x 10^E' as '0'
        this.mantissaNode.text = '0';
        this.removeChild( this.timesTenNode );
        this.removeChild( this.exponentNode );
      }
      else if ( exponentNumber === 0 && !options.showZeroExponent ) {
        // show 'M x 10^0' as 'M'
        this.mantissaNode.text = scientificNotation.mantissa;
        this.removeChild( this.timesTenNode );
        this.removeChild( this.exponentNode );
      }
      else {
        // show 'M x 10^E'
        this.mantissaNode.text = scientificNotation.mantissa;
        this.timesTenNode.text = 'x 10';
        this.exponentNode.text = scientificNotation.exponent;
      }
    }

    // update layout
    this.timesTenNode.left = this.mantissaNode.right + this.mantissaXSpacing;
    this.exponentNode.left = this.timesTenNode.right + options.exponentXSpacing;
  }
}, {

  /**
   * Converts a number to scientific-notation format, consisting of a mantissa and exponent,
   * such that the values is equal to (mantissa * Math.pow(10, exponent)).]
   *
   * @static
   * @param {number} value the number to be formatted
   * @param {Object} [options]
   * @returns {mantissa:{string}, exponent:{string}}
   */
  toScientificNotation: function( value, options ) {

    options = merge( {
      mantissaDecimalPlaces: 1,
      exponent: null // specific exponent to use
    }, options );

    let mantissa;
    let exponent;
    if ( value === 0 ) {
      mantissa = 0;
      exponent = 1;
    }
    else if ( options.exponent !== null && options.exponent === 0 ) {
      mantissa = Utils.toFixed( value, options.mantissaDecimalPlaces );
      exponent = 0;
    }
    else {
      // Convert to a string in exponential notation (eg 2e+2).
      // Request an additional decimal place, because toExponential uses toFixed, which doesn't round the same on all platforms.
      const exponentialString = value.toExponential( options.mantissaDecimalPlaces + 1 );

      // Break into mantissa and exponent tokens.
      const tokens = exponentialString.toLowerCase().split( 'e' );

      // Adjust the mantissa token to the correct number of decimal places, using nearest-neighbor rounding.
      mantissa = Utils.toFixedNumber( parseFloat( tokens[ 0 ] ), options.mantissaDecimalPlaces );
      exponent = parseInt( tokens[ 1 ], 10 );

      // Convert if a specific exponent was requested.
      if ( options.exponent !== null ) {
        mantissa = Utils.toFixedNumber( mantissa * Math.pow( 10, exponent - options.exponent ), Math.max( 0, options.mantissaDecimalPlaces ) );
        exponent = options.exponent;
      }
    }

    // restore precision in case toFixedNumber removed zeros to right of decimal
    mantissa = Utils.toFixed( mantissa, options.mantissaDecimalPlaces );
    exponent = exponent.toString();

    // mantissa x 10^exponent
    return { mantissa: mantissa, exponent: exponent };
  }
} );

export default ScientificNotationNode;