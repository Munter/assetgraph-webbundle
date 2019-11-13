const { resolve } = require('path');
const AssetGraph = require('assetgraph');
const webbundle = require('../lib/webbundle');

describe('when bundling local pages', () => {
  it('should a single html page with no external assets', async () => {
    const graph = new AssetGraph({
      root: resolve(__dirname, '../testdata/onlyHtml'),
      canonicalRoot: 'https://mntr.dk/'
    });

    await graph.logEvents();
    await graph.loadAssets('index.html');
    await graph.populate();

    await webbundle(graph, 'local.onlyHtml.wbn');
  });
});
