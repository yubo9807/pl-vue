import { h, renderToString } from "~/vue";
import App, { base } from "./app";
import { createServer } from 'http';
import { readFileSync, readFile } from 'fs';
import { resolve, extname } from 'path';

const html = readFileSync(resolve(__dirname, base.slice(1), './index.html'), 'utf-8');
const staticExtList = [
  'html', 'css', 'js', 'json',
  'xml', 'txt',
  'ico', 'png', 'jpg', 'gif',
  'ttf', 'woff', 'worf2',
  'gz',
];

const server = createServer((req, res) => {

  const url = req.url;
  const ext = extname(url);

  if (staticExtList.includes(ext.slice(1))) {
    console.log(resolve(__dirname, base.slice(1), url.slice(1)))
    // 静态资源
    readFile(resolve(__dirname, base.slice(1), url.slice(1)), (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.write(content);
        res.end();
      }
    });
  } else {
    // 服务端渲染
    const content = renderToString(<App isBrowser={false} url={url} />);
    const newHTML = html.replace('loading', content);
    res.write(newHTML);
    res.end();
  }

});

const port = 3000;
server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
