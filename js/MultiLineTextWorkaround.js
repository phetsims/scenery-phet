// Copyright 2013, University of Colorado

/**
 * Primitive and soon to be deprecated representation for multi-line text.
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var VBox = require( 'SCENERY/nodes/VBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Font = require( 'SCENERY/util/Font' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Node = require( 'SCENERY/nodes/Node' );

  function MultiLineTextWorkaround( text, options ) {
    Node.call( this, options );
    this.options = options;
    this.options.fontSize = this.options.fontSize || 10;//todo use extend
    this.text = text;
    if ( options ) {
      this.mutate( options );
    }
  }

  inherit( Node, MultiLineTextWorkaround, {
    get text() {
      return this._text;
    },
    set text( text ) {
      var multiLineTextWorkaround = this;
      this._text = text;
      this.children = [new VBox( {children: text.split( '\n' ).map( function( line ) {return new Text( line, {fontSize: multiLineTextWorkaround.options.fontSize} );} )} )];
    }
  } );

  return MultiLineTextWorkaround;
} );