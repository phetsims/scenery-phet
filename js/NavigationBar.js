define( function( require ) {
  "use strict";

  var Image = require( 'SCENERY/nodes/Image' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var DOM = require( 'SCENERY/nodes/DOM' );
  var Node = require( 'SCENERY/nodes/Node' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Scene = require( 'SCENERY/Scene' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Inheritance = require( 'PHETCOMMON/util/Inheritance' );

  var HEIGHT = 40;

  function NavigationBar( $element, tabs, selectedTabProperty ) {
    var navigationBar = this;
    Scene.call( this, $element, {width: 1, height: 1, allowDevicePixelRatioScaling: true} );

    this.initializeStandaloneEvents(); // sets up listeners on the document with preventDefault(), and forwards those events to our scene

    this.textLabel = new Text( "Tug of War", {fontSize: 24, fill: 'white'} ).mutate( {centerY: HEIGHT / 2} );
    this.phetLabel = new Text( "PhET", {fontSize: 24, fill: 'yellow'} ).mutate( {centerY: HEIGHT / 2} );
    this.addChild( this.textLabel );
    this.addChild( this.phetLabel );

    var index = 0;
    var tabChildren = [];
    _.each( tabs, function( tab ) {
      tab.index = index++;
      tab.icon.scale( HEIGHT / tab.icon.height );
      tab.icon.paintCanvas = function( state ) {
        console.log( selectedTabProperty.get() );
        state.layer.context.globalAlpha = selectedTabProperty.get() === tab.index ? 1.0 : 0.5;
        Image.prototype.paintCanvas.call( tab.icon, state );
        state.layer.context.globalAlpha = 1.0;
      };
      tab.icon.cursor = 'pointer';
      selectedTabProperty.link( function() {
        tab.icon.invalidateBounds();
        tab.icon.invalidatePaint();
      } );
      tab.icon.addInputListener( { down: function() { selectedTabProperty.set( tab.index ); }} );
      tabChildren.push( tab.icon );
    } );

    this.tabsNode = new HBox( {children: tabChildren, spacing: 3} );
    this.addChild( this.tabsNode );

    this.handleResize = function() {
      var width = $( window ).width();
      navigationBar.tabsNode.centerX = width / 2;
      navigationBar.textLabel.right = navigationBar.tabsNode.left - 5;
      navigationBar.phetLabel.right = width - 5;
      navigationBar.resize( width, HEIGHT );
      navigationBar.updateScene();
    };

    //Fit to the window and render the initial scene
    $( window ).resize( this.handleResize.bind( this ) );
    this.handleResize();
  }

  Inheritance.inheritPrototype( NavigationBar, Scene );

  return NavigationBar;
} );