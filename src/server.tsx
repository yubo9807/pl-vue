import { createServer } from 'http';
import { readFileSync, readFile } from 'fs';
import { resolve, extname } from 'path';
import { h, renderToString } from "~/plvue";
import { execGetInitialProps } from "~/plvue/router";
import App from "./app";
import { getMimeType, getStaticFileExts } from "./utils/string";
import env from "~/config/env";

const deployUrl = env.BASE_URL.slice(1);

// html 模版
const html = readFileSync(resolve(__dirname, deployUrl, 'index.html'), 'utf-8');

const server = createServer(async (req, res) => {

  const url = req.url.replace(env.BASE_URL || '/', '/');
  const ext = extname(url);

  if (getStaticFileExts().includes(ext)) {
    // 静态资源
    const filename = resolve(__dirname, deployUrl, url.slice(1));
    readFile(filename, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        const contentType = getMimeType(ext);
        contentType && res.setHeader('Content-Type', contentType);
        res.write(content);
        res.end();
      }
    });
  } else {
    // 服务端渲染
    const data = await execGetInitialProps(url);
    const content = renderToString(<App url={url} data={data} />);
    const index = html.search('</body>');
    const script = data === void 0 ? '' : `<script>window.g_initialProps=${JSON.stringify(data)}</script>`;
    const newHtml = html.slice(0, index) + script + html.slice(index, html.length);
    res.write(newHtml.replace('<!--ssr-outlet-->', content));
    res.end();
  }

});

const port = 3000;
server.listen(port, () => {
  console.log(`http://localhost:${port}${env.BASE_URL}`);
});
