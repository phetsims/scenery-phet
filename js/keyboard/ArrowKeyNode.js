// Copyright 2017, University of Colorado Boulder

/**
 * Node that looks like an arrow key on the keyboard.  Default is a rounded triangle centered in a square key.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var KeyNode = require( 'SCENERY_PHET/keyboard/KeyNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var DEFAULT_ARROW_HEIGHT = 10;
  var DEFAULT_ARROW_WIDTH = 0.6 * Math.sqrt( 3 ) * DEFAULT_ARROW_HEIGHT; // for an isosceles triangle

  // possible directions for the arrows in the key
  var DIRECTION_ANGLES = {
    up: 0,
    down: Math.PI,
    left: -Math.PI / 2,
    right: Math.PI / 2
  };

  /**
   * @param {string} direction - direction of arrow, 'up'|'down'|'left'|'right'
   * @param {Object} options
   * @constructor
   */
  function ArrowKeyNode( direction, options ) {

    assert && assert( DIRECTION_ANGLES[ direction ] !== undefined, 'Arrow direction must be one of DIRECTION_ANGLES' );

    options = _.extend( {

      // options for the arrow
      arrowFill: 'black',
      arrowStroke: 'black',
      arrowLineJoin: 'round',
      arrowLineWidth: 3,
      arrowHeight: DEFAULT_ARROW_HEIGHT,
      arrowWidth: DEFAULT_ARROW_WIDTH,

      yPadding: 10, // this way the arrows will be scaled down and given proper margin in the key
      forceSquareKey: true // arrow keys are typically square
    }, options );

    var arrowHeight = options.arrowHeight;
    var arrowWidth = options.arrowWidth;
    var arrowLineJoin = options.arrowLineJoin;
    var arrowLineWidth = options.arrowLineWidth;
    var arrowFill = options.arrowFill;
    var arrowStroke = options.arrowStroke;

    // draw the arrow shape - default shape pointing up
    var arrowShape = new Shape();
    arrowShape.moveTo( arrowHeight / 2, 0 ).lineTo( arrowHeight, arrowWidth + 0 ).lineTo( 0, arrowWidth + 0 ).close();

    var arrowPath = new Path( arrowShape, {
      fill: arrowFill,
      stroke: arrowStroke,
      lineJoin: arrowLineJoin,
      lineWidth: arrowLineWidth,
      rotation: DIRECTION_ANGLES[ direction ]
    } );

    // place the arrow in the key
    KeyNode.call( this, arrowPath, options );
  }

  sceneryPhet.register( 'ArrowKeyNode', ArrowKeyNode );

  return inherit( KeyNode, ArrowKeyNode );

} );