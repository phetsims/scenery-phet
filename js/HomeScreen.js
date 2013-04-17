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

  var HEIGHT = 120;

  function HomeScreen( title, tabs, model ) {
    Node.call( this );

    //iPad doesn't support Century Gothic, so fall back to Futura, see http://wordpress.org/support/topic/font-not-working-on-ipad-browser
    this.textLabel = new Text( title, {fontSize: 42, fontFamily: 'Century Gothic, Futura', fill: 'white', y: 100, centerX: 981 / 2} );
    this.phetLabel = new Text( "PhET", {fontSize: 24, fill: 'yellow', top: 5, left: 5} );
    this.addChild( this.textLabel );
    this.addChild( this.phetLabel );

    var textLabels = [];
    _.each( tabs, function( tab ) {
      textLabels.push( new Text( tab.name, {fontSize: 24, fill: 'white'} ).mutate( {centerY: HEIGHT / 2} ) );
    } );

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

    this.tabsNode = new HBox( {children: tabChildren, spacing: 3} ).mutate( {centerX: 981 / 2, centerY: 400} );
    this.addChild( this.tabsNode );
  }

  inherit( HomeScreen, Node );

  return HomeScreen;
} );