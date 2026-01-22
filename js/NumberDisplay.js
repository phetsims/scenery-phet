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
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Property.<number>} numberProperty
   * @param {Range} numberRange
   * @param {string} units
   * @param {string} pattern
   * @param {Object} [options]
   * @constructor
   */
  function NumberDisplay( numberProperty, numberRange, units, pattern, options ) {

    options = _.extend( {
      font: new PhetFont( 20 ),
      decimalPlaces: 0,
      xMargin: 8,
      yMargin: 2,
      cornerRadius: 0,
      numberFill: 'black',
      backgroundFill: 'white',
      backgroundStroke: 'lightGray'
    }, options );

    // determine the widest value
    var minString = Util.toFixed( numberRange.min, options.decimalPlaces );
    var maxString = Util.toFixed( numberRange.max, options.decimalPlaces );
    var widestString = StringUtils.format( pattern, ( ( minString.length > maxString.length ) ? minString : maxString ), units );

    // value
    var valueNode = new Text( widestString, {
      font: options.font,
      fill: options.numberFill
    } );

    // background
    var background = new Rectangle( 0, 0, valueNode.width + 2 * options.xMargin, valueNode.height + 2 * options.yMargin, options.cornerRadius, options.cornerRadius, {
      fill: options.backgroundFill,
      stroke: options.backgroundStroke
    } );
    valueNode.centerY = background.centerY;

    options.children = [ background, valueNode ];

    // display the value
    var numberObserver = function( value ) {
      valueNode.text = StringUtils.format( pattern, Util.toFixed( value, options.decimalPlaces ), units );
      valueNode.right = background.right - options.xMargin; // right justified
    };
    numberProperty.link( numberObserver );

    // @private called by dispose
    this.disposeNumberDisplay = function() {
      numberProperty.unlink( numberObserver );
    };

    Node.call( this, options );
  }

  return inherit( Node, NumberDisplay, {

    // @public
    dispose: function() {
      this.disposeNumberDisplay();
    }
  } );
} );