// Copyright 2026, University of Colorado Boulder

/**
 * MultiColumnKeyboardHelpContent handles layout of KeyboardHelpSections in N columns.
 *
 * @author Jesse Greenberg
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import KeyboardHelpSection from './KeyboardHelpSection.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';

type SelfOptions = {

  // horizontal spacing between the columns
  columnSpacing?: number;

  // vertical spacing between KeyboardHelpSections in each column
  sectionSpacing?: number;
};

export type MultiColumnKeyboardHelpContentOptions = SelfOptions & StrictOmit<NodeOptions, 'children'>;

export default class MultiColumnKeyboardHelpContent extends Node {

  /**
   * @param columns - KeyboardHelpSections, grouped by column from left to right
   * @param [providedOptions]
   */
  public constructor( columns: KeyboardHelpSection[][], providedOptions?: MultiColumnKeyboardHelpContentOptions ) {

    const options = optionize<MultiColumnKeyboardHelpContentOptions, SelfOptions, NodeOptions>()( {
      columnSpacing: 40,
      sectionSpacing: 40
    }, providedOptions );

    const columnOptions: StrictOmit<VBoxOptions, 'children'> = {
      align: 'left',
      spacing: options.sectionSpacing
    };

    const hBox = new HBox( {
      children: columns.map( column => new VBox( combineOptions<VBoxOptions>( {
        children: column
      }, columnOptions ) ) ),
      spacing: options.columnSpacing,
      align: 'top'
    } );

    options.children = [ hBox ];

    super( options );
  }
}