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
  var inherit = require( 'PHET_CORE/inherit' );

  function HomeScreen( imageLoader, $element, tabs, selectedTabProperty ) {
    var homeScreen = this;
    Node.call( this );

    this.textLabel = new Text( "Forces and Motion: Basics", {fontSize: 42, fontFamily: 'Century Gothic', fill: 'white', y: 100} );
    this.phetLabel = new Text( "PhET", {fontSize: 24, fill: 'yellow'} ).mutate( {top: 5} );
    this.addChild( this.textLabel );
    this.addChild( this.phetLabel );

    this.handleResize = function() {
      var width = $( window ).width();
      var height = $( window ).height();
      homeScreen.textLabel.centerX = width / 2;
      homeScreen.phetLabel.left = 5;
    };

    //Fit to the window and render the initial scene
    $( window ).resize( this.handleResize.bind( this ) );
    this.handleResize();
  }

  inherit( HomeScreen, Node );

  return HomeScreen;
} );