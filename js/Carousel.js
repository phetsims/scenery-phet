// Copyright 2002-2015, University of Colorado Boulder

/**
 * A carousel UI component.
 * A set of N items is divided into M 'pages', based on how many items are visible in the carousel.
 * Pressing the next and previous buttons moves through the pages.
 * Movement through the pages is animated, so that items appear to scroll by.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CarouselButton = require( 'SCENERY_PHET/buttons/CarouselButton' );
  var HSeparator = require( 'SUN/HSeparator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PageControl = require( 'SCENERY_PHET/PageControl' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );
  var VSeparator = require( 'SUN/VSeparator' );

  // constants
  var DEFAULT_OPTIONS = {

    // container
    orientation: 'horizontal', // {string} 'horizontal'|'vertical'
    fill: 'white', // {Color|string|null} background color of the carousel
    stroke: 'black', // {Color|string|null} color used to stroke the border of the carousel
    lineWidth: 1, // {number} width of the border around the carousel
    cornerRadius: 4, // {number} radius applied to the carousel and next/previous buttons
    defaultPageNumber: 0, // {number} page that is initially visible

    // items
    itemsPerPage: 4, // {number} number of items per page, or how many items are visible at a time in the carousel
    spacing: 10, // {number} spacing between items, between items and optional separators, and between items and buttons
    margin: 10, // {number} margin between items and the edges of the carousel

    // next/previous buttons
    buttonColor: 'rgba( 200, 200, 200, 0.5 )', // {Color|string} base color for the buttons
    buttonStroke: undefined, // {Color|string|null|undefined} stroke around the buttons (null is no stroke, undefined derives color from buttonColor)
    buttonLineWidth: 1, // {number} lineWidth of borders on buttons
    hideDisabledButtons: false, // {boolean} whether to hide buttons when they are disabled

    // item separators
    separatorsVisible: false, // {boolean} whether to put separators between items
    separatorColor: 'rgb( 180, 180, 180 )', // {Color|string} color for separators
    separatorLineWidth: 0.5, // {number} lineWidth for separators

    // iOS-style page control
    pageControlVisible: false, // {boolean} whether to show an iOS-style page control
    pageControlLocation: 'bottom', // {string} where to place the page control, 'top'|'bottom'|'left'|'right'
    pageControlSpacing: 6, // {number} spacing between page control and carousel background
    dotRadius: 3, // {number} radius of the dots in the page control
    dotSpacing: 10, // {number} space between dots
    pageVisibleColor: 'black', // {Color|string} dot color for the page that is visible
    pageNotVisibleColor: 'rgb( 200, 200, 200 )' // {Color|string} dot color for pages that are not visible
  };

  /**
   * @param {Node[]} items - items in the carousel
   * @param {Object} [options]
   * @constructor
   */
  function Carousel( items, options ) {

    // Make a copy of default options, so we can modify it
    var defaultOptions = _.clone( DEFAULT_OPTIONS );

    // If options doesn't specify a location for page control, set a valid default
    if ( options.orientation && !options.pageControlLocation ) {
      defaultOptions.pageControlLocation = ( options.orientation === 'horizontal' ) ? 'bottom' : 'left';
    }

    // Override defaults with specified options
    options = _.extend( defaultOptions, options );

    // Validate options
    assert && assert( _.contains( [ 'horizontal', 'vertical' ], options.orientation ), 'invalid orientation=' + options.orientation );
    assert && assert( _.contains( [ 'bottom', 'top', 'left', 'right' ], options.pageControlLocation ), 'invalid pageControlLocation=' + options.pageControlLocation );

    // To improve readability
    var isHorizontal = ( options.orientation === 'horizontal' );

    // Dimensions of largest item
    var maxItemWidth = _.max( items, function( item ) { return item.width; } ).width;
    var maxItemHeight = _.max( items, function( item ) { return item.height; } ).height;

    // This quantity is used make some other computations independent of orientation.
    var maxItemLength = isHorizontal ? maxItemWidth : maxItemHeight;

    // Options common to both buttons
    var buttonOptions = {
      xMargin: 5,
      yMargin: 5,
      baseColor: options.buttonColor,
      disabledBaseColor: options.fill, // same as carousel background
      stroke: options.buttonStroke,
      lineWidth: options.buttonLineWidth,
      cornerRadius: options.cornerRadius, // same as carousel background
      minWidth: isHorizontal ? 0 : maxItemWidth + ( 2 * options.margin ), // fill the width of a vertical carousel
      minHeight: isHorizontal ? maxItemHeight + ( 2 * options.margin ) : 0 // fill the height of a horizontal carousel
    };

    // Next/previous buttons
    var nextButton = new CarouselButton( _.extend( {
      arrowDirection: isHorizontal ? 'right' : 'down'
    }, buttonOptions ) );
    var previousButton = new CarouselButton( _.extend( {
      arrowDirection: isHorizontal ? 'left' : 'up'
    }, buttonOptions ) );

    // Computations related to layout of items
    var numberOfSeparators = ( options.separatorsVisible ) ? ( items.length - 1 ) : 0;
    var scrollingLength = ( items.length * ( maxItemLength + options.spacing ) + ( numberOfSeparators * options.spacing) + options.spacing );
    var scrollingWidth = isHorizontal ? scrollingLength : ( maxItemWidth + 2 * options.margin );
    var scrollingHeight = isHorizontal ? ( maxItemHeight + 2 * options.margin ) : scrollingLength;
    var itemCenter = options.spacing + ( maxItemLength / 2 );

    // Options common to all separators
    var separatorOptions = {
      stroke: options.separatorColor,
      lineWidth: options.separatorLineWidth
    };

    // All items, arranged in the proper orientation, with margins and spacing.
    // Horizontal carousel arrange items left-to-right, vertical is top-to-bottom.
    // Translation of this node will be animated to give the effect of scrolling through the items.
    var scrollingNode = new Rectangle( 0, 0, scrollingWidth, scrollingHeight );
    items.forEach( function( item, index ) {

      // add the item
      if ( isHorizontal ) {
        item.centerX = itemCenter;
        item.centerY = options.margin + ( maxItemHeight / 2 );
      }
      else {
        item.centerX = options.margin + ( maxItemWidth / 2 );
        item.centerY = itemCenter;
      }
      scrollingNode.addChild( item );

      // center for the next item
      itemCenter += ( options.spacing + maxItemLength );

      // add optional separator
      if ( options.separatorsVisible ) {
        var separator;
        if ( isHorizontal ) {

          // vertical separator, to the left of the item
          separator = new VSeparator( scrollingHeight, _.extend( {
            centerX: item.centerX + ( maxItemLength / 2 ) + options.spacing,
            centerY: item.centerY
          }, separatorOptions ) );
          scrollingNode.addChild( separator );

          // center for the next item
          itemCenter = separator.centerX + options.spacing + ( maxItemLength / 2 );
        }
        else {

          // horizontal separator, below the item
          separator = new HSeparator( scrollingWidth, _.extend( {
            centerX: item.centerX,
            centerY: item.centerY + ( maxItemLength / 2 ) + options.spacing
          }, separatorOptions ) );
          scrollingNode.addChild( separator );

          // center for the next item
          itemCenter = separator.centerY + options.spacing + ( maxItemLength / 2 );
        }
      }
    } );

    // How much to translate scrollingNode each time a next/previous button is pressed
    var scrollingDelta = options.itemsPerPage * ( maxItemLength + options.spacing );
    if ( options.separatorsVisible ) {
      scrollingDelta += ( options.itemsPerPage * options.spacing );
    }

    // Clipping window, to show one page at a time.
    // Clips at the midpoint of spacing between items so that you don't see any stray bits of the items that shouldn't be visible.
    var windowLength = ( scrollingDelta + options.spacing );
    if ( options.separatorsVisible ) {
      windowLength -= options.spacing;
    }
    var windowWidth = isHorizontal ? windowLength : scrollingNode.width;
    var windowHeight = isHorizontal ? scrollingNode.height : windowLength;
    var clipArea = isHorizontal ?
                   Shape.rectangle( options.spacing / 2, 0, windowWidth - options.spacing, windowHeight ) :
                   Shape.rectangle( 0, options.spacing / 2, windowWidth, windowHeight - options.spacing );
    var windowNode = new Node( {
      children: [ scrollingNode ],
      clipArea: clipArea
    } );

    // Background - displays the carousel's fill color
    var backgroundWidth = isHorizontal ? ( windowWidth + nextButton.width + previousButton.width ) : windowWidth;
    var backgroundHeight = isHorizontal ? windowHeight : ( windowHeight + nextButton.height + previousButton.height );
    var backgroundNode = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, options.cornerRadius, options.cornerRadius, {
      fill: options.fill
    } );

    // Foreground - displays the carousel's outline, created as a separate node so that it can be placed on top of everything, for a clean look.
    var foregroundNode = new Rectangle( 0, 0, backgroundWidth, backgroundHeight, options.cornerRadius, options.cornerRadius, {
      stroke: options.stroke
    } );

    // Layout
    if ( isHorizontal ) {
      nextButton.centerY = previousButton.centerY = windowNode.centerY = backgroundNode.centerY;
      nextButton.right = backgroundNode.right;
      previousButton.left = backgroundNode.left;
      windowNode.centerX = backgroundNode.centerX;
    }
    else {
      nextButton.centerX = previousButton.centerX = windowNode.centerX = backgroundNode.centerX;
      nextButton.bottom = backgroundNode.bottom;
      previousButton.top = backgroundNode.top;
      windowNode.centerY = backgroundNode.centerY;
    }

    // Number of pages
    var numberOfPages = items.length / options.itemsPerPage;
    if ( !Util.isInteger( numberOfPages ) ) {
      numberOfPages = Math.floor( numberOfPages + 1 );
    }

    // Number of the page that is visible in the carousel.
    var pageNumberProperty = new Property( options.defaultPageNumber );

    // iOS-style page control
    var pageControl = null;
    if ( options.pageControlVisible ) {

      pageControl = new PageControl( numberOfPages, pageNumberProperty, {
        orientation: options.orientation,
        pageVisibleColor: options.pageVisibleColor,
        pageNotVisibleColor: options.pageNotVisibleColor,
        dotRadius: options.dotRadius,
        dotSpacing: options.dotSpacing
      } );

      // Layout
      if ( isHorizontal ) {
        pageControl.centerX = backgroundNode.centerX;
        if ( options.pageControlLocation === 'top' ) {
          pageControl.bottom = backgroundNode.top - options.pageControlSpacing;
        }
        else if ( options.pageControlLocation === 'bottom' ) {
          pageControl.top = backgroundNode.bottom + options.pageControlSpacing;
        }
        else {
          throw new Error( 'incompatible pageControlLocation=' + options.pageControlLocation + ' for orientation=' + options.orientation );
        }
      }
      else {
        pageControl.centerY = backgroundNode.centerY;
        if ( options.pageControlLocation === 'left' ) {
          pageControl.right = backgroundNode.left - options.pageControlSpacing;
        }
        else if ( options.pageControlLocation === 'right' ) {
          pageControl.left = backgroundNode.right + options.pageControlSpacing;
        }
        else {
          throw new Error( 'incompatible pageControlLocation=' + options.pageControlLocation + ' for orientation=' + options.orientation );
        }
      }
    }

    // Scroll when the buttons are pressed
    var scrollTween;
    pageNumberProperty.link( function( pageNumber ) {

      assert && assert( pageNumber >= 0 && pageNumber <= numberOfPages - 1, 'pageNumber out of range: ' + pageNumber );

      // stop any animation that's in progress
      scrollTween && scrollTween.stop();

      // button state
      nextButton.enabled = pageNumber < ( numberOfPages - 1 );
      previousButton.enabled = pageNumber > 0;
      if ( options.hideDisabledButtons ) {
        nextButton.visible = nextButton.enabled;
        previousButton.visible = previousButton.enabled;
      }

      //TODO replace calls to Tween with a wrapper
      // Set up the animation to scroll the items in the carousel.
      var parameters;
      var animationDuration = 400; // ms
      var easing = TWEEN.Easing.Cubic.InOut;
      if ( isHorizontal ) {
        parameters = { left: scrollingNode.left };
        scrollTween = new TWEEN.Tween( parameters )
          .easing( easing )
          .to( { left: -pageNumber * scrollingDelta }, animationDuration )
          .onUpdate( function() {
            scrollingNode.left = parameters.left;
          } )
          .start();
      }
      else {
        parameters = { top: scrollingNode.top };
        scrollTween = new TWEEN.Tween( parameters )
          .easing( easing )
          .to( { top: -pageNumber * scrollingDelta }, animationDuration )
          .onUpdate( function() {
            scrollingNode.top = parameters.top;
          } )
          .start();
      }
    } );

    // Buttons modify the page number
    nextButton.addListener( function() {
      pageNumberProperty.set( pageNumberProperty.get() + 1 );
    } );
    previousButton.addListener( function() {
      pageNumberProperty.set( pageNumberProperty.get() - 1 );
    } );

    // public fields
    this.numberOfPages = numberOfPages; // @public (read-only) {number} number of pages in the carousel
    this.pageNumberProperty = pageNumberProperty; // @public {Property<number>} page number that is currently visible

    // @private
    this.disposeCarousel = function() {
      if ( pageControl ) {
        pageControl.dispose();
      }
    };

    options.children = [ backgroundNode, windowNode, nextButton, previousButton, foregroundNode ];
    if ( pageControl ) {
      options.children.push( pageControl );
    }

    Node.call( this, options );
  }

  return inherit( Node, Carousel, {

    dispose: function() { this.disposeCarousel(); }
  }, {

    // @static @public (read-only)
    DEFAULT_OPTIONS: DEFAULT_OPTIONS
  } );
} );
