// Copyright 2016-2017, University of Colorado Boulder

/**
 * Node that looks like an arrow key on the keyboard.  Default is a rounded
 * triangle centered in a square key.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var KeyNode = require( 'SCENERY_PHET/keyboard/KeyNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  Tandem.indicateUninstrumentedCode();

  // constants
  var DEFAULT_ARROW_HEIGHT = 10;
  var DEFAULT_ARROW_WIDTH = 1 / 2 * Math.sqrt( 3 ) * DEFAULT_ARROW_HEIGHT; // for equilateral triangle

  /**
   * @param {string} direction - direction of arrow, 'up'|'down'|'left'|'right'
   * @param {Object} options
   * @constructor
   */
  function ArrowKeyNode( direction, options ) {

    options = _.extend( {

      // options for the arrow
      arrowFill: 'black',
      arrowStroke: 'black',
      arrowLineJoin: 'round',
      arrowLineWidth: 3,
      arrowHeight: DEFAULT_ARROW_HEIGHT,
      arrowWidth: DEFAULT_ARROW_WIDTH,
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

    // draw the arrow
    var pathOptions = {
      fill: arrowFill,
      stroke: arrowStroke,
      lineJoin: arrowLineJoin,
      lineWidth: arrowLineWidth
    };
    var arrowPath = new Path( arrowShape, pathOptions );

    if ( direction === 'up' ) {
      arrowPath.rotate( 0 ); // default arrow shape points up
    }
    else if ( direction === 'down' ) {
      arrowPath.rotate( Math.PI );
    }
    else if ( direction === 'left' ) {
      arrowPath.rotate( -Math.PI / 2 );
    }
    else if ( direction === 'right' ) {
      arrowPath.rotate( Math.PI / 2 );
    }
    else {
      throw new Error( 'unsupported direction: ' + direction );
    }

    // place the arrow in the key
    KeyNode.call( this, arrowPath, options );
  }

  sceneryPhet.register( 'ArrowKeyNode', ArrowKeyNode );

  return inherit( KeyNode, ArrowKeyNode );

} );
