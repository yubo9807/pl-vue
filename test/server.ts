import { createServer } from 'http';
import { readFileSync, readFile } from 'fs';
import { resolve, extname } from 'path';
import { ssrOutlet } from "~/core/router";
import App from "./app";
import { getMimeType, getStaticFileExts } from "./utils/string";
import env from "~/config/env";
import app from './basic';

// html 模版
const html = readFileSync(resolve(__dirname, 'index.html'), 'utf-8');

const server = createServer(async (req, res) => {

  const url = req.url.replace(env.BASE_URL, '');
  const ext = extname(url);

  if (getStaticFileExts().includes(ext)) {
    // 静态资源
    const filename = resolve(__dirname, url.slice(1));

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
    const appTostring = app.renderToString(App())
    const content = await ssrOutlet(appTostring, url, html);
    res.write(content);
    res.end();
  }

});

const port = 3000;
server.listen(port, () => {
  console.log(`http://localhost:${port}${env.BASE_URL}`);
});
