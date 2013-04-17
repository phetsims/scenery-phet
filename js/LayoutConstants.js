//Module that gives the default layout dimensions for a simulation, including the tabs, play area, tab navigation bar, etc.
define( function() {
  "use strict";

  var simHeight = 644;
  var simWidth = 981;
  var navBarHeight = 40;

  return {
    //The width of the stage
    WIDTH: simWidth,

    //The height of the entire stage including the space for the tab navigation bar
    HEIGHT: simHeight,

    //Width of one tab
    TAB_WIDTH: simWidth,

    //The height of the stage available for the simulation tab content, does not include the tab navigation bar
    TAB_HEIGHT: simHeight - navBarHeight,

    //Height of the nav bar
    NAV_BAR_HEIGHT: navBarHeight
  };
} );