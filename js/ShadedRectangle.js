// Copyright 2014-2020, University of Colorado Boulder

/**
 * A rectangle with pseudo-3D shading.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import Shape from '../../kite/js/Shape.js';
import inherit from '../../phet-core/js/inherit.js';
import merge from '../../phet-core/js/merge.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Color from '../../scenery/js/util/Color.js';
import LinearGradient from '../../scenery/js/util/LinearGradient.js';
import PaintColorProperty from '../../scenery/js/util/PaintColorProperty.js';
import RadialGradient from '../../scenery/js/util/RadialGradient.js';
import sceneryPhet from './sceneryPhet.js';

/**
 * Creates a pseudo-3D shaded rounded rectangle that takes up rectBounds {Bounds2} in size. See below documentation
 * for options (it is passed through to the Node also).
 *
 * @param {Bounds2} rectBounds
 * @param {Object} [options]
 * @constructor
 */
function ShadedRectangle( rectBounds, options ) {

  Node.call( this );

  options = merge( {
    // {ColorDef} default base color
    baseColor: new Color( 80, 130, 230 ),

    // {number} how much lighter the "light" parts (top and left) are
    lightFactor: 0.5,
    // {number} how much lighter is the top than the left
    lighterFactor: 0.1,
    // {number} how much darker the "dark" parts (bottom and right) are
    darkFactor: 0.5,
    // {number} how much darker the bottom is than the right
    darkerFactor: 0.1,
    // the radius of curvature at the corners (also determines the size of the faux-3D shading)
    cornerRadius: 10,

    lightSource: 'leftTop', // {string}, one of 'leftTop', 'rightTop', 'leftBottom', 'rightBottom',

    // {number} What fraction of the cornerRadius should the light and dark gradients extend into the rectangle?
    // Should always be less than 1.
    lightOffset: 0.525,
    darkOffset: 0.375
  }, options );

  assert && assert( options.lightSource === 'leftTop' ||
                    options.lightSource === 'rightTop' ||
                    options.lightSource === 'leftBottom' ||
                    options.lightSource === 'rightBottom',
    'The lightSource ' + options.lightSource + ' is not supported' );
  assert && assert( options.lightOffset < 1, 'options.lightOffset needs to be less than 1' );
  assert && assert( options.darkOffset < 1, 'options.darkOffset needs to be less than 1' );

  const lightFromLeft = options.lightSource.indexOf( 'left' ) >= 0;
  const lightFromTop = options.lightSource.indexOf( 'Top' ) >= 0;

  const cornerRadius = options.cornerRadius;

  // @private {Property.<Color>} - compute our colors (properly handle color-Property cases for baseColor)
  this.lighterPaint = new PaintColorProperty( options.baseColor, { luminanceFactor: options.lightFactor + options.lighterFactor } );
  this.lightPaint = new PaintColorProperty( options.baseColor, { luminanceFactor: options.lightFactor } );
  this.darkPaint = new PaintColorProperty( options.baseColor, { luminanceFactor: -options.darkFactor } );
  this.darkerPaint = new PaintColorProperty( options.baseColor, { luminanceFactor: -options.darkFactor - options.darkerFactor } );

  // change colors based on orientation
  const topColorProperty = lightFromTop ? this.lighterPaint : this.darkerPaint;
  const leftColorProperty = lightFromLeft ? this.lightPaint : this.darkPaint;
  const rightColorProperty = lightFromLeft ? this.darkPaint : this.lightPaint;
  const bottomColorProperty = lightFromTop ? this.darkerPaint : this.lighterPaint;

  // how far our light and dark gradients will extend into the rectangle
  const lightOffset = options.lightOffset * cornerRadius;
  const darkOffset = options.darkOffset * cornerRadius;

  // change offsets based on orientation
  const topOffset = lightFromTop ? lightOffset : darkOffset;
  const leftOffset = lightFromLeft ? lightOffset : darkOffset;
  const rightOffset = lightFromLeft ? darkOffset : lightOffset;
  const bottomOffset = lightFromTop ? darkOffset : lightOffset;

  // we layer two gradients on top of each other as the base (using the same rounded rectangle shape)
  const horizontalNode = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, { pickable: false } );
  const verticalNode = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, { pickable: false } );

  horizontalNode.fill = new LinearGradient( horizontalNode.left, 0, horizontalNode.right, 0 )
    .addColorStop( 0, leftColorProperty )
    .addColorStop( leftOffset / verticalNode.width, options.baseColor )
    .addColorStop( 1 - rightOffset / verticalNode.width, options.baseColor )
    .addColorStop( 1, rightColorProperty );

  verticalNode.fill = new LinearGradient( 0, verticalNode.top, 0, verticalNode.bottom )
    .addColorStop( 0, topColorProperty )
    .addColorStop( topOffset / verticalNode.height, new DerivedProperty( [ topColorProperty ], function( color ) {
      return color.withAlpha( 0 );
    } ) )
    .addColorStop( 1 - bottomOffset / verticalNode.height, new DerivedProperty( [ bottomColorProperty ], function( color ) {
      return color.withAlpha( 0 );
    } ) )
    .addColorStop( 1, bottomColorProperty );

  // shape of our corner (in this case, top-right)
  const cornerShape = new Shape().moveTo( 0, 0 )
    .arc( 0, 0, cornerRadius, -Math.PI / 2, 0, false )
    .close();
  // rotation needed to move the cornerShape into the proper orientation as the light corner (Math.PI more for dark corner)
  const lightCornerRotation = {
    leftTop: -Math.PI / 2,
    rightTop: 0,
    rightBottom: Math.PI / 2,
    leftBottom: Math.PI
  }[ options.lightSource ];

  const innerBounds = rectBounds.eroded( cornerRadius );

  // since both the top and left are "lighter", we have a rounded gradient along that corner
  const lightCorner = new Path( cornerShape, {
    x: lightFromLeft ? innerBounds.minX : innerBounds.maxX,
    y: lightFromTop ? innerBounds.minY : innerBounds.maxY,
    rotation: lightCornerRotation,
    fill: new RadialGradient( 0, 0, 0, 0, 0, cornerRadius )
      .addColorStop( 0, options.baseColor )
      .addColorStop( 1 - lightOffset / cornerRadius, options.baseColor )
      .addColorStop( 1, this.lighterPaint ),
    pickable: false
  } );

  // since both the bottom and right are "darker", we have a rounded gradient along that corner
  const darkCorner = new Path( cornerShape, {
    x: lightFromLeft ? innerBounds.maxX : innerBounds.minX,
    y: lightFromTop ? innerBounds.maxY : innerBounds.minY,
    rotation: lightCornerRotation + Math.PI, // opposite direction from our light corner
    fill: new RadialGradient( 0, 0, 0, 0, 0, cornerRadius )
      .addColorStop( 0, options.baseColor )
      .addColorStop( 1 - darkOffset / cornerRadius, options.baseColor )
      .addColorStop( 1, this.darkerPaint ),
    pickable: false
  } );

  // the stroke around the outside
  const panelStroke = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, {
    stroke: new DerivedProperty( [ rightColorProperty ], function( color ) {
      return color.withAlpha( 0.4 );
    } )
  } );

  // layout
  this.addChild( horizontalNode );
  this.addChild( verticalNode );
  this.addChild( lightCorner );
  this.addChild( darkCorner );
  this.addChild( panelStroke ); // NOTE: this is the pickable child used for hit testing. Ensure something is pickable.

  this.mutate( options );
}

sceneryPhet.register( 'ShadedRectangle', ShadedRectangle );

inherit( Node, ShadedRectangle, {
  /**
   * Releases references.
   * @public
   * @override
   */
  dispose: function() {
    this.lighterPaint.dispose();
    this.lightPaint.dispose();
    this.darkPaint.dispose();
    this.darkerPaint.dispose();

    Node.prototype.dispose.call( this );
  }
} );

export default ShadedRectangle;