// Copyright 2019-2021, University of Colorado Boulder

/**
 * ComboBoxDisplay is the lovechild of a ComboBox and a NumberDisplay. It allows the user to choose one of N dynamic
 * numeric values. ComboBox was designed to display static choices, so this component ensures that none of its items
 * grow wider/taller than their initial size.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../dot/js/Range.js';
import NumberProperty from '../../axon/js/NumberProperty.js';
import Property from '../../axon/js/Property.js';
import optionize from '../../phet-core/js/optionize.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import { Node } from '../../scenery/js/imports.js';
import ComboBox, { ComboBoxOptions } from '../../sun/js/ComboBox.js';
import ComboBoxItem from '../../sun/js/ComboBoxItem.js';
import NumberDisplay, { NumberDisplayOptions } from './NumberDisplay.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';

// constants
const DEFAULT_FONT = new PhetFont( 14 );

type SubsetOfNumberDisplayOptions = Omit<NumberDisplayOptions, 'valuePattern'>;

// Describes an item in the ComboBoxDisplay
export type ComboBoxDisplayItem = {

  // a value of choiceProperty that corresponds to the item
  choice: number;

  // the selected value
  numberProperty: NumberProperty;

  // the range of the item's value, required if numberProperty.range is null
  range?: Range | null;

  // the units used to label the item's value
  units: string;

  // options passed to this item's NumberDisplay, these override ComboBoxDisplayOptions.numberDisplayOptions
  numberDisplayOptions?: SubsetOfNumberDisplayOptions;

  // tandem name for the item
  tandemName?: string;
}

type SelfOptions = {

  // propagated to all NumberDisplay subcomponents, will be overridden by ComboBoxDisplayItem.numberDisplayOptions
  numberDisplayOptions?: SubsetOfNumberDisplayOptions;
};

export type ComboBoxDisplayOptions = SelfOptions & ComboBoxOptions;

export default class ComboBoxDisplay extends ComboBox<number> {

  /**
   * @param items - describes the items that appear in the ComboBox
   * @param choiceProperty - determines which item is currently selected
   * @param listParent - parent for the ComboBox list
   * @param providedOptions
   */
  constructor( items: ComboBoxDisplayItem[], choiceProperty: Property<number>, listParent: Node,
               providedOptions?: ComboBoxDisplayOptions ) {

    const options = optionize<ComboBoxDisplayOptions, SelfOptions, ComboBoxOptions>( {

      // SelfOptions
      numberDisplayOptions: {
        backgroundFill: null,
        backgroundStroke: null,
        textOptions: {
          font: DEFAULT_FONT
        },
        align: 'right',
        xMargin: 0,
        yMargin: 0
      },

      // ComboBoxOptions
      align: 'right' // we typically want numbers to be right aligned

    }, providedOptions );

    // Convert ComboBoxDisplayItems to ComboBoxItems
    const comboBoxItems: ComboBoxItem<number>[] = [];
    items.forEach( item => {

      const range = item.range ? item.range : item.numberProperty.range!;
      assert && assert( range, 'range or numberProperty.range must be provided' );

      // optionize only supports 2 sources of option values, and we have 3.
      // So use 2 optionize calls to assemble the options for the item's NumberDisplay.
      // Order is important here, so that we don't write to options.numberDisplayOptions or item.numberDisplayOptions,
      // and so that item.numberDisplayOptions overrides options.numberDisplayOptions.
      const numberDisplayOptions = optionize<NumberDisplayOptions, {}, NumberDisplayOptions>( {
        valuePattern: StringUtils.fillIn( sceneryPhetStrings.comboBoxDisplay.valueUnits, { units: item.units } )
      }, options.numberDisplayOptions );

      const itemNode = new NumberDisplay( item.numberProperty, range,
        optionize<NumberDisplayOptions, {}, NumberDisplayOptions>( numberDisplayOptions, item.numberDisplayOptions )
      );

      // Don't allow the NumberDisplay to grow, since it's in a ComboBox
      itemNode.maxWidth = itemNode.width;
      itemNode.maxHeight = itemNode.height;

      comboBoxItems.push( new ComboBoxItem( itemNode, item.choice, {
        tandemName: item.tandemName || null
      } ) );
    } );

    super( comboBoxItems, choiceProperty, listParent, options );
  }
}

sceneryPhet.register( 'ComboBoxDisplay', ComboBoxDisplay );