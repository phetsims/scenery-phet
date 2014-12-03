// Copyright 2002-2014, University of Colorado Boulder

/**
 * Measuring tape
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (ActualConcepts)
 * @author Aaron Davis (PhET)
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var measuringTapeImage = require( 'image!SCENERY_PHET/measuringTape.png' );

  /**
   * Constructor for the measuring tape
   * @param {Bounds2} dragBounds for the measuring tape (in the ScreenView Coordinates reference frame)
   * @param {Property.<number>} scaleProperty  , number of pixels (view) in the base unit (model)
   * @param {Property.<object>} unitsProperty has two fields, (1) name <string>  and (2) multiplier <number>, eg. {name: 'cm', multiplier: 100},
   * @constructor
   */
  function MeasuringTape( dragBounds, scaleProperty, unitsProperty, isVisibleProperty, options ) {
    var measuringTape = this;

    Node.call( this );
    this.options = _.extend( {
      basePosition: new Vector2( 300, 300 ), // base Position in View units (rightBottom position of the measuring tape image)
      unrolledTapeDistance: 100, // in pixel units
      angle: 0.0, // angle of the tape in radians, recall that in the view, a positive angle means clockwise rotation.
      textPosition: new Vector2( 0, 10 ), // position of the text relative to center Bottom of the image in view units
      significantFigures: 1,  // number of significant figures in the length measurement
      textColor: 'white',  // color of the length measurement and unit
      textFont: new PhetFont( 16 ), // font for the measurement text
      textFontWeight: 'bold',
      imageScale: 0.8, // control the size of the measuringTape Image (the base)
      lineColor: 'gray',  // color of the tapeline itself
      lineWidth: 2, // linewidth of the tape line and the crosshairs
      tipCircleColor: 'rgba(0,0,0,0.1)', // transparent by default
      tipCircleRadius: 10, // radius of the circle on the tip
      crosshairColor: 'rgba(224, 95, 32,1)', // orange, color of the two crosshairs
      crosshairSize: 5,  // size of the crosshairs in pixels ( measured from center)
      isBaseCrosshairRotating: true, // do crosshairs rotate around their own axis to line up with the tapeline
      isTipCrosshairRotating: true // do crosshairs rotate around their own axis to line up with the tapeline
    }, options );

    var erodedDragBounds = dragBounds.eroded( 4 );

    this.unitsProperty = unitsProperty;
    this.scaleProperty = scaleProperty;

    this.tipToBaseDistance = this.options.unrolledTapeDistance;
    this.basePosition = this.options.basePosition;
    this.tipPosition = this.basePosition.plus( Vector2.createPolar( this.options.unrolledTapeDistance, this.options.angle ) );
    this.angle = this.options.angle;


    var crosshairShape = new Shape().
      moveTo( -this.options.crosshairSize, 0 ).
      lineTo( this.options.crosshairSize, 0 ).
      moveTo( 0, -this.options.crosshairSize ).
      lineTo( 0, this.options.crosshairSize );

    var baseCrosshair = new Path( crosshairShape, {
      stroke: this.options.crosshairColor,
      lineWidth: this.options.lineWidth,
      center: this.basePosition
    } );

    var tipCrosshair = new Path( crosshairShape, {
      stroke: this.options.crosshairColor,
      lineWidth: this.options.lineWidth
    } );

    var tipCircle = new Circle( this.options.tipCircleRadius, {fill: this.options.tipCircleColor} );

    var baseImage = new Node( {
      children: [new Image( measuringTapeImage )],
      scale: this.options.imageScale,
      rightBottom: this.basePosition,
      cursor: 'pointer'
    } );

    // create tapeline (running from one crosshair to the other)
    var tapeLine = new Line( this.basePosition, this.tipPosition, {
      stroke: this.options.lineColor,
      lineWidth: this.options.lineWidth
    } );

    // add tipCrosshair and  tipCircle to the tip
    var tip = new Node( {children: [tipCircle, tipCrosshair], center: this.tipPosition, cursor: 'pointer'} );

    // rotate crosshairs (if requested) and the baseImage
    baseImage.rotateAround( baseCrosshair.center, this.angle );
    if ( measuringTape.options.isBaseCrosshairRotating ) {
      baseCrosshair.rotateAround( baseCrosshair.center, this.angle );
    }
    if ( measuringTape.options.isTipCrosshairRotating ) {
      tipCrosshair.rotateAround( tipCrosshair.center, this.angle );
    }

    // create and add text
    var labelText = new Text( measuringTape.getText(), {
      font: this.options.textFont,
      fontWeight: this.options.textFontWeight,
      fill: this.options.textColor,
      centerTop: baseImage.centerBottom.plus( measuringTape.options.textPosition )
    } );


    tip.touchArea = tip.localBounds.dilatedXY( 10, 10 );
    tip.mouseArea = tip.localBounds.dilatedXY( 0, 0 );

    baseImage.touchArea = baseImage.localBounds.dilatedXY( 10, 10 );
    baseImage.mouseArea = baseImage.localBounds.dilatedXY( 0, 0 );


    this.addChild( tapeLine ); // tapeline going from one crosshair to the other
    this.addChild( baseCrosshair ); // crosshair near the base, (set at basePosition)
    this.addChild( baseImage );  // base of the measuring tape
    this.addChild( labelText ); // text
    this.addChild( tip ); // crosshair and circle at the tip (set at tipPosition)

    var startOffset;
    baseImage.addInputListener( new SimpleDragHandler( {
        allowTouchSnag: true,
        start: function( event, trail ) {

          // we want to find the ScreenView Node in order to enforce Bound constraints. Let's not make the assumption that it is the parent Node

          // Find the parent screen by moving up the scene graph.
          var testNode = measuringTape;
          while ( testNode !== null ) {
            if ( testNode instanceof ScreenView ) {
              this.parentScreen = testNode;
              break;
            }
            testNode = testNode.parents[0]; // Move up the scene graph by one level
          }

          // Determine the initial position of the new element as a function of the event position and this node's bounds.
          var upperLeftCornerGlobal = measuringTape.parentToGlobalPoint( measuringTape.basePosition );
          var initialPositionOffset = upperLeftCornerGlobal.minus( event.pointer.point );
          // initial position in screenView coordinates
          var initialPosition = this.parentScreen.globalToLocalPoint( event.pointer.point.plus( initialPositionOffset ) );

          startOffset = initialPosition.minus( measuringTape.basePosition );
        },

        translate: function( translationParams ) {
          // keep a reference to the old position
          var oldPosition = measuringTape.basePosition;

          // position of the base crosshair (in screen View coordinates) if we didn't enforce bounds
          var screenViewBasePosition = oldPosition.plus( translationParams.delta ).plus( startOffset );

          // constrained  basePosition (aka. the base crosshair location) to be within bounds
          var constrainedLocation = constrainBounds( screenViewBasePosition, erodedDragBounds );

          // recast the position in the local coordinate frame
          measuringTape.basePosition = constrainedLocation.minus( startOffset );

          // if the tip is not being dragged then let's move the position of the tip as well
          if ( !isDraggingTip ) {
            var deltaPosition = measuringTape.basePosition.minus( oldPosition );
            measuringTape.tipPosition = measuringTape.tipPosition.plus( deltaPosition );
          }

          // update positions of the crosshairs, text, tapeline and rotation
          measuringTape.update( measuringTape.basePosition, measuringTape.tipPosition );
        }
      } )
    );

    var isDraggingTip = false;
    // init drag and drop for tip
    tip.addInputListener( new SimpleDragHandler( {
      allowTouchSnag: true,
      start: function( event, trail ) {
        isDraggingTip = true;
      },
      translate: function( translationParams ) {
        measuringTape.tipPosition = measuringTape.tipPosition.plus( translationParams.delta );
        // update positions of the crosshairs, text, tapeline and rotation
        measuringTape.update( measuringTape.basePosition, measuringTape.tipPosition );

      },
      end: function( event, trail ) {
        isDraggingTip = false;
      }
    } ) );

    /**
     *
     * @param basePosition
     * @param tipPosition
     */
    this.update = function( basePosition, tipPosition ) {
      measuringTape.oldAngle = measuringTape.angle;
      measuringTape.angle = Math.atan2( tipPosition.y - basePosition.y, tipPosition.x - basePosition.x );
      var deltaAngle = measuringTape.angle - measuringTape.oldAngle;

      baseCrosshair.center = basePosition;
      tip.center = tipPosition;

      // in order to avoid all kind of geometrical issues with position, let's reset the baseImage upright and then set the position
      baseImage.setRotation( 0 );
      baseImage.rightBottom = basePosition;
      baseImage.rotateAround( basePosition, measuringTape.angle );


      measuringTape.tipToBaseDistance = tipPosition.distance( basePosition );
      labelText.centerTop = baseImage.centerBottom.plus( measuringTape.options.textPosition );
      labelText.setText( measuringTape.getText() );

      // reposition the tapeline
      tapeLine.setPoint1( basePosition );
      tapeLine.setPoint2( tipPosition );

      if ( measuringTape.options.isTipCrosshairRotating ) {
        tip.rotateAround( tip.center, deltaAngle );
      }
      if ( measuringTape.options.isBaseCrosshairRotating ) {
        baseCrosshair.rotateAround( baseCrosshair.center, deltaAngle );
      }
    };

    // add
    isVisibleProperty.linkAttribute( this, 'visible' );

    unitsProperty.link( function( units ) {
      labelText.setText( measuringTape.getText() );
    } );

    scaleProperty.link( function( scale ) {
      labelText.setText( measuringTape.getText() );
    } );

    /**
     * Constrains a point to some bounds.
     * @param {Vector2} point
     * @param {Bounds2} bounds
     */
    var constrainBounds = function( point, bounds ) {
      if ( _.isUndefined( bounds ) || bounds.containsCoordinates( point.x, point.y ) ) {
        return point;
      }
      else {
        var xConstrained = Math.max( Math.min( point.x, bounds.maxX ), bounds.minX );
        var yConstrained = Math.max( Math.min( point.y, bounds.maxY ), bounds.minY );
        return new Vector2( xConstrained, yConstrained );
      }
    };

  }

  return inherit( Node, MeasuringTape, {

    getText: function() {
      return Util.toFixed( this.unitsProperty.value.multiplier * this.tipToBaseDistance / this.scaleProperty.value, this.options.significantFigures ) + ' ' + this.unitsProperty.value.name;
    },

    reset: function() {
      this.basePosition = this.options.basePosition;
      this.tipPosition = this.basePosition.plus( Vector2.createPolar( this.options.unrolledTapeDistance, this.options.angle ) );
      this.update( this.basePosition, this.tipPosition );
    }

  } );
} );

