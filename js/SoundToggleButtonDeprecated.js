// Copyright 2002-2013, University of Colorado Boulder

/**
 * Button for toggling sound on and off.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var ToggleButton = require( 'SUN/ToggleButton' );

  var X_WIDTH = 12; // Empirically determined.

  function SoundToggleButtonDeprecated( property, options ) {
    var soundOffNode = new Node();
    soundOffNode.addChild( new FontAwesomeNode( 'volume_off' ) );
    var soundOffX = new Path( new Shape().moveTo( 0, 0 ).lineTo( X_WIDTH, X_WIDTH ).moveTo( 0, X_WIDTH ).lineTo( X_WIDTH, 0 ),
      {
        stroke: 'black',
        lineWidth: 3,
        left: soundOffNode.width + 5,
        centerY: soundOffNode.centerY
      } );
    soundOffNode.addChild( soundOffX );

    ToggleButton.call( this,
      new FontAwesomeNode( 'volume_up' ),
      soundOffNode,
      property,
      _.extend( { addRectangle: true, label: 'Sound' }, options ) );
  }

  inherit( ToggleButton, SoundToggleButtonDeprecated );

  return SoundToggleButtonDeprecated;
} );