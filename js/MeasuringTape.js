// Copyright 2002-2014, University of Colorado Boulder

/**
 * Measuring tape
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Siddhartha Chinthapally (ActualConcepts)
 * @author Aaron Davis (PhET)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  var Image = require( 'SCENERY/nodes/Image' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // images
  var measuringTapeImage = require( 'image!SCENERY_PHET/measuringTape.png' );

  // constants
  var FONT = new PhetFont( 16 );

  /**
   * Constructor for the measuring tape
   * @param {Bounds2} layoutBounds of the simulation
   * @param {Property.<number>} scaleProperty
   * @param {Property.<string>} unitsProperty should take values 'english' or 'metric'
   * @constructor
   */
  function MeasuringTape( layoutBounds, scaleProperty, unitsProperty, options ) {
    var measuringTape = this;
    Node.call( this );
    this.prevScale = 1;
    this.options = _.extend( {
      x: 0,
      y: 0,
      tipX: 73.5,
      tipY: 0,
      scale: 1,
      length: 73.5,
      lengthDefault: 73.5,
      initialValue: 50000,
      precision: 2,
      lineColor: 'gray',
      tipColor: 'rgba(0,0,0,0)',
      tipRadius: 15,
      plusColor: '#E05F20',
      initialAngle: 0
    }, options );

    this.unitsProperty = unitsProperty;

    // add base of tape and not base node
    this.base = new Node( { children: [ new Image( measuringTapeImage ) ], scale: 0.8 } );
    this.addChild( this.base );
    this.centerRotation = new Vector2( measuringTape.base.getWidth(), measuringTape.base.getHeight() );
    this.notBase = new Node();

    // initialize angle
    this.angle = this.options.initialAngle;

    // init drag and drop for measuring tape
    var clickYOffset, clickXOffset, v;
    var currentlyDragging = '';
    this.base.cursor = 'pointer';
    this.base.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        currentlyDragging = 'base';
        var y0 = measuringTape.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
        var x0 = measuringTape.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;
        var h = measuringTape.centerRotation.timesScalar( Math.cos( measuringTape.angle / 2 ) ).rotated( measuringTape.angle / 2 );
        v = measuringTape.centerRotation.plus( h.minus( measuringTape.centerRotation ).multiply( 2 ) );
        clickYOffset = y0 - v.y;
        clickXOffset = x0 - v.x;
      },
      drag: function( e ) {
        if ( currentlyDragging !== 'base' ) {
          return;
        }
        var x = measuringTape.globalToParentPoint( e.pointer.point ).x - clickXOffset;
        var y = measuringTape.globalToParentPoint( e.pointer.point ).y - clickYOffset;

        x = ( x < layoutBounds.left ) ? layoutBounds.left : ( x > layoutBounds.right ) ? layoutBounds.right : x;
        y = ( y < layoutBounds.top + 10 ) ? layoutBounds.top + 10 : ( y > layoutBounds.bottom ) ? layoutBounds.bottom : y;

        measuringTape.translate( x, y, v );
      }
    } ) );

    // add line
    this.line = new Path( new Shape().moveTo( 0, 0 ).lineTo( 0, 0 ), {stroke: this.options.lineColor, lineWidth: 2} );
    this.notBase.addChild( this.line );

    // add center point
    var size = 5;
    this.mediator = new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {stroke: this.options.plusColor, lineWidth: 2} );
    this.notBase.addChild( this.mediator );

    // add tip
    this.tip = new Node( { children:
      [
        new Circle( this.options.tipRadius, {fill: this.options.tipColor} ),
        new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {stroke: this.options.plusColor, lineWidth: 2} )
      ] } );
    this.tip.cursor = 'pointer';
    this.tip.touchArea = this.tip.localBounds.dilatedXY( 10, 10 );
    this.notBase.addChild( this.tip );

    // init drag and drop for tip
    this.tip.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        currentlyDragging = 'tip';
        clickYOffset = measuringTape.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
        clickXOffset = measuringTape.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;
      },
      drag: function( e ) {
        if ( currentlyDragging !== 'tip' ) {
          return;
        }
        var y = measuringTape.globalToParentPoint( e.pointer.point ).y - clickYOffset;
        var x = measuringTape.globalToParentPoint( e.pointer.point ).x - clickXOffset;
        // return to previous angle
        measuringTape.rotate( -measuringTape.angle );
        // set new angle
        measuringTape.angle = Math.atan2( y, x );
        measuringTape.rotate( measuringTape.angle );
        measuringTape.setTip( x, y );
      }
    } ) );

    // add text
    this.text = new Text( '', { font: FONT, fontWeight: 'bold', fill: 'white', pickable: false, x: -75, y: 20 } );
    this.notBase.addChild( this.text );

    this.addChild( this.notBase );

    unitsProperty.link( function( data ) {
      measuringTape.text.setText( measuringTape.getText( data ) );
    } );

    scaleProperty.link( function( newScale ) {
      measuringTape.scale( newScale );
    } );

    // draw the tape at the correct position
    measuringTape.resetTape();
  }

  return inherit( Node, MeasuringTape, {

    /**
     * Resets the tape rotation, translation, and tip. Call this after adjusting tape options to redraw correctly.
     */
    resetTape: function() {
      this.rotate( -this.angle );
      this.translate( this.options.x, this.options.y );
      this.setTip( this.options.lengthDefault, 0 );
      this.base.setTranslation( -this.centerRotation.x + this.options.x, -this.centerRotation.y + this.options.y );
    },

    getText: function( unitData ) {
      var multiplier = this.options.initialValue / this.options.lengthDefault;
      return ( this.options.length * multiplier * unitData.multiplier ).toFixed( this.options.precision ) + ' ' + unitData.name;
    },

    rotate: function( angle ) {
      this.base.rotateAround( new Vector2( this.notBase.x, this.notBase.y ), angle );
    },

    scale: function( scale ) {
      this.options.lengthDefault *= 1 / this.prevScale;
      this.options.lengthDefault *= scale;
      this.setTip( this.options.tipX / this.prevScale, this.options.tipY / this.prevScale );
      this.setTip( this.options.tipX * scale, this.options.tipY * scale );
      this.prevScale = scale;
    },

    setTip: function( x, y ) {
      this.options.length = Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );
      this.line.setShape( new Shape().moveTo( 0, 0 ).lineTo( x, y ) );
      this.text.setText( this.getText( this.unitsProperty.get() ) );
      this.tip.setTranslation( x, y );
      this.options.tipX = x;
      this.options.tipY = y;
    },

    translate: function( x, y, v ) {
      this.notBase.setTranslation( x, y );
      v = v || new Vector2( 0, 0 );
      this.base.setTranslation( x - v.x, y - v.y );
    },

    reset: function() {
      this.angle = 0;
      this.base.setRotation( this.angle );
      this.resetTape();
    }
  } );
} );