// Copyright 2002-2014, University of Colorado Boulder

/**
 * Button for toggling sound on and off.
 *
 * @author John Blanco
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var BooleanRectangularToggleButtonWithContent = require( 'SUN/experimental/buttons/BooleanRectangularToggleButton' );

  // Constants
  var WIDTH = 50;
  var HEIGHT = 50;
  var MARGIN = 4;
  var X_WIDTH = WIDTH * 0.25; // Empirically determined.

  function SoundToggleButton( property, options ) {
    var soundOffNode = new Node();
    var soundOnNode = new FontAwesomeNode( 'volume_up' );
    var scale = ( WIDTH - ( 2 * MARGIN ) ) / soundOnNode.width;
    soundOnNode.scale( scale );
    soundOffNode.addChild( new FontAwesomeNode( 'volume_off', { scale: scale } ) );
    var soundOffX = new Path( new Shape().moveTo( 0, 0 ).lineTo( X_WIDTH, X_WIDTH ).moveTo( 0, X_WIDTH ).lineTo( X_WIDTH, 0 ),
      {
        stroke: 'black',
        lineWidth: 3,
        left: soundOffNode.width + 5,
        centerY: soundOffNode.centerY
      } );
    soundOffNode.addChild( soundOffX );

    BooleanRectangularToggleButtonWithContent.call( this, soundOnNode, soundOffNode, property, _.extend(
      {
        baseColor: new Color( 255, 242, 2 ),
        minWidth: WIDTH,
        minHeight: HEIGHT,
        xMargin: MARGIN,
        yMargin: MARGIN
      }, options ) );
  }

  return inherit( BooleanRectangularToggleButtonWithContent, SoundToggleButton );
} );