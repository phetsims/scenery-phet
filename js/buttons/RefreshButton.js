// Copyright 2002-2014, University of Colorado Boulder

/**
 * Refresh button, which is a RectangularPushButton that allows the user to
 * "refresh" a feature, such as getting a new game challenge.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // Constants
  var DEFAULT_ICON_WIDTH = 24;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RefreshButton( options ) {
    options = _.extend( {
      iconWidth: DEFAULT_ICON_WIDTH,
      xMargin: DEFAULT_ICON_WIDTH / 3,
      baseColor: new Color( 242, 233, 22 )//Color match with the yellow in the PhET logo
    }, options );

    // Create the top arrow shape, starting at the rightmost edge.  The
    // following params can be tweaked to adjust the look.
    var tailThickness = options.iconWidth * 0.2;
    var radius = options.iconWidth / 2 - tailThickness / 2;
    var headWidth = tailThickness * 2.2;
    var neckAngle = -Math.PI * 0.175;
    var endToNeckAngularSpan = -0.75 * Math.PI;
    var arrowHeadAngularSpan = -Math.PI * 0.3;
    var pointOffset = 0.3 * radius;
    //---- End of tweak params ----
    var tailCenter = new Vector2( radius, 0 );
    var neckCenter = tailCenter.rotated( endToNeckAngularSpan );
    var tip = new Vector2( radius + pointOffset, 0 ).rotated( endToNeckAngularSpan + arrowHeadAngularSpan );
    var neckOuter = neckCenter.plus( new Vector2( tailThickness / 2, 0 ).rotated( Math.PI - neckAngle ) );
    var headOuterPoint = neckCenter.plus( new Vector2( headWidth / 2, 0 ).rotated( Math.PI - neckAngle ) );
    var headInnerPoint = neckCenter.plus( new Vector2( headWidth / 2, 0 ).rotated( -neckAngle ) );
    var neckInner = neckCenter.plus( new Vector2( tailThickness / 2, 0 ).rotated( -neckAngle ) );
    var outerControlPointDistance = radius * 1.75; // Multiplier empirically determined
    var ocp1 = new Vector2( outerControlPointDistance, 0 ).rotated( endToNeckAngularSpan / 3 );
    var ocp2 = new Vector2( outerControlPointDistance, 0 ).rotated( 2 / 3 * endToNeckAngularSpan );
    var icpScale = 0.6;  // Multiplier empirically determined
    var icp1 = new Vector2( ocp2.x * icpScale, ocp2.y * icpScale );
    var icp2 = new Vector2( ocp1.x * icpScale, ocp1.y * icpScale );
    var upperArrowShape = new Shape();
    upperArrowShape.moveTo( radius - tailThickness, 0 );
    upperArrowShape.lineTo( radius + tailThickness, 0 );
    upperArrowShape.cubicCurveTo( ocp1.x, ocp1.y, ocp2.x, ocp2.y, neckOuter.x, neckOuter.y );
    upperArrowShape.lineTo( headOuterPoint.x, headOuterPoint.y );
    upperArrowShape.lineTo( tip.x, tip.y );
    upperArrowShape.lineTo( headInnerPoint.x, headInnerPoint.y );
    upperArrowShape.lineTo( neckInner.x, neckInner.y );
    upperArrowShape.cubicCurveTo( icp1.x, icp1.y, icp2.x, icp2.y, tailCenter.x - tailThickness / 2, tailCenter.y );
    upperArrowShape.close();

    // Create a rotated copy for the lower arrow.
    var lowerArrowShape = upperArrowShape.copy().transformed( Matrix3.rotationZ( Math.PI ) );

    // Put it all together.
    var refreshIconNode = new Node();
    refreshIconNode.addChild( new Path( upperArrowShape, { fill: 'black' } ) );
    refreshIconNode.addChild( new Path( lowerArrowShape, { fill: 'black', y: options.iconWidth * 0.2 } ) );

    RectangularPushButton.call( this, _.extend( { content: refreshIconNode }, options ) );
  }

  return inherit( RectangularPushButton, RefreshButton );
} );