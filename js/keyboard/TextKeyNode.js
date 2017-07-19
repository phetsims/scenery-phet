// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like a keyboard key with text that is generally more than a
 * single character.  By default, a key node with text is more rectangular than
 * a letter key, and the text content is aligned in the left top corner by
 * default.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var KeyNode = require( 'SCENERY_PHET/keyboard/KeyNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * Constructor.
   * 
   * @param {string} string
   * @param {Object} options
   */
  function TextKeyNode( string, options ) {

    // margins, width, and height in ScreenView coordinates
    options = _.extend( {

      // keynode options
      xAlign: 'left',
      yAlign: 'top',

      xMargin: 5,
      yMargin: 5,

      minKeyWidth: 42,
      maxKeyWidth: 42,

      minKeyHeight: 32, // smaller than width to appear rectangular
      maxKeyHeight: 32,

      // text options
      font: new PhetFont( 10 ),
      fill: 'black'

    }, options );

    var textNode = new Text( string, { font: options.font, fill: options.fill } );
    KeyNode.call( this, textNode, options );
  }

  sceneryPhet.register( 'TextKeyNode', TextKeyNode );

  return inherit( KeyNode, TextKeyNode );

} );
