// Copyright 2013-2020, University of Colorado Boulder

/*
 * The front of a bucket (does not include the hole)
 *
 * @author Jonathan Olson
 */


// Includes
import Matrix3 from '../../../dot/js/Matrix3.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Text from '../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../scenery/js/util/LinearGradient.js';
import PaintColorProperty from '../../../scenery/js/util/PaintColorProperty.js';
import Tandem from '../../../tandem/js/Tandem.js';
import PhetFont from '../PhetFont.js';
import sceneryPhet from '../sceneryPhet.js';

/**
 * @param {Bucket} bucket - Model of a bucket, type definition found in phetcommon/model as of this writing.
 * @param {ModelViewTransform2} modelViewTransform
 * @param {Object} [options]
 * @constructor
 */
function BucketFront( bucket, modelViewTransform, options ) {

  options = merge( {
    tandem: Tandem.REQUIRED,
    cursor: 'pointer'
  }, options );

  Node.call( this );

  // This is basically like extending the options with the labelNode, but with dynamic content in the tandem.
  if ( !options.labelNode ) {
    options.labelNode = new Text( bucket.captionText, {
      font: new PhetFont( 20 ),
      fill: bucket.captionColor,
      tandem: options.tandem.createTandem( 'label' )
    } );
  }

  // @public (a11y)
  this.bucket = bucket;

  const scaleMatrix = Matrix3.scaling( modelViewTransform.getMatrix().m00(), modelViewTransform.getMatrix().m11() );
  const transformedShape = bucket.containerShape.transformed( scaleMatrix );

  // @private {Property.<Color>}
  this.baseBrighter5 = new PaintColorProperty( bucket.baseColor, { luminanceFactor: 0.5 } );
  this.baseDarker5 = new PaintColorProperty( bucket.baseColor, { luminanceFactor: -0.5 } );

  const frontGradient = new LinearGradient( transformedShape.bounds.getMinX(),
    0,
    transformedShape.bounds.getMaxX(),
    0 );
  frontGradient.addColorStop( 0, this.baseBrighter5 );
  frontGradient.addColorStop( 1, this.baseDarker5 );
  this.addChild( new Path( transformedShape, {
    fill: frontGradient
  } ) );

  // @public
  this.labelNode = options.labelNode;
  this.setLabel( this.labelNode );

  // Set initial position.
  this.translation = modelViewTransform.modelToViewPosition( bucket.position );

  this.mutate( options );
}

sceneryPhet.register( 'BucketFront', BucketFront );

export default inherit( Node, BucketFront, {
  /**
   * Set a scenery node to appear in front of the bucket.
   * @public
   * @param {Node} labelNode
   */
  setLabel: function( labelNode ) {

    if ( this.hasChild( this.labelNode ) ) {
      this.removeChild( this.labelNode );
    }

    if ( labelNode ) {
      this.labelNode = labelNode;
      this.labelNode.maxWidth = this.width * 0.8;
      this.labelNode.maxHeight = this.height;
      this.labelNode.center = this.localBounds.center;
      this.addChild( this.labelNode );
    }
  },

  dispose: function() {
    this.labelNode && this.labelNode.dispose();

    this.baseBrighter5.dispose();
    this.baseDarker5.dispose();

    Node.prototype.dispose.call( this );
  }
} );