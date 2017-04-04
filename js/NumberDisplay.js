// Copyright 2015-2017, University of Colorado Boulder

/**
 * Displays a Property of type {number} in a background rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TNumberDisplay = require( 'SCENERY_PHET/TNumberDisplay' );

  // valid values for options.align
  var ALIGN_VALUES = [ 'center', 'left', 'right' ];

  /**
   * @param {Property.<number>} numberProperty
   * @param {Range} numberRange
   * @param {Object} [options]
   * @constructor
   */
  function NumberDisplay( numberProperty, numberRange, options ) {

    options = _.extend( {
      align: 'right', // see ALIGN_VALUES

      /// {string} Pattern used to format the value. Must contain '{0}'.
      // If you want units or other verbiage, add them to the pattern, e.g. '{0} L'
      valuePattern: '{0}',
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
      tandem: Tandem.tandemRequired(),
      phetioType: TNumberDisplay
    }, options );

    // validate options
    assert && assert( _.includes( ALIGN_VALUES, options.align ), 'invalid align: ' + options.align );

    var self = this;

    // determine the widest value
    var minString = Util.toFixed( numberRange.min, options.decimalPlaces );
    var maxString = Util.toFixed( numberRange.max, options.decimalPlaces );
    var widestString = StringUtils.format( options.valuePattern, ( ( minString.length > maxString.length ) ? minString : maxString ) );

    // value
    this.valueNode = new Text( widestString, {
      font: options.font,
      fill: options.numberFill,
      maxWidth: options.numberMaxWidth,
      tandem: options.tandem.createTandem( 'valueNode' )
    } );

    // @private background
    this.backgroundNode = new Rectangle( 0, 0, this.valueNode.width + 2 * options.xMargin, this.valueNode.height + 2 * options.yMargin, {
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
      self.valueNode.text = StringUtils.format( options.valuePattern, Util.toFixed( value, options.decimalPlaces ) );

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
