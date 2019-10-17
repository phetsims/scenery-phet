// Copyright 2014-2019, University of Colorado Boulder

/**
 * Text with a drop shadow.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {string} text
   * @param {Object} [options]
   * @constructor
   */
  function ShadowText( text, options ) {
    options = merge( {
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