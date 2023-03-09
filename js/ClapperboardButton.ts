// Copyright 2022-2023, University of Colorado Boulder

/**
 * A Node that produces a variety of loud outputs to support data synchronizing during a recording.
 * This includes sound, visuals, and the PhET-iO data stream.
 *
 * This is prototype code and intended to be used in studies with users to assist with data collection.
 * Not a typical UI component.
 *
 * Next time this is used: Would be nice to emit a PhET-iO state when triggered
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import optionize, { combineOptions } from '../../phet-core/js/optionize.js';
import StrictOmit from '../../phet-core/js/types/StrictOmit.js';
import OscillatorSoundGenerator from '../../tambo/js/sound-generators/OscillatorSoundGenerator.js';
import videoSolidShape from '../../sherpa/js/fontawesome-5/videoSolidShape.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../sun/js/buttons/RectangularPushButton.js';
import sceneryPhet from './sceneryPhet.js';
import { Node, NodeOptions, Path, RichText } from '../../scenery/js/imports.js';
import soundManager from '../../tambo/js/soundManager.js';
import BackgroundNode from './BackgroundNode.js';
import stepTimer from '../../axon/js/stepTimer.js';
import Tandem from '../../tandem/js/Tandem.js';

const SOUND_DURATION = 1000;
const BUTTON_LABEL = 'Synchronize Recording';

type SelfOptions = {
  visualNode?: Node;
  synchronizeButtonOptions?: StrictOmit<RectangularPushButtonOptions, 'listener' | 'tandem'>;
};

type ClapperboardButtonOptions = SelfOptions & NodeOptions;

class ClapperboardButton extends Node {
  private readonly disposeClapperboardButton: () => void;

  public constructor( providedOptions?: ClapperboardButtonOptions ) {

    // A single waveform with a high pitch should hopefully be easy to find in recordings,
    // see https://github.com/phetsims/scenery-phet/issues/739#issuecomment-1142395903
    const soundGenerator = new OscillatorSoundGenerator( {
      initialFrequency: 880
    } );
    soundManager.addSoundGenerator( soundGenerator );

    const options = optionize<ClapperboardButtonOptions, SelfOptions, NodeOptions>()( {
      excludeInvisibleChildrenFromBounds: true,
      visualNode: new BackgroundNode( new Path( videoSolidShape, { scale: 2, fill: 'red' } ), {
        xMargin: 20,
        yMargin: 20,
        rectangleOptions: {
          fill: 'black',
          opacity: 1
        }
      } ),
      synchronizeButtonOptions: {
        content: new RichText( BUTTON_LABEL ),
        innerContent: BUTTON_LABEL,
        voicingNameResponse: BUTTON_LABEL,
        soundPlayer: {
          play: () => {
            soundGenerator.play();
          },
          stop: _.noop
        }
      },

      // phet-io
      tandem: Tandem.REQUIRED,
      tandemNameSuffix: 'Button'
    }, providedOptions );

    super( options );

    options.visualNode.visible = false;
    this.addChild( options.visualNode );

    const synchronizeButton = new RectangularPushButton( combineOptions<RectangularPushButtonOptions>( {
      listener: () => {

        // so that this listener cannot be called more than once
        synchronizeButton.enabled = false;

        options.visualNode.visible = true;
        stepTimer.setTimeout( () => {
          options.visualNode.visible = false;
          soundGenerator.stop();
        }, SOUND_DURATION );
      },
      tandem: options.tandem.createTandem( 'synchronizeButton' )
    }, options.synchronizeButtonOptions ) );
    this.addChild( synchronizeButton );

    this.disposeClapperboardButton = () => {
      synchronizeButton.dispose();
    };
  }

  public override dispose(): void {
    this.disposeClapperboardButton();
    super.dispose();
  }
}

sceneryPhet.register( 'ClapperboardButton', ClapperboardButton );

export default ClapperboardButton;