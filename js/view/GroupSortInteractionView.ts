// Copyright 2023, University of Colorado Boulder

/**
 * TODO! https://github.com/phetsims/scenery-phet/issues/815
 */

import { animatedPanZoomSingleton, HighlightFromNode, HighlightPath, KeyboardListener, Node } from '../../../scenery/js/imports.js';
import SoccerBallNode from './SoccerBallNode.js';
import { SoccerBallPhase } from '../model/SoccerBallPhase.js';
import SoccerSceneModel from '../model/SoccerSceneModel.js';
import soccerCommon from '../soccerCommon.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import SoccerBall from '../model/SoccerBall.js';
import { Shape } from '../../../kite/js/imports.js';
import Range from '../../../dot/js/Range.js';
import Utils from '../../../dot/js/Utils.js';
import Multilink from '../../../axon/js/Multilink.js';
import Matrix3 from '../../../dot/js/Matrix3.js';
import GroupSortInteractionModel from '../model/GroupSortInteractionModel.js';


// TODO: parameterize on ItemModel and ItemView, https://github.com/phetsims/scenery-phet/issues/815
export default class GroupSortInteractionView {

  // TODO: rename, this is the group focus highlight (kinda?) https://github.com/phetsims/scenery-phet/issues/815
  private readonly focusHighlightPath: HighlightPath;

