// Copyright 2024-2025, University of Colorado Boulder

/**
 * This doc assumes you have read the doc in GroupSelectModel. Read that first as it explains the "group select
 * interaction" more generally.
 *
 * The view of the "Group Sort Interaction." This type handles adding the controller for selecting and grabbing
 * in the interaction for (keyboard). It also handles the individual and group focus highlights.
 *
 * This class can be used per scene, but the model is best used per screen.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Disposable, { DisposableOptions } from '../../../../../axon/js/Disposable.js';
import Emitter from '../../../../../axon/js/Emitter.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import Shape from '../../../../../kite/js/Shape.js';
import optionize, { combineOptions } from '../../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import HighlightFromNode from '../../../../../scenery/js/accessibility/HighlightFromNode.js';
import HighlightPath from '../../../../../scenery/js/accessibility/HighlightPath.js';
import { ParallelDOMOptions, PDOMValueType } from '../../../../../scenery/js/accessibility/pdom/ParallelDOM.js';
import { isInteractiveHighlighting } from '../../../../../scenery/js/accessibility/voicing/isInteractiveHighlighting.js';
import animatedPanZoomSingleton from '../../../../../scenery/js/listeners/animatedPanZoomSingleton.js';
import KeyboardListener from '../../../../../scenery/js/listeners/KeyboardListener.js';
import Node, { NodeOptions } from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import { AlertableNoUtterance } from '../../../../../utterance-queue/js/Utterance.js';
import sceneryPhet from '../../../sceneryPhet.js';
import SceneryPhetStrings from '../../../SceneryPhetStrings.js';
import GrabReleaseCueNode, { GrabReleaseCueNodeOptions } from '../../nodes/GrabReleaseCueNode.js';
import GroupSelectModel from '../model/GroupSelectModel.js';

function GROUP_SELECT_ACCESSIBLE_NAME_BEHAVIOR( node: Node, options: NodeOptions, accessibleName: PDOMValueType ): NodeOptions {
  options.ariaLabel = accessibleName; // IMPORTANT! Divs with innerContent aren't recognized with accessibleNames
  options.innerContent = accessibleName;
  return options;
}

const navigableStringProperty = SceneryPhetStrings.a11y.groupSort.navigableStringProperty;
const sortableStringProperty = SceneryPhetStrings.a11y.groupSort.sortableStringProperty;

type SelfOptions<ItemModel, ItemNode extends Node> = {

  // If GroupSortInteraction doesn't know what the selection should be, this function is called to set the default or
  // best guess selection. Return null to not supply a selection (no focus).
  getGroupItemToSelect: ( () => ItemModel | null );

  // Return the enabled state of a group item. If a group item is not enabled it can be selected, but not sorted.
  isGroupItemEnabled?: ( groupItem: ItemModel ) => boolean;

  // Given a model item, return the corresponding node. Support 'null' as a way to support multiple scenes. If you
  // return null, it means that the provided itemModel is not associated with this view, and shouldn't be handled.
  getNodeFromModelItem: ( model: ItemModel ) => ItemNode | null;

  // Given a model item, return the corresponding focus highlight node. Defaults to the implementation of getNodeFromModelItem.
  // Return null if no highlight should be shown for the selection (not recommended).
  getHighlightNodeFromModelItem?: ( model: ItemModel ) => Node | null;

  // When the selected group item has been grabbed (into "sorting" state).
  onGrab?: ( groupItem: ItemModel ) => void;

  // When the selected group item is released (back into "selecting" state).
  onRelease?: ( groupItem: ItemModel ) => void;

  // To be passed to the grab/release cue node (which is added to the group focus highlight). The visibleProperty is
  // always GroupSelectModel.grabReleaseCueVisibleProperty
  grabReleaseCueOptions?: Partial<StrictOmit<GrabReleaseCueNodeOptions, 'visibleProperty'>>;

  // Accessible content provided to the node. This doesn't change from selecting/sorting states. Client is responsible
  // for setting accessibleName according to grabbed state, see https://github.com/phetsims/scenery-phet/issues/860
  primaryFocusedNodeOptions?: ParallelDOMOptions;

  // The role description for the group item when it is grabbed (sorting state).
  grabbedRoleDescription?: PDOMValueType;

  // The role description for the group item when it is released (selecting state).
  releasedRoleDescription?: PDOMValueType;

  // Context responses describing the grab/release events. Only spoken with alternative input.
  grabbedAccessibleContextResponse?: AlertableNoUtterance;
  releasedAccessibleContextResponse?: AlertableNoUtterance;
};

type ParentOptions = DisposableOptions;
export type GroupSelectViewOptions<ItemModel, ItemNode extends Node> = SelfOptions<ItemModel, ItemNode> & ParentOptions;

class GroupSelectView<ItemModel, ItemNode extends Node> extends Disposable {

  // Update group highlight dynamically by setting the `shape` of this path.
  public readonly groupSortGroupFocusHighlightPath: Path;

  // The cue node for grab/release.
  public readonly grabReleaseCueNode: Node;

  // Emitted when the sorting cue should be repositioned. Most likely because the selection has changed.
  public readonly positionSortCueNodeEmitter = new Emitter();

  private readonly getNodeFromModelItem: Required<SelfOptions<ItemModel, ItemNode>>['getNodeFromModelItem'];
  private readonly isGroupItemEnabled: Required<SelfOptions<ItemModel, ItemNode>>['isGroupItemEnabled'];

  public constructor(
    public readonly model: GroupSelectModel<ItemModel>,
    private readonly primaryFocusedNode: Node, // Client is responsible for setting accessibleName and nothing else!
    providedOptions: GroupSelectViewOptions<ItemModel, ItemNode> ) {

    const options = optionize<
      GroupSelectViewOptions<ItemModel, ItemNode>,
      SelfOptions<ItemModel, ItemNode>,
      ParentOptions>()( {
      onGrab: _.noop,
      onRelease: _.noop,
      getHighlightNodeFromModelItem: providedOptions.getNodeFromModelItem,

      // By default, a group item is enabled it if corresponding Node is enabled.
      isGroupItemEnabled: groupItem => {
        const itemNode = providedOptions.getNodeFromModelItem( groupItem );
        assert && assert( itemNode, 'should have a node for the group item' );
        return itemNode!.enabled;
      },
      primaryFocusedNodeOptions: {
        tagName: 'div',
        focusable: true,
        ariaRole: 'application',
        accessibleNameBehavior: GROUP_SELECT_ACCESSIBLE_NAME_BEHAVIOR
      },
      grabReleaseCueOptions: {},
      grabbedRoleDescription: sortableStringProperty,
      releasedRoleDescription: navigableStringProperty,
      grabbedAccessibleContextResponse: SceneryPhetStrings.a11y.groupSort.grabbedAccessibleContextResponseStringProperty,
      releasedAccessibleContextResponse: SceneryPhetStrings.a11y.groupSort.releasedAccessibleContextResponseStringProperty
    }, providedOptions );

    super( options );

    this.getNodeFromModelItem = options.getNodeFromModelItem;
    this.isGroupItemEnabled = options.isGroupItemEnabled;

    const selectedGroupItemProperty = this.model.selectedGroupItemProperty;
    const isKeyboardFocusedProperty = this.model.isKeyboardFocusedProperty;
    const isGroupItemKeyboardGrabbedProperty = this.model.isGroupItemKeyboardGrabbedProperty;
    const hasKeyboardGrabbedGroupItemProperty = this.model.hasKeyboardGrabbedGroupItemProperty;

    // Provide the general accessible content for the provided Node
    primaryFocusedNode.mutate( options.primaryFocusedNodeOptions );

    const grabbedPropertyListener = ( grabbed: boolean ) => {
      const selectedGroupItem = selectedGroupItemProperty.value;
      if ( selectedGroupItem !== null ) {
        if ( grabbed ) {
          options.onGrab( selectedGroupItem );

          // This listener is linked to a model Property, only speak through the Node if it is actually
          // displayed.
          if ( primaryFocusedNode.wasVisuallyDisplayed() ) {
            this.primaryFocusedNode.addAccessibleContextResponse( options.grabbedAccessibleContextResponse );
          }
        }
        else {
          options.onRelease( selectedGroupItem );

          // This listener is linked to a model Property, only speak through the Node if it is actually
          // displayed.
          if ( primaryFocusedNode.wasVisuallyDisplayed() ) {
            this.primaryFocusedNode.addAccessibleContextResponse( options.releasedAccessibleContextResponse );
          }
        }
      }
    };
    isGroupItemKeyboardGrabbedProperty.lazyLink( grabbedPropertyListener );

    const focusListener = {
      focus: () => {

        // It's possible that getGroupItemToSelect's heuristic said that there is nothing to focus here
        if ( selectedGroupItemProperty.value === null ) {
          selectedGroupItemProperty.value = options.getGroupItemToSelect();
        }

        isKeyboardFocusedProperty.value = true;

        // When the group receives keyboard focus, make sure that the selected group item is displayed
        if ( selectedGroupItemProperty.value !== null ) {
          const node = options.getNodeFromModelItem( selectedGroupItemProperty.value );
          node && animatedPanZoomSingleton.listener.panToNode( node, true );
        }
      },
      blur: () => {

        // Do not clear the selectedGroupItemProperty when blurring because we want to keep the selection for the
        // next time focus lands on the group.
        isKeyboardFocusedProperty.value = false;
        isGroupItemKeyboardGrabbedProperty.value = false;
      },
      over: () => {

        // When you mouse over while focused, the highlights are hidden, and so update the state (even though we are
        // still technically keyboard focused). This will assist in showing the mouse cue, https://github.com/phetsims/center-and-variability/issues/406
        isKeyboardFocusedProperty.value = false;
      },
      down: () => {

        // We want to remove focus from this node entirely to prevent the focus highlight from showing up when
        // there is no selected group item.
        primaryFocusedNode.blur();
      }
    };

    // When interactive highlights become active on the group, interaction with a mouse has begun while using
    // Interactive Highlighting. When that happens, clear the selection to prevent focus highlight flickering/thrashing.
    // See https://github.com/phetsims/center-and-variability/issues/557 and https://github.com/phetsims/scenery-phet/issues/815
    if ( isInteractiveHighlighting( primaryFocusedNode ) ) {
      const interactiveHighlightingActiveListener = ( active: boolean ) => {
        if ( active ) {
          if ( model.selectedGroupItemProperty.value !== null ) {

            // Release the selection if grabbed
            model.isGroupItemKeyboardGrabbedProperty.value = false;

            // Clear the selection so that there isn't potential for flickering in between input modalities
            model.selectedGroupItemProperty.value = null;
          }

          // This controls the visibility of interaction cues (keyboard vs mouse), so we need to clear it when
          // switching interaction modes.
          isKeyboardFocusedProperty.value = false;
        }
      };
      primaryFocusedNode.isInteractiveHighlightActiveProperty.lazyLink( interactiveHighlightingActiveListener );

      this.disposeEmitter.addListener( () => {
        primaryFocusedNode.isInteractiveHighlightActiveProperty.unlink( interactiveHighlightingActiveListener );
      } );
    }

    const updateFocusHighlight = new Multilink( [
        selectedGroupItemProperty,
        isGroupItemKeyboardGrabbedProperty,

        // Make sure that the highlight is updated when focused, because mouse input does not update the selectedGroupItemProperty
        isKeyboardFocusedProperty
      ],
      ( selectedGroupItem, isGroupItemGrabbed ) => {
        let focusHighlightSet = false;
        if ( selectedGroupItem !== null ) {
          const node = options.getHighlightNodeFromModelItem( selectedGroupItem );
          if ( node ) {
            const focusForSelectedGroupItem = new HighlightFromNode( node, { dashed: isGroupItemGrabbed } );

            // If available, set to the focused selection for this scene.
            primaryFocusedNode.setFocusHighlight( focusForSelectedGroupItem );
            focusHighlightSet = true;
          }
        }

        // If not set above, then actively hide it.
        !focusHighlightSet && primaryFocusedNode.setFocusHighlight( 'invisible' );

        if ( selectedGroupItem !== null ) {
          this.positionSortCueNodeEmitter.emit();
        }
      }
    );

    // "release" into selecting state when disabled
    const enabledListener = ( enabled: boolean ) => {
      if ( !enabled ) {
        hasKeyboardGrabbedGroupItemProperty.value = false;
      }
    };
    this.model.enabledProperty.link( enabledListener );
    this.disposeEmitter.addListener( () => {
      this.model.enabledProperty.unlink( enabledListener );
    } );

    // A KeyboardListener that changes the "sorting" vs "selecting" state of the interaction.
    const grabReleaseKeyboardListener = new KeyboardListener( {
      fireOnDown: false,
      keys: [ 'enter', 'space', 'escape' ],

      // This option will ensure that this listener doesn't disrupt other keys
      overlapBehavior: 'allow',
      fire: ( event, keysPressed ) => {

        // Do no grab when the interaction is disabled, if there is no selection, or when the individual group item is disabled
        if ( this.model.enabled && selectedGroupItemProperty.value !== null && this.isGroupItemEnabled( selectedGroupItemProperty.value ) ) {

          // Do the "Grab/release" action to switch to sorting or selecting
          if ( keysPressed === 'enter' || keysPressed === 'space' ) {
            isGroupItemKeyboardGrabbedProperty.toggle();
            hasKeyboardGrabbedGroupItemProperty.value = true;
          }
          else if ( isGroupItemKeyboardGrabbedProperty.value && keysPressed === 'escape' ) {
            isGroupItemKeyboardGrabbedProperty.value = false;
          }

          // Reset to true from keyboard input, in case mouse/touch input set to false during the keyboard interaction.
          isKeyboardFocusedProperty.value = true;
        }
      }
    } );

    const defaultGroupShape = primaryFocusedNode.visibleBounds.isFinite() ? Shape.bounds( primaryFocusedNode.visibleBounds ) : null;

    // Set the outer group focus highlight to surround the entire area where group items are located.
    this.groupSortGroupFocusHighlightPath = new HighlightPath( defaultGroupShape, {
      outerStroke: HighlightPath.OUTER_LIGHT_GROUP_FOCUS_COLOR,
      innerStroke: HighlightPath.INNER_LIGHT_GROUP_FOCUS_COLOR,
      outerLineWidth: HighlightPath.GROUP_OUTER_LINE_WIDTH,
      innerLineWidth: HighlightPath.GROUP_INNER_LINE_WIDTH
    } );

    Multilink.multilink( [
      model.isGroupItemKeyboardGrabbedProperty
    ], isGrabbed => {
      primaryFocusedNode.accessibleRoleDescription = isGrabbed ? options.grabbedRoleDescription : options.releasedRoleDescription;
    } );

    this.grabReleaseCueNode = new GrabReleaseCueNode( combineOptions<GrabReleaseCueNodeOptions>( {
      visibleProperty: this.model.grabReleaseCueVisibleProperty
    }, options.grabReleaseCueOptions ) );
    this.groupSortGroupFocusHighlightPath.addChild( this.grabReleaseCueNode );

    primaryFocusedNode.setGroupFocusHighlight( this.groupSortGroupFocusHighlightPath );
    primaryFocusedNode.addInputListener( focusListener );
    primaryFocusedNode.addInputListener( grabReleaseKeyboardListener );

    this.disposeEmitter.addListener( () => {
      isGroupItemKeyboardGrabbedProperty.unlink( grabbedPropertyListener );
      primaryFocusedNode.setGroupFocusHighlight( false );
      primaryFocusedNode.setFocusHighlight( null );
      primaryFocusedNode.removeInputListener( grabReleaseKeyboardListener );
      primaryFocusedNode.removeInputListener( focusListener );
      updateFocusHighlight.dispose();
      grabReleaseKeyboardListener.dispose();
    } );
  }

  // By "change" we mean sort or selection.
  protected onGroupItemChange( newGroupItem: ItemModel ): void {

    // When using keyboard input, make sure that the selected group item is still displayed by panning to keep it
    // in view. `panToCenter` is false because centering the group item in the screen is too much movement.
    const node = this.getNodeFromModelItem( newGroupItem );
    node && animatedPanZoomSingleton.listener.panToNode( node, false );

    // Reset to true from keyboard input, in case mouse/touch input set to false during the keyboard interaction.
    this.model.isKeyboardFocusedProperty.value = true;
  }

  /**
   * Programmatic way to activate the group select interaction, set its selection, and grab that selection.
   */
  public keyboardGrab( groupItem: ItemModel ): void {
    if ( this.model.enabled && this.isGroupItemEnabled( groupItem ) ) {

      // focus before anything else
      this.primaryFocusedNode.focus();

      // Selecting before grabbing ensures that the item is correct as it pertains to Property listeners.
      this.model.selectedGroupItemProperty.value = groupItem;

      this.model.hasKeyboardGrabbedGroupItemProperty.value = true;
      this.model.isGroupItemKeyboardGrabbedProperty.value = true;
      this.model.isKeyboardFocusedProperty.value = true;
    }
  }

  public override dispose(): void {
    this.groupSortGroupFocusHighlightPath.dispose();
    this.grabReleaseCueNode.dispose();
    this.positionSortCueNodeEmitter.dispose();
    super.dispose();
  }
}

sceneryPhet.register( 'GroupSelectView', GroupSelectView );

export default GroupSelectView;