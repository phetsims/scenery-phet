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

    options = _.extend( {
      font: new PhetFont(),
      align: 'center' // 'center', 'left' or 'right' (as supported by VBox)
    }, options );
    this.options = options; // @private

    Node.call( this );

    this._text = null; // @private underscore prefix because it has ES5 set/get
    this.textParent = null; // @private
    this.text = text; // call ES5 setter

    this.mutate( _.omit( options, 'align' ) ); // mutate after removing options that are specific to this subtype
  }

  inherit( Node, MultiLineText, {

      /**
       * Sets the text.
       * @param {string} text
       */
      setText: function( text ) {

        // save the new text
        this._text = text;

        // parse the text and create {Text[]}
        var thisNode = this;
        var textNodes = text.split( '\n' ).map( function( line ) {
          if ( line.length === 0 ) { line = ' '; }  // creates a blank line between consecutive line breaks
          return new Text( line, _.omit( thisNode.options, 'align' ) );
        } );

        // determine where the textParent was, so we can maintain rendering order
        var index = this.textParent ? this.indexOfChild( this.textParent ) : 0;

        // remove the old textParent
        if ( this.textParent ) { this.removeChild( this.textParent ); }

        // add the new textParent
        this.textParent = new VBox( {
          children: textNodes,
          align: this.options.align
        } );
        this.insertChild( index, this.textParent );
      },
      set text( value ) { this.setText( value ); }, // ES5 setter

      /**
       * Gets the text.
       * @returns {string}
       */
      getText: function() { return this._text; },
      get text() { return this.getText(); }, // ES5 getter

      /**
       * Sets the fill for all Text nodes.
       * @param {Color|string} fill
       */
      setFill: function( fill ) {
        this.options.fill = fill;
        var children = this.textParent.getChildren();
        for ( var i = 0; i < children.length; i++ ) {
          children[ i ].setFill( fill );
        }
      },
      set fill( value ) { this.setFill( value ); }, // ES5 setter

      /**
       * Gets the fill used for the text.
       * @returns {Color|string}
       */
      getFill: function() { return this.options.fill; },
      get fill() { return getFill(); } // ES5 getter
    }
  );

  return MultiLineText;
} );
