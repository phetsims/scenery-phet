//  Copyright 2002-2015, University of Colorado Boulder

/**
 * A tool is any node that can be dragged from a toolbox, carousel, panel, etc.
 *
 * TODO: This file is highly volatile an not ready for public consumption.  It is being actively developed
 * as part of https://github.com/phetsims/scenery-phet/issues/186 for work in Bending Light.  If it cannot be generalized
 * for usage in other simulations, it will be moved to Bending Light.  The API and implementation are subject to
 * change
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  var reparent = function( node, oldParent, newParent ) {
    var g1 = node.getLocalToGlobalMatrix();

    oldParent.removeChild( node );
    newParent.addChild( node );

    var p2 = newParent.getGlobalToLocalMatrix();

    var m2 = p2.timesMatrix( g1 );
    node.setMatrix( m2 );
  };

  var animateScale = function( node, scale ) {
    var parameters = { scale: node.getScaleVector().x }; // initial state, modified as the animation proceeds
    return new TWEEN.Tween( parameters )
      .easing( TWEEN.Easing.Cubic.InOut )
      .to( { scale: scale }, 200 )
      .onUpdate( function() {
        node.setScaleMagnitude( parameters.scale );
      } )
      .onComplete( function() {
      } )
      .start();
  };

  /**
   *
   * @constructor
   */
  function ToolListener( node, toolboxNode, playAreaNode, playAreaBoundsProperty, inToolbox, toolboxScale, playAreaScale ) {
    var inToolboxProperty = new Property( inToolbox );
    node.setScaleMagnitude( inToolbox ? toolboxScale : playAreaScale );

    var startOffset = null;

    var options = {
      allowTouchSnag: true,
      start: function( event ) {
        inToolboxProperty.value = false;

        // Note the options.startDrag can change the locationProperty, so read it again above, see https://github.com/phetsims/scenery-phet/issues/157
        var location = node.getTranslation();
        startOffset = node.globalToParentPoint( event.pointer.point ).minus( location );
      },
      drag: function( event ) {
        var parentPoint = node.globalToParentPoint( event.pointer.point ).minus( startOffset );
        parentPoint = playAreaBoundsProperty.value.closestPointTo( parentPoint );
        //self.events.trigger1( 'startedCallbacksForDragged', location );

        //locationProperty.set( location );
        node.setTranslation( parentPoint );

        //options.onDrag( event );

        //self.events.trigger0( 'endedCallbacksForDragged' );
      },
      end: function( event ) {

        // Drop into the toolbox.  But when there is no toolbox (when playAreaNode===toolboxNode) then do nothing.
        if ( toolboxNode !== playAreaNode && node.getGlobalBounds().intersectsBounds( toolboxNode.getGlobalBounds() ) ) {
          inToolboxProperty.value = true;
        }
      }
    };

    SimpleDragHandler.call( this, options );

    inToolboxProperty.lazyLink( function( inToolbox ) {
      if ( !inToolbox ) {
        animateScale( node, playAreaScale );
        reparent( node, toolboxNode, playAreaNode );
      }
      else {
        reparent( node, playAreaNode, toolboxNode );
        animateScale( node, toolboxScale );

      }
    } );

    // If the drag bounds changes, make sure the protractor didn't go out of bounds
    playAreaBoundsProperty.link( function( dragBounds ) {
      node.center = dragBounds.getClosestPoint( node.centerX, node.centerY );
    } );
  }

  return inherit( SimpleDragHandler, ToolListener );
} );