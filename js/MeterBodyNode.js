// Copyright 2002-2013, University of Colorado Boulder

/**
 * Used to create meter bodies (eg, the Concentration meter in Beer's Law Lab).
 * The body has 3 parts: left, right, center.
 * The left and right nodes can be thought of as 'book ends', with the center node stretched to fill the space in the middle.
 * <p>
 * NOTE: The center image should be something that can be stretched, versus tiled. A more general solution would
 * (and in fact, did) use tiling via scenery.Pattern.  But that solution has vertical alignment problems. For more
 * details on the problem, and whether it's been fixed, see scenery#132.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );

  /**
   * @param {Number} totalWidth
   * @param leftImage
   * @param centerImage
   * @param rightImage
   * @param options
   * @constructor
   */
  function MeterBody( totalWidth, leftImage, centerImage, rightImage, options ) {

    assert && assert( leftImage.height === centerImage.height && centerImage.height === rightImage.height ); // all images are the same height
    assert && assert( ( leftImage.width + rightImage.width ) <= totalWidth );  // center may be unused

    options = _.extend( {
      overlap: 1  // how much the center overlaps with the left and right
    }, options );

    Node.call( this );

    // left
    var leftNode = new Image( leftImage );
    this.addChild( leftNode );

    // right
    var rightNode = new Image( rightImage );
    rightNode.right = totalWidth;
    this.addChild( rightNode );

    // center, stretched to fit
    var centerNode = new Image( centerImage );
    var centerWidth = totalWidth - leftNode.width - rightNode.width + ( 2 * options.overlap );
    centerNode.setScaleMagnitude( centerWidth / centerImage.width, 1 );
    centerNode.left = leftNode.right - options.overlap;
    this.addChild( centerNode );

    this.mutate( options );
  }

  inherit( Node, MeterBody );

  return MeterBody;
} );
