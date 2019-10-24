// Copyright 2014-2019, University of Colorado Boulder

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
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const InstanceRegistry = require( 'PHET_CORE/documentation/InstanceRegistry' );
  const Line = require( 'SCENERY/nodes/Line' );
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  const Shape = require( 'KITE/Shape' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const Tandem = require( 'TANDEM/Tandem' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  // images
  const measuringTapeImage = require( 'image!SCENERY_PHET/measuringTape.png' );

  /**
   * Constructor for the measuring tape. WARNING: although the MeasuringTape will accept Scenery options such as
   * x, y, left, etc., you should not use these to set the position of the tape. Use basePositionProperty and
   * tipPositionProperty instead. However, because there are some Scenery options that might be useful, options
   * are still propagated to the supertype.
   *
   * @param {Property.<Object>} unitsProperty - it has two fields, (1) name <string> and (2) multiplier <number>,
   *                                            eg. {name: 'cm', multiplier: 100},
   * @param {Property.<boolean>} isVisibleProperty
   * @param {Object} [options]
   * @constructor
   */
  function MeasuringTapeNode( unitsProperty, isVisibleProperty, options ) {
    const self = this;

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
      tapeLineWidth: 2, // linewidth of the tape line
      tipCircleColor: 'rgba(0,0,0,0.1)', // color of the circle at the tip
      tipCircleRadius: 10, // radius of the circle on the tip
      crosshairColor: 'rgb(224, 95, 32)', // orange, color of the two crosshairs
      crosshairSize: 5, // size of the crosshairs in scenery coordinates ( measured from center)
      crosshairLineWidth: 2, // linewidth of the crosshairs
      isBaseCrosshairRotating: true, // do crosshairs rotate around their own axis to line up with the tapeline
      isTipCrosshairRotating: true, // do crosshairs rotate around their own axis to line up with the tapeline
      isTipDragBounded: true, // is the tip subject to dragBounds
      interactive: true, // specifies whether the node adds its own input listeners. Setting this to false may be helpful in creating an icon.
      baseDragEnded: _.noop, // called when the base drag ends, for testing whether it has dropped into the toolbox
      tandem: Tandem.optional
    }, options );

    Node.call( this );

    assert && assert( Math.abs( options.modelViewTransform.modelToViewDeltaX( 1 ) ) ===
                      Math.abs( options.modelViewTransform.modelToViewDeltaY( 1 ) ), 'The y and x scale factor are not identical' );

    this.significantFigures = options.significantFigures; // @private
    this.unitsProperty = unitsProperty; // @private
    this._dragBounds = options.dragBounds; // @private
    this._modelViewTransform = options.modelViewTransform; // @private
    this.isTipDragBounded = options.isTipDragBounded; //@private
    this.basePositionProperty = options.basePositionProperty;
    this.tipPositionProperty = options.tipPositionProperty;

    this._isTipUserControlledProperty = new Property( false );// @private
    this._isBaseUserControlledProperty = new Property( false ); // @private

    this.tipToBaseDistance = ( this.basePositionProperty.value ).distance( this.tipPositionProperty.value ); // @private

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

    // @private
    this.valueNode = new Text( self.getText(), {
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
    const updateValueBackgroundNode = function() {
      const valueBackgroundWidth = self.valueNode.width + ( 2 * options.textBackgroundXMargin );
      const valueBackgroundHeight = self.valueNode.height + ( 2 * options.textBackgroundYMargin );
      self.valueBackgroundNode.setRect( 0, 0, valueBackgroundWidth, valueBackgroundHeight );
      self.valueBackgroundNode.center = self.valueNode.center;
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
    this.baseDragHandler = options.interactive ? new SimpleDragHandler( {
      tandem: options.tandem.createTandem( 'baseDragHandler' ),

      allowTouchSnag: true,

      // Don't allow the pointer to swipe-to-snag other things while dragging
      attach: true,

      start: function( event, trail ) {
        self._isBaseUserControlledProperty.set( true );
        const location = self._modelViewTransform.modelToViewPosition( self.basePositionProperty.value );
        baseStartOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( location );
      },

      drag: function( event ) {
        const parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( baseStartOffset );
        const unconstrainedBaseLocation = self._modelViewTransform.viewToModelPosition( parentPoint );
        const constrainedBaseLocation = self._dragBounds.closestPointTo( unconstrainedBaseLocation );

        // the basePosition value has not been updated yet, hence it is the old value of the basePosition;
        const translationDelta = constrainedBaseLocation.minus( self.basePositionProperty.value ); // in model reference frame

        // translation of the basePosition (subject to the constraining drag bounds)
        self.basePositionProperty.set( constrainedBaseLocation );

        // translate the position of the tip if it is not being dragged
        // when the user is not holding onto the tip, dragging the body will also drag the tip
        if ( !self._isTipUserControlled ) {
          const unconstrainedTipLocation = translationDelta.add( self.tipPositionProperty.value );
          if ( options.isTipDragBounded ) {
            const constrainedTipLocation = self._dragBounds.closestPointTo( unconstrainedTipLocation );
            // translation of the tipPosition (subject to the constraining drag bounds)
            self.tipPositionProperty.set( constrainedTipLocation );
          }
          else {
            self.tipPositionProperty.set( unconstrainedTipLocation );
          }
        }
      },

      end: function( event, trail ) {
        self._isBaseUserControlledProperty.set( false );
        options.baseDragEnded();
      }
    } ) : null;

    options.interactive && this.baseImage.addInputListener( this.baseDragHandler );

    let tipStartOffset;

    // init drag and drop for tip
    options.interactive && tip.addInputListener( new SimpleDragHandler( {
      tandem: options.tandem.createTandem( 'tipDragHandler' ),

      allowTouchSnag: true,

      // Don't allow the pointer to swipe-to-snag other things while dragging
      attach: true,

      start: function( event, trail ) {
        self._isTipUserControlledProperty.set( true );
        const location = self._modelViewTransform.modelToViewPosition( self.tipPositionProperty.value );
        tipStartOffset = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( location );
      },

      drag: function( event ) {
        const parentPoint = event.currentTarget.globalToParentPoint( event.pointer.point ).minus( tipStartOffset );
        const unconstrainedTipLocation = self._modelViewTransform.viewToModelPosition( parentPoint );

        if ( options.isTipDragBounded ) {
          const constrainedTipLocation = self._dragBounds.closestPointTo( unconstrainedTipLocation );
          // translation of the tipPosition (subject to the constraining drag bounds)
          self.tipPositionProperty.set( constrainedTipLocation );
        }
        else {
          self.tipPositionProperty.set( unconstrainedTipLocation );
        }
      },

      end: function( event, trail ) {
        self._isTipUserControlledProperty.set( false );
      }
    } ) );

    /**
     * Update the scenery nodes of the measuring tape such as crosshair, tip, valueNode, tapeLine, baseImage
     * based on the position of the base and tip of the measuring tape
     * @param {Vector2} basePosition
     * @param {Vector2} tipPosition
     * @private
     */
    this.updatePosition = function( basePosition, tipPosition ) {
      const viewTipPosition = self._modelViewTransform.modelToViewPosition( tipPosition );
      const viewBasePosition = self._modelViewTransform.modelToViewPosition( basePosition );

      // calculate the orientation and change of orientation of the Measuring tape
      const oldAngle = self.baseImage.getRotation();
      const angle = Math.atan2( viewTipPosition.y - viewBasePosition.y, viewTipPosition.x - viewBasePosition.x );
      const deltaAngle = angle - oldAngle;

      // set position of the tip and the base crosshair
      baseCrosshair.center = viewBasePosition;
      tip.center = viewTipPosition;

      // in order to avoid all kind of geometrical issues with position,
      // let's reset the baseImage upright and then set its position and rotation
      self.baseImage.setRotation( 0 );
      self.baseImage.rightBottom = viewBasePosition;
      self.baseImage.rotateAround( self.baseImage.rightBottom, angle );

      // reset the text
      self.tipToBaseDistance = tipPosition.distance( basePosition );
      self.valueNode.setText( self.getText() );
      self.valueNode.centerTop = self.baseImage.center.plus( options.textPosition.times( options.baseScale ) );

      // reposition the tapeline
      tapeLine.setLine( viewBasePosition.x, viewBasePosition.y, viewTipPosition.x, viewTipPosition.y );

      // rotate the crosshairs
      if ( options.isTipCrosshairRotating ) {
        tip.rotateAround( viewTipPosition, deltaAngle );
      }
      if ( options.isBaseCrosshairRotating ) {
        baseCrosshair.rotateAround( viewBasePosition, deltaAngle );
      }
    };

    // link the positions of base and tip to the measuring tape to the scenery update function.
    // Must be disposed.
    const multilink = Property.multilink( [ this.basePositionProperty, this.tipPositionProperty, unitsProperty ],
      function( basePosition, tipPosition ) {
        self.updatePosition( basePosition, tipPosition );
      } );

    const isVisiblePropertyObserver = function( isVisible ) {
      self.visible = isVisible;
    };
    isVisibleProperty.link( isVisiblePropertyObserver ); // must be unlinked in dispose

    // set Text on on valueNode
    const unitsPropertyObserver = function() {
      self.valueNode.setText( self.getText() );
    };
    // link change of units to the text
    unitsProperty.link( unitsPropertyObserver ); // must be unlinked in dispose

    // @private
    this.disposeMeasuringTapeNode = function() {
      multilink.dispose();
      if ( isVisibleProperty.hasListener( isVisiblePropertyObserver ) ) {
        isVisibleProperty.unlink( isVisiblePropertyObserver );
      }
      if ( unitsProperty.hasListener( unitsPropertyObserver ) ) {
        unitsProperty.unlink( unitsPropertyObserver );
      }
    };

    this.mutate( options );

    // support for binder documentation, stripped out in builds and only runs when ?binder is specified
    assert && phet.chipper.queryParameters.binder && InstanceRegistry.registerDataURL( 'scenery-phet', 'MeasuringTapeNode', this );
  }

  sceneryPhet.register( 'MeasuringTapeNode', MeasuringTapeNode );

  return inherit( Node, MeasuringTapeNode, {

    /**
     * Shows/hides the text and its background.  Operates by removing/adding children so that Node.rasterized() can
     * be used to create icons that are not off-center.
     *
     * @param {boolean} visible
     * @public
     */
    setTextVisible: function( visible ) {
      this.valueContainer.visible = visible;
    },

    /**
     * Resets the MeasuringTapeNode to its initial configuration
     * @public
     */
    reset: function() {
      this.basePositionProperty.reset();
      this.tipPositionProperty.reset();
    },

    /**
     * Ensures that this node is subject to garbage collection
     * @public
     */
    dispose: function() {
      this.disposeMeasuringTapeNode();
      Node.prototype.dispose.call( this );
    },

    /**
     * Returns a readout of the current measurement
     * @public
     * @returns {string}
     */
    getText: function() {
      return Util.toFixed( this.unitsProperty.value.multiplier * this.tipToBaseDistance,
        this.significantFigures ) + ' ' + this.unitsProperty.value.name;
    },

    /**
     * Sets the color of the text label
     * @public
     * @param {Color|string|null} color
     */
    setTextColor: function( color ) {
      this.valueNode.fill = color;
    },

    /**
     * Returns a property indicating if the tip of the measuring tape is being dragged or not
     * @public
     * @returns {Property.<boolean>}
     */
    getIsTipUserControlledProperty: function() {
      return this._isTipUserControlledProperty;
    },

    /**
     * Returns a property indicating if the baseImage of the measuring tape is being dragged or not
     * @public
     * @returns {Property.<boolean>}
     */
    getIsBaseUserControlledProperty: function() {
      return this._isBaseUserControlledProperty;
    },

    /**
     * Sets the property indicating if the tip of the measuring tape is being dragged or not.
     * (Useful to set externally if using a creator node to generate the measuring tape)
     * @public
     * @param {boolean} value
     */
    setIsBaseUserControlledProperty: function( value ) {
      this._isBaseUserControlledProperty.set( value );
    },

    /**
     * Sets the property indicating if the tip of the measuring tape is being dragged or not
     * @public
     * @param {boolean} value
     */
    setIsTipUserControlledProperty: function( value ) {
      this._isBaseUserControlledProperty.set( value );
    },

    /**
     * Sets the dragBounds of the of the measuring tape.
     * In addition, it forces the tip and base of the measuring tape to be within the new bounds.
     * @public
     * @param {Bounds2} dragBounds
     */
    setDragBounds: function( dragBounds ) {
      this._dragBounds = dragBounds.copy();
      // sets the base position of the measuring tape, which may have changed if it was outside of the dragBounds
      this.basePositionProperty.set( this._dragBounds.closestPointTo( this.basePositionProperty.value ) );
      // sets a new tip position if the tip of the measuring tape is subject to dragBounds
      if ( this.isTipDragBounded ) {
        this.tipPositionProperty.set( this._dragBounds.closestPointTo( this.tipPositionProperty.value ) );
      }
    },

    /**
     * Returns the dragBounds of the sim.
     * @public
     * @returns {Bounds2}
     */
    getDragBounds: function() {
      return this._dragBounds;
    },

    /**
     * Sets the modelViewTransform.
     * @public
     * @param {ModelViewTransform2} modelViewTransform
     */
    setModelViewTransform: function( modelViewTransform ) {
      this._modelViewTransform = modelViewTransform;
      this.updatePosition( this.basePositionProperty.value, this.tipPositionProperty.value );
    },

    /**
     * Gets the modelViewTransform.
     * @public
     * @returns {ModelViewTransform2}
     */
    getModelViewTransform: function() {
      return this._modelViewTransform;
    },

    /**
     * Returns the center of the base in the measuring tape's local coordinate frame.
     * @public
     *
     * @returns {Vector2}
     */
    getLocalBaseCenter: function() {
      return new Vector2( -this.baseImage.imageWidth / 2, -this.baseImage.imageHeight / 2 );
    },

    /**
     * Returns the bounding box of the measuring tape's base within its local coordinate frame
     * @public
     *
     * @returns {Bounds2}
     */
    getLocalBaseBounds: function() {
      return this.baseImage.bounds.copy();
    },

    /**
     * Initiates a drag of the base (whole measuring tape) from a Scenery event.
     * @public
     *
     * @param {Event} event
     */
    startBaseDrag: function( event ) {
      this.baseDragHandler.startDrag( event );
    },

    // @public ES5 getter and setter for the textColor
    set textColor( value ) { this.setTextColor( value ); },
    get textColor() { return this.valueNode.fill; },

    // @public ES5 getter and setter for the modelViewTransform
    set modelViewTransform( modelViewTransform ) { this._modelViewTransform = modelViewTransform; },
    get modelViewTransform() { return this._modelViewTransform; },

    // @public ES5 getter and setter for the dragBounds
    set dragBounds( value ) { this.setDragBounds( value ); },
    get dragBounds() { return this.getDragBounds(); },

    // @public ES5 getters and setters
    get isBaseUserControlledProperty() { return this.getIsBaseUserControlledProperty(); },
    get isTipUserControlledProperty() { return this.getIsTipUserControlledProperty(); },

    // @public
    set isBaseUserControlledProperty( value ) { return this.setIsBaseUserControlledProperty( value ); },
    set isTipUserControlledProperty( value ) { return this.setIsTipUserControlledProperty( value ); }
  }, {

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
    createIcon: function( measuringTapeOptions, tandem = null ) {

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
      measuringTape.toImage( function( image ) {
        measuringTapeIcon.children = [ new Image( image ) ];
      } );

      if ( tandem ) {
        measuringTapeIcon.mutate( { tandem: tandem } ); // need to mutate, as there is no tandem setter for Node.
      }

      return measuringTapeIcon;
    }
  } );
} );