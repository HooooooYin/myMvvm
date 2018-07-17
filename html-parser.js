const tagName = /^\s*\w*/       //标签名
const space = /^\s*/         //空白符
const attr_str = /^(\s*\w*\s*=\s*\w\*)*/   //标签参数
const tabEnd = /^\s*<\/\w*>/   //结束标签

let attrs = makeMap('id,class,style')

function makeMap(values){
    let map = {}
    values = values.split(',')
    for(value in values){
        map[value] = 1
    }
    return function(value){
        return map[value.toLowerCase()] === 1
    }
}

function HTMLPraser(html){
    let textEnd = 0
    let lastTab, lastNode           //最新读取到的tab以及对应的节点
    let tabStack = [], topTab                //标签栈以及栈顶节点
    let tabStart, rest
    while(html){
        if(!lastTab){                   //没有识别到标签时候
            textEnd = html.indexOf('<');
            if(textEnd === 0){
                if(/^<!--/.test(html)){
                    let commentEnd = html.indexOf('-->')
    
                    if(commentEnd >= 0){
                        let commentText = html.substring(4, commentEnd)
                        // 对注释内容进行处理
                        html = html.substring(commentEnd + 3)
                        continue
                    }
                }
                if(tagName.test(html)){
                    // 获得标签名，生成标签
                    tagStart = html.match(space)
                    html = html.substring(tagStart.length)
                    lastTab = html.match(tagName)
                    html = html.substring(lastTab.length)

                    // 创建dom，把标签插入父元素
                    lastNode = document.createElement(lastTab)
                    if(tabStack.length !== 0){
                        topTab = tabStack[tabStack.length - 1]
                        topTab.appendChild(lastNode)
                    }

                    // 开始标签，就入栈
                    tabStack.push(lastNode)
                }
                // 结束标签
                if(tagEnd.test(html)){
                    rest = html.match(tabEnd)
                    html = html.substring(tagEnd.length)
                    lastTab = rest.match(/\w*/)
                    if(lastTab === tabStack[tabStack.length - 1]){
                        tabStack.pop()
                        lastTab = null
                        lastNode = null
                    }
                }
            }
        // 识别到标签的时候
        }else{
            if(attr_str.test(html)){
                let attrStart = html.match(attr_str)           //匹配到key = value形式
                html = html.substring(attrStart.length)
                let attrAndVal = attrStart.split(/\s+/)            //0： key， 1： =， 2： val
                lastNode.setAttribute(attrAndVal[0], attrAndVal[2])  //设置属性
            }
            if(/^\s*>/.test(html)){
                tagEnd = html.indexOf()
                lastTab = null
                lastNode = null
            }else if(/^\s*\/>/.test(html)){
                if(tabStack[tabStack.length - 1] === lastTab){
                    lastTab = null
                    lastNode = null
                    tabStack.pop()
                }
                else return
            }
        }
    }
}