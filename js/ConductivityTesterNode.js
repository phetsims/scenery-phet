// Copyright 2015-2017, University of Colorado Boulder

/**
 * Conductivity tester. Light bulb connected to a battery, with draggable probes.
 * When the probes are both immersed in solution, the circuit is completed, and the bulb glows.
 *
 * @author Andrey Zelenkov (Mlearner)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightBulbNode = require( 'SCENERY_PHET/LightBulbNode' );
  var MinusNode = require( 'SCENERY_PHET/MinusNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector2Property = require( 'DOT/Vector2Property' );

  // images
  var batteryImage = require( 'image!SCENERY_PHET/battery-D-cell.png' );

  // strings
  var shortCircuitString = require( 'string!SCENERY_PHET/shortCircuit' );

  // constants
  var SHOW_TESTER_ORIGIN = false; // draws a red circle at the tester's origin, for debugging
  var SHOW_PROBE_ORIGIN = false; // draws a red circle at the origin of probes, for debugging

  /**
   * @param {Property.<number>} brightnessProperty brightness of bulb varies from 0 (off) to 1 (full on)
   * @param {Property.<Vector2>} locationProperty location of the tester, at bottom-center of the bulb (model coordinate frame)
   * @param {Property.<Vector2>} positiveProbeLocationProperty location of bottom-center of the positive probe (model coordinate frame)
   * @param {Property.<Vector2>} negativeProbeLocationProperty location of bottom-center of the negative probe (model coordinate frame)
   * @param {Object} [options]
   * @constructor
   */
  function ConductivityTesterNode( brightnessProperty, locationProperty, positiveProbeLocationProperty, negativeProbeLocationProperty, options ) {
    Tandem.indicateUninstrumentedCode();

    var self = this;

    options = _.extend( {
      modelViewTransform: ModelViewTransform2.createIdentity(),
      interactive: true, // set to false if you're creating an icon
      bulbImageScale: 0.33,
      batteryImageScale: 0.6,
      // common to both probes
      probeSize: new Dimension2( 20, 68 ), // {Dimension2} probe dimensions, in view coordinates
      probeLineWidth: 0.5,
      probeDragYRange: null, // {DOT.Range} y-axis drag range, relative to locationProperty, in view coordinates. null means no constraint.
      probeCursor: 'pointer',
      // positive probe
      positiveProbeFill: 'red',
      positiveProbeStroke: 'black',
      positiveLabelFill: 'white',
      // negative probe
      negativeProbeFill: 'black',
      negativeProbeStroke: 'black',
      negativeLabelFill: 'white',
      // wires
      wireStroke: 'black',
      wireLineWidth: 1.5,
      bulbToBatteryWireLength: 40, // length of the wire between bulb and battery, in view coordinates
      // short-circuit indicator
      shortCircuitFont: new PhetFont( 14 ),
      shortCircuitFill: 'black'
    }, options );

    // @private bulb, origin at bottom center of base
    this.lightBulbNode = new LightBulbNode( brightnessProperty, {
      bulbImageScale: options.bulbImageScale
    } );

    // @private short-circuit indicator, centered above the light bulb
    assert && assert( brightnessProperty.get() === 0 ); //TODO layout will be wrong if lightBulbNode has rays
    this.shortCircuitNode = new Text( shortCircuitString, {
      font: options.shortCircuitFont,
      fill: options.shortCircuitFill,
      centerX: this.lightBulbNode.centerX,
      bottom: this.lightBulbNode.top,
      visible: false // initial state is no short circuit
    } );

    // battery
    var battery = new Image( batteryImage, {
      scale: options.batteryImageScale,
      left: options.bulbToBatteryWireLength,
      centerY: 0
    } );

    // wire from bulb base to battery
    var bulbBatteryWire = new Path( new Shape().moveTo( 0, 0 ).lineTo( options.bulbToBatteryWireLength, 0 ), {
      stroke: options.wireStroke,
      lineWidth: options.wireLineWidth
    } );

    // apparatus (bulb + battery), origin at bottom center of bulb's base
    var apparatusNode = new Node( {
      children: [
        bulbBatteryWire,
        battery,
        this.lightBulbNode,
        this.shortCircuitNode
      ]
    } );
    if ( SHOW_TESTER_ORIGIN ) {
      apparatusNode.addChild( new Circle( 2, { fill: 'red' } ) );
    }

    // wire from battery terminal to positive probe
    var positiveWire = new WireNode(
      battery.getGlobalBounds().right,
      battery.getGlobalBounds().centerY,
      options.modelViewTransform.modelToViewX( positiveProbeLocationProperty.get().x ) - options.modelViewTransform.modelToViewX( locationProperty.get().x ),
      options.modelViewTransform.modelToViewY( positiveProbeLocationProperty.get().y ) - options.modelViewTransform.modelToViewY( locationProperty.get().y ) - options.probeSize.height,
      { stroke: options.wireStroke, lineWidth: options.wireLineWidth }
    );

    // wire from base of bulb (origin) to negative probe
    var negativeWire = new WireNode(
      -5, -5, // specific to bulb image file
      options.modelViewTransform.modelToViewX( negativeProbeLocationProperty.get().x ) - options.modelViewTransform.modelToViewX( locationProperty.get().x ),
      options.modelViewTransform.modelToViewY( negativeProbeLocationProperty.get().y ) - options.modelViewTransform.modelToViewY( locationProperty.get().y ) - options.probeSize.height,
      { stroke: options.wireStroke, lineWidth: options.wireLineWidth }
    );

    // drag handler for probes
    var clickYOffset = 0;
    var probeDragHandler = new SimpleDragHandler( {

      start: function( e ) {
        clickYOffset = e.currentTarget.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
      },

      // probes move together
      drag: function( e ) {
        // do dragging in view coordinate frame
        var locationView = options.modelViewTransform.modelToViewPosition( locationProperty.get() );
        var yView = e.currentTarget.globalToParentPoint( e.pointer.point ).y + locationView.y - clickYOffset;
        if ( options.probeDragYRange ) {
          yView = Util.clamp( yView, locationView.y + options.probeDragYRange.min, locationView.y + options.probeDragYRange.max );
        }
        // convert to model coordinate frame
        var yModel = options.modelViewTransform.viewToModelY( yView );
        positiveProbeLocationProperty.set( new Vector2( positiveProbeLocationProperty.get().x, yModel ) );
        negativeProbeLocationProperty.set( new Vector2( negativeProbeLocationProperty.get().x, yModel ) );
      }
    } );

    // probes
    var positiveProbe = new ProbeNode( new PlusNode( { fill: options.positiveLabelFill } ), {
      size: options.probeSize,
      fill: options.positiveProbeFill,
      stroke: options.positiveProbeStroke,
      lineWidth: options.probeLineWidth
    } );
    var negativeProbe = new ProbeNode( new MinusNode( { fill: options.negativeLabelFill } ), {
      size: options.probeSize,
      fill: options.negativeProbeFill,
      stroke: options.negativeProbeStroke,
      lineWidth: options.probeLineWidth
    } );
    if ( options.interactive ) {
      positiveProbe.cursor = options.probeCursor;
      positiveProbe.addInputListener( probeDragHandler );
      negativeProbe.cursor = options.probeCursor;
      negativeProbe.addInputListener( probeDragHandler );
    }

    Node.call( this, { children: [ positiveWire, negativeWire, positiveProbe, negativeProbe, apparatusNode ] } );

    // @private when the location changes ...
    this.locationObserver = function( location, oldLocation ) {
      // move the entire tester
      self.translation = options.modelViewTransform.modelToViewPosition( location );
      // probes move with the tester
      if ( oldLocation ) {
        var dx = location.x - oldLocation.x;
        var dy = location.y - oldLocation.y;
        positiveProbeLocationProperty.set( new Vector2( positiveProbeLocationProperty.get().x + dx, positiveProbeLocationProperty.get().y + dy ) );
        negativeProbeLocationProperty.set( new Vector2( negativeProbeLocationProperty.get().x + dx, negativeProbeLocationProperty.get().y + dy ) );
      }
    };
    this.locationProperty = locationProperty; // @private
    this.locationProperty.link( this.locationObserver );

    // @private update positive wire if end point was changed
    this.positiveProbeObserver = function( positiveProbeLocation ) {
      positiveProbe.centerX = options.modelViewTransform.modelToViewX( positiveProbeLocation.x ) - options.modelViewTransform.modelToViewX( self.locationProperty.get().x );
      positiveProbe.bottom = options.modelViewTransform.modelToViewY( positiveProbeLocation.y ) - options.modelViewTransform.modelToViewY( self.locationProperty.get().y );
      positiveWire.setEndPoint( positiveProbe.x, positiveProbe.y - options.probeSize.height );
    };
    this.positiveProbeLocationProperty = positiveProbeLocationProperty; // @private
    this.positiveProbeLocationProperty.link( this.positiveProbeObserver );

    // @private update negative wire if end point was changed
    this.negativeProbeObserver = function( negativeProbeLocation ) {
      negativeProbe.centerX = options.modelViewTransform.modelToViewX( negativeProbeLocation.x ) - options.modelViewTransform.modelToViewX( self.locationProperty.get().x );
      negativeProbe.bottom =  options.modelViewTransform.modelToViewY( negativeProbeLocation.y ) - options.modelViewTransform.modelToViewY( self.locationProperty.get().y );
      negativeWire.setEndPoint( negativeProbe.x, negativeProbe.y - options.probeSize.height );
    };
    this.negativeProbeLocationProperty = negativeProbeLocationProperty; // @private
    this.negativeProbeLocationProperty.link( this.negativeProbeObserver );

    // Since locationProperty determines translation, avoid options related to translation!
    this.mutate( options );
  }

  sceneryPhet.register( 'ConductivityTesterNode', ConductivityTesterNode );

  inherit( Node, ConductivityTesterNode, {

    // @public Ensures that this object is eligible for GC
    dispose: function() {

      // unlink from axon properties
      this.locationProperty.unlink( this.locationObserver );
      this.positiveProbeLocationProperty.unlink( this.positiveProbeObserver );
      this.negativeProbeLocationProperty.unlink( this.negativeProbeObserver );

      // dispose of sub-components
      this.lightBulbNode.dispose();
      this.lightBulbNode = null;

      Node.prototype.dispose.call( this );
    },

    // @public @override
    setVisible: function( visible ) {
      Node.prototype.setVisible.call( this, visible );
      this.lightBulbNode.visible = visible; // to prevent light from updating when invisible
    },

    /**
     * Determines whether 'Short circuit' is shown above the light bulb. Note that it is the client's responsibility
     * to ensure that the bulb's brightness (as set by brightnessProperty) is appropriate for a short circuit.
     * @param {boolean} value
     * @public
     */
    set shortCircuit( value ) { this.shortCircuitNode.visible = value; },

    /**
     * Is 'Short circuit' shown above the light bulb?
     * @returns {boolean}
     * @public
     */
    get shortCircuit() { return this.shortCircuitNode.visible; }
  } );

  /**
   * Conductivity probe, origin at bottom center.
   *
   * @param {Node} labelNode
   * @param {Object} [options]
   * @constructor
   */
  function ProbeNode( labelNode, options ) {

    options = _.extend( {
      size: new Dimension2( 20, 60 ),
      fill: 'white',
      stroke: 'black',
      lineWidth: 1.5
    }, options );

    Node.call( this );

    // plate
    var plateNode = new Rectangle( -options.size.width / 2, -options.size.height, options.size.width, options.size.height, {
      fill: options.fill,
      stroke: options.stroke,
      lineWidth: options.lineWidth
    } );

    // scale the label to fix, place it towards bottom center
    labelNode.setScaleMagnitude( 0.5 * options.size.width / labelNode.width );
    labelNode.centerX = plateNode.centerX;
    labelNode.bottom = plateNode.bottom - 10;

    // rendering order
    this.addChild( plateNode );
    this.addChild( labelNode );
    if ( SHOW_PROBE_ORIGIN ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
    }

    // expand touch area
    this.touchArea = this.localBounds.dilatedXY( 10, 10 );

    this.mutate( options );
  }

  inherit( Node, ProbeNode );

  /**
   * Wires that connect to the probes.
   *
   * @param startX
   * @param startY
   * @param endX
   * @param endY
   * @param {Object} [options]
   * @constructor
   */
  function WireNode( startX, startY, endX, endY, options ) {

    Path.call( this, null );

    this.startPoint = { x: startX, y: startY }; // @private
    // control point offsets for when probe is to left of light bulb
    this.controlPointOffset = { x: 30, y: -50 }; // @private
    if ( endX < startX ) {
      // probe is to right of light bulb, flip sign on control point x-offset
      this.controlPointOffset.x = -this.controlPointOffset.x;
    }

    this.setEndPoint( endX, endY );

    this.mutate( options );
  }

  inherit( Path, WireNode, {

    // @private Sets the end point coordinates, the point attached to the probe.
    setEndPoint: function( endX, endY ) {

      var startX = this.startPoint.x;
      var startY = this.startPoint.y;
      var controlPointXOffset = this.controlPointOffset.x;
      var controlPointYOffset = this.controlPointOffset.y;

      this.setShape( new Shape()
          .moveTo( startX, startY )
          .cubicCurveTo( startX + controlPointXOffset, startY, endX, endY + controlPointYOffset, endX, endY )
      );
    }
  } );

  /**
   * Convenience function for creating an icon.
   * @param {number} brightness 0-1 (off to full on)
   * @param {number} positiveProbeXOffset x-offset of the positive probe, relative to the bulb's tip
   * @param {number} negativeProbeXOffset x-offset of the negative probe, relative to the bulb's tip
   * @param {number} bothProbesYOffset y-offset of both probes, relative to the bulb's tip
   * @param {Object} [options] same options as ConductivityTesterNode constructor
   * @returns {ConductivityTesterNode}
   */
  ConductivityTesterNode.createIcon = function( brightness, positiveProbeXOffset, negativeProbeXOffset, bothProbesYOffset, options ) {

    options = options || {};
    options.interactive = false;

    return new ConductivityTesterNode(
      new Property( brightness ),
      new Vector2Property( new Vector2( 0, 0 ) ),
      new Vector2Property( new Vector2( positiveProbeXOffset, bothProbesYOffset ) ),
      new Vector2Property( new Vector2( negativeProbeXOffset, bothProbesYOffset ) ),
      options
    );
  };

  return ConductivityTesterNode;
} );
