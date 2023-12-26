import {replaceEmoji} from '@_/assets/img/emoji/emojUtil';
/*
路由列表处理 
@router {*} router 
@data {*} 菜单列表
@data {*} onelevel
*/
function generaMenu(router,data,onelevel){
    data.forEach(item=>{
        let menu=Object.assign({},item);
        let component=menu.component;
        if(component){
            menu.component=()=>import(`@/${component}.vue`);//组件
        }
        if(menu.childs){
            menu.children=[];
            generaMenu(menu.children,menu.childs,onelevel?onelevel:menu);
        }
        if(component){
            if(onelevel){
                onelevel.children.push(menu); 
            }else{
                router.push(menu); 
            }
        }
    })
}

/* 是否为空 */
function isBlank(value){
    if(value===null||value===undefined||value==="null"||value==="undefined"||value==="")
    return true;
}

/* 
 去重
 @param {*} data 数组
*/
function unique(data){
	let obj={};
	let arr=[];
	for(let key of data){
	  if(!obj[key.path]){
		arr.push(key);
		obj[key.path]=1;
	  }
	}
	return arr;
}

/* base64转blob */
function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

/* 路径处理 */
function resUrl(path) {
    let config=JSON.parse(localStorage.getItem("tiomgconfig"));
    let res_server=config['res.server'];
    // res_server='https://res.tx.t-io.org'
    if (path) {
        var isAbPath = path.indexOf("http://");
        var isAbsPath = path.indexOf("https://");
        if (isAbPath >= 0 || isAbsPath >= 0) {
            return path;
        } else {
            if (path.indexOf("/") == 0) {
                return res_server + path;
            } else {
                return res_server + "/" + path;
            }
        }
    } else {
        return null;
    }
}

function formatSize1(size) {
    return formatSize(size, 2, ['B', 'K', 'M', 'G', 'TB']);
}
/**
 * 格式化文件大小, 输出成带单位的字符串
 * @param {Number} size 文件大小
 * @param {Number} [pointLength=2] 精确到的小数点数。
 * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 单位数组。从字节，到千字节，一直往上指定。
 *    如果单位数组里面只指定了到了K(千字节)，同时文件大小大于M, 此方法的输出将还是显示成多少K.
 */
function formatSize(size, pointLength, units) {
    if (!size) {
        return "0";
    }

    var initsize = size;

    var unit;
    units = units.concat() || ['B', 'K', 'M', 'G', 'TB'];
    while ((unit = units.shift()) && size > 1024) {
        size = size / 1024;
    }
    return /*initsize + "_" + */(unit === 'B' ? size : size.toFixed(pointLength === undefined ? 2 : pointLength)) + unit;
}

/* 处理消息体中的表情 */
function messageEmoji(str){
    if(!str){
        return;
    }
    if (str.match(/\[([^(\]|\[)]*)\]/g) != null) {
        str = replaceEmoji(str);
    };
    return str;
}

/**
 * 日期格式化
 * @param {*} time  时间戳
 * @param {*} fmt  格式：yyyy-MM-dd HH:mm:ss
 */
function formatDateByTime(time, fmt) {
    var date = new Date();
    date.setTime(time);
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "H+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}
/**
 * beautify Date 美化时间
 * 返回：刚刚、几分钟前、几小时前、几年前等
 * @param {*} dateStr 
 */
function btDate(dateStr) {
    if (isBlank(dateStr)) {
        return "时间丢失";
    }

    var s1 = Date.parse(dateStr.replace(/-/g, "/"));
    var s2 = new Date().getTime();
    var iv = s2 - s1;

    var m = Math.round(iv / (1000 * 60));  //经历了多少分钟
    var hour;
    var day;
    var year;
    // 一年525600分钟
    if (m < 1) {
        return "刚刚";
    } else if (m >= 1 && m < 59) {
        return m + "分钟前";
    } else if (m >= 60) {
        hour = Math.round(m / 60);  //经历了多少小时
        if (m < 1440) {
            return hour + "小时前";
        } else {
            day = Math.round(hour / 24);  //经历了多少天
            if (day <= 365) {
                return day + "天前";
            } else {
                year = Math.round(day / 365);  //经历了多少年
                if (year <= 10) {
                    return year + "年前";
                } else {
                    return "很久以前";
                }
            }
        }
    }

    return "时间丢失";
};
export {
	generaMenu,
    isBlank,
    unique,
    dataURLtoBlob,
    resUrl,
    formatSize1,
    messageEmoji,
    formatDateByTime,
    btDate
}