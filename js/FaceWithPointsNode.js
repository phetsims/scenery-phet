// Copyright 2014-2020, University of Colorado Boulder

/**
 * A face that either smiles or frowns.  When the face is smiling, it displays points awarded next to it.
 *
 * @author John Blanco
 * @author Sam Reid
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../dot/js/Vector2.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Text from '../../scenery/js/nodes/Text.js';
import FaceNode from './FaceNode.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function FaceWithPointsNode( options ) {
  options = merge( {
    spacing: 2, // space between face and points

    // face options
    faceDiameter: 100,
    faceOpacity: 1, // 0-1, see scenery.Node.opacity

    // points options
    pointsAlignment: 'centerBottom', // 'centerBottom', 'rightBottom', 'rightCenter'
    pointsFont: new PhetFont( { size: 44, weight: 'bold' } ),
    pointsFill: 'black', // {Color|string}
    pointsStroke: null, // {Color|string}
    pointsOpacity: 1, // {number} 0 (transparent) to 1 (opaque)
    showZeroPoints: false, // whether to show '0' points
    points: 0 // {number} the number of points
  }, options );

  // @private options needed by prototype functions
  this.pointsAlignment = options.pointsAlignment;
  this.spacing = options.spacing;
  this.showZeroPoints = options.showZeroPoints;

  // @private
  this.faceNode = new FaceNode( options.faceDiameter, { opacity: options.faceOpacity } );

  // @private
  this.pointsNode = new Text( '', {
    font: options.pointsFont,
    fill: options.pointsFill,
    opacity: options.pointsOpacity,
    stroke: options.pointsStroke,
    lineWidth: 1
  } );

  options.children = [ this.faceNode, this.pointsNode ];
  Node.call( this, options );

  this.setPoints( options.points );
}

sceneryPhet.register( 'FaceWithPointsNode', FaceWithPointsNode );

inherit( Node, FaceWithPointsNode, {

  // @public
  smile: function() {
    this.faceNode.smile();
    this.pointsNode.visible = true;
  },

  // @public
  frown: function() {
    this.faceNode.frown();
    this.pointsNode.visible = false;
  },

  // @public sets the number of {number} points
  setPoints: function( points ) {

    // We do not have negative points, as it goes against our philosophy,
    // see https://github.com/phetsims/scenery-phet/issues/224
    assert && assert( points >= 0, 'Points should be non-negative' );

    if ( points === 0 && !this.showZeroPoints ) {
      this.pointsNode.text = '';
    }
    else {
      this.pointsNode.text = '+' + points;
    }
    this.updatePointsPosition();
  },

  // @private Adjusts position of the points to match the specified value of options.pointsAlignment.
  updatePointsPosition: function() {
    switch( this.pointsAlignment ) {

      case 'centerBottom':
        this.pointsNode.centerX = this.faceNode.centerX;
        this.pointsNode.top = this.faceNode.bottom + this.spacing;
        break;

      case 'rightBottom':
        var position = new Vector2( this.faceNode.right + this.spacing, this.faceNode.centerY );
        position.rotate( Math.PI / 4 );
        this.pointsNode.left = position.x;
        this.pointsNode.centerY = position.y;
        break;

      case 'rightCenter':
        this.pointsNode.left = this.faceNode.right + this.spacing;
        this.pointsNode.centerY = this.faceNode.centerY;
        break;

      // Add other alignments here as needed, please document in options.

      default:
        throw new Error( 'unsupported pointsAlignment: ' + this.pointsAlignment );
    }
  }
} );

export default FaceWithPointsNode;