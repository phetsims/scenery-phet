// Copyright 2015, University of Colorado Boulder

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
  var TandemText = require( 'TANDEM/scenery/nodes/TandemText' );
  var Util = require( 'DOT/Util' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );

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
      valuePattern: '{0}', // {string} if you want units, add them to the pattern, e.g. '{0} L'
      font: new PhetFont( 20 ),
      decimalPlaces: 0,
      xMargin: 8,
      yMargin: 2,
      cornerRadius: 0,
      numberFill: 'black',
      numberMaxWidth: 200,
      backgroundFill: 'white',
      backgroundStroke: 'lightGray',
      tandem: null
    }, options );

    // validate options
    assert && assert( _.contains( ALIGN_VALUES, options.align ), 'invalid align: ' + options.align );

    Tandem.validateOptions( options ); // The tandem is required when brand==='phet-io'

    var thisNode = this;

    // determine the widest value
    var minString = Util.toFixed( numberRange.min, options.decimalPlaces );
    var maxString = Util.toFixed( numberRange.max, options.decimalPlaces );
    var widestString = StringUtils.format( options.valuePattern, ( ( minString.length > maxString.length ) ? minString : maxString ) );

    // value
    this.valueNode = new TandemText( widestString, {
      font: options.font,
      fill: options.numberFill,
      maxWidth: options.numberMaxWidth,
      tandem: options.tandem && options.tandem.createTandem( 'valueNode' )
    } );

    // @private background
    this.backgroundNode = new Rectangle( 0, 0, this.valueNode.width + 2 * options.xMargin, this.valueNode.height + 2 * options.yMargin, options.cornerRadius, options.cornerRadius, {
      fill: options.backgroundFill,
      stroke: options.backgroundStroke
    } );
    this.valueNode.centerY = this.backgroundNode.centerY;

    options.children = [ this.backgroundNode, this.valueNode ];

    // display the value
    var numberObserver = function( value ) {

      // update the value
      thisNode.valueNode.text = StringUtils.format( options.valuePattern, Util.toFixed( value, options.decimalPlaces ) );

      // horizontally align value in background
      if ( options.align === 'center' ) {
        thisNode.valueNode.centerX = thisNode.backgroundNode.centerX;
      }
      else if ( options.align === 'left' ) {
        thisNode.valueNode.left = thisNode.backgroundNode.left + options.xMargin;
      }
      else { // right
        thisNode.valueNode.right = thisNode.backgroundNode.right - options.xMargin;
      }
    };
    numberProperty.link( numberObserver );

    // @private called by dispose
    this.disposeNumberDisplay = function() {
      numberProperty.unlink( numberObserver );
      options.tandem && options.tandem.removeInstance( this );
    };

    Node.call( this, options );

    options.tandem && options.tandem.addInstance( this );
  }

  sceneryPhet.register( 'NumberDisplay', NumberDisplay );

  return inherit( Node, NumberDisplay, {

    // @public
    dispose: function() {
      this.disposeNumberDisplay();
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
