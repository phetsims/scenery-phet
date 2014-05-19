// Copyright 2002-2014, University of Colorado Boulder

// RequireJS configuration file for scenery-phet
require.config(
  {
    deps: ['scenery-phet-main'],

    paths: {

      // third party libs
      text: '../../sherpa/text',

      // plugins
      image: '../../chipper/requirejs-plugins/image',
      string: '../../chipper/requirejs-plugins/string',

      // PhET libs, uppercase names to identify them in require.js imports
      ASSERT: '../../assert/js',
      AXON: '../../axon/js',
      BRAND: '../../brand/js',
      DOT: '../../dot/js',
      JOIST: '../../joist/js',
      KITE: '../../kite/js',
      PHETCOMMON: '../../phetcommon/js',
      PHET_CORE: '../../phet-core/js',
      SCENERY: '../../scenery/js',
      SCENERY_PHET: '../../scenery-phet/js',
      SHERPA: '../../sherpa',
      SUN: '../../sun/js',
      VEGAS: '../../vegas/js'
    },

    urlArgs: new Date().getTime()  // cache buster to make browser refresh load all included scripts

  } );
