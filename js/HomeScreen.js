define( function( require ) {
  "use strict";

  var Node = require( 'SCENERY/nodes/Node' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Layout = require( 'SCENERY_PHET/Layout' );

  var HEIGHT = 120;

  function HomeScreen( title, tabs, model ) {
    Node.call( this );

    //iPad doesn't support Century Gothic, so fall back to Futura, see http://wordpress.org/support/topic/font-not-working-on-ipad-browser
    this.textLabel = new Text( title, {fontSize: 42, fontFamily: 'Century Gothic, Futura', fill: 'white', y: 100, centerX: 981 / 2} );
    this.phetLabel = new Text( "PhET", {fontSize: 24, fill: 'yellow', top: 5, left: 5} );
    this.addChild( this.textLabel );
    this.addChild( this.phetLabel );

    var textLabels = _.map( tabs, function( tab ) {
      return new Text( tab.name, {fontSize: 24, fill: 'white'} ).mutate( {centerY: HEIGHT / 2} );
    } );

    var index = 0;
    var tabChildren = _.map( tabs, function( tab ) {
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
      return child;
    } );

    this.tabsNode = new HBox( {children: tabChildren, spacing: 3} ).mutate( {centerX: Layout.WIDTH / 2, centerY: Layout.HEIGHT / 2} );
    this.addChild( this.tabsNode );
  }

  inherit( HomeScreen, Node );

  return HomeScreen;
} );