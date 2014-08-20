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

  // strings
  var feetString = require( 'string!SCENERY_PHET/feet' );
  var metersString = require( 'string!SCENERY_PHET/meters' );

  // constants
  var FONT = new PhetFont( 16 );

  /**
   * Constructor for the measuring tape
   * @param {Bounds2} layoutBounds of the simulation
   * @param {Property<Number>} scaleProperty
   * @param {Property<String>} unitsProperty should take values 'english' or 'metric'
   * @constructor
   */
  function MeasuringTape( layoutBounds, scaleProperty, unitsProperty, options ) {
    var measuringTape = this;
    Node.call( this );
    this.prevScale = 1;
    this.options = _.extend( {
      initialMeasuringTapePosition: new Vector2(),
      tipX: 73.5,
      tipY: 0,
      scale: 1,
      length: 73.5,
      lengthDefault: 73.5,
      precision: 2
    }, options );

    this.unitsProperty = unitsProperty;

    // add base of tape and not base node
    this.base = new Node( { children: [ new Image( measuringTapeImage ) ], scale: 0.8 } );
    this.addChild( this.base );
    this.centerRotation = new Vector2( measuringTape.base.getWidth(), measuringTape.base.getHeight() );
    this.notBase = new Node();
    // init drag and drop for measuring tape
    var clickYOffset;
    var clickXOffset;
    this.angle = 0;
    var v;
    var currentlyDragging = '';
    this.base.cursor = 'pointer';
    this.base.addInputListener( new SimpleDragHandler( {
      start: function( e ) {
        currentlyDragging = 'base';
        var h;
        var y0 = measuringTape.globalToParentPoint( e.pointer.point ).y - e.currentTarget.y;
        var x0 = measuringTape.globalToParentPoint( e.pointer.point ).x - e.currentTarget.x;
        h = measuringTape.centerRotation.timesScalar( Math.cos( measuringTape.angle / 2 ) ).rotated( measuringTape.angle / 2 );
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
    this.line = new Path( new Shape().moveTo( 0, 0 ).lineTo( 0, 0 ), {stroke: 'black', lineWidth: 2} );
    this.notBase.addChild( this.line );

    // add center point
    var size = 5;
    this.mediator = new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {stroke: '#E05F20', lineWidth: 2} );
    this.notBase.addChild( this.mediator );

    // add tip
    this.tip = new Node( {children: [new Circle( 8, {fill: 'black'} ), new Path( new Shape().moveTo( -size, 0 ).lineTo( size, 0 ).moveTo( 0, -size ).lineTo( 0, size ), {stroke: '#E05F20', lineWidth: 2} )]} );
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
      if ( data === 'metric' ) {
        measuringTape.text.setText( measuringTape.getText().toFixed( 2 ) + ' ' + metersString )
      }
      else {
        measuringTape.text.setText( ( measuringTape.getText() * 3.28 ).toFixed( 2 ) + ' ' + feetString );
      }
    } );

    // Inital position for tape
    measuringTape.initTape( measuringTape.options, this.angle );

    scaleProperty.link( function( newScale ) {
      measuringTape.scale( newScale );
    } );
  }

  return inherit( Node, MeasuringTape, {

    // init tape
    initTape: function( option, angle ) {
      this.rotate( -angle );
      this.translate( option.initialMeasuringTapePosition.x, option.initialMeasuringTapePosition.y );
      this.setTip( option.lengthDefault, 0 );
      this.base.setTranslation( -this.centerRotation.x + option.initialMeasuringTapePosition.x, -this.centerRotation.y + option.initialMeasuringTapePosition.y );
    },

    // return text(length)
    getText: function() {
      return this.options.length.toFixed( 2 ) / 10;
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
      if ( this.unitsProperty.get() === 'metric' ) {
        this.text.setText( this.getText().toFixed( this.options.precision ) + ' ' + metersString );
      }
      else {
        this.text.setText( ( this.getText() * 3.28 ).toFixed( this.options.precision ) + ' ' + feetString )
      }
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
      this.initTape( this.options, this.angle );
      this.base.setRotation( this.angle );
    }
  } );
} );