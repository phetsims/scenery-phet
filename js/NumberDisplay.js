// Copyright 2015-2019, University of Colorado Boulder

/**
 * Displays a Property of type {number} in a background rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplayIO = require( 'SCENERY_PHET/NumberDisplayIO' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RichText = require( 'SCENERY/nodes/RichText' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const SunConstants = require( 'SUN/SunConstants' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );

  // valid values for options.align and options.noValueAlign
  var ALIGN_VALUES = [ 'center', 'left', 'right' ];

  /**
   * @param {Property.<number|null>} numberProperty
   * @param {Range} displayRange - this range, with options.decimals applied, is used to determine the display width.
   *                               It is unrelated to the range of numberProperty.
   * @param {Object} [options]
   * @constructor
   */
  function NumberDisplay( numberProperty, displayRange, options ) {

    options = _.extend( {
      align: 'right', // see ALIGN_VALUES

      // {string} Pattern used to format the value.
      // Must contain SunConstants.VALUE_NAMED_PLACEHOLDER or SunConstants.VALUE_NUMBERED_PLACEHOLDER.
      valuePattern: SunConstants.VALUE_NAMED_PLACEHOLDER,
      useRichText: false,
      font: new PhetFont( 20 ),

      // {number|null} the number of decimal places to show. If null, the full value is displayed.
      // We attempted to change the default to null, but there were too many usages that relied on the 0 default.
      // See https://github.com/phetsims/scenery-phet/issues/511
      decimalPlaces: 0,

      xMargin: 8,
      yMargin: 2,
      cornerRadius: 0,
      numberFill: 'black',
      numberMaxWidth: null, // {number|null} if null, then it will be computed
      backgroundFill: 'white',
      backgroundStroke: 'lightGray',
      backgroundLineWidth: 1,
      minBackgroundWidth: 0,

      // options related to display when numberProperty.value === null
      noValueString: MathSymbols.NO_VALUE, // {string} default is the PhET standard, do no override lightly.
      noValueAlign: null, // {string|null} see ALIGN_VALUES. If null, defaults to options.align
      noValuePattern: null, // {string|null} If null, defaults to options.valuePattern

      // phet-io
      tandem: Tandem.optional,
      phetioType: NumberDisplayIO
    }, options );

    // Set default alignments and validate
    assert && assert( _.includes( ALIGN_VALUES, options.align ), 'invalid align: ' + options.align );
    if ( !options.noValueAlign ) {
      options.noValueAlign = options.align;
    }
    assert && assert( _.includes( ALIGN_VALUES, options.noValueAlign ), 'invalid noValueAlign: ' + options.noValueAlign );

    // Support numbered (old-style) placeholder by replacing it with the corresponding named placeholder.
    // See https://github.com/phetsims/scenery-phet/issues/446
    if ( options.valuePattern.indexOf( SunConstants.VALUE_NUMBERED_PLACEHOLDER ) !== -1 ) {
      options.valuePattern = StringUtils.format( options.valuePattern, SunConstants.VALUE_NAMED_PLACEHOLDER );
    }
    assert && assert( !!phet.chipper.queryParameters.stringTest ||
                      options.valuePattern.indexOf( SunConstants.VALUE_NAMED_PLACEHOLDER ) !== -1,
      'missing value placeholder in options.valuePattern: ' + options.valuePattern );

    // Set default and validate
    if ( !options.noValuePattern ) {
      options.noValuePattern = options.valuePattern;
    }
    assert && assert( !!phet.chipper.queryParameters.stringTest ||
                      options.noValuePattern.indexOf( SunConstants.VALUE_NAMED_PLACEHOLDER ) !== -1,
      'missing value placeholder in options.noValuePattern: ' + options.noValuePattern );

    var self = this;

    // determine the widest value
    var minString = valueToString( displayRange.min, options.decimalPlaces, options.noValueString );
    var maxString = valueToString( displayRange.max, options.decimalPlaces, options.noValueString );
    var longestString = StringUtils.fillIn( options.valuePattern, {
      value: ( ( minString.length > maxString.length ) ? minString : maxString )
    } );

    // value
    var Constructor = options.useRichText ? RichText : Text;
    this.valueNode = new Constructor( longestString, {
      font: options.font,
      fill: options.numberFill,
      maxWidth: options.numberMaxWidth,
      phetioReadOnly: true,
      tandem: options.tandem.createTandem( 'valueText' )
    } );

    // maxWidth for valueNode
    if ( options.numberMaxWidth === null ) {
      this.valueNode.maxWidth = this.valueNode.width;
    }
    else {
      this.valueNode.maxWidth = options.numberMaxWidth;
    }

    var backgroundWidth = Math.max( options.minBackgroundWidth, this.valueNode.width + 2 * options.xMargin );

    // @private background
    this.backgroundNode = new Rectangle( 0, 0, backgroundWidth, this.valueNode.height + 2 * options.yMargin, {
      cornerRadius: options.cornerRadius,
      fill: options.backgroundFill,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } );

    options.children = [ this.backgroundNode, this.valueNode ];

    // display the value
    var numberObserver = function( value ) {

      const valuePattern = ( value === null ) ? options.noValuePattern : options.valuePattern;
      const stringValue = valueToString( value, options.decimalPlaces, options.noValueString );
      const align = ( value === null ) ? options.noValueAlign : options.align;

      // update the value
      self.valueNode.text = StringUtils.fillIn( valuePattern, {
        value: stringValue
      } );

      // horizontally align value in background
      if ( align === 'center' ) {
        self.valueNode.centerX = self.backgroundNode.centerX;
      }
      else if ( align === 'left' ) {
        self.valueNode.left = self.backgroundNode.left + options.xMargin;
      }
      else { // right
        self.valueNode.right = self.backgroundNode.right - options.xMargin;
      }
      self.valueNode.centerY = self.backgroundNode.centerY;
    };
    numberProperty.link( numberObserver );

    // @private called by dispose
    this.disposeNumberDisplay = function() {
      numberProperty.unlink( numberObserver );
    };

    Node.call( this, options );
  }

  sceneryPhet.register( 'NumberDisplay', NumberDisplay );

  /**
   * Converts a numeric value to a string.
   * @param {number} value
   * @param {number|null} decimalPlaces - if null, use the full value
   * @param {string} noValueString
   * @returns {*|string}
   */
  function valueToString( value, decimalPlaces, noValueString ) {
    let stringValue = noValueString;
    if ( value !== null ) {
      if ( decimalPlaces === null ) {
        stringValue = '' + value;
      }
      else {
        stringValue = Util.toFixed( value, decimalPlaces );
      }
    }
    return stringValue;
  }

  return inherit( Node, NumberDisplay, {

    // @public
    dispose: function() {
      this.disposeNumberDisplay();
      Node.prototype.dispose.call( this );
    },

    /**
     * Sets the number text font.
     * @param {Font} font
     * @public
     */
    setNumberFont: function( font ) {
      this.valueNode.font = font;
    },
    set numberFont( value ) { this.setNumberFont( value ); },

    /**
     * Sets the number text fill.
     * @param {Color|string} fill
     * @public
     */
    setNumberFill: function( fill ) {
      this.valueNode.fill = fill;
    },
    set numberFill( value ) { this.setNumberFill( value ); },

    /**
     * Sets the background fill.
     * @param {Color|string} fill
     * @public
     */
    setBackgroundFill: function( fill ) {
      this.backgroundNode.fill = fill;
    },
    set backgroundFill( value ) { this.setBackgroundFill( value ); },

    /**
     * Sets the background stroke.
     * @param {Color|string} stroke
     * @public
     */
    setBackgroundStroke: function( stroke ) {
      this.backgroundNode.stroke = stroke;
    },
    set backgroundStroke( value ) { this.setBackgroundStroke( value ); }
  } );
} );
