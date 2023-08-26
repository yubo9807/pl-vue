import { Request, SateConfig, asyncto } from "@/utils/network";
import env from "~/config/env";

class Request2 extends Request {

  constructor() {
    super({
      // baseURL: env.NODE_ENV === 'development' ? '/api' : 'http://hicky.hpyyb.cn/api',
      baseURL: 'http://127.0.0.1:20010/api',
      timeout: 5000,
    })
  }

}

const request = new Request2();

export default function(config: SateConfig) {
  return asyncto(request.instance(config));
}
