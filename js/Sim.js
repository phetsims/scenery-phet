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

  //Default size to use, which will be scaled up and down isometrically
  var HEIGHT = Layout.simHeight;
  var WIDTH = Layout.simWidth;

  /**
   *
   * @param name
   * @param tabs
   * @param options optional parameters for starting tab and home values, so that developers can easily specify the startup scenario for quick development
   * @constructor
   */
  function Sim( name, tabs, options ) {
    var sim = this;

    //Default values are to show the home screen with the 1st tab selected
    options = options || {};
    var home = options.home || false;
    var tab = options.tab || 0;

    this.tabs = tabs;

    Util.polyfillRequestAnimationFrame();

    //This model represents where the simulation is, whether it is on the home screen or a tab, and which tab it is on or is highlighted in the home screen
    this.appModel = new Fort.Model( {home: home, tab: tab} );

    this.scene = new Scene( $( '.scene' ), {width: WIDTH, height: HEIGHT, allowDevicePixelRatioScaling: true} );
    this.scene.initializeStandaloneEvents(); // sets up listeners on the document with preventDefault(), and forwards those events to our scene
    this.scene.resizeOnWindowResize(); // the scene gets resized to the full screen size

    var homeScreen = new HomeScreen( name, tabs, this.appModel );
    var navigationBar = new NavigationBar( tabs, this.appModel ).mutate( {top: Layout.height + 2} );//TODO: this padding amount is copied in NavigationBar 

    //The root contains the home screen or the tabNode
    var root = new Node(); //root: homeScreen | tabNode

    //The tab container contains the tab itself, which will be swapped out based on which tab icon the user selected
    var tabContainer = new Node();//tabContainer: sceneForTab

    //The tabNode contains the tabContainer and the navigation bar
    var tabNode = new Node( {children: [navigationBar, tabContainer]} );
    this.scene.addChild( root );

    //When the user presses the home icon, then show the home screen, otherwise show the tabNode 
    this.appModel.link( 'home', function( home ) { root.children = [home ? homeScreen : tabNode];} );

    function resize() {

      //TODO: This will have to change when sims are embedded on a page instead of taking up an entire page
      var width = $( window ).width();
      var height = $( window ).height();

      var scale = Math.min( width / WIDTH, height / HEIGHT );
      sim.scene.resetTransform();
      sim.scene.setScaleMagnitude( scale );

      //center vertically
      if ( scale === width / WIDTH ) {
        sim.scene.translate( 0, (height - HEIGHT * scale) / 2 / scale );
      }

      //center horizontally
      else if ( scale === height / HEIGHT ) {
        sim.scene.translate( (width - WIDTH * scale) / 2 / scale, 0 );
      }

      //Redraw if necessary, in case the animation loop hasn't started yet
      sim.scene.updateScene();
    }

    //Instantiate the tabs
    for ( var i = 0; i < tabs.length; i++ ) {
      tabs[i].instance = tabs[i].create();
    }

    //When the user presses a different tab, show it on the screen
    this.appModel.link( 'tab', function( tabIndex ) { tabContainer.children = [tabs[tabIndex].instance]; } );

    //Fit to the window and render the initial scene
    $( window ).resize( resize );
    resize();
  }

  Sim.prototype.start = function() {
    var sim = this;

    // place the rAF *before* the render() to assure as close to 60fps with the setTimeout fallback.
    //http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    (function animationLoop() {
      requestAnimationFrame( animationLoop );

      //Update the tab, but not if the user is on the home screen
      if ( !sim.appModel.home ) {
        sim.tabs[sim.appModel.tab].instance.model.step();
      }
      sim.scene.updateScene();
    })();
  };

  return Sim;
} );