// Copyright 2002-2015, University of Colorado Boulder

/**
 * View for the "LightSensorNode" screen, a demo of LightSensorNode.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Line = require( 'SCENERY/nodes/Line' );
  var PropertySet = require( 'AXON/PropertySet' );
  var LightSensorNode = require( 'SCENERY_PHET/LightSensorNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var HSlider = require( 'SUN/HSlider' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Panel = require( 'SUN/Panel' );

  /**
   * @constructor
   */
  function LightSensorNodeView() {

    var lightSensorNodeView = this;

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 1024, 618 ) } );

    // Layer for the light sensor node.  The node will be destroyed and re-created when its parameters change
    var lightSensorNodeLayer = new Node();

    // Model properties that describe the sensor
    var propertySet = new PropertySet( {
      width: LightSensorNode.DEFAULTS.width,
      height: LightSensorNode.DEFAULTS.height
    } );

    // When the model properties change, update the sensor node
    var updateLightSensor = function() {
      lightSensorNodeLayer.removeAllChildren();
      lightSensorNodeLayer.addChild( new LightSensorNode( {
        width: propertySet.width,
        height: propertySet.height,

        x: lightSensorNodeView.layoutBounds.width / 2,
        y: lightSensorNodeView.layoutBounds.height / 2
      } ) );
    };
    propertySet.widthProperty.link( updateLightSensor );
    propertySet.heightProperty.link( updateLightSensor );
    this.addChild( lightSensorNodeLayer );

    // Show a cross hairs in the middle of the screen so that we can make sure the sensor origin is correct.
    this.addChild( new Line( -1000, this.layoutBounds.centerY, 3000, this.layoutBounds.centerY, { stroke: 'black' } ) );
    this.addChild( new Line( this.layoutBounds.centerX, -1000, this.layoutBounds.centerX, 3000, { stroke: 'black' } ) );

    // Controls
    this.addChild( new Panel( new VBox( {

      // Don't readjust the size when the slider knob moves all the way to the right 
      resize: false,
      children: [
        new Text( 'Width' ),
        new HSlider( propertySet.widthProperty, { min: 1, max: LightSensorNode.DEFAULTS.width * 2 } ),

        new Text( 'Height' ),
        new HSlider( propertySet.heightProperty, { min: 1, max: LightSensorNode.DEFAULTS.height * 2 } )
      ]
    } ), {
      xMargin: 20,
      yMargin: 20,

      // Don't readjust the size when the slider knob moves all the way to the right
      resize: false,

      // Bottom left of the play area
      left: 50,
      bottom: this.layoutBounds.maxY - 50
    } ) );

    // Reset All button, bottom right
    this.addChild( new ResetAllButton( {
      listener: function() {
        propertySet.reset();
      },
      right: this.layoutBounds.maxX - 15,
      bottom: this.layoutBounds.maxY - 15
    } ) );
  }

  return inherit( ScreenView, LightSensorNodeView );
} );
