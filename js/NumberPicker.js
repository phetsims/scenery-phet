// Copyright 2014-2019, University of Colorado Boulder

/**
 * User-interface component for picking a number value from a range.
 * This is essentially a value with integrated up/down spinners.
 * But PhET has been calling it a 'picker', so that's what this type is named.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccessibleNumberSpinner = require( 'SUN/accessibility/AccessibleNumberSpinner' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Color = require( 'SCENERY/util/Color' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var FireOnHoldInputListener = require( 'SCENERY_PHET/buttons/FireOnHoldInputListener' );
  var FocusHighlightPath = require( 'SCENERY/accessibility/FocusHighlightPath' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var MathSymbols = require( 'SCENERY_PHET/MathSymbols' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PaintColorProperty = require( 'SCENERY/util/PaintColorProperty' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PhetioObject = require( 'TANDEM/PhetioObject' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var StringProperty = require( 'AXON/StringProperty' );
  var SunConstants = require( 'SUN/SunConstants' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Property.<number>} valueProperty
   * @param {Property.<Range>} rangeProperty - If the range is anticipated to change, it's best to have the range
   *                                           property contain the (maximum) union of all potential changes, so that
   *                                           NumberPicker can iterate through all possible values and compute the
   *                                           bounds of the labels.
   * @param {Object} [options]
   * @mixes AccessibleNumberSpinner
   * @constructor
   */
  function NumberPicker( valueProperty, rangeProperty, options ) {

    options = _.extend( {
      cursor: 'pointer',
      color: new Color( 0, 0, 255 ), // {Color|string|Property.<Color|string>} color of arrows, and top/bottom gradient on pointer over
      backgroundColor: 'white', // {Color|string|Property.<Color|string>} color of the background when pointer is not over it
      cornerRadius: 6,
      xMargin: 3,
      yMargin: 3,
      decimalPlaces: 0,
      font: new PhetFont( 24 ),
      upFunction: function( value ) { return value + 1; },
      downFunction: function( value ) { return value - 1; },
      timerDelay: 400, // start to fire continuously after pressing for this long (milliseconds)
      timerInterval: 100, // fire continuously at this frequency (milliseconds),
      noValueString: MathSymbols.NO_VALUE, // string to display if valueProperty.get is null or undefined
      align: 'center', // horizontal alignment of the value, 'center'|'right'|'left'
      touchAreaXDilation: 10,
      touchAreaYDilation: 10,
      mouseAreaXDilation: 0,
      mouseAreaYDilation: 5,
      backgroundStroke: 'gray',
      backgroundLineWidth: 0.5,
      arrowHeight: 6,
      arrowYSpacing: 3,
      arrowStroke: 'black',
      arrowLineWidth: 0.25,
      valueMaxWidth: null, // {number|null} - If non-null, it will cap the value's maxWidth to this value

      /**
       * Converts a value to a string to be displayed in a Text node. NOTE: If this function can give different strings
       * to the same value depending on external state, it is recommended to rebuild the NumberPicker when that state
       * changes (as it uses formatValue over the initial range to determine the bounds that labels can take).
       *
       * @param {number} value - the current value
       * @returns {string}
       */
      formatValue: function( value ) {
        return Util.toFixed( value, options.decimalPlaces );
      },

      /**
       * Determines whether the up arrow is enabled.
       * @param {number} value - the current value
       * @param {Range} range - the picker's range
       * @returns {boolean}
       */
      upEnabledFunction: function( value, range ) {
        return ( value !== null && value !== undefined && value < range.max );
      },

      /**
       * Determines whether the down arrow is enabled.
       * @param {number} value - the current value
       * @param {Range} range - the picker's range
       * @returns {boolean}
       */
      downEnabledFunction: function( value, range ) {
        return ( value !== null && value !== undefined && value > range.min );
      },

      // {BooleanProperty|null} if null, a default BooleanProperty is created
      enabledProperty: null,

      // {*|null} options passed to enabledProperty constructor, ignored if enabledProperty is provided
      enabledPropertyOptions: null,

      // Opacity used to indicate disabled, [0,1] exclusive
      disabledOpacity: SunConstants.DISABLED_OPACITY,

      // phet-io
      tandem: Tandem.required,
      phetioReadOnly: PhetioObject.DEFAULT_OPTIONS.phetioReadOnly,

      // a11y
      a11yPageValueDelta: 2 // {number} - change in value when using page up/page down, see AccessibleNumberSpinner

    }, options );

    // {Color|string|Property.<Color|string} color of arrows and top/bottom gradient when pressed
    var colorProperty = null;
    if ( options.pressedColor === undefined ) {
      colorProperty = new PaintColorProperty( options.color ); // dispose required!

      // No reference needs to be kept, since we dispose its dependency.
      options.pressedColor = new DerivedProperty( [ colorProperty ], function( color ) {
        return color.darkerColor();
      } );
    }

    assert && assert( options.disabledOpacity > 0 && options.disabledOpacity < 1,
      `invalid disabledOpacity: ${options.disabledOpacity}` );

    var self = this;
    Node.call( this );

    //------------------------------------------------------------
    // Properties

    var upStateProperty = new StringProperty( 'up' ); // up|down|over|out
    var downStateProperty = new StringProperty( 'up' ); // up|down|over|out

    // must be disposed
    var upEnabledProperty = new DerivedProperty( [ valueProperty, rangeProperty ], options.upEnabledFunction );

    // must be disposed
    var downEnabledProperty = new DerivedProperty( [ valueProperty, rangeProperty ], options.downEnabledFunction );

    // @private
    this.enabledProperty = options.enabledProperty;
    var ownsEnabledProperty = !this.enabledProperty;
    if ( ownsEnabledProperty ) {
      this.enabledProperty = new BooleanProperty( true, _.extend( {
        tandem: options.tandem.createTandem( 'enabledProperty' ),
        phetioReadOnly: options.phetioReadOnly,
        phetioDocumentation: 'When disabled, the picker is grayed out and cannot be pressed.'
      }, options.enabledPropertyOptions ) );
    }

    //------------------------------------------------------------
    // Nodes

    // displays the value
    var valueNode = new Text( '', { font: options.font, pickable: false } );

    // compute max width of text based on the width of all possible values.
    // See https://github.com/phetsims/area-model-common/issues/5
    // TODO: Recalculate maximum width on range changes, see https://github.com/phetsims/scenery-phet/issues/306
    var currentSampleValue = rangeProperty.get().min;
    var sampleValues = [];
    while ( currentSampleValue <= rangeProperty.get().max ) {
      sampleValues.push( currentSampleValue );
      currentSampleValue = options.upFunction( currentSampleValue );
      assert && assert( sampleValues.length < 500000, 'Don\'t infinite loop here' );
    }
    var maxWidth = Math.max.apply( null, sampleValues.map( function( value ) {
      valueNode.text = options.formatValue( value );
      return valueNode.width;
    } ) );
    // Cap the maxWidth if valueMaxWidth is provided, see https://github.com/phetsims/scenery-phet/issues/297
    if ( options.valueMaxWidth !== null ) {
      maxWidth = Math.min( maxWidth, options.valueMaxWidth );
    }

    // compute shape of the background behind the numeric value
    var backgroundWidth = maxWidth + ( 2 * options.xMargin );
    var backgroundHeight = valueNode.height + ( 2 * options.yMargin );
    var backgroundOverlap = 1;
    var backgroundCornerRadius = options.cornerRadius;

    // Apply the max-width AFTER computing the backgroundHeight, so it doesn't shrink vertically
    valueNode.maxWidth = maxWidth;

    // top half of the background, for 'up'. Shape computed starting at upper-left, going clockwise.
    var upBackground = new Path( new Shape()
      .arc( backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, Math.PI, Math.PI * 3 / 2, false )
      .arc( backgroundWidth - backgroundCornerRadius, backgroundCornerRadius, backgroundCornerRadius, -Math.PI / 2, 0, false )
      .lineTo( backgroundWidth, ( backgroundHeight / 2 ) + backgroundOverlap )
      .lineTo( 0, ( backgroundHeight / 2 ) + backgroundOverlap )
      .close(), { pickable: false } );

    // bottom half of the background, for 'down'. Shape computed starting at bottom-right, going clockwise.
    var downBackground = new Path( new Shape()
      .arc( backgroundWidth - backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, 0, Math.PI / 2, false )
      .arc( backgroundCornerRadius, backgroundHeight - backgroundCornerRadius, backgroundCornerRadius, Math.PI / 2, Math.PI, false )
      .lineTo( 0, backgroundHeight / 2 )
      .lineTo( backgroundWidth, backgroundHeight / 2 )
      .close(), { pickable: false } );

    // separate rectangle for stroke around value background
    var strokedBackground = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, backgroundCornerRadius, backgroundCornerRadius, {
      pickable: false,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } );

    // compute size of arrows
    var arrowButtonSize = new Dimension2( 0.5 * backgroundWidth, options.arrowHeight );

    var arrowOptions = {
      stroke: options.arrowStroke,
      lineWidth: options.arrowLineWidth,
      pickable: false
    };

    // 'up' arrow
    var upArrowShape = new Shape()
      .moveTo( arrowButtonSize.width / 2, 0 )
      .lineTo( arrowButtonSize.width, arrowButtonSize.height )
      .lineTo( 0, arrowButtonSize.height )
      .close();
    this.upArrow = new Path( upArrowShape, arrowOptions ); // @private
    this.upArrow.centerX = upBackground.centerX;
    this.upArrow.bottom = upBackground.top - options.arrowYSpacing;

    // 'down' arrow
    var downArrowShape = new Shape()
      .moveTo( arrowButtonSize.width / 2, arrowButtonSize.height )
      .lineTo( 0, 0 )
      .lineTo( arrowButtonSize.width, 0 )
      .close();
    this.downArrow = new Path( downArrowShape, arrowOptions ); // @private
    this.downArrow.centerX = downBackground.centerX;
    this.downArrow.top = downBackground.bottom + options.arrowYSpacing;

    // parents for 'up' and 'down' components
    var upParent = new Node( { children: [ upBackground, this.upArrow ] } );
    upParent.addChild( new Rectangle( upParent.localBounds ) ); // invisible overlay
    var downParent = new Node( { children: [ downBackground, this.downArrow ] } );
    downParent.addChild( new Rectangle( downParent.localBounds ) ); // invisible overlay

    // rendering order
    this.addChild( upParent );
    this.addChild( downParent );
    this.addChild( strokedBackground );
    this.addChild( valueNode );

    //------------------------------------------------------------
    // Pointer areas

    // touch area
    upParent.touchArea = Shape.rectangle(
      upParent.left - ( options.touchAreaXDilation / 2 ), upParent.top - options.touchAreaYDilation,
      upParent.width + options.touchAreaXDilation, upParent.height + options.touchAreaYDilation );
    downParent.touchArea = Shape.rectangle(
      downParent.left - ( options.touchAreaXDilation / 2 ), downParent.top,
      downParent.width + options.touchAreaXDilation, downParent.height + options.touchAreaYDilation );

    // mouse area
    upParent.mouseArea = Shape.rectangle(
      upParent.left - ( options.mouseAreaXDilation / 2 ), upParent.top - options.mouseAreaYDilation,
      upParent.width + options.mouseAreaXDilation, upParent.height + options.mouseAreaYDilation );
    downParent.mouseArea = Shape.rectangle(
      downParent.left - ( options.mouseAreaXDilation / 2 ), downParent.top,
      downParent.width + options.mouseAreaXDilation, downParent.height + options.mouseAreaYDilation );

    //------------------------------------------------------------
    // Colors

    // arrow colors
    var arrowColors = {
      up: options.color,
      over: options.color,
      down: options.pressedColor,
      out: options.color,
      disabled: 'rgb(176,176,176)'
    };

    // background colors
    var highlightGradient = createVerticalGradient( options.color, options.backgroundColor, options.color, backgroundHeight );
    var pressedGradient = createVerticalGradient( options.pressedColor, options.backgroundColor, options.pressedColor, backgroundHeight );
    var backgroundColors = {
      up: options.backgroundColor,
      over: highlightGradient,
      down: pressedGradient,
      out: pressedGradient,
      disabled: options.backgroundColor
    };

    //------------------------------------------------------------
    // Observers and InputListeners

    // up
    upParent.addInputListener( new ButtonStateListener( upStateProperty ) );
    this.upListener = new FireOnHoldInputListener( {
      listener: function() {
        valueProperty.set( Math.min( options.upFunction( valueProperty.get() ), rangeProperty.get().max ) );
      },
      timerDelay: options.timerDelay,
      timerInterval: options.timerInterval
    } );
    upParent.addInputListener( this.upListener );

    // down
    downParent.addInputListener( new ButtonStateListener( downStateProperty ) );
    // @private
    this.downListener = new FireOnHoldInputListener( {
      listener: function() {
        valueProperty.set( Math.max( options.downFunction( valueProperty.get() ), rangeProperty.get().min ) );
      },
      timerDelay: options.timerDelay,
      timerInterval: options.timerInterval
    } );
    downParent.addInputListener( this.downListener );

    // enable/disable listeners: unlink unnecessary, Properties are owned by this instance
    upEnabledProperty.link( function( enabled ) { self.upListener.enabled = enabled; } );
    downEnabledProperty.link( function( enabled ) { self.downListener.enabled = enabled; } );

    // Update text to match the value
    var valueObserver = function( value ) {
      if ( value === null || value === undefined ) {
        valueNode.text = options.noValueString;
        valueNode.x = ( backgroundWidth - valueNode.width ) / 2; // horizontally centered
      }
      else {
        valueNode.text = options.formatValue( value );
        if ( options.align === 'center' ) {
          valueNode.centerX = upBackground.centerX;
        }
        else if ( options.align === 'right' ) {
          valueNode.right = upBackground.right - options.xMargin;
        }
        else if ( options.align === 'left' ) {
          valueNode.left = upBackground.left + options.xMargin;
        }
        else {
          throw new Error( 'unsupported value for options.align: ' + options.align );
        }
      }
      valueNode.centerY = backgroundHeight / 2;
    };
    valueProperty.link( valueObserver ); // must be unlinked in dispose

    // @private update colors for 'up' components
    Property.multilink( [ upStateProperty, upEnabledProperty ], function( state, enabled ) {
      updateColors( state, enabled, upBackground, self.upArrow, backgroundColors, arrowColors );
    } );

    // @private update colors for 'down' components
    Property.multilink( [ downStateProperty, downEnabledProperty ], function( state, enabled ) {
      updateColors( state, enabled, downBackground, self.downArrow, backgroundColors, arrowColors );
    } );

    this.mutate( options );

    // Dilate based on consistent technique which brings into account transform of this node.
    var focusBounds = this.localBounds.dilated( FocusHighlightPath.getDilationCoefficient( this ) );

    // a11y - custom focus highlight that matches rounded background behind the numeric value
    this.focusHighlight = new FocusHighlightPath( Shape.roundedRectangleWithRadii(
      focusBounds.minX,
      focusBounds.minY,
      focusBounds.width,
      focusBounds.height, {
        topLeft: options.cornerRadius,
        topRight: options.cornerRadius,
        bottomLeft: options.cornerRadius,
        bottomRight: options.cornerRadius
      } )
    );

    // initialize accessibility features - must reach into up function to get delta
    this.initializeAccessibleNumberSpinner( valueProperty, rangeProperty, this.enabledProperty, _.extend( {
      a11yValueDelta: options.upFunction( valueProperty.get() ) - valueProperty.get()
    }, options ) );

    // update style with keyboard input, Emitters owned by this instance and disposed in AccessibleNumberSpinner
    this.incrementDownEmitter.addListener( function( isDown ) { upStateProperty.value = ( isDown ? 'down' : 'up' ); } );
    this.decrementDownEmitter.addListener( function( isDown ) { downStateProperty.value = ( isDown ? 'down' : 'up' ); } );

    var enabledListener = function( enabled ) {
      self.interruptSubtreeInput(); // cancel interaction that may be in progress
      self.pickable = enabled;
      self.cursor = enabled ? options.cursor : 'default';
      self.opacity = enabled ? 1 : options.disabledOpacity;
    };
    self.enabledProperty.link( enabledListener );

    // @private
    this.disposeNumberPicker = function() {

      colorProperty && colorProperty.dispose();
      upEnabledProperty.dispose();
      downEnabledProperty.dispose();

      if ( valueProperty.hasListener( valueObserver ) ) {
        valueProperty.unlink( valueObserver );
      }

      if ( ownsEnabledProperty ) {
        self.enabledProperty.dispose();
      }
      else if ( self.enabledProperty.hasListener( enabledListener ) ) {
        self.enabledProperty.unlink( enabledListener );
      }

      // a11y mixin
      self.disposeAccessibleNumberSpinner();
    };
  }

  sceneryPhet.register( 'NumberPicker', NumberPicker );

  /**
   * Converts ButtonListener events to state changes.
   *
   * @param {Property.<string>} stateProperty up|down|over|out
   * @constructor
   */
  function ButtonStateListener( stateProperty ) {
    ButtonListener.call( this, {
      up: function() { stateProperty.set( 'up' ); },
      over: function() { stateProperty.set( 'over' ); },
      down: function() { stateProperty.set( 'down' ); },
      out: function() { stateProperty.set( 'out' ); }
    } );
  }

  inherit( ButtonListener, ButtonStateListener );

  // creates a vertical gradient
  var createVerticalGradient = function( topColor, centerColor, bottomColor, height ) {
    return new LinearGradient( 0, 0, 0, height )
      .addColorStop( 0, topColor )
      .addColorStop( 0.5, centerColor )
      .addColorStop( 1, bottomColor );
  };

  // Update arrow and background colors
  var updateColors = function( state, enabled, background, arrow, backgroundColors, arrowColors ) {
    if ( enabled ) {
      arrow.stroke = 'black';
      if ( state === 'up' ) {
        background.fill = backgroundColors.up;
        arrow.fill = arrowColors.up;
      }
      else if ( state === 'over' ) {
        background.fill = backgroundColors.over;
        arrow.fill = arrowColors.over;
      }
      else if ( state === 'down' ) {
        background.fill = backgroundColors.down;
        arrow.fill = arrowColors.down;
      }
      else if ( state === 'out' ) {
        background.fill = backgroundColors.out;
        arrow.fill = arrowColors.out;
      }
      else {
        throw new Error( 'unsupported state: ' + state );
      }
    }
    else {
      background.fill = backgroundColors.disabled;
      arrow.fill = arrowColors.disabled;
      arrow.stroke = arrowColors.disabled; // stroke so that arrow size will look the same when it's enabled/disabled
    }
  };

  inherit( Node, NumberPicker, {

    // @public Ensures that this node is eligible for GC.
    dispose: function() {
      this.disposeNumberPicker();
      Node.prototype.dispose.call( this );
    },

    // @public
    setArrowsVisible: function( visible ) {
      this.upListener.setEnabled( visible );
      this.downListener.setEnabled( visible );
      this.upArrow.visible = this.downArrow.visible = visible;
    },

    /**
     * Sets whether the picker is enabled.
     * @param {boolean} enabled
     * @public
     */
    setEnabled: function( enabled ) { this.enabledProperty.value = enabled; },
    set enabled( value ) { this.setEnabled( value ); },

    /**
     * Is the picker enabled?
     * @returns {boolean}
     * @public
     */
    getEnabled: function() { return this.enabledProperty.value; },
    get enabled() { return this.getEnabled(); }
  } );

  // mix accessibility into NumberPicker
  AccessibleNumberSpinner.mixInto( NumberPicker );

  return NumberPicker;
} );
