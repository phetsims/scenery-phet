// Copyright 2002-2013, University of Colorado Boulder

/**
 * MultiLine plain text, with alignment.
 * The line break character is '\n'.
 * Specify alignment via the 'align' option.
 * Text node options can be specified to style the text.
 * <p>
 * Example: new MultiLineText( 'Hello\nWorld', { align: 'left', font: new PhetFont(20), fill: 'red' } );
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   *
   * @param {string} text
   * @param {Object} [options]
   * @constructor
   */
  function MultiLineText( text, options ) {

    var thisNode = this;

    thisNode._options = options = _.extend( {
      font: new PhetFont(),
      align: 'center' // 'center', 'left' or 'right' (as supported by VBox)
    }, options );

    Node.call( thisNode );

    thisNode._text = null; // @private
    thisNode.text = text; // call ES5 setter

    thisNode.mutate( _.omit( options, 'align' ) ); // mutate after removing options that are specific to this subtype
  }

  inherit( Node, MultiLineText, {

      get text() {
        return this._text;
      },

      set text( value ) {
        var thisNode = this;
        thisNode._text = value;
        thisNode.children = [ new VBox( {
          children: value.split( '\n' ).map( function( line ) {
            if ( line.length === 0 ) { line = ' '; }  // creates a blank line between consecutive line breaks
            return new Text( line, _.omit( thisNode._options, 'align' ) );
          } ),
          align: thisNode._options.align
        } ) ];
      },

      /**
       * Returns an Array of the text nodes that comprise this multi line text, in case they need to be modified.
       * @private
       * @returns {Array[Text]}
       */
      getTextNodes: function() {
        var vbox = this.children[ 0 ];
        return vbox.getChildren();
      },

      /**
       * Sets the fill for all Text nodes.
       * @param {Color|string} fill
       */
      setFill: function( fill ) {
        var children = this.getTextNodes();
        for ( var i = 0; i < children.length; i++ ) {
          children[ i ].setFill( fill );
        }
      }
    }
  );

  return MultiLineText;
} );
