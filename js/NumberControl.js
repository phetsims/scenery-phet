// Copyright 2015, University of Colorado Boulder

/**
 * Control for changing a Property of type {number}.
 * Consists of a labeled value, slider and arrow buttons.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SUN/buttons/ArrowButton' );
  var Color = require( 'SCENERY/util/Color' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TandemText = require( 'TANDEM/scenery/nodes/TandemText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var numberControlPattern0Value1UnitsString = require( 'string!SCENERY_PHET/NumberControl.pattern_0value_1units' );

  /**
   * @param {string} title
   * @param {Property.<number>} numberProperty
   * @param {Range} numberRange
   * @param {Object} [options]
   * @constructor
   */
  function NumberControl( title, numberProperty, numberRange, options ) {

    options = _.extend( {

      startCallback: function() {}, // called when interaction begins
      endCallback: function() {}, // called when interaction ends
      enabledProperty: new Property( true ), // {Property.<boolean>} is this control enabled?
      disabledOpacity: 0.5, // {number} opacity used to make the control look disabled

      // title
      titleFont: new PhetFont( 12 ),
      titleMaxWidth: null, // {null|string} maxWidth to use for title, to constrain width for i18n

      // value
      valueFont: new PhetFont( 12 ),
      valueMaxWidth: null, // {null|string} maxWidth to use for value display, to constrain width for i18n
      decimalPlaces: 0,
      units: null,

      // arrow buttons
      delta: 1,

      // slider
      majorTicks: [], // array of objects with these fields: { value: {number}, label: {Node} }
      minorTickSpacing: 0, // zero indicates no minor ticks
      trackSize: new Dimension2( 180, 3 ),
      thumbSize: new Dimension2( 17, 34 ),
      majorTickLength: 20,
      minorTickStroke: 'rgba( 0, 0, 0, 0.3 )',
      thumbFillEnabled: 'green',

      tandem: null

    }, options );

    options.thumbFillHighlighted = options.thumbFillHighlighted || Color.toColor( options.thumbFillEnabled ).brighterColor();

    // validate options
    assert && assert( options.disabledOpacity > 0 && options.disabledOpacity < 1, 'invalid disabledOpacity: ' + options.disabledOpacity );
    Tandem.validateOptions( options ); // The tandem is required when brand==='phet-io'

    var thisNode = this;

    var delta = options.delta; // to improve readability

    var titleNode = new TandemText( title, {
      font: options.titleFont,
      maxWidth: options.titleMaxWidth,
      tandem: options.tandem && options.tandem.createTandem( 'titleNode' )
    } );

    // if units were provided, fill in the {1} units, but leave the {0} value alone.
    var valuePattern = options.units ? StringUtils.format( numberControlPattern0Value1UnitsString, '{0}', options.units ) : '{0}';

    var numberDisplay = new NumberDisplay( numberProperty, numberRange, {
      valuePattern: valuePattern,
      font: options.valueFont,
      decimalPlaces: options.decimalPlaces,
      maxWidth: options.valueMaxWidth,
      tandem: options.tandem && options.tandem.createTandem( 'numberDisplay' )
    } );

    var arrowButtonOptions = {
      delta: options.delta,
      startCallback: options.startCallback,
      endCallback: options.endCallback,
      scale: 0.85
    };

    var leftArrowButton = new ArrowButton( 'left', function() {
      var value = numberProperty.get() - delta;
      value = Util.roundSymmetric( value / delta ) * delta; // constrain to delta
      value = Math.max( value, numberRange.min ); // constrain to range
      numberProperty.set( value );
    }, _.extend( {
      tandem: options.tandem && options.tandem.createTandem( 'leftArrowButton' )
    }, arrowButtonOptions ) );

    var rightArrowButton = new ArrowButton( 'right', function() {
      var value = numberProperty.get() + delta;
      value = Util.roundSymmetric( value / delta ) * delta; // constrain to delta
      value = Math.min( value, numberRange.max ); // constrain to range
      numberProperty.set( value );
    }, _.extend( {
      tandem: options.tandem && options.tandem.createTandem( 'rightArrowButton' )
    }, arrowButtonOptions ) );

    var arrowEnabledListener = function( value ) {
      leftArrowButton.enabled = ( value > numberRange.min );
      rightArrowButton.enabled = ( value < numberRange.max );
    };
    numberProperty.link( arrowEnabledListener );

    var slider = new HSlider( numberProperty, numberRange, _.extend( {
      startDrag: options.startCallback,
      endDrag: options.endCallback,
      constrainValue: function( value ) {
        // constrain to delta
        value = Util.roundSymmetric( value / options.delta ) * options.delta;
        // constrain to range
        return numberRange.constrainValue( value );
      }
    }, options, {

      // This uses a 3-arg extend so that the tandem is overriden properly
      tandem: options.tandem && options.tandem.createTandem( 'slider' )
    } ) );

    // major ticks
    var majorTicks = options.majorTicks;
    for ( var i = 0; i < majorTicks.length; i++ ) {
      slider.addMajorTick( majorTicks[ i ].value, majorTicks[ i ].label );
    }

    // minor ticks, exclude values where we already have major ticks
    if ( options.minorTickSpacing > 0 ) {
      for ( var minorTickValue = numberRange.min; minorTickValue <= numberRange.max; ) {
        if ( !_.find( majorTicks, function( majorTick ) { return majorTick.value === minorTickValue; } ) ) {
          slider.addMinorTick( minorTickValue );
        }
        minorTickValue += options.minorTickSpacing;
      }
    }

    options.spacing = 5;
    options.resize = false; // workaround for slider
    options.children = [
      new HBox( {
        spacing: 5,
        children: [ titleNode, numberDisplay ]
      } ),
      new HBox( {
        spacing: 15,
        resize: false,
        children: [ leftArrowButton, slider, rightArrowButton ]
      } )
    ];
    VBox.call( this, options );

    // enabled/disable this control
    this.enabledProperty = options.enabledProperty; // @public
    var enabledObserver = function( enabled ) {
      thisNode.pickable = enabled;
      thisNode.opacity = enabled ? 1.0 : options.disabledOpacity;
      //TODO if !enabled, cancel any interaction that is in progress, see scenery#218
    };
    this.enabledProperty.link( enabledObserver );

    // @private
    this.disposeNumberControl = function() {
      numberDisplay.dispose();
      numberProperty.unlink( arrowEnabledListener );
      thisNode.enabledProperty.unlink( enabledObserver );
      slider.dispose();
      options.tandem && options.tandem.removeInstance( this );
    };

    options.tandem && options.tandem.addInstance( this );
  }

  sceneryPhet.register( 'NumberControl', NumberControl );

  return inherit( VBox, NumberControl, {

    // @public
    dispose: function() {
      this.disposeNumberControl();
      VBox.prototype.dispose.call( this );
    },

    // @public
    setEnabled: function( enabled ) { this.enabledProperty.set( enabled ); },
    set enabled( value ) { this.setEnabled( value ); },

    // @public
    getEnabled: function() { return this.enabledProperty.get(); },
    get enabled() { return this.getEnabled(); }

  }, {

    /**
     * Creates a NumberControl with default tick marks for min and max values.
     * @param {string} label
     * @param {Property.<number>} property
     * @param {Range} range
     * @param {Object} [options]
     * @returns {NumberControl}
     * @static
     * @public
     */
    withMinMaxTicks: function( label, property, range, options ) {

      options = _.extend( {
        tickLabelFont: new PhetFont( 12 )
      }, options );

      options.majorTicks = [
        { value: range.min, label: new Text( range.min, { font: options.tickLabelFont } ) },
        { value: range.max, label: new Text( range.max, { font: options.tickLabelFont } ) }
      ];

      return new NumberControl( label, property, range, options );
    }
  } );
} );
