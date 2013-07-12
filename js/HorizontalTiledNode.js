// Copyright 2002-2013, University of Colorado Boulder

/**
 * A node that is created for a specific width by horizontally tiling a set of nodes.
 * The left and right nodes can be thought of as 'book ends', with the center node tiled to fill the space in the middle.
 * This allows us to create (for example) control panels that have 3D-looking backgrounds, but can adjust to fit i18n.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // imports
  var assert = require( 'ASSERT/assert' )( 'beers-law-lab' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Pattern = require( 'SCENERY/util/Pattern' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Number} totalWidth
   * @param leftImage
   * @param centerImage
   * @param rightImage
   * @param options
   * @constructor
   */
  function HorizontalTiledNode( totalWidth, leftImage, centerImage, rightImage, options ) {

    assert && assert( leftImage.height === centerImage.height && centerImage.height === rightImage.height ); // all images are the same height
    assert && assert( ( leftImage.width + rightImage.width ) <= totalWidth );  // center may be unused

    options = _.extend( {
      xOverlap: 1  // how much the center overlaps with the left and right
    }, options );

    Node.call( this );

    // left
    var leftNode = new Image( leftImage );
    this.addChild( leftNode );

    // right
    var rightNode = new Image( rightImage );
    rightNode.right = totalWidth;
    this.addChild( rightNode );

    // tile the center, with overlap between tiles to hide seams
    var tiledWidth = totalWidth - leftNode.width - rightNode.width + ( 2 * options.xOverlap );
    var centerNode = new Rectangle( 0, 0, tiledWidth, centerImage.height, { fill: new Pattern( centerImage ) } );
    centerNode.left = leftNode.right - options.xOverlap;
    this.addChild( centerNode );

    this.mutate( options );
  }

  inherit( Node, HorizontalTiledNode );

  return HorizontalTiledNode;
} );
