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

  function NavigationBar( tabs, model ) {
    var navigationBar = this;
    this.handleResize = function() {
      var width = $( window ).width();
      this.tabsNode.centerX = width / 2;
      this.phetLabel.right = width - 5;
      this.homeIcon.left = this.tabsNode.right + 5;
      this.textLabel.right = this.tabsNode.left - 5;
    };
    Node.call( this );

    var textLabels = [];
    _.each( tabs, function( tab ) {
      textLabels.push( new Text( tab.name, {fontSize: 24, fill: 'white'} ).mutate( {centerY: HEIGHT / 2} ) );
    } );
    this.textLabel = new Node();
    this.phetLabel = new Text( "PhET", {fontSize: 24, fill: 'yellow'} ).mutate( {centerY: HEIGHT / 2} );
    this.addChild( this.textLabel );
    this.addChild( this.phetLabel );

    var index = 0;
    var tabChildren = [];
    _.each( tabs, function( tab ) {
      tab.index = index++;
      tab.icon.scale( HEIGHT / tab.icon.height );
      tab.icon.cursor = 'pointer';
      model.link( 'tab', function( m, t ) {
        tab.icon.invalidateBounds();
        tab.icon.opacity = t === tab.index ? 1 : 0.5;
      } );
      tab.icon.addInputListener( { down: function() {
        model.tab = tab.index;
        model.home = false;
      }} );
      tabChildren.push( tab.icon );
    } );

    this.tabsNode = new HBox( {children: tabChildren, spacing: 3} );
    this.addChild( this.tabsNode );

    //Add the home icon, uses font awesome to render it.  The unicode character was looked up in the CSS
    //Use 'svg' here so that the font will update when font awesome loads.  TODO: also update the bounds when the font loads
    this.homeIcon = new Text( '\uf015', {fontFamily: 'FontAwesome', fontSize: '40px', fill: 'white', centerY: HEIGHT / 2, cursor: 'pointer', renderer: 'svg'} );
    this.homeIcon.addInputListener( {down: function() { model.home = true; }} );
    this.addChild( this.homeIcon );

    _.each( tabs, function( tab ) {
      model.link( 'tab', function( m, value ) {
        navigationBar.textLabel.children = [ textLabels[value] ];
        navigationBar.handleResize();
      } );
    } );
  }

  Inheritance.inheritPrototype( NavigationBar, Scene );

  return NavigationBar;
} );