const { writeFile } = require('fs').promises;
const toArrayBuffer = require('to-arraybuffer');
const wbn = require('wbn');

/**
 * @param {AssetGraph} graph
 */
module.exports = async function webbundle(graph, outfile) {
  const builder = new wbn.BundleBuilder(graph.canonicalRoot);

  const manifest = graph.findAssets({ type: 'ApplicationManifest' })[0];

  if (manifest) {
    builder.addManifestURL(
      manifest.url.replace(graph.root, graph.canonicalRoot)
    );
  }

  const allAssets = graph.findAssets({ isLoaded: true, isInline: false });

  for (const asset of allAssets) {
    builder.addExchange(
      asset.url.replace(graph.root, graph.canonicalRoot),
      200,
      {
        'Content-Type': asset.contentType
      },
      toArrayBuffer(asset.rawSrc)
    );
  }

  await writeFile(outfile, builder.createBundle());
};
