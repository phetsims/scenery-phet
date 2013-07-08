// Copyright 2002-2013, University of Colorado Boulder

/**
 * The Home button that appears in the navigation bar.
 */
define( function( require ) {
  'use strict';

  // imports
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function HomeButton( options ) {

    options = _.extend( { cursor: 'pointer' }, options );

    Node.call( this, options );

    var icon = new FontAwesomeNode( 'home', { fill: '#fff' } );
    this.addChild( new Rectangle( icon.bounds.minX, icon.bounds.minY, icon.bounds.width, icon.bounds.height ) );
    this.addChild( icon );
  }

  inherit( Node, HomeButton );

  return HomeButton;
} );