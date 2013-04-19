//Main class that represents one simulation, including the tabs, home screen, play area, etc.
//Provides default initialization, such as polyfills as well.
//TODO: Handle simulations that have only one tab.  Perhaps just show the name at the left and the logo at the right, and omit home screen
define( function( require ) {
  'use strict';

  var Fort = require( 'FORT/Fort' );
  var Util = require( 'SCENERY/util/Util' );
  var NavigationBar = require( 'SCENERY_PHET/NavigationBar' );
  var HomeScreen = require( 'SCENERY_PHET/HomeScreen' );
  var Scene = require( 'SCENERY/Scene' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Layout = require( 'SCENERY_PHET/Layout' );

  /**
   *
   * @param name
   * @param modules
   * @param options optional parameters for starting tab and home values, so that developers can easily specify the startup scenario for quick development
   * @constructor
   */
  function Sim( name, modules, options ) {
    var sim = this;

    //Set the HTML page title to the i18nized title
    //TODO: When a sim is embedded on a page, we shouldn't retitle the page
    $( 'title' ).html( name );

    //Default values are to show the home screen with the 1st tab selected
    options = options || {};
    var home = options.home || false;
    var tab = options.tab || 0;

    this.modules = modules;

    //This model represents where the simulation is, whether it is on the home screen or a tab, and which tab it is on or is highlighted in the home screen
    this.appModel = new Fort.Model( {home: home, tab: tab} );

    this.scene = new Scene( $( '.scene' ), {allowDevicePixelRatioScaling: true} );
    this.scene.initializeStandaloneEvents(); // sets up listeners on the document with preventDefault(), and forwards those events to our scene
    this.scene.resizeOnWindowResize(); // the scene gets resized to the full screen size

    var homeScreen = new HomeScreen( name, modules, this.appModel );
    var navigationBar = new NavigationBar( modules, this.appModel );

    //The root contains the home screen or the tabNode
    var root = new Node();

    //The tab container contains the tab itself, which will be swapped out based on which tab icon the user selected
    //Without this layerSplit, the performance significantly declines on both Win8/Chrome and iPad3/Safari
    var tabContainer = new Node( {layerSplit: true} );

    //The tabNode contains the tabContainer and the navigation bar
    var tabNode = new Node( {children: [tabContainer, navigationBar]} );
    this.scene.addChild( root );

    //When the user presses the home icon, then show the home screen, otherwise show the tabNode 
    this.appModel.link( 'home', function( home ) { root.children = [home ? homeScreen : tabNode];} );

    function resize() {

      //TODO: This will have to change when sims are embedded on a page instead of taking up an entire page
      var width = $( window ).width();
      var height = $( window ).height();

      //scale up the tab bar according to the aspect ratio of the current tab (hopefully same throughout the sim!)
      //TODO: how to enforce consistent size for navigation bar and home screen?
      navigationBar.resetTransform();
      var scale = sim.modules[sim.appModel.tab].view.getLayoutScale( width, height );
      navigationBar.setScaleMagnitude( scale );
      navigationBar.bottom = height;
      navigationBar.centerX = width / 2;

      homeScreen.resetTransform();
      homeScreen.setScaleMagnitude( scale );

      //center vertically
      if ( scale >= width / Layout.width ) {
        homeScreen.translate( 0, (height - Layout.simHeight * scale) / 2 / scale );
      }

      //center horizontally
      else {
        homeScreen.translate( (width - Layout.width * scale) / 2 / scale, 0 );
      }

      //Layout each of the tabs
      _.each( modules, function( m ) { m.view.layout( width, height - navigationBar.height ); } );

      //Startup can give spurious resizes (seen on ipad), so defer to the animation loop for painting
    }

    //Instantiate the modules
    //Currently this is done eagerly, but this pattern leaves open the door for loading things in the background.
    _.each( modules, function( m ) {
      m.model = m.createModel();
      m.view = m.createView( m.model );
    } );

    //When the user presses a different tab, show it on the screen
    this.appModel.link( 'tab', function( tabIndex ) { tabContainer.children = [modules[tabIndex].view]; } );

    //Fit to the window and render the initial scene
    $( window ).resize( resize );
    resize();
  }

  Sim.prototype.start = function() {
    var sim = this;

    //Make sure requestAnimationFrame is defined
    Util.polyfillRequestAnimationFrame();

    // place the rAF *before* the render() to assure as close to 60fps with the setTimeout fallback.
    //http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    (function animationLoop() {
      requestAnimationFrame( animationLoop );

      //Update the tab, but not if the user is on the home screen
      if ( !sim.appModel.home ) {
        var dt = 0.04;//TODO: put real time elapsed in seconds
        sim.modules[sim.appModel.tab].model.step( dt );
      }
      sim.scene.updateScene();
    })();
  };

  return Sim;
} );