define( function( require ) {
  "use strict";

  var Node = require( 'SCENERY/nodes/Node' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );

  var HEIGHT = 40;

  function NavigationBar( tabs, model ) {
    var navigationBar = this;
    this.handleResize = function() {
      var width = 981;
      this.tabsNode.centerX = width / 2;
      this.phetLabel.right = width - 5;
      this.homeIcon.left = this.tabsNode.right + 5;
      this.textLabel.right = this.tabsNode.left - 5;
      this.textLabel.centerY = HEIGHT / 2;
    };
    Node.call( this );

    var textLabels = [];
    _.each( tabs, function( tab ) {
      textLabels.push( new Text( tab.name, {fontSize: 24, fill: 'white', centerY: HEIGHT / 2} ) );
    } );
    this.textLabel = new Node();
    this.phetLabel = new Text( "PhET", {fontSize: 24, fill: 'yellow', centerY: HEIGHT / 2} );
    this.addChild( this.textLabel );
    this.addChild( this.phetLabel );

    var index = 0;
    var tabChildren = [];
    _.each( tabs, function( tab ) {
      tab.index = index++;
      var child = new Node( {children: [tab.icon]} );
      child.scale( HEIGHT / tab.icon.height );
      child.cursor = 'pointer';
      model.link( 'tab', function( t ) {
        child.invalidateBounds();
        child.opacity = t === tab.index ? 1 : 0.5;
      } );
      child.addInputListener( { down: function() {
        model.tab = tab.index;
        model.home = false;
      }} );
      tabChildren.push( child );
    } );

    this.tabsNode = new HBox( {children: tabChildren, spacing: 3} );
    this.addChild( this.tabsNode );

    this.homeIcon = new FontAwesomeNode( 'home', {cursor: 'pointer', fill: '#fff'} );
    this.homeIcon.centerY = HEIGHT / 2;
    this.homeIcon.addInputListener( {down: function() { model.home = true; }} );
    this.addChild( this.homeIcon );

    _.each( tabs, function( tab ) {
      model.link( 'tab', function( value ) {
        navigationBar.textLabel.children = [ textLabels[value] ];
        navigationBar.handleResize();
      } );
    } );
  }

  inherit( NavigationBar, Node );

  return NavigationBar;
} );