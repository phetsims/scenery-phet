// Copyright 2013-2017, University of Colorado Boulder

/**
 * Scenery node that represents a simple, non-interactive clock.  It is
 * intended for use in situations where an icon representing time is needed.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );

  /**
   * @param {number} radius
   * @param {Object} [options]
   * @constructor
   */
  function SimpleClockIcon( radius, options ) {

    Node.call( this );
    options = _.extend( { fill: 'white', stroke: 'black', lineWidth: 2 }, options );
    this.addChild( new Circle( radius, options ) );
    this.addChild( new Circle( radius * 0.15, { fill: options.stroke } ) );
    var lineOptionsForClockHands = {
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      lineCap: 'round',
      lineJoin: 'round'
    };
    // Hands at 4 o'clock
    this.addChild( new Line( 0, 0, 0, -radius * 0.75, lineOptionsForClockHands ) );
    this.addChild( new Line( 0, 0, radius * 0.45, radius * 0.3, lineOptionsForClockHands ) );
    this.centerX = radius;
    this.centerY = radius;
    this.mutate( options );
  }

  sceneryPhet.register( 'SimpleClockIcon', SimpleClockIcon );

  return inherit( Node, SimpleClockIcon );
} );