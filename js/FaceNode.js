// Copyright 2013-2019, University of Colorado Boulder

/**
 * A face that can smile or frown.  This is generally used for indicating success or failure.
 * This was ported from a version that was originally written in Java.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  const Circle = require( 'SCENERY/nodes/Circle' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PaintColorProperty = require( 'SCENERY/util/PaintColorProperty' );
  const Path = require( 'SCENERY/nodes/Path' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );

  /**
   * @param {number} headDiameter
   * @param {Object} [options]
   * @constructor
   */
  function FaceNode( headDiameter, options ) {

    // default options
    options = _.extend( {
      headFill: 'yellow',
      eyeFill: 'black',
      mouthStroke: 'black',
      headLineWidth: 1
    }, options );

    // @private {Property.<Color>}
    this.headFillProperty = new PaintColorProperty( options.headFill );

    // The derived property listens to our headFillProperty which will be disposed. We don't need to keep a reference.
    options.headStroke = options.headStroke || new DerivedProperty( [ this.headFillProperty ], function( color ) {
      return color.darkerColor();
    } );

    Node.call( this );

    // Add head.
    this.addChild( new Circle( headDiameter / 2, {
      fill: options.headFill,
      stroke: options.headStroke,
      lineWidth: options.headLineWidth
    } ) );

    // Add the eyes.
    var eyeDiameter = headDiameter * 0.075;
    this.addChild( new Circle( eyeDiameter, {
      fill: options.eyeFill,
      centerX: -headDiameter * 0.2,
      centerY: -headDiameter * 0.1
    } ) );
    this.addChild( new Circle( eyeDiameter, {
      fill: options.eyeFill,
      centerX: headDiameter * 0.2,
      centerY: -headDiameter * 0.1
    } ) );

    // Add the mouths.
    var mouthLineWidth = headDiameter * 0.05;

    // @private
    this.smileMouth = new Path( new Shape().arc( 0, headDiameter * 0.05, headDiameter * 0.25, Math.PI * 0.2, Math.PI * 0.8 ), {
      stroke: options.mouthStroke,
      lineWidth: mouthLineWidth,
      lineCap: 'round'
    } );
    this.addChild( this.smileMouth );

    // @private
    this.frownMouth = new Path( new Shape().arc( 0, headDiameter * 0.4, headDiameter * 0.20, -Math.PI * 0.75, -Math.PI * 0.25 ), {
      stroke: options.mouthStroke,
      lineWidth: mouthLineWidth,
      lineCap: 'round'
    } );
    this.addChild( this.frownMouth );
    this.smile();

    // Pass through any options for positioning and such.
    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'FaceNode', this );
  }

  sceneryPhet.register( 'FaceNode', FaceNode );

  return inherit( Node, FaceNode, {

    // @public
    smile: function() {
      this.smileMouth.visible = true;
      this.frownMouth.visible = false;
      return this; // allow chaining
    },

    // @public
    frown: function() {
      this.smileMouth.visible = false;
      this.frownMouth.visible = true;
      return this; // allow chaining
    },

    /**
     * Releases references.
     * @public
     * @override
     */
    dispose: function() {
      this.headFillProperty.dispose();

      Node.prototype.dispose.call( this );
    }
  } );
} );
