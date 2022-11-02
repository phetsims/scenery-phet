// Copyright 2019-2022, University of Colorado Boulder

/**
 * TwoColumnKeyboardHelpContentOptions handles layout of KeyboardHelpSections in 2 columns.
 *
 * @author Jesse Greenberg
 */

import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { HBox, Node, NodeOptions, VBox, VBoxOptions } from '../../../../scenery/js/imports.js';
import sceneryPhet from '../../sceneryPhet.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';

type SelfOptions = {

  // spacing between the left and right columns of the help content
  columnSpacing?: number;

  // vertical spacing between KeyboardHelpSections in each column
  sectionSpacing?: number;
};

export type TwoColumnKeyboardHelpContentOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class TwoColumnKeyboardHelpContent extends Node {
  private readonly disposeTwoColumnKeyboardHelpContent: () => void;

  /**
   * @param leftSections - KeyboardHelpSections for the left column
   * @param rightSections -  KeyboardHelpSections for the right column
   * @param [providedOptions]
   */
  public constructor( leftSections: KeyboardHelpSection[], rightSections: KeyboardHelpSection[],
                      providedOptions?: TwoColumnKeyboardHelpContentOptions ) {

    const options = optionize<TwoColumnKeyboardHelpContentOptions, SelfOptions, NodeOptions>()( {
      columnSpacing: 40,
      sectionSpacing: 40
    }, providedOptions );

    const columnOptions: StrictOmit<VBoxOptions, 'children'> = {
      align: 'left',
      spacing: options.sectionSpacing
    };
    const leftColumn = new VBox( combineOptions<VBoxOptions>( {
      children: leftSections
    }, columnOptions ) );
    const rightColumn = new VBox( combineOptions<VBoxOptions>( {
      children: rightSections
    }, columnOptions ) );

    const hBox = new HBox( {
      children: [ leftColumn, rightColumn ],
      spacing: options.columnSpacing,
      align: 'top'
    } );

    options.children = [ hBox ];

    super( options );
    this.disposeTwoColumnKeyboardHelpContent = () => {
      leftColumn.dispose();
      rightColumn.dispose();
      hBox.dispose();
    };
  }

  public override dispose(): void {
    this.disposeTwoColumnKeyboardHelpContent();
    super.dispose();
  }
}

sceneryPhet.register( 'TwoColumnKeyboardHelpContent', TwoColumnKeyboardHelpContent );