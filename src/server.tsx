import { h, renderToString } from "~/vue";
import App, { base, routes } from "./app";
import { createServer } from 'http';
import { readFileSync, readFile } from 'fs';
import { resolve, extname } from 'path';

const mimeTypes = {
  'text/html': ['.html'],
  'text/css': ['.css'],
  'application/javascript;': ['.js'],
  'application/json': ['.json'],
  'image/vnd.microsoft.icon': ['.ico'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'application/pdf': ['.pdf'],
  'font/woff2': ['.worf2'],
  'font/woff': ['.worf'],
  'font/ttf': ['.ttf'],
  'application/octet-stream': ['.mp4', '.avi'],
}

/**
 * 获取所有静态文件的后缀
 * @returns 
 */
function getStaticFileExts() {
  const exts = Object.values(mimeTypes).flat();
  return ['.gz'].concat(exts);
}

/**
 * 获取文件 content-type 类型
 * @param filename 
 * @returns 
 */
function getMimeType(filename: string) {
  const ext = extname(filename).toLowerCase();
  let type: string = null;
  for (const key in mimeTypes) {
    if (mimeTypes[key].includes(ext)) {
      type = key;
      break;
    }
  }
  type ??= 'text/html;';
  return type;
}

// html 模版
const html = readFileSync(resolve(__dirname, base.slice(1), './index.html'), 'utf-8');

/**
 * 生成节点前执行组件的 getInitialProps 方法
 * @param url 
 * @returns 
 */
async function getInitialProps(url: string) {
  url = url.replace(base, '');
  const route = routes.find(val => {
    if (val.exact) {
      return url === val.path;
    } else {
      return (url + '/').startsWith(val.path + '/');
    }
  });
  if (route && typeof route.component.prototype.getInitialProps === 'function') {
    return await route.component.prototype.getInitialProps();
  } else {
    return void 0;
  }
}

const server = createServer(async (req, res) => {

  const url = req.url;
  const ext = extname(url);

  if (getStaticFileExts().includes(ext)) {
    // 静态资源
    const filename = resolve(__dirname, url.slice(1));
    readFile(filename, (err, content) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.setHeader('Content-Type', getMimeType(filename));
        res.write(content);
        res.end();
      }
    });
  } else {
    // 服务端渲染
    const data = await getInitialProps(url);
    const content = renderToString(<App isBrowser={false} url={url} data={data} />);
    const index = html.search('</body>');
    const script = data === void 0 ? '' : `<script>window.g_initialProps=${JSON.stringify(data)}</script>`;
    const newHtml = html.slice(0, index) + script + html.slice(index, html.length);
    res.write(newHtml.replace('<!--ssr-outlet-->', content));
    res.end();
  }

});

const port = 3000;
server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
