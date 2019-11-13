const { writeFile } = require('fs').promises;
const wbn = require('wbn');

/**
 * @param {AssetGraph} graph
 */
module.exports = async function webbundle(graph, outfile) {
  console.log(graph.canonicalRoot);
  const builder = new wbn.BundleBuilder(graph.canonicalRoot);

  const manifest = graph.findAssets({ type: 'ApplicationManifest' })[0];

  if (manifest) {
    builder.addManifestURL(
      manifest.url.replace(graph.root, graph.canonicalRoot)
    );
  }

  const allAssets = graph.findAssets({ isLoaded: true, isInline: false });

  if (allAssets.length === 0) {
    console.error('Empty graph');
    return;
  }

  for (const asset of allAssets) {
    const url = asset.url
      .replace(graph.root, graph.canonicalRoot)
      .replace('/index.html', '/');

    builder.addExchange(
      url,
      200,
      {
        'Content-Type': asset.contentType,
        'Access-Control-Allow-Origin': '*'
      },
      asset.isText ? asset.text : asset.rawSrc
    );
  }

  await writeFile(outfile, builder.createBundle());
};
