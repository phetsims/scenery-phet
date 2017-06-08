// Copyright 2013-2015, University of Colorado Boulder

/*
 * The front of a bucket (does not include the hole)
 */
define( function( require ) {
  'use strict';

  // Includes
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * @param {Bucket} bucket - Model of a bucket, type definition found in phetcommon/model as of this writing.
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  function BucketFront( bucket, modelViewTransform, options ) {

    // Invoke super constructor.
    Node.call( this, { cursor: 'pointer' } );

    options = _.extend( {
      tandem: Tandem.tandemRequired()
    }, options );

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

    var scaleMatrix = Matrix3.scaling( modelViewTransform.getMatrix().m00(), modelViewTransform.getMatrix().m11() );
    var transformedShape = bucket.containerShape.transformed( scaleMatrix );
    var baseColor = new Color( bucket.baseColor );
    var frontGradient = new LinearGradient( transformedShape.bounds.getMinX(),
      0,
      transformedShape.bounds.getMaxX(),
      0 );
    frontGradient.addColorStop( 0, baseColor.colorUtilsBrighter( 0.5 ).toCSS() );
    frontGradient.addColorStop( 1, baseColor.colorUtilsDarker( 0.5 ).toCSS() );
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

  return inherit( Node, BucketFront, {
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
    }
  } );
} );