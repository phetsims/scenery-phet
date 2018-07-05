// Copyright 2013-2017, University of Colorado Boulder

/**
 * DO NOT USE IN NEW DEVELOPMENT. Please use SCENERY/nodes/RichText.
 *
 * MultiLine plain text, with alignment.
 * The line break character is '\n'.
 * Specify alignment via the 'align' option.
 * Text node options can be specified to style the text.
 *
 * Example: new MultiLineText( 'Hello\nWorld', { align: 'left', font: new PhetFont(20), fill: 'red' } );
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MultiLineTextIO = require( 'SCENERY_PHET/MultiLineTextIO' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // ifphetio
  var phetioEvents = require( 'ifphetio!PHET_IO/phetioEvents' );

  /**
   * @param {string} text
   * @param {Object} [options]
   * @constructor
   * @deprecated
   */
  function MultiLineText( text, options ) {

    options = _.extend( {
      font: new PhetFont(),
      align: 'center', // 'center', 'left' or 'right' (as supported by VBox)
      tandem: Tandem.optional,
      phetioType: MultiLineTextIO
    }, options );

    // Normally individual properties from options should be stored rather than the entire options instance,
    // but in this case the options is stored because it must be propagated to child text instances
    this.options = options; // @private

    Node.call( this );

    this._text = null; // @private underscore prefix because it has ES5 set/get
    this.textParent = null; // @private
    this.text = text; // call ES5 setter

    this.mutate( _.omit( options, 'align' ) ); // mutate after removing options that are specific to this subtype
  }

  sceneryPhet.register( 'MultiLineText', MultiLineText );

  return inherit( Node, MultiLineText, {

    /**
     * Sets the text.
     * @param {string} text
     * @public
     */
    setText: function( text ) {

      // Only trigger the changed event if there is a previous text stored. This must be called before the 'text' arg
      // overwrites the old value of
      if ( this.options.tandem.isSuppliedAndEnabled() && this.text ) {
        phetioEvents.trigger( 'model', this.options.tandem.phetioID, MultiLineTextIO, 'changed', {
          oldText: this.text,
          newText: text
        } );
      }

      var oldText = this._text;

      // save the new text
      this._text = text;

      // parse the text and create {Text[]}
      var self = this;
      var textNodes = StringUtils.embeddedSplit( text, '\n' ).map( function( line ) {

        // create a blank line between consecutive line breaks
        if ( line.length === 0 ) { line = ' '; }

        return new Text( line, _.omit( self.options, 'align', 'maxWidth', 'tandem' ) );
      } );

      // determine where the textParent was, so we can maintain rendering order
      var index = this.textParent ? this.indexOfChild( this.textParent ) : 0;

      // remove the old textParent
      if ( this.textParent ) {
        this.removeChild( this.textParent );
      }

      // add the new textParent
      this.textParent = new VBox( {
        children: textNodes,
        align: this.options.align
      } );
      this.insertChild( index, this.textParent );

      this.trigger2( 'text', oldText, text );
    },
    set text( value ) { this.setText( value ); }, // ES5 setter

    /**
     * Gets the text.
     * @returns {string}
     * @public
     */
    getText: function() { return this._text; },
    get text() { return this.getText(); }, // ES5 getter

    /**
     * Sets the fill for all Text nodes.
     * @param {Color|string} fill
     * @public
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
     * @public
     */
    getFill: function() { return this.options.fill; },
    get fill() { return this.getFill(); } // ES5 getter
  } );
} );
