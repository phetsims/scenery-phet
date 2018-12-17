// Copyright 2013-2018, University of Colorado Boulder

/**
 * GaugeNode is a circular gauge that depicts some dynamic value.
 * This was originally ported from the speedometer node in forces-and-motion-basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author John Blanco (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Property.<number>} valueProperty which is portrayed
   * @param {string} label label to display (scaled to fit if necessary)
   * @param {Range} range
   * @param {Object} [options]
   * @constructor
   */
  function GaugeNode( valueProperty, label, range, options ) {
    options = _.extend( {
      // Defaults
      radius: 100,
      backgroundFill: 'white',
      backgroundStroke: 'rgb( 85, 85, 85 )',
      backgroundLineWidth: 2,
      anglePerTick: Math.PI * 2 / 4 / 8,

      // defines max width of the label, relative to the radius
      maxLabelWidthScale: 1.3,

      // 8 ticks goes to 9 o'clock (on the left side), and two more ticks appear below that mark.
      // The ticks are duplicated for the right side, and one tick appears in the middle at the top
      numTicks: ( 8 + 2 ) * 2 + 1,

      majorTickLength: 10,
      minorTickLength: 5,
      majorTickLineWidth: 2,
      minorTickLineWidth: 1,

      // Whether or not to display the valueProperty in a NumberDisplay inside the GaugeNode. This is the default but
      // the display can be shown later, see setNumberDisplayVisible()
      numberDisplayVisible: false,

      // options passed to the NumberDisplay, see NumberDisplay for full list of available options
      numberDisplayOptions: {},

      // Determines whether the gauge will be updated when the value changes.
      // Use this to (for example) disable updates while a gauge is not visible.
      updateEnabledProperty: new Property( true ),
      tandem: Tandem.required
    }, options );

    options.numberDisplayOptions = _.extend( {
      font: new PhetFont( 16 ),
      backgroundStroke: 'black',
      align: 'center',
      cornerRadius: 5
    }, options.numberDisplayOptions );

    assert && assert( range instanceof Range, 'range must be of type Range:' + range );
    assert && assert( options.numTicks * options.anglePerTick <= 2 * Math.PI,
      'options.numTicks * options.anglePerTick must be <= 2 * Math.PI. numTicks: ' + options.numTicks +
      ', anglePerTick: ' + options.anglePerTick
    );

    Node.call( this );

    var tandem = options.tandem;

    this.addChild( new Circle( options.radius, {
      fill: options.backgroundFill,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } ) );

    // @private {NumberDisplay} - display for the valueProperty, hidden by default
    this.numberDisplay = new NumberDisplay( valueProperty, range, options.numberDisplayOptions );
    this.addChild( this.numberDisplay );
    this.numberDisplay.center = new Vector2( 0, options.radius / 2 );
    this.setNumberDisplayVisible( options.numberDisplayVisible );

    var foregroundNode = new Node( { pickable: false, tandem: tandem.createTandem( 'foregroundNode' ) } );
    this.addChild( foregroundNode );

    var needle = new Path( Shape.lineSegment( 0, 0, options.radius, 0 ), {
      stroke: 'red',
      lineWidth: 3
    } );
    foregroundNode.addChild( needle );

    var labelNode = new Text( label, {
      font: new PhetFont( 20 ),
      maxWidth: options.radius * options.maxLabelWidthScale,
      tandem: tandem.createTandem( 'labelNode' )
    } ).mutate( {
      centerX: 0,
      centerY: -options.radius / 3
    } );
    foregroundNode.addChild( labelNode );

    var pin = new Circle( 2, { fill: 'black' } );
    foregroundNode.addChild( pin );

    var totalAngle = ( options.numTicks - 1 ) * options.anglePerTick;
    var startAngle = -1 / 2 * Math.PI - totalAngle / 2;
    var endAngle = startAngle + totalAngle;

    var scratchMatrix = new Matrix3();

    var updateNeedle = function() {
      if ( options.updateEnabledProperty.get() ) {
        if ( typeof( valueProperty.get() ) === 'number' ) {
          assert && assert( valueProperty.get() >= 0, 'GaugeNode representing negative values indicates a logic error' );

          needle.visible = true;
          var needleAngle = Util.linear( range.min, range.max, startAngle, endAngle, Math.abs( valueProperty.get() ) );

          // 2d rotation, but reusing our matrix above
          needle.setMatrix( scratchMatrix.setToRotationZ( needleAngle ) );
        }
        else {

          // Hide the needle if there is no value number value to portray.
          needle.visible = false;
        }
      }
    };

    valueProperty.link( updateNeedle );
    options.updateEnabledProperty.link( updateNeedle );

    // Render all of the ticks into two layers (since they have different strokes)
    // see https://github.com/phetsims/energy-skate-park-basics/issues/208
    var bigTicksShape = new Shape();
    var smallTicksShape = new Shape();

    // Add the tick marks
    for ( var i = 0; i < options.numTicks; i++ ) {
      var tickAngle = i * options.anglePerTick + startAngle;

      var tickLength = i % 2 === 0 ? options.majorTickLength : options.minorTickLength;
      var x1 = ( options.radius - tickLength ) * Math.cos( tickAngle );
      var y1 = ( options.radius - tickLength ) * Math.sin( tickAngle );
      var x2 = options.radius * Math.cos( tickAngle );
      var y2 = options.radius * Math.sin( tickAngle );
      if ( i % 2 === 0 ) {
        bigTicksShape.moveTo( x1, y1 );
        bigTicksShape.lineTo( x2, y2 );
      }
      else {
        smallTicksShape.moveTo( x1, y1 );
        smallTicksShape.lineTo( x2, y2 );
      }
    }

    foregroundNode.addChild( new Path( bigTicksShape, { stroke: 'gray', lineWidth: options.majorTickLineWidth } ) );
    foregroundNode.addChild( new Path( smallTicksShape, { stroke: 'gray', lineWidth: options.minorTickLineWidth } ) );
    this.mutate( options );

    // @private
    this.disposeGaugeNode = function() {
      if ( valueProperty.hasListener( updateNeedle ) ) {
        valueProperty.unlink( updateNeedle );
      }

      this.numberDisplay.dispose();
      if ( options.updateEnabledProperty.hasListener( updateNeedle ) ) {
        options.updateEnabledProperty.unlink( updateNeedle );
      }
    };
  }

  sceneryPhet.register( 'GaugeNode', GaugeNode );

  return inherit( Node, GaugeNode, {

    // @public
    dispose: function() {
      this.disposeGaugeNode();
      Node.prototype.dispose.call( this );
    },

    /**
     * Set whether or not the number display inside this GaugeNode is visible.
     * 
     * @public
     * @param {boolean} visible
     */
    setNumberDisplayVisible: function( visible ) {
      if ( visible !== this._numberDisplayVisible ) {
        this._numberDisplayVisible = visible;
        this.numberDisplay.visible = visible;
      }
    },
    set numberDisplayVisible( visible ) { this.setNumberDisplayVisible( visible ); },

    /**
     * Get whether or not the number display inside this GaugeNode is visible.
     * 
     * @public
     * @return {boolean}
     */
    getNumberDisplayVisible: function() {
      return this._numberDisplayVisible;
    },
    get numberDisplayVisible() { return this.getNumberDisplayVisible(); }

  } );
} );