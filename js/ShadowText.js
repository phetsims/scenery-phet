// Copyright 2014-2019, University of Colorado Boulder

/**
 * Text with a drop shadow.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {string} text
   * @param {Object} [options]
   * @constructor
   */
  function ShadowText( text, options ) {
    options = _.extend( {
      font: new PhetFont( 24 ),
      fill: 'lightGray',
      stroke: null,
      shadowXOffset: 3,
      shadowYOffset: 1,
      shadowFill: 'black'
    }, options );

    options.children = [
      new Text( text, { font: options.font, fill: options.shadowFill, x: options.shadowXOffset, y: options.shadowYOffset } ), // shadow
      new Text( text, { font: options.font, fill: options.fill, stroke: options.stroke } )
    ];

    Node.call( this, options );
  }

  sceneryPhet.register( 'ShadowText', ShadowText );

  return inherit( Node, ShadowText );
} );