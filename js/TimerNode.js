// Copyright 2014-2018, University of Colorado Boulder

/**
 * Shows a readout of the elapsed time, with play and pause buttons.  By default there are no units (which could be used
 * if all of a simulations time units are in 'seconds'), or you can specify a selection of units to choose from.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Anton Ulyanov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanRectangularToggleButton = require( 'SUN/buttons/BooleanRectangularToggleButton' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var sceneryPhet = require( 'SCENERY_PHET/sceneryPhet' );
  var ShadedRectangle = require( 'SCENERY_PHET/ShadedRectangle' );
  var Shape = require( 'KITE/Shape' );
  var Tandem = require( 'TANDEM/Tandem' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var UTurnArrowShape = require( 'SCENERY_PHET/UTurnArrowShape' );

  /**
   * @param {Property.<number>} secondsProperty
   * @param {Property.<boolean>} runningProperty
   * @param {Object} [options]
   * @constructor
   */
  function TimerNode( secondsProperty, runningProperty, options ) {
    Tandem.indicateUninstrumentedCode();
    var self = this;
    var timerNodeOptionDefaults = {
      iconColor: '#333',
      buttonBaseColor: '#DFE0E1',
      unitsChoices: [], // {string[]} The possible string values for units, or the empty array for a unitless display
      units: null // {string|null} The currently selected value for units, or null for a unitless display
    };
    var supertypeOptionDefaults = {
      touchAreaDilation: 10,
      cursor: 'pointer'
    };
    options = _.extend( {}, supertypeOptionDefaults, timerNodeOptionDefaults, options );

    // If only current units were provided, promote that to the only unitsChoices entry
    if ( options.units && !options.unitChoices ) {
      options.unitChoices = [ options.units ];
    }

    // If unitsChoices were provided, default to the first units.
    if ( options.unitsChoices && !options.units ) {
      options.units = options.unitsChoices[ 0 ];
    }

    // @private {string} - the selected units
    this.units = options.units;

    if ( options.unitsChoices && options.units ) {
      assert && assert( options.unitsChoices.indexOf( options.units ) >= 0, 'unitsChoices does not contain units' );
    }

    Node.call( this );

    /*---------------------------------------------------------------------------*
     * Readout text
     *----------------------------------------------------------------------------*/
    var largeNumberText = new PhetFont( 20 );
    var bigReadoutText = new Text( this.timeToBigString( 0 ), {
      font: largeNumberText
    } );
    var smallFont = new PhetFont( 15 );
    var smallReadoutText = new Text( this.timeToSmallString( 0 ), {
      font: smallFont,
      left: bigReadoutText.right
    } );

    // @private {Text[]} - one node for each supported units string
    this.unitsTexts = options.unitsChoices.map( function( units ) {
      return new Text( units, {
        font: smallFont,
        left: smallReadoutText.right + 4
      } );
    } );

    // Perform layout with all children, then just show the selected units after layout complete.
    this.unitsNode = new Node( {
      children: this.unitsTexts
    } );

    // aligns the baselines of the big and small text
    smallReadoutText.bottom = smallReadoutText.bounds.maxY - bigReadoutText.bounds.minY;
    bigReadoutText.top = 0;
    if ( this.unitsNode.children.length > 0 ) {
      this.unitsNode.bottom = smallReadoutText.bottom;
    }
    var readoutText = new Node( {
      children: [
        bigReadoutText,
        smallReadoutText,
        this.unitsNode
      ],
      pickable: false
    } );
    readoutText.centerX = 0;

    /*---------------------------------------------------------------------------*
     * Readout background
     *----------------------------------------------------------------------------*/
    var textBackground = Rectangle.roundedBounds( readoutText.bounds.dilatedXY( 5, 2 ), 5, 5, {
      fill: '#fff',
      stroke: 'rgba(0,0,0,0.5)',
      pickable: false
    } );

    var paddingBetweenItems = 6;
    var minimumButtonWidth = ( textBackground.width - paddingBetweenItems ) / 2 - 1; // -1 due to the stroke making it look mis-aligned

    /*---------------------------------------------------------------------------*
     * Buttons
     *----------------------------------------------------------------------------*/
    var resetAllShape = new UTurnArrowShape( 10 );
    var playPauseHeight = resetAllShape.bounds.height;
    var playPauseWidth = playPauseHeight;
    var halfPlayStroke = 0.05 * playPauseWidth;
    var playOffset = 0.15 * playPauseWidth;
    var playShape = new Shape().moveTo( playPauseWidth - halfPlayStroke * 0.5 - playOffset, 0 )
      .lineTo( halfPlayStroke * 1.5 + playOffset, playPauseHeight / 2 - halfPlayStroke - playOffset )
      .lineTo( halfPlayStroke * 1.5 + playOffset, -playPauseHeight / 2 + halfPlayStroke + playOffset )
      .close().getOffsetShape( -playOffset );

    // a stop symbol (square)
    var pauseShape = Shape.bounds( new Bounds2( 0, -playPauseHeight / 2, playPauseWidth, playPauseHeight / 2 ).eroded( playPauseWidth * 0.1 ) );

    var resetButton = new RectangularPushButton( {
      listener: function resetTimer() {
        runningProperty.set( false );
        secondsProperty.set( 0 );
      },
      content: new Path( resetAllShape, {
        fill: options.iconColor
      } ),
      baseColor: options.buttonBaseColor,
      minWidth: minimumButtonWidth
    } );

    var playPauseButton = new BooleanRectangularToggleButton(
      new Path( pauseShape, { fill: options.iconColor } ),
      new Path( playShape, {
        stroke: options.iconColor,
        fill: '#eef',
        lineWidth: halfPlayStroke * 2
      } ), runningProperty, {
        baseColor: options.buttonBaseColor,
        minWidth: minimumButtonWidth
      } );

    /*---------------------------------------------------------------------------*
     * Layout
     *----------------------------------------------------------------------------*/
    var container = new Node();
    container.addChild( resetButton );
    container.addChild( playPauseButton );
    container.addChild( textBackground );
    container.addChild( readoutText );

    resetButton.right = -paddingBetweenItems / 2;
    playPauseButton.left = paddingBetweenItems / 2;
    resetButton.top = textBackground.bottom + paddingBetweenItems;
    playPauseButton.top = textBackground.bottom + paddingBetweenItems;

    var panelPad = 8;
    container.left = panelPad;
    container.top = panelPad;

    /*---------------------------------------------------------------------------*
     * Panel background
     *----------------------------------------------------------------------------*/
    var roundedRectangle = new ShadedRectangle( container.bounds.dilated( panelPad ) );
    roundedRectangle.touchArea = roundedRectangle.localBounds.dilated( options.touchAreaDilation );
    this.addChild( roundedRectangle );
    this.addChild( container );

    /*---------------------------------------------------------------------------*
     * Control logic
     *----------------------------------------------------------------------------*/
    var updateTime = function updateTime( value ) {
      bigReadoutText.text = self.timeToBigString( value );
      smallReadoutText.text = self.timeToSmallString( value );
      resetButton.enabled = value > 0;

      smallReadoutText.left = bigReadoutText.right;
      if ( self.units ) {
        self.unitsNode.left = smallReadoutText.right + 3;
      }
    };
    secondsProperty.link( updateTime );

    /*---------------------------------------------------------------------------*
     * Target for drag listeners
     *----------------------------------------------------------------------------*/
    this.dragTarget = roundedRectangle;

    // @private
    this.disposeTimerNode = function() {
      secondsProperty.unlink( updateTime );
      resetButton.dispose();
      playPauseButton.dispose();
    };

    // Omit TimerNode specific options before passing along to parent.  See https://github.com/phetsims/tasks/issues/934
    // for discussion of other ways to filter the options
    this.mutate( _.omit( options, _.keys( timerNodeOptionDefaults ) ) );

    if ( options.units ) {
      this.setUnits( options.units );
    }
  }

  sceneryPhet.register( 'TimerNode', TimerNode );

  return inherit( Node, TimerNode, {

    /**
     * Release resources when no longer be used.
     * @public
     */
    dispose: function() {
      this.disposeTimerNode();
    },

    /**
     * Set the units for the readout.  Must be one of the units specified in unitsChoices in the constructor.
     * @param {string|null} units
     * @public
     */
    setUnits: function( units ) {
      this.units = units;
      var unitsText = _.find( this.unitsTexts, function( unitsText ) {return unitsText.text === units;} );
      assert && assert( unitsText, 'Units text not found for units: ' + units );
      this.unitsNode.children = [ unitsText ];
    },

    // the full-sized minutes and seconds string
    timeToBigString: function( timeInSeconds ) {
      // Round to the nearest centisecond (compatible with timeToSmallString).
      // see https://github.com/phetsims/masses-and-springs/issues/156
      timeInSeconds = Util.roundSymmetric( timeInSeconds * 100 ) / 100;

      // When showing units, don't show the "00:" prefix, see https://github.com/phetsims/scenery-phet/issues/378
      if ( this.units ) {
        return Math.floor( timeInSeconds ) + '';
      }
      else {

        var minutes = Math.floor( timeInSeconds / 60 ) % 60;
        var seconds = Math.floor( timeInSeconds ) % 60;

        if ( seconds < 10 ) {
          seconds = '0' + seconds;
        }
        if ( minutes < 10 ) {
          minutes = '0' + minutes;
        }
        return minutes + ':' + seconds;
      }
    },

    // the smaller hundredths-of-a-second string
    timeToSmallString: function( timeInSeconds ) {
      // Round to the nearest centisecond (compatible with timeToSmallString).
      // see https://github.com/phetsims/masses-and-springs/issues/156
      timeInSeconds = Util.roundSymmetric( timeInSeconds * 100 ) / 100;

      // Rounding after mod, in case there is floating-point error
      var centiseconds = Util.roundSymmetric( timeInSeconds % 1 * 100 );
      if ( centiseconds < 10 ) {
        centiseconds = '0' + centiseconds;
      }
      return '.' + centiseconds;
    }
  } );
} );