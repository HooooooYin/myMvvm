// mvvm框架类
class FrameWork{
    constructor(options){
        this.$options = options
        this._data = options.data
        // 根据el项选择dom，并转化成序列化字符串片段
        const el = this._el = document.querySelector(options.el)
        const el_str = getOuterHTML(el)


        // 编译
        compile(el_str);
    }
}


// 获得el的序列化字符串片段
function getOuterHTML(el){
    if(el.outerHTML){
        return el.outerHTML
    }else{
        const container = document.createElement('div')
        container.appendChild(el.cloneNode(true))
        return container
    }
}


// 编译html字符串
function compile(html){
    html = html.trim()
    return HTMLPraser(html)
}

