// Copyright 2002-2015, University of Colorado Boulder

/**
 * Bracket with optional label.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function HBracketNode( options ) {

    options = _.extend( {
      orientation: 'down', // refers to the direction that the tip of the bracket points, 'up'|'down'|'left'|'right'
      labelNode: null, // {Node|null} optional label that will be centered below bracket's tip
      bracketWidth: 100,
      bracketEndRadius: 5, // radius of the arcs at the ends of the bracket
      bracketTipRadius: 6, // radius of the arcs at the tip (center) of the bracket
      bracketStroke: 'black',
      spacing: 2 // vertical space between label and tip of bracket
    }, options );

    Node.call( this );

    // bracket shape, created for 'down' orientation, left-to-right
    var bracketShape = new Shape()
      // left end curves up
      .arc( options.bracketEndRadius, 0, options.bracketEndRadius, Math.PI, 0.5 * Math.PI, true )
      .lineTo( ( options.bracketWidth / 2 ) - options.bracketTipRadius, options.bracketEndRadius )
      // tip points down
      .arc( ( options.bracketWidth / 2 ) - options.bracketTipRadius, options.bracketEndRadius + options.bracketTipRadius, options.bracketTipRadius, 1.5 * Math.PI, 0 )
      .arc( ( options.bracketWidth / 2 ) + options.bracketTipRadius, options.bracketEndRadius + options.bracketTipRadius, options.bracketTipRadius, Math.PI, 1.5 * Math.PI )
      // right end curves up
      .lineTo( options.bracketWidth - options.bracketEndRadius, options.bracketEndRadius )
      .arc( options.bracketWidth - options.bracketEndRadius, 0, options.bracketEndRadius, 0.5 * Math.PI, 0, true );

    // transform the shape based on orientation
    switch( options.orientation ) {
      case 'up':
        bracketShape = bracketShape.transformed( )
        break;
      case 'down':
        // do nothing, this is how the shape was created
        break;
      case 'left':
        break;
      case 'right':
        break;
      default:
        throw new Error( 'unsupported orientation: ' + options.orientation );
    };

    // bracket node
    var bracketNode = new Path( bracketShape, {
      stroke: options.bracketStroke
    } );
    this.addChild( bracketNode );

    // optional label, positioned near the bracket's tip
    if ( options.labelNode ) {
      this.addChild( options.labelNode );
      switch( options.orientation ) {
        case 'up':
          options.labelNode.centerX = bracketNode.centerX;
          options.labelNode.bottom = bracketNode.top + options.spacing;
          break;
        case 'down':
          options.labelNode.centerX = bracketNode.centerX;
          options.labelNode.top = bracketNode.bottom + options.spacing;
          break;
        case 'left':
          options.labelNode.right = bracketNode.left - options.spacing;
          options.labelNode.centerY = bracketNode.centerY;
          break;
        case 'right':
          options.labelNode.left = bracketNode.right + options.spacing;
          options.labelNode.centerY = bracketNode.centerY;
          break;
        default:
          throw new Error( 'unsupported orientation: ' + options.orientation );
      }
    }

    this.mutate( options );
  }

  return inherit( Node, HBracketNode );
} );