// Copyright 2002-2013, University of Colorado Boulder

//TODO this should extend sun.Button
//TODO this should handle wiring up the callback that goes to the home screen, currently done in NavigationBar
/**
 * The Home button that appears in the navigation bar.
 */
define( function( require ) {
  'use strict';

  // imports
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );

  function HomeButton( options ) {

    options = _.extend( { cursor: 'pointer' }, options );

    Node.call( this, options );

    var icon = new FontAwesomeNode( 'home', { fill: '#fff' } );
    this.mouseArea = this.touchArea = Shape.rectangle( icon.bounds.minX, icon.bounds.minY, icon.bounds.width, icon.bounds.height );
    this.addChild( icon );
  }

  inherit( Node, HomeButton );

  return HomeButton;
} );