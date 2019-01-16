// Copyright 2015-2018, University of Colorado Boulder

/**
 * Displays a Property of type {number} in a background rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberDisplayIO = require( 'SCENERY_PHET/NumberDisplayIO' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // valid values for options.align
  var ALIGN_VALUES = [ 'center', 'left', 'right' ];
  var NUMBERED_PLACEHOLDER = '{0}';
  var NAMED_PLACEHOLDER = '{{value}}';
  var DEFAULT_VALUE_PATTERN = NAMED_PLACEHOLDER;

  /**
   * @param {Property.<number|null>} numberProperty
   * @param {Range} numberRange
   * @param {Object} [options]
   * @constructor
   */
  function NumberDisplay( numberProperty, numberRange, options ) {

    options = _.extend( {
      align: 'right', // see ALIGN_VALUES

      // {string} Pattern used to format the value. Must contain '{{value}}' or '{0}'.
      // If you want units or other verbiage, add them to the pattern, e.g. '{{value}} L'
      valuePattern: DEFAULT_VALUE_PATTERN,
      useRichText: false,
      font: new PhetFont( 20 ),
      decimalPlaces: 0,
      xMargin: 8,
      yMargin: 2,
      cornerRadius: 0,
      numberFill: 'black',
      numberMaxWidth: 200,
      backgroundFill: 'white',
      backgroundStroke: 'lightGray',
      backgroundLineWidth: 1,
      minBackgroundWidth: 0,

      // string that is displayed when numberProperty.value is null
      noValueString: MathSymbols.NO_VALUE,

      // phet-io
      tandem: Tandem.optional,
      phetioType: NumberDisplayIO
    }, options );

    // validate options
    assert && assert( _.includes( ALIGN_VALUES, options.align ), 'invalid align: ' + options.align );

    // Support numbered (old-style) placeholders by replacing '{0}' with '{{value}}'.
    // See https://github.com/phetsims/scenery-phet/issues/446
    if ( options.valuePattern.indexOf( NUMBERED_PLACEHOLDER ) !== -1 ) {
      options.valuePattern = StringUtils.format( options.valuePattern, NAMED_PLACEHOLDER );
    }

    var self = this;

    // determine the widest value
    var minString = Util.toFixed( numberRange.min, options.decimalPlaces );
    var maxString = Util.toFixed( numberRange.max, options.decimalPlaces );
    var longestString = StringUtils.fillIn( options.valuePattern, {
      value: ( ( minString.length > maxString.length ) ? minString : maxString )
    } );

    // value
    var Constructor = options.useRichText ? RichText : Text;
    this.valueNode = new Constructor( longestString, {
      font: options.font,
      fill: options.numberFill,
      maxWidth: options.numberMaxWidth,
      tandem: options.tandem.createTandem( 'valueNode' )
    } );

    var backgroundWidth = Math.max( options.minBackgroundWidth, this.valueNode.width + 2 * options.xMargin );

    // @private background
    this.backgroundNode = new Rectangle( 0, 0, backgroundWidth, this.valueNode.height + 2 * options.yMargin, {
      cornerRadius: options.cornerRadius,
      fill: options.backgroundFill,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } );
    this.valueNode.centerY = this.backgroundNode.centerY;

    options.children = [ this.backgroundNode, this.valueNode ];

    // display the value
    var numberObserver = function( value ) {

      // update the value
      self.valueNode.text = StringUtils.fillIn( options.valuePattern, {
        value: ( value === null ) ? options.noValueString : Util.toFixed( value, options.decimalPlaces )
      } );

      // horizontally align value in background
      if ( options.align === 'center' ) {
        self.valueNode.centerX = self.backgroundNode.centerX;
      }
      else if ( options.align === 'left' ) {
        self.valueNode.left = self.backgroundNode.left + options.xMargin;
      }
      else { // right
        self.valueNode.right = self.backgroundNode.right - options.xMargin;
      }
    };
    numberProperty.link( numberObserver );

    // @private called by dispose
    this.disposeNumberDisplay = function() {
      numberProperty.unlink( numberObserver );
    };

    Node.call( this, options );
  }

  sceneryPhet.register( 'NumberDisplay', NumberDisplay );

  inherit( Node, NumberDisplay, {

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

  // @public @static
  NumberDisplay.DEFAULT_VALUE_PATTERN = DEFAULT_VALUE_PATTERN;

  return NumberDisplay;
} );
