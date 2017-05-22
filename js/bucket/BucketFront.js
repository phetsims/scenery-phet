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
      labelNode: new Text( bucket.captionText, {
        font: new PhetFont( 20 ),
        fill: bucket.captionColor,
        tandem: Tandem.tandemRequired().createTandem( 'label' )
      } )
    }, options );

    // @public (a11y)
    this.bucket = bucket;

    var scaleMatrix = Matrix3.scaling( modelViewTransform.getMatrix().m00(), modelViewTransform.getMatrix().m11() );
    this.transformedShape = bucket.containerShape.transformed( scaleMatrix );
    var baseColor = new Color( bucket.baseColor );
    var frontGradient = new LinearGradient( this.transformedShape.bounds.getMinX(),
      0,
      this.transformedShape.bounds.getMaxX(),
      0 );
    frontGradient.addColorStop( 0, baseColor.colorUtilsBrighter( 0.5 ).toCSS() );
    frontGradient.addColorStop( 1, baseColor.colorUtilsDarker( 0.5 ).toCSS() );
    this.addChild( new Path( this.transformedShape, {
      fill: frontGradient
    } ) );
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
          this.labelNode = labelNode;
        }
        labelNode.scale( Math.min( 1,
          Math.min( ( ( this.transformedShape.bounds.width * 0.75 ) / labelNode.width ),
            ( this.transformedShape.bounds.height * 0.8 ) / labelNode.height ) ) );
        labelNode.center = this.transformedShape.bounds.getCenter();
        this.addChild( labelNode );
      }
    }
  );
} );