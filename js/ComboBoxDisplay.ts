// Copyright 2019-2022, University of Colorado Boulder

/**
 * ComboBoxDisplay is the lovechild of a ComboBox and a NumberDisplay. It allows the user to choose one of N dynamic
 * numeric values. ComboBox was designed to display static choices, so this component ensures that none of its items
 * grow wider/taller than their initial size.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../dot/js/Range.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StringUtils from '../../phetcommon/js/util/StringUtils.js';
import { Node } from '../../scenery/js/imports.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../sun/js/ComboBox.js';
import NumberDisplay, { NumberDisplayOptions } from './NumberDisplay.js';
import PhetFont from './PhetFont.js';
import sceneryPhet from './sceneryPhet.js';
import sceneryPhetStrings from './sceneryPhetStrings.js';
import Property from '../../axon/js/Property.js';
import IReadOnlyProperty from '../../axon/js/IReadOnlyProperty.js';

// constants
const DEFAULT_FONT = new PhetFont( 14 );

type SubsetOfNumberDisplayOptions = StrictOmit<NumberDisplayOptions, 'valuePattern'>;

// Describes an item in the ComboBoxDisplay
export type ComboBoxDisplayItem<T> = {

  // a value of choiceProperty that corresponds to the item
  choice: T;

  // the item's numeric value
  numberProperty: IReadOnlyProperty<number>;

  // the range of the item's numeric value
  range: Range;

  // the units used to label the item's numeric value
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

export default class ComboBoxDisplay<T> extends ComboBox<T> {

  /**
   * @param choiceProperty - determines which item is currently selected
   * @param items - describes the items that appear in the ComboBox
   * @param listParent - parent for the ComboBox list
   * @param providedOptions?
   */
  public constructor( choiceProperty: Property<T>, items: ComboBoxDisplayItem<T>[], listParent: Node,
                      providedOptions?: ComboBoxDisplayOptions ) {

    const options = optionize<ComboBoxDisplayOptions, SelfOptions, ComboBoxOptions>()( {

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
    const comboBoxItems: ComboBoxItem<T>[] = [];
    items.forEach( item => {

      // optionize only supports 2 sources of option values, and we have 3.
      // So use 2 optionize calls to assemble the options for the item's NumberDisplay.
      // Order is important here, so that we don't write to options.numberDisplayOptions or item.numberDisplayOptions,
      // and so that item.numberDisplayOptions overrides options.numberDisplayOptions.
      const numberDisplayOptions = combineOptions<NumberDisplayOptions>( {
        valuePattern: StringUtils.fillIn( sceneryPhetStrings.comboBoxDisplay.valueUnits, { units: item.units } )
      }, options.numberDisplayOptions );

      const itemNode = new NumberDisplay( item.numberProperty, item.range,
        combineOptions<NumberDisplayOptions>( numberDisplayOptions, item.numberDisplayOptions )
      );

      // Don't allow the NumberDisplay to grow, since it's in a ComboBox
      itemNode.maxWidth = itemNode.width;
      itemNode.maxHeight = itemNode.height;

      comboBoxItems.push( {
        value: item.choice,
        node: itemNode,
        tandemName: item.tandemName || null
      } );
    } );

    super( choiceProperty, comboBoxItems, listParent, options );
  }
}

sceneryPhet.register( 'ComboBoxDisplay', ComboBoxDisplay );