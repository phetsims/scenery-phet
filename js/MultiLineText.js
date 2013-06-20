// Copyright 2013, University of Colorado

/**
 * MultiLine plain text, with alignment.
 * The line break character is '\n'.
 * Specify alignment via the 'align' option.
 * Text node options can be specified to style the text.
 * <p>
 * Example: new MultiLineText( 'Hello\nWorld', { align: 'left', font: 'sans-serif', fill: 'red' } );
 *
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  function MultiLineText( text, options ) {

    this._options = options = _.extend( {
      align: 'center' // 'center', 'left' or 'right' (as supported by VBox)
    }, options );

    Node.call( this );

    this.text = text;

    this.mutate( _.omit( options, 'align' ) ); // mutate after removing options that are specific to this subtype
  }

  inherit( Node, MultiLineText, {
      get text() {
        return this._text;
      },
      set text( text ) {
        var thisNode = this;
        this._text = text;
        this.children = [ new VBox( {
          children: text.split( '\n' ).map( function( line ) {
            return new Text( line, _.omit( thisNode._options, 'align' ) );
          } ),
          align: thisNode._options.align
        } )];
      }
    }
  );

  return MultiLineText;
} );