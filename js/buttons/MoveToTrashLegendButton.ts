// Copyright 2022, University of Colorado Boulder

/**
 * When a MoveToTrashLegendButton appears in a legend or as part of a bar chart label, typically it is smaller,
 * flat and with more muted colors.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import sceneryPhet from '../sceneryPhet.js';
import MoveToTrashButton, { MoveToTrashButtonOptions } from './MoveToTrashButton.js';
import ButtonNode from '../../../sun/js/buttons/ButtonNode.js';

type SelfOptions = EmptySelfOptions;

export default class MoveToTrashLegendButton extends MoveToTrashButton {

  public constructor( providedOptions?: MoveToTrashButtonOptions ) {

    const options = optionize<MoveToTrashButtonOptions, SelfOptions, MoveToTrashButtonOptions>()( {

      baseColor: 'rgb( 230, 230, 240 )',
      buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy,
      cornerRadius: 6,
      xMargin: 7,
      yMargin: 3,
      iconScale: 0.4
    }, providedOptions );

    super( options );
  }
}

sceneryPhet.register( 'MoveToTrashLegendButton', MoveToTrashLegendButton );