// Copyright 2002-2013, University of Colorado Boulder

//TODO #4: add support for consecutive line breaks, eg 'Hello\n\nWorld'
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
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  function MultiLineText( text, options ) {

    var thisNode = this;

    thisNode._options = options = _.extend( {
      align: 'center' // 'center', 'left' or 'right' (as supported by VBox)
    }, options );

    Node.call( thisNode );
    thisNode.text = text;
    thisNode.mutate( _.omit( options, 'align' ) ); // mutate after removing options that are specific to this subtype
  }

  inherit( Node, MultiLineText, {
      get text() {
        return this._text;
      },
      set text( string ) {
        var thisNode = this;
        thisNode._text = string;
        thisNode.children = [ new VBox( {
          children: string.split( '\n' ).map( function( line ) {
            if ( line.length === 0 ) { line = '|'; }  // creates a blank line between consecutive line breaks
            return new Text( line, _.omit( thisNode._options, 'align' ) );
          } ),
          align: thisNode._options.align
        } )];
      }
    }
  );

  return MultiLineText;
} );
