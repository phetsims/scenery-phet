// Copyright 2013-2016, University of Colorado Boulder

/**
 * WavelengthSlider is a slider-like control used for setting visible wavelength.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SUN/buttons/ArrowButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var SpectrumNode = require( 'SCENERY_PHET/SpectrumNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TandemDragHandler = require( 'TANDEM/scenery/input/TandemDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VisibleColor = require( 'SCENERY_PHET/VisibleColor' );

  // phet-io modules
  var TNode = require( 'ifphetio!PHET_IO/types/scenery/nodes/TNode' );

  // strings
  var unitsNmString = require( 'string!SCENERY_PHET/units_nm' );
  var wavelengthSliderPattern0Wavelength1UnitsString = require( 'string!SCENERY_PHET/WavelengthSlider.pattern_0wavelength_1units' );

  // constants
  var DEFAULT_THUMB_WIDTH = 35;
  var DEFAULT_THUMB_HEIGHT = 45;

  /**
   * @param {Property.<number>} wavelengthProperty - wavelength, in nm
   * @param {Object} [options]
   * @constructor
   */
  function WavelengthSlider( wavelengthProperty, options ) {

    options = options || {};

    // Compute defaults for touchArea dilation.
    // Must be done before _.extends call because these values are proportional to thumb size.
    var DEFAULT_THUMB_TOUCH_AREA_X_DILATION = 0.5 * ( options.thumbWidth || DEFAULT_THUMB_WIDTH );
    var DEFAULT_THUMB_TOUCH_AREA_Y_DILATION = 0.25 * ( options.thumbHeight || DEFAULT_THUMB_HEIGHT );

    // options that are specific to this type
    options = _.extend( {

      minWavelength: VisibleColor.MIN_WAVELENGTH,
      maxWavelength: VisibleColor.MAX_WAVELENGTH,

      // track
      trackWidth: 150,
      trackHeight: 30,
      trackOpacity: 1,
      trackBorderStroke: 'black',

      // thumb
      thumbWidth: DEFAULT_THUMB_WIDTH,
      thumbHeight: DEFAULT_THUMB_HEIGHT,
      thumbTouchAreaXDilation: DEFAULT_THUMB_TOUCH_AREA_X_DILATION,
      thumbTouchAreaYDilation: DEFAULT_THUMB_TOUCH_AREA_Y_DILATION,
      thumbMouseAreaXDilation: 0,
      thumbMouseAreaYDilation: 0,

      // value
      valueFont: new PhetFont( 20 ),
      valueFill: 'black',
      valueVisible: true,
      valueYSpacing: 2, // {number} space between value and top of track

      // tweakers
      tweakersVisible: true,
      tweakersXSpacing: 8,
      maxTweakersHeight: 30,
      tweakersTouchAreaXDilation: 7,
      tweakersTouchAreaYDilation: 7,
      tweakersMouseAreaXDilation: 0,
      tweakersMouseAreaYDilation: 0,

      // cursor
      cursorVisible: true,
      cursorStroke: 'black',

      // phet-io
      tandem: null

    }, options );

    Tandem.validateOptions( options ); // The tandem is required when brand==='phet-io'

    // validate wavelengths
    assert && assert( options.minWavelength < options.maxWavelength );
    assert && assert( options.minWavelength >= VisibleColor.MIN_WAVELENGTH && options.minWavelength <= VisibleColor.MAX_WAVELENGTH );
    assert && assert( options.maxWavelength >= VisibleColor.MIN_WAVELENGTH && options.maxWavelength <= VisibleColor.MAX_WAVELENGTH );

    var thisNode = this;
    Node.call( thisNode );

    var thumb = new Thumb( options.thumbWidth, options.thumbHeight );

    // thumb touchArea
    if ( options.thumbTouchAreaXDilation || options.thumbTouchAreaYDilation ) {
      thumb.touchArea = thumb.localBounds
        .dilatedXY( options.thumbTouchAreaXDilation, options.thumbTouchAreaYDilation )
        .shiftedY( options.thumbTouchAreaYDilation );
    }

    // thumb mouseArea
    if ( options.thumbMouseAreaXDilation || options.thumbMouseAreaYDilation ) {
      thumb.mouseArea = thumb.localBounds
        .dilatedXY( options.thumbMouseAreaXDilation, options.thumbMouseAreaYDilation )
        .shiftedY( options.thumbMouseAreaYDilation );
    }

    var valueDisplay = ( options.valueVisible ) ? new ValueDisplay( wavelengthProperty, options.valueFont, options.valueFill ) : null;
    var track = new SpectrumNode( options.trackWidth, options.trackHeight, options.minWavelength, options.maxWavelength, options.trackOpacity );
    var cursor = ( options.cursorVisible ) ? new Cursor( 3, track.height, options.cursorStroke ) : null;

    // tweaker buttons for single-unit increments
    var plusButton;
    var minusButton;
    if ( options.tweakersVisible ) {

      plusButton = new ArrowButton( 'right', function() {
        wavelengthProperty.set( wavelengthProperty.get() + 1 );
      }, {
        maxHeight: options.maxTweakersHeight,
        tandem: options.tandem && options.tandem.createTandem( 'plusButton' )
      } );

      minusButton = new ArrowButton( 'left', function() {
        wavelengthProperty.set( wavelengthProperty.get() - 1 );
      }, {
        maxHeight: options.maxTweakersHeight,
        tandem: options.tandem && options.tandem.createTandem( 'minusButton' )
      } );

      // tweakers touchArea
      plusButton.touchArea = plusButton.localBounds
        .dilatedXY( options.tweakersTouchAreaXDilation, options.tweakersTouchAreaYDilation )
        .shiftedX( options.tweakersTouchAreaXDilation );
      minusButton.touchArea = minusButton.localBounds
        .dilatedXY( options.tweakersTouchAreaXDilation, options.tweakersTouchAreaYDilation )
        .shiftedX( -options.tweakersTouchAreaXDilation );

      // tweakers mouseArea
      plusButton.mouseArea = plusButton.localBounds
        .dilatedXY( options.tweakersMouseAreaXDilation, options.tweakersMouseAreaYDilation )
        .shiftedX( options.tweakersMouseAreaXDilation );
      minusButton.mouseArea = minusButton.localBounds
        .dilatedXY( options.tweakersMouseAreaXDilation, options.tweakersMouseAreaYDilation )
        .shiftedX( -options.tweakersMouseAreaXDilation );
    }

    /*
     * Put a border around the track.
     * We don't stroke the track itself because stroking the track will affect its bounds,
     * and will thus affect the drag handle behavior.
     * Having a separate border also gives subclasses a place to add markings (eg, tick marks)
     * without affecting the track's bounds.
     */
    var trackBorder = new Rectangle( 0, 0, track.width, track.height, {
      stroke: options.trackBorderStroke,
      lineWidth: 1,
      pickable: false
    } );

    // rendering order
    thisNode.addChild( track );
    thisNode.addChild( trackBorder );
    thisNode.addChild( thumb );
    if ( valueDisplay ) { thisNode.addChild( valueDisplay ); }
    if ( cursor ) { thisNode.addChild( cursor ); }
    if ( options.tweakersVisible ) {
      thisNode.addChild( plusButton );
      thisNode.addChild( minusButton );
    }

    // layout
    if ( cursor ) { cursor.top = track.top; }
    thumb.top = track.bottom;
    if ( valueDisplay ) { valueDisplay.bottom = track.top - options.valueYSpacing; }
    if ( options.tweakersVisible ) {
      plusButton.left = track.right + options.tweakersXSpacing;
      plusButton.centerY = track.centerY;
      minusButton.right = track.left - options.tweakersXSpacing;
      minusButton.centerY = track.centerY;
    }

    // transforms between position and wavelength
    var positionToWavelength = function( x ) {
      return Math.floor( Util.clamp( Util.linear( 0, track.width, options.minWavelength, options.maxWavelength, x ), options.minWavelength, options.maxWavelength ) );
    };
    var wavelengthToPosition = function( wavelength ) {
      return Math.floor( Util.clamp( Util.linear( options.minWavelength, options.maxWavelength, 0, track.width, wavelength ), 0, track.width ) );
    };

    // track interactivity
    track.cursor = 'pointer';

    // click in the track to change the value, continue dragging if desired
    var handleTrackEvent = function( event ) {
      var x = thumb.globalToParentPoint( event.pointer.point ).x;
      var wavelength = positionToWavelength( x );
      wavelengthProperty.set( wavelength );
    };

    track.addInputListener( new TandemDragHandler( {

      tandem: options.tandem ? options.tandem.createTandem( 'trackInputListener' ) : null,

      start: function( event, trail ) {
        handleTrackEvent( event );
      },

      drag: function( event, trail ) {
        handleTrackEvent( event );
      }
    } ) );

    // thumb interactivity
    thumb.cursor = 'pointer';
    var clickXOffset = 0; // x-offset between initial click and thumb's origin
    thumb.addInputListener( new TandemDragHandler( {

      tandem: options.tandem ? options.tandem.createTandem( 'thumbInputListener' ) : null,

      allowTouchSnag: true,

      start: function( event ) {
        clickXOffset = thumb.globalToParentPoint( event.pointer.point ).x - thumb.x;
      },

      drag: function( event ) {
        var x = thumb.globalToParentPoint( event.pointer.point ).x - clickXOffset;
        var value = positionToWavelength( x );
        wavelengthProperty.set( value );
      }
    } ) );

    // sync with model
    var updateUI = function( wavelength ) {
      // positions
      var x = wavelengthToPosition( wavelength );
      thumb.centerX = x;
      if ( cursor ) { cursor.centerX = x; }
      if ( valueDisplay ) { valueDisplay.centerX = x; }
      // thumb color
      thumb.fill = VisibleColor.wavelengthToColor( wavelength );
      // tweaker buttons
      if ( options.tweakersVisible ) {
        plusButton.enabled = ( wavelength < options.maxWavelength );
        minusButton.enabled = ( wavelength > options.minWavelength );
      }
    };
    var wavelengthListener = function( wavelength ) {
      updateUI( wavelength );
    };
    wavelengthProperty.link( wavelengthListener );

    /*
     * The horizontal bounds of the wavelength control changes as the slider knob is dragged.
     * To prevent this, we determine the extents of the control's bounds at min and max values,
     * then add an invisible horizontal strut.
     */
    // determine bounds at min and max wavelength settings
    updateUI( options.minWavelength );
    var minX = thisNode.left;
    updateUI( options.maxWavelength );
    var maxX = thisNode.right;

    // restore the wavelength
    updateUI( wavelengthProperty.get() );

    // add a horizontal strut
    var strut = new Rectangle( minX, 0, maxX - minX, 1, { pickable: false } );
    thisNode.addChild( strut );
    strut.moveToBack();

    thisNode.mutate( options );
    options.tandem && options.tandem.addInstance( this, TNode );

    this.disposeWavelengthSlider = function() {
      plusButton && plusButton.dispose();
      minusButton && minusButton.dispose();
      wavelengthProperty.unlink( wavelengthListener );
      options.tandem && options.tandem.removeInstance( this );
    };
  }

  sceneryPhet.register( 'WavelengthSlider', WavelengthSlider );

  /**
   * The slider thumb
   *
   * @param {number} width
   * @param {number} height
   * @constructor
   */
  function Thumb( width, height ) {

    // Set the radius of the arcs based on the height or width, whichever is smaller.
    var radiusScale = 0.15;
    var radius = ( width < height ) ? radiusScale * width : radiusScale * height;

    // Calculate some parameters of the upper triangles of the thumb for getting arc offsets.
    var hypotenuse = Math.sqrt( Math.pow( 0.5 * width, 2 ) + Math.pow( 0.3 * height, 2 ) );
    var angle = Math.acos( width * 0.5 / hypotenuse );
    var heightOffset = radius * Math.sin( angle );

    // Draw the thumb shape starting at the right upper corner of the pentagon below the arc,
    // this way we can get the arc coordinates for the arc in this corner from the other side,
    // which will be easier to calculate arcing from bottom to top.
    var shape = new Shape()
      .moveTo( 0.5 * width, 0.3 * height + heightOffset )
      .lineTo( 0.5 * width, 1 * height - radius )
      .arc( 0.5 * width - radius, 1 * height - radius, radius, 0, Math.PI / 2 )
      .lineTo( -0.5 * width + radius, 1 * height )
      .arc( -0.5 * width + radius, 1 * height - radius, radius, Math.PI / 2, Math.PI )
      .lineTo( -0.5 * width, 0.3 * height + heightOffset )
      .arc( -0.5 * width + radius, 0.3 * height + heightOffset, radius, Math.PI, Math.PI + angle );

    // Save the coordinates for the point above the left side arc, for use on the other side.
    var sideArcPoint = shape.getLastPoint();

    shape.lineTo( 0, 0 )
      .lineTo( -sideArcPoint.x, sideArcPoint.y )
      .arc( 0.5 * width - radius, 0.3 * height + heightOffset, radius, -angle, 0 )
      .close();

    Path.call( this, shape, { stroke: 'black', lineWidth: 1, fill: 'black' } );
  }

  sceneryPhet.register( 'WavelengthSlider.Thumb', Thumb );

  inherit( Path, Thumb );

  /**
   * Displays the value and units.
   *
   * @param {Property} property
   * @param {string} font
   * @param {string} fill
   * @constructor
   */
  function ValueDisplay( property, font, fill ) {
    var thisNode = this;
    Text.call( this, '?', { font: font, fill: fill } );
    property.link( function( value ) {
      thisNode.text = StringUtils.format( wavelengthSliderPattern0Wavelength1UnitsString, Util.toFixed( value, 0 ), unitsNmString );
    } );
  }

  sceneryPhet.register( 'WavelengthSlider.ValueDisplay', ValueDisplay );

  inherit( Text, ValueDisplay );

  /**
   * Rectangular 'cursor' that appears in the track directly above the thumb. Origin is at top center of cursor.
   *
   * @param {number} width
   * @param {number} height
   * @param {Color|string} stroke
   * @constructor
   */
  function Cursor( width, height, stroke ) {
    Rectangle.call( this, -width / 2, 0, width, height, { stroke: stroke, lineWidth: 1 } );
  }

  sceneryPhet.register( 'WavelengthSlider.Cursor', Cursor );

  inherit( Rectangle, Cursor );

  return inherit( Node, WavelengthSlider, {

    // @public
    dispose: function() {
      this.disposeWavelengthSlider();
    }
  } );
} );
