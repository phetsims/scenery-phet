// Copyright 2025-2026, University of Colorado Boulder

/**
 * Generic keyboard listener that presents a transient ComboBox for selecting from discrete attachment
 * targets (e.g., connecting circuit vertices, joining track endpoints, snapping a probe to a measurement point).
 *
 * AttachmentKeyboardListener uses Enter/Space keyboard events and requires ariaRole="application" on the trigger
 * node or an ancestor.
 *
 * ## Transient ComboBox Pattern
 *
 * This pattern uses a standard ComboBox component purely for its PDOM (Parallel DOM) list navigation —
 * arrow keys to browse items, Enter to select, Escape to cancel. The ComboBox is positioned offscreen
 * so it does not appear visually in the sim; only its PDOM list box is exposed to screen readers and
 * keyboard users. A separate visual highlight (e.g., a dashed circle) tracks the currently focused
 * item to provide sighted keyboard users with feedback.
 *
 * The ComboBox is kept offscreen (rather than shown visually) because:
 * - The visual list would overlap simulation content and obscure the attachment targets
 * - The highlight-on-target approach gives better spatial context than a dropdown
 * - This is consistent across CCK, Energy Skate Park, and potentially other sims
 * - In ?dev mode, the ComboBox is shown on-screen for debugging
 *
 * ## Lifecycle
 * 1. User focuses an attachable node and presses Space/Enter
 * 2. `getItems()` dynamically generates available targets
 * 3. A ComboBox is created, added to listParent, positioned offscreen, and its list box opened
 * 4. User navigates items with arrow keys; showHighlight() tracks the current target
 * 5. Enter confirms selection → applySelection() called → ComboBox disposed → focus restored
 * 6. Escape cancels → applySelection(null) called → ComboBox disposed → focus restored
 * 7. If cancelEmitter fires while open, the ComboBox is silently cancelled
 *
 * ## Keyboard Help Dialog
 * Because the ComboBox handles key bindings internally (arrow keys, Enter, Escape are built into
 * ComboBox/ListBox), there are no sim-level KeyboardListeners or HotkeyData to reference.
 * Use ComboBoxKeyboardHelpSection with closeVisualStringProperty/closeAccessibleStringProperty
 * to customize the cancel row text.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import animationFrameTimer from '../../../axon/js/animationFrameTimer.js';
import Property from '../../../axon/js/Property.js';
import type { TReadOnlyEmitter } from '../../../axon/js/TEmitter.js';
import type { TReadOnlyProperty } from '../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import type Vector2 from '../../../dot/js/Vector2.js';
import { pdomFocusProperty } from '../../../scenery/js/accessibility/pdomFocusProperty.js';
import { OneKeyStroke } from '../../../scenery/js/input/KeyDescriptor.js';
import SceneryEvent from '../../../scenery/js/input/SceneryEvent.js';
import KeyboardListener from '../../../scenery/js/listeners/KeyboardListener.js';
import Node from '../../../scenery/js/nodes/Node.js';
import ComboBox from '../../../sun/js/ComboBox.js';
import ComboBoxListItemNode from '../../../sun/js/ComboBoxListItemNode.js';
import Tandem from '../../../tandem/js/Tandem.js';

export type AttachmentItem<T> = {
  value: T | null;
  createNode: () => Node;
};

export type AttachmentKeyboardListenerOptions<T> = {

  // Node that will regain focus after the ComboBox is closed (unless restoreFocus is overridden)
  triggerNode: Node;

  // The Node to which the transient ComboBox will be added as a child.
  // Typically the ScreenView or a top-level layer.
  // Accepts a getter function for cases where the parent is not available at construction time
  // (e.g., a TrackNode that hasn't been added to the scene graph yet).
  listParent: Node | ( () => Node );

  // Bounds used for positioning the offscreen ComboBox (typically screenView.layoutBounds).
  // Accepts a getter function for deferred resolution.
  layoutBounds: Bounds2 | ( () => Bounds2 );

  // Called when the focused combo box item changes, to show a visual highlight on the current
  // attachment target. The position is in the coordinate frame of the highlight node's parent
  // (model or view, depending on where the caller places the highlight in the scene graph).
  showHighlight: ( position: Vector2 ) => void;

  hideHighlight: () => void;

  // Items to appear in the ComboBox list
  getItems: () => AttachmentItem<T>[];

  // Position for the highlight when the given selection is active. null means no selection
  // (used as the snap-back position on cancel).
  getHighlightPosition: ( selection: T | null ) => Vector2;

  // Called when the ComboBox closes with a confirmed selection, or with null on cancel
  applySelection: ( selection: T | null, targetPosition: Vector2 ) => void;

  onOpen?: () => void;
  onClose?: () => void;
  onCancel?: () => void;

  // Invoked after a successful selection is applied (not cancelled)
  onSelectionApplied?: ( selection: T | null ) => void;

  // Invoked when a list item receives focus
  onItemFocused?: ( value: T | null, index: number ) => void;

  // Called after the ComboBox is disposed to restore focus. Defaults to focusing triggerNode.
  // Override when the triggerNode may be disposed during applySelection (e.g., after a track join).
  restoreFocus?: () => void;

  // If this emitter fires while the combo box is open, silently cancel the combo box
  cancelEmitter?: TReadOnlyEmitter;

  // Optional callback to sort items before displaying in the combo box
  sortItems?: ( items: AttachmentItem<T>[] ) => AttachmentItem<T>[];

  // Context response announced when there are no available items
  noItemsContextResponse: TReadOnlyProperty<string> | string;
};

export default class AttachmentKeyboardListener<T> extends KeyboardListener<OneKeyStroke[]> {

  // Run the application-role trail assertion only once per listener instance.
  private trailRoleValidated = false;

  public constructor( options: AttachmentKeyboardListenerOptions<T> ) {

    const restoreFocus = options.restoreFocus || ( () => options.triggerNode.focus() );

    super( {
      keys: [ 'space', 'enter' ],

      // We still require an application-role ancestor (see keydown override below). This option disables
      // KeyboardListener's generic enter/space assertion so we can provide an AttachmentKeyboardListener-specific one.
      allowEnterSpaceWithoutApplicationRole: true,

      fire: () => {
        const availableItems = options.getItems();

        if ( availableItems.length === 0 ) {
          options.hideHighlight();
          options.triggerNode.addAccessibleContextResponse( options.noItemsContextResponse );
          return;
        }

        // Resolve listParent and layoutBounds (may be getter functions for deferred resolution)
        const listParent = typeof options.listParent === 'function' ? options.listParent() : options.listParent;
        const layoutBounds = typeof options.layoutBounds === 'function' ? options.layoutBounds() : options.layoutBounds;

        let items: AttachmentItem<T>[] = [ ...availableItems ];
        if ( options.sortItems ) {
          items = options.sortItems( items );
        }

        const selectionProperty = new Property<T | null>( items[ 0 ].value );
        let targetDropPosition = options.getHighlightPosition( null );

        const comboBox = new ComboBox( selectionProperty, items, listParent, {
          opacity: 0.8,
          tandem: Tandem.OPT_OUT // transient ui
        } );

        // We must make the button non-focusable, otherwise when a selection is locked in, we will
        // trigger a re-entrant focus property issue.
        // See https://github.com/phetsims/circuit-construction-kit-common/issues/1078
        comboBox.button.focusable = false;

        // Clear out the ariaLabelledby associations, since they cause duplicate reading of the
        // 1st item, once as list and again as item.
        // See https://github.com/phetsims/circuit-construction-kit-dc/issues/232
        comboBox.listBox.ariaLabelledbyAssociations = [];

        // ComboBoxes are disposed on the next animation frame and multiple calls to dispose may be
        // queued up. This makes sure that we only try to dispose once.
        const cleanComboBoxDispose = () => {
          if ( !comboBox.isDisposed ) {
            comboBox.dispose();
          }
        };

        let cancelled = false;

        comboBox.listBox.visibleProperty.lazyLink( visible => {
          if ( cancelled ) {
            return;
          }

          if ( !visible ) {
            options.applySelection( selectionProperty.value, targetDropPosition );

            options.hideHighlight();
            options.onClose?.();
            options.onSelectionApplied?.( selectionProperty.value );

            animationFrameTimer.runOnNextTick( () => {
              cleanComboBoxDispose();
              restoreFocus();
            } );
          }
        } );

        options.onOpen?.();

        selectionProperty.link( selection => {
          targetDropPosition = options.getHighlightPosition( selection );
          options.showHighlight( targetDropPosition );
        } );

        // Offscreen unless in ?dev mode, then in top center of the layout
        comboBox.centerX = layoutBounds.centerX;
        comboBox.top = layoutBounds.top + 5 + ( phet.chipper.queryParameters.dev ? 0 : 4000 );

        listParent.addChild( comboBox );

        comboBox.showListBox();
        comboBox.focusListItemNode( items[ 0 ].value );

        comboBox.cancelEmitter.addListener( () => {
          targetDropPosition = options.getHighlightPosition( null );

          options.applySelection( null, targetDropPosition );
          cancelled = true;
          options.hideHighlight();
          options.onCancel?.();

          animationFrameTimer.runOnNextTick( () => {
            cleanComboBoxDispose();
            restoreFocus();
          } );

        } );

        if ( options.cancelEmitter ) {
          const cancelListener = () => {
            cancelled = true;
            options.hideHighlight();

            animationFrameTimer.runOnNextTick( () => {
              cleanComboBoxDispose();
            } );
          };
          options.cancelEmitter.addListener( cancelListener );

          comboBox.disposeEmitter.addListener( () => {
            if ( options.cancelEmitter!.hasListener( cancelListener ) ) {
              options.cancelEmitter!.removeListener( cancelListener );
            }
          } );
        }

        pdomFocusProperty.link( focus => {
          const node = focus?.trail?.lastNode();
          if ( node && node instanceof ComboBoxListItemNode ) {
            const value = node.item.value as T | null;
            selectionProperty.value = value;

            const index = items.findIndex( item => item.value === value );
            if ( index >= 0 ) {
              options.onItemFocused?.( value, index );
            }
          }
        }, {
          disposer: comboBox
        } );
      }
    } );
  }

  /**
   * Hook into keydown dispatch so we can assert that attachment hotkeys run in an application-role context
   * (trigger node or ancestor). Doing the check here bypasses the generic check for role configuration
   * in KeyboardDragListener for a more specific requirement.
   */
  public override keydown( event: SceneryEvent<KeyboardEvent> ): void {
    if ( assert && !this.trailRoleValidated ) {

      // Best-effort invariant: attachment hotkeys should run in an application-role context.
      const hasApplicationRoleInTrail = event.trail.nodes.some( node => {
        return node.ariaRole === 'application' || node.containerAriaRole === 'application';
      } );

      assert && assert( hasApplicationRoleInTrail,
        'AttachmentKeyboardListener requires ariaRole="application" on the trigger node or one of its ancestors.'
      );

      this.trailRoleValidated = true;
    }

    super.keydown( event );
  }
}
