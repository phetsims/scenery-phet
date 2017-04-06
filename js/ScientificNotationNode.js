// Copyright 2014-2015, University of Colorado Boulder

/**
 * Displays a number in scientific notation, M x 10^E, where M is the mantissa and E is the exponent (e.g. 2.34 x 10^-4).
 * To conserve memory, creates one set of scenery.Text nodes, modifies their text as needed.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

  /**
   * @param {Property.<number>} valueProperty
   * @param {Object} [options]
   * @constructor
   */
  function ScientificNotationNode( valueProperty, options ) {
    Tandem.indicateUninstrumentedCode();

    options = _.extend( {
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
      nullValueString: '-' // if the value is null, display this string
    }, options );
    this.options = options; // @private

    var textOptions = { font: options.font, fill: options.fill };
    this.valueProperty = valueProperty; // @public

    // must be recomputed if font changes!
    var tmpText = new Text( ' ', textOptions );
    this.mantissaXSpacing = tmpText.width; // @private width of space between mantissa and 'x 10'
    this.capLineYOffset = options.capHeightScale * ( tmpText.top - tmpText.y ); // @private cap line offset from baseline

    // scenery.Text nodes
    this.mantissaNode = new Text( '?', textOptions );
    this.timesTenNode = new Text( '?', textOptions );
    this.exponentNode = new Text( '?', _.extend( { scale: options.exponentScale }, textOptions ) ); // exponent is scaled
    this.exponentNode.centerY = this.timesTenNode.y + this.capLineYOffset + options.exponentYOffset;

    Node.call( this, _.extend( options, { children: [ this.mantissaNode, this.exponentNode, this.timesTenNode ] } ) ); // this replaces options.children

    valueProperty.link( this.update.bind( this ) );
  }

  sceneryPhet.register( 'ScientificNotationNode', ScientificNotationNode );

  return inherit( Node, ScientificNotationNode, {

    /**
     * @param {number} value
     * @private
     */
    update: function( value ) {

      var options = this.options;

      //NOTE: adding and removing nodes is more expensive than changing visibility, but results in correct bounds.
      // start will all nodes included
      if ( !this.hasChild( this.mantissaNode ) ) { this.addChild( this.mantissaNode ); }
      if ( !this.hasChild( this.exponentNode ) ) { this.addChild( this.exponentNode ); }
      if ( !this.hasChild( this.timesTenNode ) ) { this.addChild( this.timesTenNode ); }

      if ( value === null ) {
        // show '-'
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
        var scientificNotation = ScientificNotationNode.toScientificNotation( value, options );
        if ( scientificNotation.mantissa === 0 && options.showZeroAsInteger ) {
          // show '0 x 10^E' as '0'
          this.mantissaNode.text = '0';
          this.removeChild( this.timesTenNode );
          this.removeChild( this.exponentNode );
        }
        else if ( scientificNotation.exponent === 0 && !options.showZeroExponent ) {
          // show 'M x 10^0' as 'M'
          this.mantissaNode.text = Util.toFixed( scientificNotation.mantissa, options.mantissaDecimalPlaces );
          this.removeChild( this.timesTenNode );
          this.removeChild( this.exponentNode );
        }
        else {
          // show 'M x 10^E'
          this.mantissaNode.text = Util.toFixed( scientificNotation.mantissa, options.mantissaDecimalPlaces );
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
     * @returns {mantissa:{number}, exponent:{number}}
     */
    toScientificNotation: function( value, options ) {

      options = _.extend( {
        mantissaDecimalPlaces: 1,
        exponent: null // specific exponent to use
      }, options );

      var mantissa;
      var exponent;
      if ( value === 0 ) {
        mantissa = 0;
        exponent = 1;
      }
      else if ( options.exponent !== null && options.exponent === 0 ) {
        mantissa = Util.toFixed( value, options.mantissaDecimalPlaces );
        exponent = 0;
      }
      else {
        // Convert to a string in exponential notation (eg 2e+2).
        // Request an additional decimal place, because toExponential uses toFixed, which doesn't round the same on all platforms.
        var exponentialString = value.toExponential( options.mantissaDecimalPlaces + 1 );

        // Break into mantissa and exponent tokens.
        var tokens = exponentialString.toLowerCase().split( 'e' );

        // Adjust the mantissa token to the correct number of decimal places, using nearest-neighbor rounding.
        mantissa = Util.toFixedNumber( parseFloat( tokens[ 0 ] ), options.mantissaDecimalPlaces );
        exponent = parseInt( tokens[ 1 ], 10 );

        // Convert if a specific exponent was requested.
        if ( options.exponent !== null ) {
          mantissa = Util.toFixedNumber( mantissa * Math.pow( 10, exponent - options.exponent ), Math.max( 0, options.mantissaDecimalPlaces ) );
          exponent = options.exponent;
        }
      }

      // mantissa x 10^exponent
      return { mantissa: mantissa, exponent: exponent };
    }

    //TODO add setters and getters for scenery.Text properties as needed
  } );
} );
