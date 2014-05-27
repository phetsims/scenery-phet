// Copyright 2002-2013, University of Colorado Boulder

/**
 * A face that can smile, frown, or grimace.  This is generally used for
 * indicating success or failure.
 * <p>
 * This was ported from a version that was originally written in Java.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {number} headDiameter
   * @param {*} options
   * @constructor
   */
  function FaceNode( headDiameter, options ) {

    // default options
    options = _.extend( {
      headFill: 'yellow',
      eyeFill: 'black',
      mouthStroke: 'black',
      headStroke: null,
      headLineWidth: '1px'
    }, options );

    var thisNode = this;
    Node.call( thisNode );

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
    this.smileMouth = new Path( new Shape().arc( 0, headDiameter * 0.05, headDiameter * 0.25, Math.PI * 0.2, Math.PI * 0.8 ), {
      stroke: options.mouthStroke,
      lineWidth: mouthLineWidth,
      lineCap: 'round' } );
    this.addChild( this.smileMouth );
    this.frownMouth = new Path( new Shape().arc( 0, headDiameter * 0.4, headDiameter * 0.20, -Math.PI * 0.75, -Math.PI * 0.25 ), {
      stroke: options.mouthStroke,
      lineWidth: mouthLineWidth,
      lineCap: 'round' } );
    this.addChild( this.frownMouth );
    this.grimaceMouth = new Path( new Shape().moveTo( -headDiameter * 0.2, headDiameter * 0.3 ).lineTo( headDiameter * 0.2, headDiameter * 0.2 ), {
      stroke: options.mouthStroke,
      lineWidth: mouthLineWidth,
      lineCap: 'round' } );
    this.addChild( this.grimaceMouth );
    this.smile();

    // Pass through any options for positioning and such.
    this.mutate( options );
  }

  inherit( Node, FaceNode, {
    smile: function() {
      this.smileMouth.visible = true;
      this.frownMouth.visible = false;
      this.grimaceMouth.visible = false;
      return this; // allow chaining
    },
    frown: function() {
      this.smileMouth.visible = false;
      this.frownMouth.visible = true;
      this.grimaceMouth.visible = false;
      return this; // allow chaining
    },
    grimace: function() {
      this.smileMouth.visible = false;
      this.frownMouth.visible = false;
      this.grimaceMouth.visible = true;
      return this; // allow chaining
    } } );

  return FaceNode;
} );
