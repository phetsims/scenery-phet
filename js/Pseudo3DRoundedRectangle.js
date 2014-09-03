/**
 * Copyright 2002-2013, University of Colorado
 *
 * A pseudo-3D rectangle abstraction
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Color = require( 'SCENERY/util/Color' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /*
   * Creates a pseudo-3D shaded rounded rectangle that takes up rectBounds {Bounds2} in size. See below documentation
   * for options (it is passed through to the Node also).
   */
  function Pseudo3DRoundedRectangle( rectBounds, options ) {
    Node.call( this );

    options = _.extend( {
      // {Color|String} default base color
      baseColor: new Color( 80, 130, 230 ),

      // {Number} how much lighter the "light" parts (top and left) are
      lightFactor: 0.5,
      // {Number} how much lighter is the top than the left
      lighterFactor: 0.1,
      // {Number} how much darker the "dark" parts (bottom and right) are
      darkFactor: 0.5,
      // {Number} how much darker the bottom is than the right
      darkerFactor: 0.1,
      // the radius of curvature at the corners (also determines the size of the faux-3D shading)
      cornerRadius: 10
    }, options );

    var cornerRadius = options.cornerRadius;

    // compute our colors
    var baseColor = options.baseColor instanceof Color ? options.baseColor : new Color( options.baseColor );
    var lighterColor = baseColor.colorUtilsBrighter( options.lightFactor + options.lighterFactor );
    var lightColor = baseColor.colorUtilsBrighter( options.lightFactor );
    var darkColor = baseColor.colorUtilsDarker( options.darkFactor );
    var darkerColor = baseColor.colorUtilsDarker( options.darkFactor + options.darkerFactor );

    // how far our light and dark gradients will extend into the rectangle
    var lightOffset = 0.07 * 7.5 * cornerRadius;
    var darkOffset = 0.05 * 7.5 * cornerRadius;

    // we layer two gradients on top of each other as the base (using the same rounded rectangle shape)
    var horizontalNode = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, {} );
    var verticalNode = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, {} );

    horizontalNode.fill = new LinearGradient( horizontalNode.left, 0, horizontalNode.right, 0 )
      .addColorStop( 0, lightColor )
      .addColorStop( lightOffset / verticalNode.width, baseColor )
      .addColorStop( 1 - darkOffset / verticalNode.width, baseColor )
      .addColorStop( 1, darkColor );

    verticalNode.fill = new LinearGradient( 0, verticalNode.top, 0, verticalNode.bottom )
      .addColorStop( 0, lighterColor )
      .addColorStop( lightOffset / verticalNode.height, lighterColor.withAlpha( 0 ) )
      .addColorStop( 1 - darkOffset / verticalNode.height, darkerColor.withAlpha( 0 ) )
      .addColorStop( 1, darkerColor );

    // since both the top and left are "lighter", we have a rounded gradient along that corner
    var lightCorner = new Path( new Shape().moveTo( 0, 0 )
                                           .arc( 0, 0, cornerRadius, -Math.PI, -Math.PI / 2, false )
                                           .close(), {
      x: verticalNode.left + cornerRadius,
      y: verticalNode.top + cornerRadius,
      fill: new RadialGradient( 0, 0, 0, 0, 0, cornerRadius )
        .addColorStop( 0, baseColor )
        .addColorStop( 1 - lightOffset / cornerRadius, baseColor )
        .addColorStop( 1, lighterColor )
    } );

    // since both the bottom and right are "darker", we have a rounded gradient along that corner
    var darkCorner = new Path( new Shape().moveTo( 0, 0 )
                                          .arc( 0, 0, cornerRadius, 0, Math.PI / 2, false )
                                          .close(), {
      x: verticalNode.right - cornerRadius,
      y: verticalNode.bottom - cornerRadius,
      fill: new RadialGradient( 0, 0, 0, 0, 0, cornerRadius )
        .addColorStop( 0, baseColor )
        .addColorStop( 1 - darkOffset / cornerRadius, baseColor )
        .addColorStop( 1, darkerColor )
    } );

    // the stroke around the outside
    var panelStroke = Rectangle.roundedBounds( rectBounds, cornerRadius, cornerRadius, {
      stroke: darkColor.withAlpha( 0.4 )
    } );

    // layout
    this.addChild( horizontalNode );
    this.addChild( verticalNode );
    this.addChild( lightCorner );
    this.addChild( darkCorner );
    this.addChild( panelStroke );

    this.mutate( options );
  }

  inherit( Node, Pseudo3DRoundedRectangle );

  return Pseudo3DRoundedRectangle;
} );

