// Copyright 2014-2020, University of Colorado Boulder

/**
 * A scenery node that is used to represent a draggable Measuring Tape. It contains a tip and a base that can be dragged
 * separately, with a text indicating the measurement. The motion of the measuring tape can be confined by drag bounds.
 * The position of the measuring tape should be set via the basePosition and tipPosition rather than the scenery
 * coordinates
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (ActualConcepts)
 * @author Aaron Davis (PhET Interactive Simulations)
 * @author Martin Veillette (Berea College)
 */

import DerivedProperty from '../../axon/js/DerivedProperty.js';
import DerivedPropertyIO from '../../axon/js/DerivedPropertyIO.js';
import Property from '../../axon/js/Property.js';
import Bounds2 from '../../dot/js/Bounds2.js';
import Utils from '../../dot/js/Utils.js';
import Vector2 from '../../dot/js/Vector2.js';
import Vector2Property from '../../dot/js/Vector2Property.js';
import Shape from '../../kite/js/Shape.js';
import InstanceRegistry from '../../phet-core/js/documentation/InstanceRegistry.js';
import merge from '../../phet-core/js/merge.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import ModelViewTransform2 from '../../phetcommon/js/view/ModelViewTransform2.js';
import SimpleDragHandler from '../../scenery/js/input/SimpleDragHandler.js';
import Circle from '../../scenery/js/nodes/Circle.js';
import Image from '../../scenery/js/nodes/Image.js';
import Line from '../../scenery/js/nodes/Line.js';
import Node from '../../scenery/js/nodes/Node.js';
import Path from '../../scenery/js/nodes/Path.js';
import Rectangle from '../../scenery/js/nodes/Rectangle.js';
import Text from '../../scenery/js/nodes/Text.js';
import Tandem from '../../tandem/js/Tandem.js';
import NumberIO from '../../tandem/js/types/NumberIO.js';
import StringIO from '../../tandem/js/types/StringIO.js';
import measuringTapeImage from '../images/measuringTape_png.js';
import PhetFont from './PhetFont.js';
import sceneryPhetStrings from './scenery-phet-strings.js';
import sceneryPhet from './sceneryPhet.js';

class MeasuringTapeNode extends Node {

