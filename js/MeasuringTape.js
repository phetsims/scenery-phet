// Copyright 2002-2014, University of Colorado Boulder

/**
 * A scenery node that is used to represent a draggable Measuring Tape.
 * It contains a tip and a base that can be dragged separately,
 * with a text indicating the measurement.
 * The motion of the measuring tape can be confined by drag bounds.
 * It assumes that the position of this node is set to (0,0) in the parent Node.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (ActualConcepts)
 * @author Aaron Davis (PhET)
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );


  // images
  var measuringTapeImage = require( 'image!SCENERY_PHET/measuringTape.png' );

  /**
   * Constructor for the measuring Tape
   * @param {Property.<Object>} unitsProperty - it has two fields, (1) name <string>  and (2) multiplier <number>, eg. {name: 'cm', multiplier: 100},
   * @param {Property.<boolean>} isVisibleProperty
   * @param {Object} [options]
   * @constructor
   */
  function MeasuringTape( unitsProperty, isVisibleProperty, options ) {
    var measuringTape = this;

    Node.call( this );
    options = _.extend( {
      basePosition: new Vector2( 40, 40 ), // base Position in view coordinates (rightBottom position of the measuring tape image)
      unrolledTapeDistance: 1, // in model coordinates
      angle: 0.0, // angle of the tape in radians, recall that in the view, a positive angle means clockwise rotation.
      textPosition: new Vector2( 0, 30 ), // position of the text relative to center of the base image in view units
      modelViewTransform: ModelViewTransform2.createIdentity(),
      dragBounds: Bounds2.EVERYTHING,// bounds for the measuring tape (in the parent Node Coordinates reference frame), default value is no (effective) bounds
      scaleProperty: new Property( 1 ), // scale the apparent length of the unrolled Tape, without changing the measurement, analogous to a zoom factor
      significantFigures: 1,  // number of significant figures in the length measurement
      textColor: 'white',  // color of the length measurement and unit
      textFont: new PhetFont( {size: 16, weight: 'bold'} ), // font for the measurement text
      baseScale: 0.8, // control the size of the measuringTape Image (the base)
      lineColor: 'gray',  // color of the tapeline itself
      tapeLineWidth: 2, // linewidth of the tape line
      tipCircleColor: 'rgba(0,0,0,0.1)', // color of the circle at the tip
      tipCircleRadius: 10, // radius of the circle on the tip
      crosshairColor: 'rgb(224, 95, 32)', // orange, color of the two crosshairs
      crosshairSize: 5,  // size of the crosshairs in scenery coordinates ( measured from center)
      crosshairLineWidth: 2, // linewidth of the crosshairs
      isBaseCrosshairRotating: true, // do crosshairs rotate around their own axis to line up with the tapeline
      isTipCrosshairRotating: true // do crosshairs rotate around their own axis to line up with the tapeline
    }, options );


    assert && assert( options.modelViewTransform.modelToViewDeltaX( 1 ) === options.modelViewTransform.modelToViewDeltaY( 1 ), 'The y and x scale factor are not identical' );
    this.modelToViewScale = options.modelViewTransform.modelToViewDeltaX( 1 ); // private

    this.significantFigures = options.significantFigures;
    this.unitsProperty = unitsProperty; // @private
    this.scaleProperty = options.scaleProperty;  // @private
    this.tipToBaseDistance = options.unrolledTapeDistance; // @private


    this.basePositionProperty = new Property( options.basePosition );
    var tapeDistance = options.modelViewTransform.modelToViewDeltaX( options.unrolledTapeDistance );

    this.tipPositionProperty = new Property( options.basePosition.plus( Vector2.createPolar( tapeDistance, options.angle ) ) );


    var crosshairShape = new Shape().
      moveTo( -options.crosshairSize, 0 ).
      moveTo( -options.crosshairSize, 0 ).
      lineTo( options.crosshairSize, 0 ).
      moveTo( 0, -options.crosshairSize ).
      lineTo( 0, options.crosshairSize );

    var baseCrosshair = new Path( crosshairShape, {
      stroke: options.crosshairColor,
      lineWidth: options.crosshairLineWidth
    } );

    var tipCrosshair = new Path( crosshairShape, {
      stroke: options.crosshairColor,
      lineWidth: options.crosshairLineWidth
    } );

    var tipCircle = new Circle( options.tipCircleRadius, {fill: options.tipCircleColor} );

    var baseImage = new Image( measuringTapeImage, {
      scale: options.baseScale,
      cursor: 'pointer'
    } );

    // create tapeline (running from one crosshair to the other)
    var tapeLine = new Line( this.basePositionProperty.value, this.tipPositionProperty.value, {
      stroke: options.lineColor,
      lineWidth: options.tapeLineWidth
    } );

    // add tipCrosshair and tipCircle to the tip
    var tip = new Node( {children: [tipCircle, tipCrosshair], cursor: 'pointer'} );

    // create text
    var labelText = new Text( measuringTape.getText(), {
      font: options.textFont,
      fill: options.textColor
    } );


    /**
     * Update the measuring tape
     *
     * @param {Vector2} basePosition
     * @param {Vector2} tipPosition
     */
    this.update = function( basePosition, tipPosition ) {
      // calculate the orientation and change of orientation of the Measuring tape
      var oldAngle = baseImage.getRotation();
      var angle = Math.atan2( tipPosition.y - basePosition.y, tipPosition.x - basePosition.x );
      var deltaAngle = angle - oldAngle;

      // set position of the tip and the base crosshair
      baseCrosshair.center = basePosition;
      tip.center = tipPosition;

      // in order to avoid all kind of geometrical issues with position, let's reset the baseImage upright and then set its position and rotation
      baseImage.setRotation( 0 );
      baseImage.rightBottom = basePosition;
      baseImage.rotateAround( basePosition, angle );

      // reset the text
      measuringTape.tipToBaseDistance = tipPosition.distance( basePosition );
      labelText.setText( measuringTape.getText() );
      labelText.centerTop = baseImage.center.plus( options.textPosition.times( options.baseScale ) );


      // reposition the tapeline
      tapeLine.setLine( basePosition.x, basePosition.y, tipPosition.x, tipPosition.y );

      // rotate the crosshairs
      if ( options.isTipCrosshairRotating ) {
        tip.rotateAround( tip.center, deltaAngle );
      }
      if ( options.isBaseCrosshairRotating ) {
        baseCrosshair.rotateAround( baseCrosshair.center, deltaAngle );
      }

    };

    // update the tip and base positions, orientation of base, the crosshairs and tapeline
    this.update( this.basePositionProperty.value, this.tipPositionProperty.value );

    // expand the area for touch
    tip.touchArea = tip.localBounds.dilatedXY( 10, 10 );
    baseImage.touchArea = baseImage.localBounds.dilatedXY( 10, 10 );


    this.addChild( tapeLine ); // tapeline going from one crosshair to the other
    this.addChild( baseCrosshair ); // crosshair near the base, (set at basePosition)
    this.addChild( baseImage );  // base of the measuring tape
    this.addChild( labelText ); // text
    this.addChild( tip ); // crosshair and circle at the tip (set at tipPosition)

    var startOffset;
    baseImage.addInputListener( new SimpleDragHandler( {
        allowTouchSnag: true,
        start: function( event, trail ) {
          startOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( measuringTape.basePositionProperty.value );
        },

        drag: function( event ) {
          var parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( startOffset );
          var constrainedLocation = constrainBounds( parentPoint, options.dragBounds );

          // translation of the basePosition (subject to the constraining bounds)
          var translationDelta = constrainedLocation.minus( measuringTape.basePositionProperty.value );

          measuringTape.basePositionProperty.value = constrainedLocation;

          // translate the position of the tip if it is not being dragged
          if ( !isDraggingTip ) {
            measuringTape.tipPositionProperty.value = measuringTape.tipPositionProperty.value.plus( translationDelta );
          }
          // update positions of the crosshairs, text, tapeline and rotation
          measuringTape.update( measuringTape.basePositionProperty.value, measuringTape.tipPositionProperty.value );
        }

      } )
    );

    // when the user is not holding onto the tip, dragging the body will also drag the tip
    var isDraggingTip = false;

    // init drag and drop for tip
    tip.addInputListener( new SimpleDragHandler( {
      allowTouchSnag: true,

      start: function( event, trail ) {
        isDraggingTip = true;
      },

      translate: function( translationParams ) {
        measuringTape.tipPositionProperty.value = measuringTape.tipPositionProperty.value.plus( translationParams.delta );

        // update positions of the crosshairs, text, tapeline and rotation
        measuringTape.update( measuringTape.basePositionProperty.value, measuringTape.tipPositionProperty.value );
      },

      end: function( event, trail ) {
        isDraggingTip = false;
      }
    } ) );


    // link visibility of this node
    isVisibleProperty.linkAttribute( this, 'visible' );

    // link change of units to the text
    unitsProperty.link( function() {
      labelText.setText( measuringTape.getText() );
    } );

    // scaleProperty is analogous to a zoom function
    // the length of the unrolled tape scales with the scaleProperty but the text measurement stays the same.
    options.scaleProperty.link( function( scale, oldScale ) {
      // make sure that the oldScale exists, if not set to 1.
      if ( oldScale === null ) {
        oldScale = 1;
      }
      // update the position of the tip
      var displacementVector = measuringTape.tipPositionProperty.value.minus( measuringTape.basePositionProperty.value );
      var scaledDisplacementVector = displacementVector.timesScalar( scale / oldScale );
      measuringTape.tipPositionProperty.value = measuringTape.basePositionProperty.value.plus( scaledDisplacementVector );
      measuringTape.update( measuringTape.basePositionProperty.value, measuringTape.tipPositionProperty.value );
    } );

    /**
     * Constrains a point to some bounds.
     *
     * @param {Vector2} point
     * @param {Bounds2} bounds
     * @returns {Vector2}
     */
    function constrainBounds( point, bounds ) {
      if ( _.isUndefined( bounds ) || bounds.containsPoint( point ) ) {
        return point;
      }
      else {
        var xConstrained = Math.max( Math.min( point.x, bounds.maxX ), bounds.minX );
        var yConstrained = Math.max( Math.min( point.y, bounds.maxY ), bounds.minY );
        return new Vector2( xConstrained, yConstrained );
      }
    }
  }

  return inherit( Node, MeasuringTape, {
    /**
     *  reset the MeasuringTape to its initial configuration
     *  @public
     */
    reset: function() {
      this.basePositionProperty.reset();
      this.tipPositionProperty.reset();
      this.update( this.basePositionProperty.value, this.tipPositionProperty.value );
    },

    /**
     * returns a readout of the current measurement
     * @public
     * @returns {string}
     */
    getText: function() {
      return Util.toFixed( this.unitsProperty.value.multiplier * this.tipToBaseDistance / this.modelToViewScale / this.scaleProperty.value,
          this.significantFigures ) + ' ' + this.unitsProperty.value.name;
    }


  } );
} );

