const AssetGraph = require('assetgraph');
const webbundle = require('../lib/webbundle');

describe('when bundling online pages', () => {
  it('should bundle https://mntr.dk', async () => {
    const graph = new AssetGraph({
      root: 'https://mntr.dk/',
      canonicalRoot: 'https://mntr.dk/'
    });

    await graph.loadAssets('/');
    await graph.populate({
      followRelations: {
        type: {
          $nin: [
            'HtmlAnchor',
            'HtmlAlternateLink',
            'SourceMapFile',
            'SourceMapSource'
          ],
          crossorigin: false
        }
      }
    });

    await webbundle(graph, 'mntr.dk.wbn');
  });
});
