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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
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
    this.textLabel = new Node();
    this.phetLabel = new Text( "PhET", {fontSize: fontSize, fill: 'yellow', centerY: height / 2, right: Layout.width - 5} );
    this.addChild( this.textLabel );
    this.addChild( this.phetLabel );

    //Create the nodes to be used for the tab icons
    var index = 0;
    var tabChildren = _.map( tabs, function( tab ) {
      tab.index = index++;
      var child = new Node( {children: [tab.icon], cursor: 'pointer'} );
      child.tab = tab;
      child.scale( (height - verticalPadding * 2) / child.tab.icon.height );

      var textLabel = new Text( tab.name, {fontSize: 32, fill: 'black'} );
      var outline = new Rectangle( 0, 0, textLabel.width + 10, textLabel.height + 10, 10, 10, {fill: 'white'} );
      textLabel.centerX = outline.width / 2;
      textLabel.centerY = outline.height / 2;
      outline.addChild( textLabel );

      child.largeTextLabel = outline;
      child.addInputListener( { down: function() {
        model.tab = tab.index;
        model.home = false;
      }} );
      return child;
    } );

    //Add everything to the scene
    for ( var i = 0; i < tabChildren.length; i++ ) {
      this.addChild( tabChildren[i] );
      this.addChild( tabChildren[i].largeTextLabel );
    }

    //add the home icon
    this.homeIcon = new FontAwesomeNode( 'home', {cursor: 'pointer', fill: '#fff', centerY: height / 2} );
    this.homeIcon.addInputListener( {down: function() { model.home = true; }} );
    this.addChild( this.homeIcon );

    //On initialization and when the tab changes, update the size of the icons and the layout of the icons and text
    model.link( 'tab', function( tab ) {

      //Update size and opacity of each icon
      var selectedChild = null;
      for ( var i = 0; i < tabChildren.length; i++ ) {
        var child = tabChildren[i];
        child.invalidateBounds();
        var selected = tab === child.tab.index;
        child.selected = selected;
        child.opacity = selected ? 1 : 0.5;
        child.resetTransform();
        child.scale( selected ? (height - verticalPadding * 2) / child.tab.icon.height : (height - verticalPadding * 2) / child.tab.icon.height * 0.75 );
        child.largeTextLabel.visible = selected;
        if ( selected ) {
          selectedChild = child;
        }
      }

      //Compute layout bounds
      var width = 0;
      for ( var i = 0; i < tabChildren.length; i++ ) {
        var child = tabChildren[i];
        width = width + child.width;
      }
      var spacing = 10;
      width = width + spacing * (tabChildren.length - 1);

      //Lay out the components from left to right
      var x = Layout.width / 2 - width / 2;
      selectedChild.largeTextLabel.right = x - 25;
      selectedChild.largeTextLabel.centerY = height / 2;
      for ( var i = 0; i < tabChildren.length; i++ ) {
        var child = tabChildren[i];
        child.x = x;
        child.y = verticalPadding;
        x += child.width + spacing;
      }
      navigationBar.homeIcon.left = x + 15;
    } );
  }

  inherit( NavigationBar, Node );

  return NavigationBar;
} );