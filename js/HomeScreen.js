/**
 * Shows the home screen for a multi-module simulation, which lets the user see all of the modules and select one.
 *
 * @author Sam Reid
 */
define( function( require ) {
  "use strict";

  var Node = require( 'SCENERY/nodes/Node' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Layout = require( 'SCENERY_PHET/Layout' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  var HEIGHT = 110;

  function HomeScreen( title, modules, model ) {
    var homeScreen = this;
    Node.call( this );

    //TODO get rid of this rectangle, and set document.bgColor=homeScreen.backgroundColor in Sim.js when home screen is activated
    this.addChild( new Rectangle( -1000, -1000, 3000, 3000, {fill: 'black'} ) );
    //iPad doesn't support Century Gothic, so fall back to Futura, see http://wordpress.org/support/topic/font-not-working-on-ipad-browser
    this.textLabel = new Text( title, {fontSize: 52, fontFamily: 'Century Gothic, Futura', fill: 'white', y: 140, centerX: 981 / 2} );
    this.phetLabel = new Text( "PhET", {fontSize: 36, fill: 'yellow', top: 5, left: 5} );
    this.addChild( this.textLabel );
    this.addChild( this.phetLabel );

    var index = 0;
    var moduleChildren = _.map( modules, function( theModule ) {
      theModule.index = index++;
      var child = new Node( {children: [theModule.icon]} );
      child.smallTextLabel = new Text( theModule.name, {fontSize: 36, fill: 'gray'} );
      child.largeTextLabel = new Text( theModule.name, {fontSize: 52, fill: 'yellow'} );
      homeScreen.addChild( child.smallTextLabel );
      homeScreen.addChild( child.largeTextLabel );
      child.scale( HEIGHT / theModule.icon.height );
      child.cursor = 'pointer';
      child.theModule = theModule;

      //Tap once to select, a second time to start that module
      child.addInputListener( { down: function() {
        if ( model.moduleIndex === theModule.index ) {
          model.home = false;
        }
        else {
          model.moduleIndex = theModule.index;
        }
      }} );
      return child;
    } );

    for ( var i = 0; i < moduleChildren.length; i++ ) {
      this.addChild( moduleChildren[i] );
    }

    model.link( 'moduleIndex', function( moduleIndex ) {
      for ( var i = 0; i < moduleChildren.length; i++ ) {
        var child = moduleChildren[i];
        child.invalidateBounds();
        var selected = moduleIndex === child.theModule.index;
        child.selected = selected;
        child.opacity = selected ? 1 : 0.5;
        child.resetTransform();
        child.scale( selected ? HEIGHT / child.theModule.icon.height * 2 : HEIGHT / child.theModule.icon.height );
      }

      var width = 0;
      for ( var i = 0; i < moduleChildren.length; i++ ) {
        var child = moduleChildren[i];
        width = width + child.width;
      }
      var spacing = 41 / 1.25;
      width = width + spacing * (moduleChildren.length - 1);

      var x = Layout.width / 2 - width / 2;

      for ( var i = 0; i < moduleChildren.length; i++ ) {
        var child = moduleChildren[i];
        child.x = x;
        child.y = Layout.height / 2 - 111 / 1.25;
        x += child.width + spacing;
        child.largeTextLabel.visible = child.selected;
        child.smallTextLabel.visible = !child.selected;
        var label = child.selected ? child.largeTextLabel : child.smallTextLabel;
        label.top = child.bottom + 20;
        label.x = child.x;
      }
    } );
  }

  inherit( HomeScreen, Node );

  return HomeScreen;
} );