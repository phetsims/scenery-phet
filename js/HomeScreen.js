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

  function HomeScreen( imageLoader, $element, tabs, selectedTabProperty ) {
    var homeScreen = this;
    Scene.call( this, $element, {width: 1, height: 1, allowDevicePixelRatioScaling: true} );

    this.initializeStandaloneEvents(); // sets up listeners on the document with preventDefault(), and forwards those events to our scene

    this.textLabel = new Text( "Tug of War", {fontSize: 24, fill: 'white'} ).mutate( {centerY: HEIGHT / 2} );
    this.phetLabel = new Text( "PhET", {fontSize: 24, fill: 'yellow'} ).mutate( {centerY: HEIGHT / 2} );
    this.addChild( this.textLabel );
    this.addChild( this.phetLabel );

    var index = 0;
    var tabChildren = [];
    this.handleResize = function() {
      var width = $( window ).width();
      var height = $( window ).height();
      homeScreen.textLabel.right = 0;
      homeScreen.phetLabel.left = 5;
      homeScreen.resize( width, height );
      homeScreen.updateScene();
    };

    //Fit to the window and render the initial scene
    $( window ).resize( this.handleResize.bind( this ) );
    this.handleResize();
  }

  Inheritance.inheritPrototype( HomeScreen, Scene );
  HomeScreen.prototype.step = function() {};

  return HomeScreen;
} );