  public constructor(
    private readonly groupSortInteractionModel: GroupSortInteractionModel,
    public readonly sceneModel: SoccerSceneModel, // TODO: Think hard about the best interface for this, https://github.com/phetsims/scenery-phet/issues/815
    soccerBallMap: Map<SoccerBall, SoccerBallNode>,
    keyboardDragArrowNode: Node,
    primaryFocusedNode: Node,
    public readonly modelViewTransform: ModelViewTransform2,
    physicalRange: Range ) {

    const focusedGroupItemProperty = this.groupSortInteractionModel.focusedGroupItemProperty;
    const isKeyboardFocusedProperty = this.groupSortInteractionModel.isKeyboardFocusedProperty;
    const isSoccerBallKeyboardGrabbedProperty = this.groupSortInteractionModel.isSoccerBallKeyboardGrabbedProperty;
    const hasKeyboardGrabbedBallProperty = this.groupSortInteractionModel.hasKeyboardGrabbedBallProperty;
    const soccerBallHasBeenDraggedProperty = this.groupSortInteractionModel.soccerBallHasBeenDraggedProperty;
    const dragIndicatorValueProperty = this.groupSortInteractionModel.dragIndicatorValueProperty;

    sceneModel.soccerBalls.forEach( soccerBall => {
      soccerBall.valueProperty.link( ( value, oldValue ) => {

        // If the value changed from numeric to numeric, it must have been by user dragging it.
        // It's simpler to have the listener here because in the model or drag listener, there is rounding/snapping
        // And we only want to hide the indicator of the user dragged the ball a full tick mark
        if ( value !== null && oldValue !== null ) {
          soccerBallHasBeenDraggedProperty.value = true;
        }
      } );
    } );

    // Update pointer areas and soccer ball focus (for keyboard and interactive highlight) when topmost ball changes
    sceneModel.stackChangedEmitter.addListener( stack => {

      // When a user is focused on the backLayerSoccerBallLayer, but no balls have landed yet, we want to ensure that
      // a focusedSoccerBall gets assigned once the ball lands.
      // TODO: Hard to generalize, perhaps with a hook like "update focus please" https://github.com/phetsims/scenery-phet/issues/815
      const topSoccerBalls = sceneModel.getTopSoccerBalls();
      if ( focusedGroupItemProperty.value === null && topSoccerBalls.length > 0 && primaryFocusedNode.focused ) {
        focusedGroupItemProperty.value = topSoccerBalls[ 0 ];
      }

      // Anytime a stack changes and the focusedSoccerBall is assigned, we want to make sure the focusedSoccerBall
      // stays on top.
      if ( focusedGroupItemProperty.value !== null ) {
        assert && assert( focusedGroupItemProperty.value.valueProperty.value !== null, 'The valueProperty of the focusedSoccerBall should not be null.' );
        const focusedStack = sceneModel.getStackAtValue( focusedGroupItemProperty.value.valueProperty.value! );
        focusedGroupItemProperty.value = focusedStack[ focusedStack.length - 1 ];
      }
    } );

    primaryFocusedNode.addInputListener( {
      focus: () => {
        const topSoccerBalls = sceneModel.getTopSoccerBalls();
        if ( focusedGroupItemProperty.value === null && topSoccerBalls.length > 0 ) {
          if ( dragIndicatorValueProperty.value !== null ) {
            const dragIndicatorStack = sceneModel.getStackAtValue( dragIndicatorValueProperty.value,
              ( soccerBall: SoccerBall ) => soccerBall.soccerBallPhaseProperty.value === SoccerBallPhase.STACKED );
            focusedGroupItemProperty.value = dragIndicatorStack[ dragIndicatorStack.length - 1 ];
          }
          else {
            focusedGroupItemProperty.value = topSoccerBalls[ 0 ];
          }

        }
        isKeyboardFocusedProperty.value = true;

        // When the group receives keyboard focus, make sure that the focused ball is displayed
        if ( focusedGroupItemProperty.value !== null ) {
          // TODO: awkward, https://github.com/phetsims/scenery-phet/issues/815
          animatedPanZoomSingleton.listener.panToNode( soccerBallMap.get( focusedGroupItemProperty.value )!, true );
        }
      },
      blur: () => {
        isSoccerBallKeyboardGrabbedProperty.value = false;
        isKeyboardFocusedProperty.value = false;
      },
      over: () => {
        isKeyboardFocusedProperty.value = false;
      }
    } );

    Multilink.multilink( [
        focusedGroupItemProperty,
        isSoccerBallKeyboardGrabbedProperty,
        dragIndicatorValueProperty
      ],
      ( focusedSoccerBall, isSoccerBallGrabbed, dragIndicatorValue ) => {
        if ( focusedSoccerBall ) {

          const focusForSelectedBall = new HighlightFromNode( soccerBallMap.get( focusedSoccerBall )!, { dashed: isSoccerBallGrabbed } );
          primaryFocusedNode.setFocusHighlight( focusForSelectedBall );
        }
        else {
          primaryFocusedNode.setFocusHighlight( 'invisible' );
        }

        // The selection arrow is shown over the same ball as the mouse drag indicator ball
        if ( dragIndicatorValue !== null ) {

          // If a soccer ball has focus, that takes precedence for displaying the indicators
          const valueToShow = focusedSoccerBall ? focusedSoccerBall.valueProperty.value! : dragIndicatorValue;
          const stack = this.sceneModel.getStackAtValue( valueToShow );

          if ( stack.length > 0 ) {

            const arrowOffset = -18;

            const topBall = stack[ stack.length - 1 ];
            const position = topBall.positionProperty.value;

            keyboardDragArrowNode.centerBottom = modelViewTransform.modelToViewPosition( position ).plusXY( 0, arrowOffset );
            keyboardDragArrowNode.moveToFront();
          }
        }
      }
    );

    // Move the focus highlight to a different soccer ball based on the provided delta.
    // TODO: Probably a hook, https://github.com/phetsims/scenery-phet/issues/815
    const moveFocusByDelta = ( delta: number, topBallNodes: SoccerBallNode[] ) => {

      if ( focusedGroupItemProperty.value === null ) {

        // No-op if we do not have a focusedGroupItem.
        return;
      }

      const numberOfTopSoccerBalls = topBallNodes.length;

      // We are deciding not to wrap the value around the ends of the range because the grabbed soccer ball
      // also does not wrap.
      const currentIndex = topBallNodes.indexOf( soccerBallMap.get( focusedGroupItemProperty.value )! );
      const nextIndex = Utils.clamp( currentIndex + delta, 0, numberOfTopSoccerBalls - 1 );
      focusedGroupItemProperty.value = topBallNodes[ nextIndex ].soccerBall;
    };

    const keyboardListener = new KeyboardListener( {
      fireOnHold: true,
      keys: [ 'd', 'arrowRight', 'a', 'arrowLeft', 'arrowUp', 'arrowDown', 'w', 's', 'enter', 'space', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'home', 'end', 'escape', 'pageUp', 'pageDown' ],
      callback: ( event, keysPressed ) => {
        // TODO: like a getFocusable group items hook? https://github.com/phetsims/scenery-phet/issues/815
        const topBallNodes = sceneModel.getTopSoccerBalls().map( soccerBall => soccerBallMap.get( soccerBall )! );

        // Select a soccer ball
        if ( focusedGroupItemProperty.value !== null ) {
          if ( ( [ 'arrowRight', 'arrowLeft', 'a', 'd', 'arrowUp', 'arrowDown', 'w', 's' ].includes( keysPressed ) ) ) {
            if ( [ 'arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown' ].includes( keysPressed ) && !isSoccerBallKeyboardGrabbedProperty.value ) {
              this.groupSortInteractionModel.hasKeyboardSelectedDifferentBallProperty.value = true;

              const delta = [ 'arrowRight', 'arrowUp' ].includes( keysPressed ) ? 1 : -1;
              moveFocusByDelta( delta, topBallNodes );
            }
            else if ( isSoccerBallKeyboardGrabbedProperty.value ) {
              this.groupSortInteractionModel.hasKeyboardMovedBallProperty.value = true;

              const delta = [ 'arrowLeft', 'a', 'arrowDown', 's' ].includes( keysPressed ) ? -1 : 1;
              const soccerBall = focusedGroupItemProperty.value;
              soccerBall.valueProperty.value = physicalRange.constrainValue( soccerBall.valueProperty.value! + delta );
              soccerBall.toneEmitter.emit( soccerBall.valueProperty.value );
            }
          }
          else if ( [ 'home', 'end' ].includes( keysPressed ) && !isSoccerBallKeyboardGrabbedProperty.value ) {
            const delta = keysPressed === 'home' ? -physicalRange.max : physicalRange.max;
            moveFocusByDelta( delta, topBallNodes );
          }
          else if ( keysPressed === 'enter' || keysPressed === 'space' ) {
            isSoccerBallKeyboardGrabbedProperty.value = !isSoccerBallKeyboardGrabbedProperty.value;
            hasKeyboardGrabbedBallProperty.value = true;
          }
          else if ( isSoccerBallKeyboardGrabbedProperty.value ) {

            if ( keysPressed === 'escape' ) {
              isSoccerBallKeyboardGrabbedProperty.value = false;
            }
            else {
              const soccerBall = focusedGroupItemProperty.value;
              soccerBall.valueProperty.value = keysPressed === 'home' ? physicalRange.min :
                                               keysPressed === 'end' ? physicalRange.max :
                                               keysPressed === '1' ? 1 :
                                               keysPressed === '2' ? 2 :
                                               keysPressed === '3' ? 3 :
                                               keysPressed === '4' ? 4 :
                                               keysPressed === '5' ? 5 :
                                               keysPressed === '6' ? 6 :
                                               keysPressed === '7' ? 7 :
                                               keysPressed === '8' ? 8 :
                                               keysPressed === '9' ? 9 :
                                               keysPressed === '0' ? 10 :
                                               // TODO: Generalize to the range https://github.com/phetsims/scenery-phet/issues/815
                                               keysPressed === 'pageDown' ? Math.max( soccerBall.valueProperty.value! - 3, physicalRange.min ) :
                                               keysPressed === 'pageUp' ? Math.min( soccerBall.valueProperty.value! + 3, physicalRange.max ) :
                                               soccerBall.valueProperty.value;
              if ( typeof soccerBall.valueProperty.value === 'number' ) {
                soccerBall.toneEmitter.emit( soccerBall.valueProperty.value );
                this.groupSortInteractionModel.hasKeyboardMovedBallProperty.value = true;
              }
            }
          }

          // When using keyboard input, make sure that the "focused" ball is still displayed by panning to keep it
          // in view. `panToCenter` is false because centering the ball in the screen is too much movement.
          // TODO: Oh boy, https://github.com/phetsims/scenery-phet/issues/815
          animatedPanZoomSingleton.listener.panToNode( soccerBallMap.get( focusedGroupItemProperty.value )!, false );
        }
      }
    } );

    // Set the outer group focus region to cover the entire area where soccer balls may land, translate lower so it also includes the number line and labels
    this.focusHighlightPath = new HighlightPath( null, {
      outerStroke: HighlightPath.OUTER_LIGHT_GROUP_FOCUS_COLOR,
      innerStroke: HighlightPath.INNER_LIGHT_GROUP_FOCUS_COLOR,
      outerLineWidth: HighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: HighlightPath.GROUP_INNER_LINE_WIDTH
    } );
    primaryFocusedNode.setGroupFocusHighlight( this.focusHighlightPath );
    primaryFocusedNode.addInputListener( keyboardListener );

    // TODO: move to the model and use use resetInteractionState(), see about https://github.com/phetsims/scenery-phet/issues/815
    sceneModel.preClearDataEmitter.addListener( () => {
      focusedGroupItemProperty.reset();
      isSoccerBallKeyboardGrabbedProperty.reset();
      isKeyboardFocusedProperty.reset();
      }
    );
  }

  /**
   * The group focus region for the soccer ball area is supposed to be just below the accordion box, and adjust when the
   * accordion box expands and collapses.
   */
  public setGroupFocusHighlightTop( top: number ): void {
    const margin = 4; // Distance below the accordion box
    const shapeForLeftRightBottom = this.modelViewTransform.modelToViewShape( Shape.rect( 0.5, 0, 15, 6 ) ).transformed( Matrix3.translation( 0, 37 ) );
    this.focusHighlightPath.shape = Shape.rect(
      shapeForLeftRightBottom.bounds.x,
      top + margin,
      shapeForLeftRightBottom.bounds.width,
      shapeForLeftRightBottom.bounds.bottom - top - margin
    );
  }
}

soccerCommon.register( 'GroupSortInteractionView', GroupSortInteractionView );