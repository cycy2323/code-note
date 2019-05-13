import GBServiceParam from './GBServiceParam'

export default class ImageUrlManager {
    //统一处理图片URI
    static dealURI(uri){
        String.prototype.startWith = function (startStr) {
            var d = this.length - startStr.length;
            return (d >= 0 && this.indexOf(startStr) == 0)
        }

        if (uri.startWith('http'))
        {
            //如果uri是全路径 则客户端不做拼装
            return uri;
        }
        else
        {
            //如果是相对路径 则客户端需要做拼装
            if (GBServiceParam.currentPort === '8989' || GBServiceParam.currentPort === '8787')
            {
                //如果是8989或者8787则都走http+8787
                let spliceUri = "http://"+GBServiceParam.currentIP+":8787"+uri;
                return spliceUri;
            }
            else
            {
                //否则都走默认80端口
                let spliceUri = "http://"+GBServiceParam.currentIP+uri;
                return spliceUri;
            }
        }
    }
}