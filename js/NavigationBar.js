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

  function NavigationBar( $element, tabs, selectedTabProperty, homePressed ) {
    var navigationBar = this;
    this.handleResize = function() {
      var width = $( window ).width();
      this.tabsNode.centerX = width / 2;
      this.textLabel.right = this.tabsNode.left - 5;
      this.phetLabel.right = width - 5;
      this.homeIcon.left = this.tabsNode.right + 5;
      this.resize( width, HEIGHT );
      this.updateScene();
    };
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
      tab.icon.cursor = 'pointer';
      selectedTabProperty.link( function() {
        tab.icon.invalidateBounds();
        tab.icon.opacity = selectedTabProperty.get() === tab.index ? 1 : 0.5;
      } );
      tab.icon.addInputListener( { down: function() { selectedTabProperty.set( tab.index ); }} );
      tabChildren.push( tab.icon );
    } );

    this.tabsNode = new HBox( {children: tabChildren, spacing: 3} );
    this.addChild( this.tabsNode );

    //Add the home icon, uses font awesome to render it.  The unicode character was looked up in the CSS
    this.homeIcon = new Text( '\uf015', {fontFamily: 'FontAwesome', fontSize: '40px', fill: 'white', centerY: HEIGHT / 2, cursor: 'pointer'} );
    this.homeIcon.addInputListener( {down: homePressed} );
    this.addChild( this.homeIcon );

    _.each( tabs, function( tab ) {
      selectedTabProperty.link( function( m, value ) {
        navigationBar.textLabel.text = tabs[value].name;

        //TODO: could speed it up by just moving the text
        navigationBar.handleResize();
      } );
    } );

    //Fit to the window and render the initial scene
    $( window ).resize( this.handleResize.bind( this ) );
    this.handleResize();
  }

  Inheritance.inheritPrototype( NavigationBar, Scene );

  return NavigationBar;
} );
