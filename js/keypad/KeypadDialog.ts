// Copyright 2022-2023, University of Colorado Boulder

/**
 * KeypadDialog is a Dialog sub-type that handles the creation and management of a Keypad for the 'collision lab'
 * simulation. It is present on all screens.
 *
 * The KeypadDialog is shown when requested through the beginEdit() method, which occurs when the user presses on a
 * BallValuesPanelNumberDisplay, to allow the user to manipulate a Ball Property. Edits must be within a specified
 * range. There will be a 'Enter' button to allow the user to submit a edit, and edits are canceled if the user hides
 * the Dialog.
 *
 * KeypadDialog is created at the start of the sim and is never disposed, so no dispose method is necessary and
 * internal links are left as-is.
 *
 * @author Brandon Li
 */

import PatternStringProperty from '../../../axon/js/PatternStringProperty.js';
import Range from '../../../dot/js/Range.js';
import Keypad, { KeypadLayout, KeypadOptions } from '../../../scenery-phet/js/keypad/Keypad.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { Color, Font, KeyboardListener, Node, Rectangle, RichText, TColor, Text, VBox } from '../../../scenery/js/imports.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../sun/js/buttons/RectangularPushButton.js';
import Dialog, { DialogOptions } from '../../../sun/js/Dialog.js';
import sceneryPhet from '../sceneryPhet.js';
import optionize, { combineOptions } from '../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../axon/js/TReadOnlyProperty.js';
import SceneryPhetStrings from '../SceneryPhetStrings.js';
import StrictOmit from '../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {
  // Font used for all Text instances within the Dialog.
  font?: Font;

  // Width of the value field, height determined by valueFont.
  valueBoxWidth?: number;

  // Vertical margin inside the value box.
  valueYMargin?: number;

  // Vertical spacing between the content of the KeypadDialog.
  contentSpacing?: number;

  // If true, the range Text will be created as a RichText
  useRichTextRange?: boolean;

  keypadLayout?: KeypadLayout;

  keypadOptions?: KeypadOptions;

  enterButtonOptions?: RectangularPushButtonOptions;

  keypadDefaultTextColor?: TColor;
  keypadErrorTextColor?: TColor;
};

export type KeypadDialogOptions = StrictOmit<DialogOptions, 'focusOnShowNode'> & SelfOptions;

class KeypadDialog extends Dialog {

  // Reference to the function called when a edit in-range successfully occurs. If null, the Keypad dialog is currently
  // not shown.
  private editValue: ( ( value: number ) => void ) | null = null;

  // Reference to the Range of the value that the Keypad is editing, if non-null.
  private valueRange: Range | null = null;

  // Reference to a potential callback function for when the Keypad is finished editing. This is provided by the client
  // in the beginEdit() method.
  private editFinishedCallback: ( () => void ) | null = null;

  // The Keypad of the KeypadDialog
  private readonly keypad: Keypad;

  // The Text Node that displays the Range of the current edit.
  private readonly rangeText: Text | RichText;

  // So we can dispose it
  private rangeStringProperty: TReadOnlyProperty<string> | null = null;

  // The Text Node that shows the current value of the Keypad edit.
  private readonly valueText: Text;

  private readonly defaultTextColor: TColor;
  private readonly errorTextColor: TColor;

  private readonly disposeKeypadDialog: () => void;

