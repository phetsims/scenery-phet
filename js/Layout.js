//Module that gives the default layout dimensions for a simulation, including the tabs, play area, tab navigation bar, etc.
//These values should be treated as constants, or it will cause buggy behavior.s
define( function() {
  "use strict";

  var simHeight = 644;
  var simWidth = 981;
  var navBarHeight = 40;

  return {
    //The width of the sim, stage and tab (all the same)
    width: simWidth,

    //The height of a tab (does not include the vertical space for the navigation bar)
    height: simHeight - navBarHeight,

    //Width of one tab
    simWidth: simWidth,

    //The height of the stage available for the simulation tab content, does not include the tab navigation bar
    simHeight: simHeight,

    //Height of the nav bar
    navBarHeight: navBarHeight
  };
} );