var helper = function () {
    // 深度克隆
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
     ** js浮点数加减法运算函数（可能存在值溢出）
     **/

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
    //乘法（未测试）
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

    //除法(未测试)
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

    //节流（在某个时间段内只响应一次）
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

    //防抖（在某个时间段内点击会取消前面的点击事件）
    this.debounce = function (fn) {
        let timer = null;
        return function () {
            clearTimeout(timer);

            timer = setTimeout(() => {
                fn.call(this.arguments);
            }, 1000);
        }
    }
    //sleep函数

    // 用法
    // sleep(500).then(() => {
    //     // 这里写sleep之后需要去做的事情
    // })
    this.sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }



    //二进制转十进制

    /**
     * 将二进制小数（包含整数部分和小数部分）转换为十进制数
     * 二进制数（可能是整数，也可能是小数）
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
    //校验正则
    this.regex = function (key, value) {
        //password的校验不允许空格以及中文
        //英文状态特殊字符共32个: ~`!@#$%^&*()_+-= {}[]\|;:"'<,>.?/ 需要转义共14个：{ } [ ] / \ + * . $ ^ | ? -
        //中文状态32：·~！@#￥%…&*（）——-=+｛｝【】|、；‘’：“”，。、《》？需要转义2个：| -    
        //手机验证摘抄自网络 https://blog.csdn.net/qaz5209103/article/details/105530079
        //username验证不考虑空格

        value = value.toString()
        let obj = {
            password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#\$%\^&\*\(\)_\-\+=\{\[\}\]\|\\:;"'<,>\.\/\?·~！@#￥%…&*（）——\-=+｛｝【】\|、；‘’：“”，。、《》？])[A-Za-z\d`~!@#\$%\^&\*\(\)_\-\+=\{\[\}\]\|\\:;"'<,>\.\/\?·~！@#￥%…&*（）——\-=+｛｝【】\|、；‘’：“”，。、《》？]{6,20}$/g.test(value),
            phone: /^((\+|00)86)?((134\d{4})|((13[0-3|5-9]|14[1|5-9]|15[0-9]|16[2|5|6|7]|17[0-8]|18[0-9]|19[0-2|5-9])\d{8}))$/g.test(value),
            username: /^[A-Za-z\d`~!@#\$%\^&\*\(\)_\-\+=\{\[\}\]\|\\:;"'<,>\.\/\?\p{Unified_Ideograph}·~！@#￥%…&*（）——\-=+｛｝【】\|、；‘’：“”，。、《》？]{6,20}$/u.test(value)
        }

        return obj[key]


    }
    //对象类型校验
    this.cheackType = function (val) {
        let temp = Object.prototype.toString.call(val).slice(8).split('')
        temp.pop()
        return temp.join('')
    }
	//setTimeout模拟setinterval
    this.moni =(time,cb)=>{

        num=setTimeout(()=>{
            
            clearTimeout(num)
            this.moni(time,cb)
            cb()
            
              

        },time)
    }
    //图片懒加载
    //主页绑定document.addEventListener('scroll', imgLazyLoad())
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
    //url取参数
    //参数是完整的url
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




}
let yoo = new helper()