  /**
   * WARNING: although the MeasuringTape will accept Scenery options such as x, y, left, etc., you should not use these
   * to set the position of the tape. Use basePositionProperty and tipPositionProperty instead. However, because there
   * are some Scenery options that might be useful, options are still propagated to the supertype.
   *
   * @param {Property.<Object>} unitsProperty - it has two fields, (1) name <string> and (2) multiplier <number>,
   *                                            eg. {name: 'cm', multiplier: 100},
   * @param {Property.<boolean>} isVisibleProperty
   * @param {Object} [options]
   */
  constructor( unitsProperty, isVisibleProperty, options ) {
    options = merge( {

      // base Position in model coordinate reference frame (rightBottom position of the measuring tape image)
      basePositionProperty: new Vector2Property( new Vector2( 0, 0 ) ),

      // tip Position in model coordinate reference frame (center position of the tip)
      tipPositionProperty: new Vector2Property( new Vector2( 1, 0 ) ),

      // use this to omit the value and units displayed below the tape measure, useful with createIcon
      hasValue: true,

      // bounds for the measuring tape (in model coordinate reference frame), default value is everything,
      // effectively no bounds
      dragBounds: Bounds2.EVERYTHING,
      textPosition: new Vector2( 0, 30 ), // position of the text relative to center of the base image in view units
      modelViewTransform: ModelViewTransform2.createIdentity(),
      significantFigures: 1, // number of significant figures in the length measurement
      textColor: 'white', // color of the length measurement and unit
      textBackgroundColor: null, // {Color|string|null} fill color of the text background
      textBackgroundXMargin: 4,
      textBackgroundYMargin: 2,
      textBackgroundCornerRadius: 2,
      textMaxWidth: 200,
      textFont: new PhetFont( { size: 16, weight: 'bold' } ), // font for the measurement text
      baseScale: 0.8, // control the size of the measuring tape Image (the base)
      lineColor: 'gray', // color of the tapeline itself
      tapeLineWidth: 2, // lineWidth of the tape line
      tipCircleColor: 'rgba(0,0,0,0.1)', // color of the circle at the tip
      tipCircleRadius: 10, // radius of the circle on the tip
      crosshairColor: 'rgb(224, 95, 32)', // orange, color of the two crosshairs
      crosshairSize: 5, // size of the crosshairs in scenery coordinates ( measured from center)
      crosshairLineWidth: 2, // linewidth of the crosshairs
      isBaseCrosshairRotating: true, // do crosshairs rotate around their own axis to line up with the tapeline
      isTipCrosshairRotating: true, // do crosshairs rotate around their own axis to line up with the tapeline
      isTipDragBounded: true, // is the tip subject to dragBounds
      interactive: true, // specifies whether the node adds its own input listeners. Setting this to false may be helpful in creating an icon.
      baseDragStarted: _.noop, // called when the base drag starts
      baseDragEnded: _.noop, // called when the base drag ends, for testing whether it has dropped into the toolbox
      tandem: Tandem.OPTIONAL
    }, options );

    super();

    assert && assert( Math.abs( options.modelViewTransform.modelToViewDeltaX( 1 ) ) ===
                      Math.abs( options.modelViewTransform.modelToViewDeltaY( 1 ) ), 'The y and x scale factor are not identical' );

    this.significantFigures = options.significantFigures; // @private
    this.unitsProperty = unitsProperty; // @private
    this._dragBounds = options.dragBounds; // @private
    this.modelViewTransformProperty = new Property( options.modelViewTransform ); // @private
    this.isTipDragBounded = options.isTipDragBounded; //@private
    this.basePositionProperty = options.basePositionProperty;
    this.tipPositionProperty = options.tipPositionProperty;

    this._isTipUserControlledProperty = new Property( false );// @private
    this._isBaseUserControlledProperty = new Property( false ); // @private

    assert && assert( this.basePositionProperty.units === this.tipPositionProperty.units, 'units should match' );

    // @public (read-only) the distance measured by the tape
    this.measuredDistanceProperty = new DerivedProperty(
      [ this.basePositionProperty, this.tipPositionProperty ],
      ( basePosition, tipPosition ) => basePosition.distance( tipPosition ), {
        tandem: options.tandem.createTandem( 'measuredDistanceProperty' ),
        phetioDocumentation: 'The distance measured by the measuring tape',
        phetioType: DerivedPropertyIO( NumberIO ),
        units: this.basePositionProperty.units
      } );

    const crosshairShape = new Shape()
      .moveTo( -options.crosshairSize, 0 )
      .moveTo( -options.crosshairSize, 0 )
      .lineTo( options.crosshairSize, 0 )
      .moveTo( 0, -options.crosshairSize )
      .lineTo( 0, options.crosshairSize );

    const baseCrosshair = new Path( crosshairShape, {
      stroke: options.crosshairColor,
      lineWidth: options.crosshairLineWidth
    } );

    const tipCrosshair = new Path( crosshairShape, {
      stroke: options.crosshairColor,
      lineWidth: options.crosshairLineWidth
    } );

    const tipCircle = new Circle( options.tipCircleRadius, { fill: options.tipCircleColor } );

    // @private
    this.baseImage = new Image( measuringTapeImage, {
      scale: options.baseScale,
      cursor: 'pointer'
    } );

    // create tapeline (running from one crosshair to the other)
    const tapeLine = new Line( this.basePositionProperty.value, this.tipPositionProperty.value, {
      stroke: options.lineColor,
      lineWidth: options.tapeLineWidth
    } );

    // add tipCrosshair and tipCircle to the tip
    const tip = new Node( { children: [ tipCircle, tipCrosshair ], cursor: 'pointer' } );

    const readoutTextProperty = new DerivedProperty(
      [ this.unitsProperty, this.measuredDistanceProperty ],
      ( units, measuredDistance ) => {
        const distance = Utils.toFixed( units.multiplier * measuredDistance, this.significantFigures );
        return StringUtils.fillIn( sceneryPhetStrings.measuringTapeReadoutPattern, {
          distance: distance,
          units: units.name
        } );
      }, {
        tandem: options.tandem.createTandem( 'readoutTextProperty' ),
        phetioType: DerivedPropertyIO( StringIO ),
        phetioDocumentation: 'The text content of the readout on the measuring tape'
      } );

    // @private
    this.valueNode = new Text( readoutTextProperty.value, {
      font: options.textFont,
      fill: options.textColor,
      maxWidth: options.textMaxWidth
    } );

    // @private
    this.valueBackgroundNode = new Rectangle( 0, 0, 1, 1, {
      cornerRadius: options.textBackgroundCornerRadius,
      fill: options.textBackgroundColor
    } );

    // Resizes the value background and centers it on the value
    const updateValueBackgroundNode = () => {
      const valueBackgroundWidth = this.valueNode.width + ( 2 * options.textBackgroundXMargin );
      const valueBackgroundHeight = this.valueNode.height + ( 2 * options.textBackgroundYMargin );
      this.valueBackgroundNode.setRect( 0, 0, valueBackgroundWidth, valueBackgroundHeight );
      this.valueBackgroundNode.center = this.valueNode.center;
    };
    this.valueNode.on( 'bounds', updateValueBackgroundNode );
    updateValueBackgroundNode();

    // expand the area for touch
    tip.touchArea = tip.localBounds.dilated( 15 );
    this.baseImage.touchArea = this.baseImage.localBounds.dilated( 20 );
    this.baseImage.mouseArea = this.baseImage.localBounds.dilated( 10 );

    this.addChild( tapeLine ); // tapeline going from one crosshair to the other
    this.addChild( baseCrosshair ); // crosshair near the base, (set at basePosition)
    this.addChild( this.baseImage ); // base of the measuring tape

    // @private {Node} - parent that displays the text and its background
    this.valueContainer = new Node( { children: [ this.valueBackgroundNode, this.valueNode ] } );
    if ( options.hasValue ) {
      this.addChild( this.valueContainer );
    }
    this.addChild( tip ); // crosshair and circle at the tip (set at tipPosition)

    let baseStartOffset;

    // @private
    this.baseDragHandler =
      options.interactive ?
      new SimpleDragHandler( {
        tandem: options.tandem.createTandem( 'baseDragHandler' ),

        allowTouchSnag: true,

        // Don't allow the pointer to swipe-to-snag other things while dragging
        attach: true,

        start: ( event, trail ) => {
          options.baseDragStarted();
          this._isBaseUserControlledProperty.set( true );
          const position = this.modelViewTransformProperty.value.modelToViewPosition( this.basePositionProperty.value );
          baseStartOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( position );
        },

        drag: event => {
          const parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( baseStartOffset );
          const unconstrainedBasePosition = this.modelViewTransformProperty.value.viewToModelPosition( parentPoint );
          const constrainedBasePosition = this._dragBounds.closestPointTo( unconstrainedBasePosition );

          // the basePosition value has not been updated yet, hence it is the old value of the basePosition;
          const translationDelta = constrainedBasePosition.minus( this.basePositionProperty.value ); // in model reference frame

          // translation of the basePosition (subject to the constraining drag bounds)
          this.basePositionProperty.set( constrainedBasePosition );

          // translate the position of the tip if it is not being dragged
          // when the user is not holding onto the tip, dragging the body will also drag the tip
          if ( !this._isTipUserControlled ) {
            const unconstrainedTipPosition = translationDelta.add( this.tipPositionProperty.value );
            if ( options.isTipDragBounded ) {
              const constrainedTipPosition = this._dragBounds.closestPointTo( unconstrainedTipPosition );
              // translation of the tipPosition (subject to the constraining drag bounds)
              this.tipPositionProperty.set( constrainedTipPosition );
            }
            else {
              this.tipPositionProperty.set( unconstrainedTipPosition );
            }
          }
        },

        end: ( event, trail ) => {
          this._isBaseUserControlledProperty.set( false );
          options.baseDragEnded();
        }
      } ) :
      null;

    options.interactive && this.baseImage.addInputListener( this.baseDragHandler );

    let tipStartOffset;

    // init drag and drop for tip
    options.interactive && tip.addInputListener( new SimpleDragHandler( {
      tandem: options.tandem.createTandem( 'tipDragHandler' ),

      allowTouchSnag: true,

      // Don't allow the pointer to swipe-to-snag other things while dragging
      attach: true,

      start: ( event, trail ) => {
        this._isTipUserControlledProperty.set( true );
        const position = this.modelViewTransformProperty.value.modelToViewPosition( this.tipPositionProperty.value );
        tipStartOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( position );
      },

      drag: event => {
        const parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( tipStartOffset );
        const unconstrainedTipPosition = this.modelViewTransformProperty.value.viewToModelPosition( parentPoint );

        if ( options.isTipDragBounded ) {
          const constrainedTipPosition = this._dragBounds.closestPointTo( unconstrainedTipPosition );
          // translation of the tipPosition (subject to the constraining drag bounds)
          this.tipPositionProperty.set( constrainedTipPosition );
        }
        else {
          this.tipPositionProperty.set( unconstrainedTipPosition );
        }
      },

      end: ( event, trail ) => {
        this._isTipUserControlledProperty.set( false );
      }
    } ) );

    // set Text on on valueNode
    const updateTextReadout = text => {
      this.valueNode.setText( text );

      // reset the text
      this.valueNode.centerTop = this.baseImage.center.plus( options.textPosition.times( options.baseScale ) );
    };

    // link the positions of base and tip to the measuring tape to the scenery update function.
    // Must be disposed.
    const multilink = Property.multilink(
      [ this.measuredDistanceProperty, unitsProperty, this.modelViewTransformProperty, this.tipPositionProperty, this.basePositionProperty ], (
        measuredDistance, units, modelViewTransform, tipPosition, basePosition ) => {

        const viewTipPosition = modelViewTransform.modelToViewPosition( tipPosition );
        const viewBasePosition = modelViewTransform.modelToViewPosition( basePosition );

        // calculate the orientation and change of orientation of the Measuring tape
        const oldAngle = this.baseImage.getRotation();
        const angle = Math.atan2( viewTipPosition.y - viewBasePosition.y, viewTipPosition.x - viewBasePosition.x );
        const deltaAngle = angle - oldAngle;

        // set position of the tip and the base crosshair
        baseCrosshair.center = viewBasePosition;
        tip.center = viewTipPosition;

        // in order to avoid all kind of geometrical issues with position,
        // let's reset the baseImage upright and then set its position and rotation
        this.baseImage.setRotation( 0 );
        this.baseImage.rightBottom = viewBasePosition;
        this.baseImage.rotateAround( this.baseImage.rightBottom, angle );

        // reposition the tapeline
        tapeLine.setLine( viewBasePosition.x, viewBasePosition.y, viewTipPosition.x, viewTipPosition.y );

        // rotate the crosshairs
        if ( options.isTipCrosshairRotating ) {
          tip.rotateAround( viewTipPosition, deltaAngle );
        }
        if ( options.isBaseCrosshairRotating ) {
          baseCrosshair.rotateAround( viewBasePosition, deltaAngle );
        }

        updateTextReadout( readoutTextProperty.value );
      } );

    const isVisiblePropertyObserver = isVisible => {
      this.visible = isVisible;
    };
    isVisibleProperty.link( isVisiblePropertyObserver ); // must be unlinked in dispose

    readoutTextProperty.link( updateTextReadout );

    // @private
    this.disposeMeasuringTapeNode = () => {
      multilink.dispose();
      if ( isVisibleProperty.hasListener( isVisiblePropertyObserver ) ) {
        isVisibleProperty.unlink( isVisiblePropertyObserver );
      }
      readoutTextProperty.unlink( updateTextReadout );
    };

    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'MeasuringTapeNode', this );
  }

  /**
   * Shows/hides the text and its background.  Operates by removing/adding children so that Node.rasterized() can
   * be used to create icons that are not off-center.
   *
   * @param {boolean} visible
   * @public
   */
  setTextVisible( visible ) {
    this.valueContainer.visible = visible;
  }

  /**
   * Resets the MeasuringTapeNode to its initial configuration
   * @public
   */
  reset() {
    this.basePositionProperty.reset();
    this.tipPositionProperty.reset();
  }

  /**
   * Ensures that this node is subject to garbage collection
   * @public
   */
  dispose() {
    this.disposeMeasuringTapeNode();
    Node.prototype.dispose.call( this );
  }

  /**
   * Sets the color of the text label
   * @public
   * @param {Color|string|null} color
   */
  setTextColor( color ) {
    this.valueNode.fill = color;
  }

  /**
   * Returns a property indicating if the tip of the measuring tape is being dragged or not
   * @public
   * @returns {Property.<boolean>}
   */
  getIsTipUserControlledProperty() {
    return this._isTipUserControlledProperty;
  }

  /**
   * Returns a property indicating if the baseImage of the measuring tape is being dragged or not
   * @public
   * @returns {Property.<boolean>}
   */
  getIsBaseUserControlledProperty() {
    return this._isBaseUserControlledProperty;
  }

  /**
   * Sets the property indicating if the tip of the measuring tape is being dragged or not.
   * (Useful to set externally if using a creator node to generate the measuring tape)
   * @public
   * @param {boolean} value
   */
  setIsBaseUserControlledProperty( value ) {
    this._isBaseUserControlledProperty.set( value );
  }

  /**
   * Sets the property indicating if the tip of the measuring tape is being dragged or not
   * @public
   * @param {boolean} value
   */
  setIsTipUserControlledProperty( value ) {
    this._isBaseUserControlledProperty.set( value );
  }

  /**
   * Sets the dragBounds of the of the measuring tape.
   * In addition, it forces the tip and base of the measuring tape to be within the new bounds.
   * @public
   * @param {Bounds2} dragBounds
   */
  setDragBounds( dragBounds ) {
    this._dragBounds = dragBounds.copy();
    // sets the base position of the measuring tape, which may have changed if it was outside of the dragBounds
    this.basePositionProperty.set( this._dragBounds.closestPointTo( this.basePositionProperty.value ) );
    // sets a new tip position if the tip of the measuring tape is subject to dragBounds
    if ( this.isTipDragBounded ) {
      this.tipPositionProperty.set( this._dragBounds.closestPointTo( this.tipPositionProperty.value ) );
    }
  }

  /**
   * Returns the dragBounds of the sim.
   * @public
   * @returns {Bounds2}
   */
  getDragBounds() {
    return this._dragBounds;
  }

  /**
   * Sets the modelViewTransform.
   * @public
   * @param {ModelViewTransform2} modelViewTransform
   */
  setModelViewTransform( modelViewTransform ) {
    this.modelViewTransformProperty.value = modelViewTransform;
  }

  /**
   * Gets the modelViewTransform.
   * @public
   * @returns {ModelViewTransform2}
   */
  getModelViewTransform() {
    return this.modelViewTransformProperty.value;
  }

  /**
   * Returns the center of the base in the measuring tape's local coordinate frame.
   * @public
   *
   * @returns {Vector2}
   */
  getLocalBaseCenter() {
    return new Vector2( -this.baseImage.imageWidth / 2, -this.baseImage.imageHeight / 2 );
  }

  /**
   * Returns the bounding box of the measuring tape's base within its local coordinate frame
   * @public
   *
   * @returns {Bounds2}
   */
  getLocalBaseBounds() {
    return this.baseImage.bounds.copy();
  }

  /**
   * Initiates a drag of the base (whole measuring tape) from a Scenery event.
   * @public
   *
   * @param {SceneryEvent} event
   */
  startBaseDrag( event ) {
    this.baseDragHandler.startDrag( event );
  }

  // @public ES5 getter and setter for the textColor
  set textColor( value ) { this.setTextColor( value ); }

  get textColor() { return this.valueNode.fill; }

  // @public ES5 getter and setter for the modelViewTransform
  set modelViewTransform( modelViewTransform ) { this.modelViewTransformProperty.value = modelViewTransform; }

  get modelViewTransform() { return this.modelViewTransformProperty.value; }

  // @public ES5 getter and setter for the dragBounds
  set dragBounds( value ) { this.setDragBounds( value ); }

  get dragBounds() { return this.getDragBounds(); }

  // @public ES5 getters and setters
  get isBaseUserControlledProperty() { return this.getIsBaseUserControlledProperty(); }

  get isTipUserControlledProperty() { return this.getIsTipUserControlledProperty(); }

  // @public
  set isBaseUserControlledProperty( value ) { return this.setIsBaseUserControlledProperty( value ); }

  set isTipUserControlledProperty( value ) { return this.setIsTipUserControlledProperty( value ); }

  /**
   * Creates an icon of the measuring tape.
   *
   * @param {Object} [measuringTapeOptions] - options applied to the 'look' of icon.
   *    These options are not applied to the icon this returns. DO NOT use layout options!
   * @param {Tandem} [tandem]
   * @returns {Node}
   * @static
   * @public
   */
  static createIcon( measuringTapeOptions, tandem = null ) {

    // See documentation above!
    measuringTapeOptions = merge( {
      tipPositionProperty: new Vector2Property( new Vector2( 30, 0 ) ),
      hasValue: false, // no value below the tape
      interactive: false
    }, measuringTapeOptions, {
      pickable: false // MeasuringTapeNode has a drag handle, don't allow the user to interact with it
    } );

    assert && assert( !measuringTapeOptions.tandem, 'pass tandem as an arg for the icon, not as options' );

    // Create an actual measuring tape.
    const measuringTape = new MeasuringTapeNode( new Property( { name: '', multiplier: 1 } ), new Property( true ),
      measuringTapeOptions );

    // Create the icon, with measuringTape as its initial child.  This child will be replaced once the image becomes
    // available in the callback to toImage (see below). Since toImage happens asynchronously, this ensures that
    // the icon has initial bounds that will match the icon once the image is available.
    const measuringTapeIcon = new Node( { children: [ measuringTape ] } );

    // Convert measuringTape to an image, and make it the child of measuringTapeIcon.
    measuringTape.toImage( image => measuringTapeIcon.setChildren( [ new Image( image ) ] ) );

    if ( tandem ) {
      measuringTapeIcon.mutate( { tandem: tandem } ); // need to mutate, as there is no tandem setter for Node.
    }

    return measuringTapeIcon;
  }
}

sceneryPhet.register( 'MeasuringTapeNode', MeasuringTapeNode );

export default MeasuringTapeNode;