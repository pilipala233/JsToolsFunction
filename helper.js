var helper = function () {

    /**
     * @description: 深度克隆（一个很常见的递归克隆）
     * @param {Object} obj 需要拷贝的对象
     * @param {Object} parent 对象类型递归时的父对象，使用时不需要传
     * @return {Object} 拷贝后的对象
     * 
     */
    this.deepClone = function deepClone(obj, parent = null) {
        let result; // 最后的返回结果

        let _parent = parent; // 防止循环引用
        while (_parent) {
            if (_parent.originalParent === obj) {
                return _parent.currentParent;
            }
            _parent = _parent.parent;
        }

        if (obj && typeof obj === "object") { // 返回引用数据类型(null已被判断条件排除))
            if (obj instanceof RegExp) { // RegExp类型
                result = new RegExp(obj.source, obj.flags)
            } else if (obj instanceof Date) { // Date类型
                result = new Date(obj.getTime());
            } else {
                if (obj instanceof Array) { // Array类型
                    result = []
                } else { // Object类型，继承原型链
                    let proto = Object.getPrototypeOf(obj);
                    result = Object.create(proto);
                }
                for (let key in obj) { // Array类型 与 Object类型 的深拷贝
                    if (obj.hasOwnProperty(key)) {
                        if (obj[key] && typeof obj[key] === "object") {
                            result[key] = deepClone(obj[key], {
                                originalParent: obj,
                                currentParent: result,
                                parent: parent
                            });
                        } else {
                            result[key] = obj[key];
                        }
                    }
                }
            }
        } else { // 返回基本数据类型与Function类型,因为Function不需要深拷贝
            return obj
        }
        return result;
    };


    /**
     * @description: 日期格式化
     * @param {Date} t  Date实例
     * @param {String} str 参见函数内的obj属性
     * @return {String} "2020-11-03 11:41:54 星期二"
     * @example formatDate(new Date(),'yyyy-MM-dd HH:mm:ss 星期w')
     * 
     */
    this.formatDate = function (t, str) {
        var obj = {
            yyyy: t.getFullYear(),
            yy: ("" + t.getFullYear()).slice(-2),
            M: t.getMonth() + 1,
            MM: ("0" + (t.getMonth() + 1)).slice(-2),
            d: t.getDate(),
            dd: ("0" + t.getDate()).slice(-2),
            H: t.getHours(),
            HH: ("0" + t.getHours()).slice(-2),
            h: t.getHours() % 12,
            hh: ("0" + t.getHours() % 12).slice(-2),
            m: t.getMinutes(),
            mm: ("0" + t.getMinutes()).slice(-2),
            s: t.getSeconds(),
            ss: ("0" + t.getSeconds()).slice(-2),
            w: ['日', '一', '二', '三', '四', '五', '六'][t.getDay()]
        };
        return str.replace(/([a-z]+)/ig, function ($1) {
            return obj[$1]
        });
    };

    /**
     * @description: js浮点数加减法运算函数（其实小数过长依然会存在值溢出）
     * @param {Number} arg1 参数
     * @param {Number} arg2 参数
     * @return {Number} 返回数值类型结果
     * 
     */
    //加法
    this.accAdd = function (arg1, arg2) {
        var r1, r2, m, c;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
            var cm = Math.pow(10, c);
            if (r1 > r2) {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", "")) * cm;
            } else {
                arg1 = Number(arg1.toString().replace(".", "")) * cm;
                arg2 = Number(arg2.toString().replace(".", ""));
            }
        } else {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
    };
    //减法
    this.accSub = function (arg1, arg2) {
        var r1, r2, m, n;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
        n = (r1 >= r2) ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    };
    //乘法
    this.accMul = function (arg1, arg2) {
        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {}
        try {
            m += s2.split(".")[1].length;
        } catch (e) {}
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    }

    //除法
    this.accDiv = function (arg1, arg2) {
        var t1 = 0,
            t2 = 0,
            r1, r2;
        try {
            t1 = arg1.toString().split(".")[1].length;
        } catch (e) {}
        try {
            t2 = arg2.toString().split(".")[1].length;
        } catch (e) {}
        with(Math) {
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * pow(10, t2 - t1);
        }
    }


    /**
     * @description: 节流（在某个时间段内只响应一次）
     * @param {Function} fn 需要节流的方法
     * 
     */
    this.throttle = function (fn) {
        let timer = true;
        return function () {
            if (!timer) {
                return;
            }
            timer = false;
            setTimeout(() => {
                fn.call(this, arguments);
                timer = true;
            }, 1000);
        }
    }

     /**
     * @description: 防抖（在某个时间段内点击会取消前面的点击事件）
     * @param {Function} fn 需要防抖的方法
     * 
     */   
    this.debounce = function (fn) {
        let timer = null;
        return function () {
            clearTimeout(timer);

            timer = setTimeout(() => {
                fn.call(this.arguments);
            }, 1000);
        }
    }

    /**
     * @description: sleep函数
     * @param {Number} time 睡眠时间毫秒
     * 
     */   
    this.sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }


    /**
     * @description: 将二进制小数（包含整数部分和小数部分）转换为十进制数
     * @param {String} binaryNum 二进制数
     * @return {Number} 返回数值类型结果
     * 
     */  

    this.binaryFloatToDecimal = function (binaryNum) {
        // 如果该二进制只有整数部分则直接用 parseInt(string, radix) 处理
        if (Number.isInteger(binaryNum)) {
            return parseInt(binaryNum, 2)
        } else {
            const binaryFloatNumArr = binaryNum.toString().split(".")

            // 将二进制整数转换为十进制数
            const binaryIntParStr = binaryFloatNumArr[0]
            const decimalIntPartNum = parseInt(binaryIntParStr, 2)

            // 将二进制小数部分转换为十进制数
            const binaryFloatPartArr = binaryFloatNumArr[1].split("")
            const eachDecimalFloatPartNum = binaryFloatPartArr.map((currentValue, index) => {
                return Number(currentValue) * Math.pow(2, (-(index + 1)))
            })


            const deciamlFloatPartNum = eachDecimalFloatPartNum.reduce((accumulator, currentValue) => {
                return accumulator + currentValue
            })
            return decimalIntPartNum + deciamlFloatPartNum
        }
    }


    /**
     * @description: 校验正则(需要再处理，有问题)
     * @param {String} key 需要判断的类型['password','phone','username']
     * @param {String} value 待校验的字符串
     * @return {Boolean}  校验结果true 或者 false
     * 
     */     

    this.regex = function (key, value) {
        /**
         * password的校验不允许空格以及中文（6-20位）
         *    英文状态特殊字符共32个: ~`!@#$%^&*()_+-= {}[]\|;:"'<,>.?/ 需要转义共14个：{ } [ ] / \ + * . $ ^ | ? -
         *    中文状态32：·~！@#￥%…&*（）——-=+｛｝【】|、；‘’：“”，。、《》？需要转义2个：| -    
         * 手机验证摘抄自网络 https://blog.csdn.net/qaz5209103/article/details/105530079
         * username 可中文，但是验证不考虑空格（6-20位）
         */
        value = value.toString()
        let obj = {
            password: /^[A-Za-z\d`~!@#\$%\^&\*\(\)_\-\+=\{\[\}\]\|\\:;"'<,>\.\/\?·~！@#￥%…&*（）——\-=+｛｝【】\|、；‘’：“”，。、《》？]{6,20}$/g.test(value),
            phone: /^((\+|00)86)?((134\d{4})|((13[0-3|5-9]|14[1|5-9]|15[0-9]|16[2|5|6|7]|17[0-8]|18[0-9]|19[0-2|5-9])\d{8}))$/g.test(value),
            username: /^[A-Za-z\d`~!@#\$%\^&\*\(\)_\-\+=\{\[\}\]\|\\:;"'<,>\.\/\?\p{Unified_Ideograph}·~！@#￥%…&*（）——\-=+｛｝【】\|、；‘’：“”，。、《》？]{6,20}$/u.test(value)
        }

        return obj[key]


    }


    /**
     * @description: 对象类型校验
     * @param {String} val 需要判断值
     * @return {String}  返回Object.prototype.toString的处理值
     * 
     */   

    this.cheackType = function (val) {
        let temp = Object.prototype.toString.call(val).slice(8).split('')
        temp.pop()
        return temp.join('')
    }



    /**
     * @description: setTimeout模拟setinterval
     * @param {Number} time 定时执行的时间毫秒数
     * @param {Function}  cb 需要被执行的函数
     * 
     */   
    this.moni =(time,cb)=>{

        num=setTimeout(()=>{
            
            clearTimeout(num)
            this.moni(time,cb)
            cb()
            
              

        },time)
    }

    /**
     * @description: 图片懒加载
     * @example document.addEventListener('scroll', imgLazyLoad())
     * 
     */

    this.imgLazyLoad = function () {

        let imgList = [...document.querySelectorAll('img')]
        let length = imgList.length       
        let count = 0
        return function () {
            let deleteIndexList = []
            
            imgList.forEach((img, index) => {
                
                let rect = img.getBoundingClientRect()
                console.log(rect.top)
                if (rect.top < window.innerHeight) {
                    console.log('yoo')
                    img.src = img.getAttribute('mysrc')
                    deleteIndexList.push(index)
                    count++
                    if (count === length) {
                        document.removeEventListener('scroll', imgLazyLoad)
                    }
                }
            })
            imgList = imgList.filter((img, index) => !deleteIndexList.includes(index))
        }
    }


    
    /**
     * @description: url取参数
     * @param {String} url 完整的url
     * @return {Object}  参数值的对象
     * 
     */   

    this.parseParam = function(url){
        const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
        const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
        let paramsObj = {};
        // 将 params 存到对象中
        paramsArr.forEach(param => {
            if (/=/.test(param)) { // 处理有 value 的参数
                let [key, val] = param.split('='); // 分割 key 和 value
                val = decodeURIComponent(val); // 解码
                val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字
        
                if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
                    paramsObj[key] = [].concat(paramsObj[key], val);
                } else { // 如果对象没有这个 key，创建 key 并设置值
                    paramsObj[key] = val;
                }
            } else { // 处理没有 value 的参数
                paramsObj[param] = true;
            }
        })
        
        return paramsObj;
    
    }

    
    /**
     * @description: 判读是否为数字
     * @param {string} s
     * @return {boolean}
     */
    this.isNumber = function (s) {
        const e = ["e", "E"];
        s = s.trim();

        let pointSeen = false;
        let eSeen = false;
        let numberSeen = false;
        let numberAfterE = true;
        for (let i = 0; i < s.length; i++) {
            if ("0" <= s.charAt(i) && s.charAt(i) <= "9") {
                numberSeen = true;
                numberAfterE = true;
            } else if (s.charAt(i) === ".") {
                if (eSeen || pointSeen) {
                    return false;
                }
                pointSeen = true;
            } else if (e.includes(s.charAt(i))) {
                if (eSeen || !numberSeen) {
                    return false;
                }
                numberAfterE = false;
                eSeen = true;
            } else if (s.charAt(i) === "-" || s.charAt(i) === "+") {
                if (i != 0 && !e.includes(s.charAt(i - 1))) {
                    return false;
                }
            } else {
                return false;
            }
        }

        return numberSeen && numberAfterE;
    };

    /**
     * @description: 判读URL是否合法
     * @param {string} url
     * @return {boolean}
     */
     this.isUrl = function (url) {
        try {
            new URL(url);
            return true;
        }catch(err){
        return false;
    }};
    /**
     * @description: cookie操作,来源MDN
     * @return {boolean}
     */
    this.docCookies = function(){
        var docCookies = {
            getItem: function (sKey) {
              return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
            },
            setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
              if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
              var sExpires = "";
              if (vEnd) {
                switch (vEnd.constructor) {
                  case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                  case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                  case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
                }
              }
              document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
              return true;
            },
            removeItem: function (sKey, sPath, sDomain) {
              if (!sKey || !this.hasItem(sKey)) { return false; }
              document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
              return true;
            },
            hasItem: function (sKey) {
              return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
            },
            keys: /* optional method: you can safely remove it! */ function () {
              var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
              for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
              return aKeys;
            }
          };
        return docCookies
    }

}
