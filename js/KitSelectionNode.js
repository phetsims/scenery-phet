// Copyright 2014-2019, University of Colorado Boulder

/**
 * Node for showing and scrolling between kits.
 *
 * @author John Blanco
 * @author Sam Reid
 */

define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var KitControlNodeSides = require( 'SCENERY_PHET/KitControlNodeSides' );
  var KitControlNodeTop = require( 'SCENERY_PHET/KitControlNodeTop' );
  var Node = require( 'SCENERY/nodes/Node' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var timer = require( 'AXON/timer' );

  // constants
  var SLOT_CHANGE_TIME = 0.35; // In seconds

  /**
   * @param {Property.<number>} selectedKit
   * @param {Array.<Object>} kits - where Object is  {{title: {Text}, {content: {Node}}
   * @param {Object} [options]
   * @constructor
   */
  function KitSelectionNode( selectedKit, kits, options ) {
    Tandem.indicateUninstrumentedCode();

    Node.call( this );
    var self = this;

    options = _.extend( {
      titleNode: null,
      selectorPosition: 'sides' // Valid values are 'sides' and 'top'
    }, options );

    // @public Make the selected kit property visible externally.
    self.selectedKit = selectedKit;

    // Determine the max size of all the kit contents for layout purposes.
    var maxKitContentSize = new Dimension2( 0, 0 );
    var maxKitTitleSize = new Dimension2( 0, 0 );
    kits.forEach( function( kit ) {
      maxKitContentSize.width = Math.max( maxKitContentSize.width, kit.content.width );
      maxKitContentSize.height = Math.max( maxKitContentSize.height, kit.content.height );
      maxKitTitleSize.width = Math.max( maxKitTitleSize.width, kit.title.width );
      maxKitTitleSize.height = Math.max( maxKitTitleSize.height, kit.title.height );
    } );

    var controlNode;
    if ( options.selectorPosition === 'top' ) {
      controlNode = new KitControlNodeTop( kits.length, selectedKit, {
        titleNode: options.titleNode,
        minButtonXSpace: 70
      } );
    }
    else if ( options.selectorPosition === 'sides' ) {
      controlNode = new KitControlNodeSides( kits.length, selectedKit, maxKitContentSize.width * 1.2 );
    }
    else {
      throw new Error( 'Unknown selector position option: ' + options.selectorPosition );
    }

    // @private Construct and add the background.  Make it big enough to hold the largest kit.
    self.selectorSize = new Dimension2( Math.max( Math.max( maxKitContentSize.width, maxKitTitleSize.width ), controlNode.width ),
      controlNode.height + maxKitContentSize.height + maxKitTitleSize.height );

    // @private
    // Create the layer that contains all the kits, and add the kits side by
    // side spaced by the distance of the background so only 1 kit will be
    // visible at a time.
    self.kitLayer = new Node();

    // Add the kits to the kit layer, spacing them out so they don't overlap.
    var x = 0;
    kits.forEach( function( kit ) {
      // Put the title centered at the top and the content node centered in the
      // available space beneath.
      if ( kit.title ) {
        kit.title.centerX = x + self.selectorSize.width / 2;
        kit.title.top = 0;
        self.kitLayer.addChild( kit.title );
      }

      kit.content.centerX = x + self.selectorSize.width / 2;
      kit.content.centerY = kit.title.bottom + maxKitContentSize.height / 2;
      self.kitLayer.addChild( kit.content );

      // Move over to the next kit
      x += self.selectorSize.width;
    } );

    // Clip the kits so that the unselected ones are invisible.
    self.clipArea = Shape.rect( 0, 0, self.selectorSize.width, self.selectorSize.height );

    // Add the remaining nodes.
    self.addChild( self.kitLayer );
    self.addChild( controlNode );

    // Layout
    if ( options.selectorPosition === 'top ' ) {
      controlNode.top = 0;
      controlNode.centerX = self.selectorSize.width / 2;
      self.kitLayer.top = controlNode.height;
    }
    else { // control node at sides
      controlNode.centerX = self.selectorSize.width / 2;
      controlNode.centerY = self.bounds.height / 2;
      self.kitLayer.top = 0;
    }

    // Set up an observer to set visibility of the selected kit.
    var selectedKitObserver = function( kit ) {
      self.scrollTo( kit );
    };
    selectedKit.link( selectedKitObserver );

    // Set up the timer and function that will animate the carousel position.
    var motionVelocity = self.selectorSize.width / SLOT_CHANGE_TIME;
    self.kitLayerTargetX = self.kitLayer.x;
    var animateCarouselPosition = function( dt ) {
      if ( self.kitLayer.x !== self.kitLayerTargetX ) {
        var dx = dt * motionVelocity * ( self.kitLayerTargetX < self.kitLayer.x ? -1 : 1 );
        if ( Math.abs( self.kitLayer.x - self.kitLayerTargetX ) <= Math.abs( dx ) ) {
          self.kitLayer.x = self.kitLayerTargetX;
        }
        else {
          self.kitLayer.x += dx;
        }
      }
    };
    timer.addListener( animateCarouselPosition );

    // Pass through any options intended for Node.
    self.mutate( options );

    // @private
    this.disposeKitSelectionNode = function() {
      controlNode.dispose();
      self.kitLayer.dispose();
      timer.removeListener( animateCarouselPosition );
      if ( selectedKit.hasListener( selectedKitObserver ) ) {
        selectedKit.unlink( selectedKitObserver );
      }
    };
  }

  sceneryPhet.register( 'KitSelectionNode', KitSelectionNode );

  return inherit( Node, KitSelectionNode, {

    /**
     * Ensures that this node is subject to garbage collection
     * @public
     */
    dispose: function() {
      this.disposeKitSelectionNode();
      Node.prototype.dispose.call( this );
    },

    // @public scrolls to the {number} kitNumber
    scrollTo: function( kitNumber ) {
      this.kitLayerTargetX = -kitNumber * this.selectorSize.width;
    }
  } );
} );
