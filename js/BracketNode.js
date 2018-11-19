// Copyright 2015-2018, University of Colorado Boulder

/**
 * Bracket with optional label.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function BracketNode( options ) {

    options = _.extend( {
      orientation: 'down', // refers to the direction that the tip of the bracket points, 'up'|'down'|'left'|'right'
      labelNode: null, // {Node|null} optional label that will be centered below bracket's tip
      bracketLength: 100, // {number} length of the bracket
      bracketTipLocation: 0.5, // {number} [0,1] exclusive, determines where along the width of the bracket the tip (and optional label) are placed
      bracketEndRadius: 5, // {number} radius of the arcs at the ends of the bracket
      bracketTipRadius: 6, // {number} radius of the arcs at the tip (center) of the bracket
      bracketStroke: 'black', // {Color|string} color of the bracket
      bracketLineWidth: 1, // {number} line width (thickness) of the bracket
      spacing: 2 // {number} space between optional label and tip of bracket
    }, options );

    // validate options
    assert && assert( options.orientation === 'up' || options.orientation === 'down' || options.orientation === 'left' || options.orientation === 'right' );
    assert && assert( options.bracketTipLocation > 0 && options.bracketTipLocation < 1 );

    Node.call( this );

    // compute tip location
    var tipX;
    if ( options.orientation === 'down' || options.orientation === 'left' ) {
       tipX = options.bracketTipLocation * options.bracketLength;
    }
    else {
      tipX = ( 1 - options.bracketTipLocation ) * options.bracketLength;
    }
    assert && assert( tipX > ( options.bracketEndRadius + options.bracketTipRadius ) );
    assert && assert( tipX < options.bracketLength - ( options.bracketEndRadius + options.bracketTipRadius ) );

    // bracket shape, created for 'down' orientation, left-to-right
    var bracketShape = new Shape()
      // left end curves up
      .arc( options.bracketEndRadius, 0, options.bracketEndRadius, Math.PI, 0.5 * Math.PI, true )
      .lineTo( tipX - options.bracketTipRadius, options.bracketEndRadius )
      // tip points down
      .arc( tipX - options.bracketTipRadius, options.bracketEndRadius + options.bracketTipRadius, options.bracketTipRadius, 1.5 * Math.PI, 0 )
      .arc( tipX + options.bracketTipRadius, options.bracketEndRadius + options.bracketTipRadius, options.bracketTipRadius, Math.PI, 1.5 * Math.PI )
      // right end curves up
      .lineTo( options.bracketLength - options.bracketEndRadius, options.bracketEndRadius )
      .arc( options.bracketLength - options.bracketEndRadius, 0, options.bracketEndRadius, 0.5 * Math.PI, 0, true );

    // bracket node
    var bracketNode = new Path( bracketShape, {
      stroke: options.bracketStroke,
      lineWidth: options.bracketLineWidth
    } );
    this.addChild( bracketNode );

    // put the bracket in the correct orientation
    switch( options.orientation ) {
      case 'up':
        bracketNode.rotation = Math.PI;
        break;
      case 'down':
        // do nothing, this is how the shape was created
        break;
      case 'left':
        bracketNode.rotation = Math.PI / 2;
        break;
      case 'right':
        bracketNode.rotation = -Math.PI / 2;
        break;
      default:
        throw new Error( 'unsupported orientation: ' + options.orientation );
    }

    // optional label, positioned near the bracket's tip
    if ( options.labelNode ) {
      this.addChild( options.labelNode );
      switch( options.orientation ) {
        case 'up':
          options.labelNode.centerX = bracketNode.left + ( options.bracketTipLocation * bracketNode.width );
          options.labelNode.bottom = bracketNode.top - options.spacing;
          break;
        case 'down':
          options.labelNode.centerX = bracketNode.left + ( options.bracketTipLocation * bracketNode.width );
          options.labelNode.top = bracketNode.bottom + options.spacing;
          break;
        case 'left':
          options.labelNode.right = bracketNode.left - options.spacing;
          options.labelNode.centerY = bracketNode.top + ( options.bracketTipLocation * bracketNode.height );
          break;
        case 'right':
          options.labelNode.left = bracketNode.right + options.spacing;
          options.labelNode.centerY = bracketNode.top + ( options.bracketTipLocation * bracketNode.height );
          break;
        default:
          throw new Error( 'unsupported orientation: ' + options.orientation );
      }
    }

    this.mutate( options );
  }

  sceneryPhet.register( 'BracketNode', BracketNode );

  return inherit( Node, BracketNode );
} );