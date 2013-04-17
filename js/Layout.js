//Module that gives the default layout dimensions for a simulation, including the tabs, play area, tab navigation bar, etc.
define( function() {
  "use strict";

  var simHeight = 644;
  var simWidth = 981;
  var navBarHeight = 40;

  return {
    //The width of the sim, stage and tab (all the same)
    WIDTH: simWidth,

    //The height of a tab (does not include the vertical space for the navigation bar)
    HEIGHT: simHeight - navBarHeight,

    //Width of one tab
    SIM_WIDTH: simWidth,

    //The height of the stage available for the simulation tab content, does not include the tab navigation bar
    SIM_HEIGHT: simHeight,

    //Height of the nav bar
    NAV_BAR_HEIGHT: navBarHeight
  };
} );