  public constructor( providedOptions?: KeypadDialogOptions ) {

    const options = optionize<KeypadDialogOptions, SelfOptions, DialogOptions>()( {

      font: new PhetFont( 15 ),

      valueBoxWidth: 85,
      valueYMargin: 3,
      contentSpacing: 10,

      useRichTextRange: false,

      keypadLayout: Keypad.PositiveAndNegativeFloatingPointLayout,

      keypadDefaultTextColor: Color.BLACK,
      keypadErrorTextColor: Color.RED,

      enterButtonOptions: {
        // baseColor: CollisionLabColors.KEYPAD_ENTER_BUTTON,
      },
      keypadOptions: {}
    }, providedOptions );

    //----------------------------------------------------------------------------------------

    // Reference the content of the Dialog. Children are added later.
    const contentNode = new VBox( { spacing: options.contentSpacing, align: 'center' } );

    const keypad = new Keypad( options.keypadLayout, options.keypadOptions );

    options.focusOnShowNode = keypad;

    super( contentNode, options );

    this.defaultTextColor = options.keypadDefaultTextColor;
    this.errorTextColor = options.keypadErrorTextColor;

    this.keypad = keypad;
    this.rangeText = options.useRichTextRange
                     ? new RichText( '', { font: options.font, maxWidth: this.keypad.width } )
                     : new Text( '', { font: options.font, maxWidth: this.keypad.width } );
    this.valueText = new Text( '', { font: options.font } );

    // Create the Background to the valueText Node.
    const valueBackgroundNode = new Rectangle( 0, 0, options.valueBoxWidth, this.height + 2 * options.valueYMargin, {
      cornerRadius: 3,
      fill: Color.WHITE,
      stroke: Color.BLACK
    } );

    const valueDisplayBox = new Node( { children: [ valueBackgroundNode, this.valueText ] } );

    // Create the enterButton, which allows the user to submit an Edit.
    const enterText = new Text( SceneryPhetStrings.key.enterStringProperty, {
      font: options.font,
      maxWidth: this.keypad.width // constrain width for i18n
    } );
    const enterButton = new RectangularPushButton( combineOptions<RectangularPushButtonOptions>( {
      listener: this.submitEdit.bind( this ),

      content: enterText,
      accessibleName: SceneryPhetStrings.key.enterStringProperty
    }, options.enterButtonOptions ) );

    // Set the children of the content of the KeypadDialog, in the correct rendering order.
    contentNode.children = [
      this.rangeText,
      valueDisplayBox,
      this.keypad,
      enterButton
    ];

    //----------------------------------------------------------------------------------------

    // Observe when the Keypad is edited and update our valueText display. Link is never disposed as KeypadDialogs
    // are never disposed.
    this.keypad.stringProperty.link( string => {
      this.valueText.string = string;
      this.valueText.center = valueBackgroundNode.center;
    } );

    // Observe when a key is pressed and reset text colors. Link is never disposed.
    this.keypad.accumulatedKeysProperty.link( () => {
      this.valueText.fill = this.defaultTextColor;
      this.rangeText.fill = this.defaultTextColor;
    } );

    const submitFromKeypadListener = new KeyboardListener( {
      keys: [ 'space', 'enter' ],
      listenerFireTrigger: 'up',
      callback: () => this.submitEdit()
    } );
    this.keypad.addInputListener( submitFromKeypadListener );

    this.disposeKeypadDialog = () => {
      submitFromKeypadListener.dispose();
      this.keypad.dispose();
      this.rangeStringProperty && this.rangeStringProperty.dispose();
      enterText.dispose(); // linked to a translated string Property
    };
  }

  /**
   * Begins an edit by showing the KeypadDialog. Called when the user presses on a BallValuesPanelNumberDisplay to allow
   * the user to manipulate a Ball.
   *
   * @param editValue - the function called when a edit in-range successfully occurs.
   * @param valueRange - the Range that the user can edit the valueProperty
   * @param patternStringProperty - the template string that formats the text on the rangeText.
   * @param editFinishedCallback - callback when edit is entered or canceled.
   */
  public beginEdit( editValue: ( value: number ) => void, valueRange: Range, patternStringProperty: TReadOnlyProperty<string>, editFinishedCallback: () => void ): void {

    this.keypad.clear();

    // Update references. These references are released when the edit is canceled or finished.
    this.editValue = editValue;
    this.valueRange = valueRange;
    this.editFinishedCallback = editFinishedCallback;

    // Clear a previous value out if it exists
    this.rangeStringProperty && this.rangeStringProperty.dispose();

    this.rangeStringProperty = new PatternStringProperty( patternStringProperty, {
      min: valueRange.min,
      max: valueRange.max
    } );
    this.rangeText.mutate( {
      stringProperty: this.rangeStringProperty
    } );

    // Display the KeypadDialog.
    this.show();
  }

  /**
   * Attempts to submit the current Keypad edit. If the edit is valid, the valueProperty is set and the edit is
   * finished. Otherwise, the edit is invalid, and the warnOutOfRange() method is invoked.
   *
   * This is called when the user presses the 'Enter' button.
   */
  private submitEdit(): void {

    // If the user didn't enter anything, treat this as a cancel.
    if ( this.keypad.stringProperty.value === '' ) {
      this.finishEdit();
      return;
    }

    // Retrieve the value from the Keypad
    const value = this.keypad.valueProperty.value;

    // If the edit is valid, the valueProperty is set and the edit.
    if ( value !== null && Number.isFinite( value ) && ( !this.valueRange || this.valueRange.contains( value ) ) ) {
      this.editValue !== null && this.editValue( value );
      this.finishEdit();
    }
    else { this.warnOutOfRange(); }
  }

  /**
   * Changes the text colors of the Value and the Range Text to indicate that a entered Edit is out of range.
   */
  private warnOutOfRange(): void {
    this.valueText.fill = this.errorTextColor;
    this.rangeText.fill = this.errorTextColor;
    this.keypad.setClearOnNextKeyPress( true );
  }

  /**
   * Convenience method to finish the KeypadDialog.
   *
   * This method is invoked when a edit is canceled or when a valid edit is entered.
   */
  private finishEdit(): void {
    this.hide(); // Hide the KeypadDialog
    this.keypad.clear(); // Clear the Keypad

    // Release references.
    this.valueRange = null;
    this.editFinishedCallback = null;
  }

  /**
   * Hides the dialog. Overridden to also call the editFinishedCallback function when edits are canceled.
   */
  public override hide(): void {
    this.editFinishedCallback && this.editFinishedCallback();

    super.hide();
  }

  public override dispose(): void {
    this.disposeKeypadDialog();
    super.dispose();
  }
}

sceneryPhet.register( 'KeypadDialog', KeypadDialog );
export default KeypadDialog;