import { Request, SateConfig, asyncto } from "@/utils/network";
import env from "~/config/env";

class Request2 extends Request {

  constructor() {
    super({
      baseURL: env.BASE_API,
      timeout: 5000,
    })
  }

}

const request = new Request2();

export default function(config: SateConfig) {
  return asyncto(request.instance(config));
}
