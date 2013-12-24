// Copyright 2002-2013, University of Colorado Boulder

/**
 * The gauge node is a scenery node that represents a circular gauge that
 * depicts some dynamic value.  This was originally ported from the
 * speedometer node in forces-and-motion-basics.
 *
 * @author Sam Reid
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  var Circle = require( 'SCENERY/nodes/Circle' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var inherit = require( 'PHET_CORE/inherit' );
  var linear = require( 'DOT/Util' ).linear;
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );

  /**
   * Constructor
   * @param {Property} valueProperty Property<Number> which is portrayed
   * @param {Object} options typical Node layout and display options
   * @param label {String} label to display (scaled to fit if necessary)
   * @param range {Object} contains min and max values that define the range
   * @constructor
   */
  function GaugeNode( valueProperty, label, range, options ) {

    Node.call( this );

    options = _.extend( {
      // Defaults
      radius: 67,
      backgroundFill: 'white',
      backgroundStroke: 'rgb( 85, 85, 85 )',
      backgroundLineWidth: 2,
      anglePerTick: Math.PI * 2 / 4 / 8,

      //8 ticks goes to 9 o'clock (on the left side), and two more ticks appear below that mark.
      //The ticks are duplicated for the right side, and one tick appears in the middle at the top
      numTicks: ( 8 + 2 ) * 2 + 1,

      //Optional property to pass in--if the client provides a updateEnabledProperty then the needle will only be updated when changed and visible (or made visible)
      updateEnabledProperty: new Property( true )
    }, options );
    this.addChild( new Circle( options.radius, {
      fill: options.backgroundFill,
      stroke: options.backgroundStroke,
      lineWidth: options.backgroundLineWidth
    } ) );

    var foregroundNode = new Node( { pickable: false } );
    this.addChild( foregroundNode );

    var needle = new Path( Shape.lineSegment( 0, 0, options.radius, 0 ), { stroke: 'red', lineWidth: 3} );
    foregroundNode.addChild( needle );

    this.label = new Text( label, {font: new PhetFont( 20 )} ).mutate( {centerX: 0, centerY: -options.radius / 3} );
    foregroundNode.addChild( this.label );

    var pin = new Circle( 2, {fill: 'black'} );
    foregroundNode.addChild( pin );

    var totalAngle = (options.numTicks - 1) * options.anglePerTick;
    var startAngle = -1 / 2 * Math.PI - totalAngle / 2;
    var endAngle = startAngle + totalAngle;

    //Update when the velocity changes, but only if the gauge is visible
    var updateNeedle = function() {
      if ( options.updateEnabledProperty.get() ) {
        var needleAngle = linear( range.min, range.max, startAngle, endAngle, Math.abs( valueProperty.get() ) );
        needle.setMatrix( Matrix3.rotation2( needleAngle ) );
      }
    };
    valueProperty.link( updateNeedle );

    //When the gauge is made visible, update the needle
    options.updateEnabledProperty.link( function( visible ) {
      if ( visible ) {
        updateNeedle();
      }
    } );

    //Add the tick marks
    for ( var i = 0; i < options.numTicks; i++ ) {
      var tickAngle = i * options.anglePerTick + startAngle;
      var tickLength = i % 2 === 0 ? 10 : 5;
      var lineWidth = i % 2 === 0 ? 2 : 1;
      var tick = new Path( Shape.lineSegment( (options.radius - tickLength) * Math.cos( tickAngle ),
        (options.radius - tickLength) * Math.sin( tickAngle ),
        options.radius * Math.cos( tickAngle ),
        options.radius * Math.sin( tickAngle ) ),
        { stroke: 'gray', lineWidth: lineWidth } );
      foregroundNode.addChild( tick );
    }

    this.mutate( options );
  }

  return inherit( Node, GaugeNode );
} );