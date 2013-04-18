/**
 * The tab navigation bar at the bottom of the screen.
 * For a single-tabbed sim, it shows the name of the sim at the left and the PhET Logo and options menu at the right.
 * For a multi-tabbed sim, it shows icons for all of the other tabs, with the tab name at the left and the PhET Logo and options menu at the right.
 */
define( function( require ) {
  "use strict";

  var Node = require( 'SCENERY/nodes/Node' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var Layout = require( 'SCENERY_PHET/Layout' );
  var inherit = require( 'PHET_CORE/inherit' );

  function NavigationBar( tabs, model ) {
    var navigationBar = this;
    Node.call( this );

    //Space between the icons and the bottom of the play area
    var verticalPadding = 2;

    //Vertical height of the nav bar
    var height = Layout.navBarHeight;

    var fontSize = 36;

    //Create the text labels once because in this version of Scenery (4/18/2013) they are expensive to create because they must be accurately sized.
    var textLabels = _.map( tabs, function( tab ) {
      return new Text( tab.name, {fontSize: fontSize, fill: 'white', centerY: height / 2} );
    } );
    this.textLabel = new Node();
    this.phetLabel = new Text( "PhET", {fontSize: fontSize, fill: 'yellow', centerY: height / 2, right: Layout.width - 5} );
    this.addChild( this.textLabel );
    this.addChild( this.phetLabel );

    var index = 0;
    var tabChildren = _.map( tabs, function( tab ) {
      tab.index = index++;
      var child = new Node( {children: [tab.icon], cursor: 'pointer'} );
      child.scale( (height - verticalPadding * 2) / tab.icon.height );
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

    //Add the tabs node.  I'm not sure why it must be mutated afterwards, but putting centerX in the constructor options doesn't cause it to end up in the right spot
    this.tabsNode = new HBox( {children: tabChildren, spacing: 7, top: verticalPadding} ).mutate( {centerX: Layout.width / 2} );
    this.addChild( this.tabsNode );

    this.homeIcon = new FontAwesomeNode( 'home', {cursor: 'pointer', fill: '#fff', centerY: height / 2, left: this.tabsNode.right + 15} );
    this.homeIcon.addInputListener( {down: function() { model.home = true; }} );
    this.addChild( this.homeIcon );

    model.link( 'tab', function( value ) {
      navigationBar.textLabel.children = [ textLabels[value] ];
      navigationBar.textLabel.right = navigationBar.tabsNode.left - 15;
    } );
  }

  inherit( NavigationBar, Node );

  return NavigationBar;
} );