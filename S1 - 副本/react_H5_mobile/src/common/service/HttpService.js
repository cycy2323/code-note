import { Service } from 'soul'

/**
 * this._get(url, {param: param})
 * this._post(url, {param: param, isFormData: false, isQueryData: false, showDefault: false})
 * this._put(url, {param: param, isFormData: false, isQueryData: false, showDefault: false})
 * this._delete(url, param, showDefault)
 * 参数说明：
 * param: 请求参数, isFormData: 是否以formdata的形式提交。 isQueryData: 是否以query的方式提交, showDefault: 是否显示默认提示
 * 返回说明：
 * Promise对象
 */
export default class HttpService extends Service {
  constructor (option){
    super(option)
  }
  /**
     * 公共接口
     */

}
