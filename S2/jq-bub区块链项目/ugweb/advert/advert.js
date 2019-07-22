var xw;
var OperateFunc = function () {
    return {
        f: function (val, row) {

            var returnstr = '';
            //'1':'上架中','2':'已下架','3':'售罄'
            if (row.status != '3') {
                returnstr += '<a data-id="' + val + '" href=javascript:editDetail("' + row.operateid + '")  style="color:#0cc2aa">编辑</a>'
            }
            if (row.status == '2') {//上架
                returnstr += ' <a data-id="' + val + '" onclick="putAdvert(\'' + val + ',' + row.number + '\')" href="javascript:void(0)" style="color:#167cf9">上架</a>'
            }
            if (row.status == '1') {//下架
                returnstr += ' <a data-id="' + val + '" onclick="downAdvert(\'' + val + '\')" href="javascript:void(0)" style="color:#df2d2d">下架</a>'
            }
            return returnstr;
        }
    }
}();
var editDetail = function (advertid, row) {
    doClearForView();
    // 动态下拉创建
    moreSelect(advertid)
}

var doClearForView = function () {
    $("form[name='advertEdit'] .fs-options .fs-option").removeClass("selected")
    $("#edit_gp_btn").on("hidden.bs.modal", function () {
        document.getElementById("edit_form1").reset();
    });
}
var reShowDetail = function (advertid) {
    var rows = new Array();
    selrows = xw.getTable().getData()
    $.each(selrows.rows, function (idx, row) {
        if (row.ugOtcAdvertId == advertid) {
            rows.push(row);
        }
    });
    selrows.rows = rows;
    selrow_obj = rows[0];

    $.each(selrow_obj, function (key, val) {//key.val
        $("form[name='advertEdit'] input[data-name='" + key + "']").val(val);
        $("form[name='advertEdit'] select[data-name='" + key + "']").val(val).trigger("change");
        //    收款方式多选下拉动态选中
        if (key === 'paymentWayIds') {
            // console.log("key",key);
            let selectArr = val.split(',')
            selectArr.map((val) => {
                $("form[name='advertEdit'] .fs-options [data-value='" + val + "']").removeClass("selected").click()
            })
        }

    });
    // 限额固额判断
    if ($("#edit_amountType").val() == '2') {
        $(".showlimitmax1").hide()
        $(".showlimitmin1").hide()
        $(".showfix1").show()
    } else if ($("#edit_amountType").val() == '1') {
        $(".showlimitmax1").show()
        $(".showlimitmin1").show()
        $(".showfix1").hide()
    }

    $('#edit_gp_btn1').modal("show");
}
var putAdvert = function () {
    // 函数重载方式接参
    let advertid, number, arr = arguments[0].split(',')
    if (arr.length === 1) {
        advertid = arr[0]
    } else if (arr.length === 2) {
        advertid = arr[0]
        number = arr[1]
    }
    var dialog = bootbox.dialog({
        title: '广告上架',
        message: `<p id="identifier">
                    <table style="border-collapse:separate;border-spacing:5px 10px" >
                        <tr>
                            <td>支付密码：</td>
                            <td> 
                                <input id="put_paypwd" style="width:180px" type="text" class="form-control" placeHolder="输入密码" autocomplete="off" password="" />
                            </td>
                            <td>谷歌验证码：</td>
                            <td>
                                <input id="put_google" class="form-control " style="width:180px" placeHolder="请输入谷歌验证码">
                            </td>
                        </tr>
                        <tr>
                            <td>补充数量：</td>
                            <td> 
                                <input id="number" style="width:180px" type="text" class="form-control" placeHolder="输入补充数量（非必填）" autocomplete="off"/>
                            </td>
                            <td>当前广告剩余数量：</td>
                            <td>
                                <span>` + number + `</span>
                            </td>
                        </tr>
                    </table>
                   </p>`,
        closeButton: true,
        buttons: {
            ok: {
                label: "广告上架确认",
                className: 'btn-success',
                callback: function () {
                    if (!$("#put_paypwd").val()) {
                        bootbox.alert("请输入支付密码")
                        return false;
                    } else {
                        // authu.password='" + $.md5($('#rePrintAuth').attr('password'))
                        var pwdmd5 = $.md5($('#put_paypwd').attr('password'));
                        var googlecode = $('#put_google').val();
                        var number = $('#number').val();
                        var datapost = {};
                        datapost.advertId = advertid;
                        datapost.transactionPassword = pwdmd5;
                        datapost.googlecode = googlecode;
                        datapost.number = number;
                        $.ajax({
                            url: "ug/mer/pbsas.do",
                            type: "POST",
                            contentType: "application/json;charset=utf-8",
                            data: JSON.stringify(datapost),
                            dataType: "json",
                            success: function (data) {
                                //console.log(data);
                                if (data.errcode == '1') {
                                    //上架成功
                                    xw.update();
                                    bootbox.alert("上架成功");
                                } else {
                                    // console.log(data.msg);//错误信息
                                    bootbox.alert(data.msg);
                                    return false;
                                }
                            },
                            error: function () {

                                bootbox.alert('上架失败，请重试或联系客服');
                                return false;
                            }
                        });
                        // return false;
                    }
                }
            }
        }
    });
}

var downAdvert = function (val) {
    var dialog = bootbox.dialog({
        title: '广告下架',
        message: '<p><table><tr></td><td>支付密码：</td><td> <input id="down_paypwd" style="width:200px" type="text" class="form-control" placeHolder="输入密码" autocomplete="off" password="" /></td><td>谷歌验证码：</td><td><input id="down_google" class="form-control " style="width:200px" placeHolder="请输入谷歌验证码"></td></tr></table></p>',
        closeButton: true,
        buttons: {
            ok: {
                label: "广告下架确认",
                className: 'btn-success',
                callback: function () {
                    if (!$("#down_paypwd").val()) {
                        return false;
                    } else {
                        // authu.password='" + $.md5($('#rePrintAuth').attr('password'))
                        var pwdmd5 = $.md5($('#down_paypwd').attr('password'));
                        var googlecode = $('#down_google').val();
                        var datapost = {};
                        datapost.advertId = val;
                        datapost.transactionPassword = pwdmd5;
                        datapost.googlecode = googlecode;
                        // console.log(datapost);
                        $.ajax({
                            url: "ug/mer/pbcas.do",
                            type: "POST",
                            contentType: "application/json;charset=utf-8",
                            data: JSON.stringify(datapost),
                            dataType: "json",
                            success: function (data) {
                                // console.log('下架数据',data);
                                if (data.errcode == '1') {
                                    //上架成功
                                    bootbox.alert("下架成功");
                                    xw.update();
                                } else {
                                    // console.log(data.msg);//错误信息
                                    bootbox.alert(data.msg);
                                    return false;
                                }
                            },
                            error: function () {

                                bootbox.alert('下架失败，请重试或联系客服');
                                return false;
                            }
                        });
                        // return false;
                    }
                }
            }
        }
    });
}
// 获取付款方式、创建动态下拉
var moreSelect = (advertid) => {
    $.ajax({
        url: "/ug/pws/pbsel.do",
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        // parmas: JSON.stringify(reqresource),
        // data: {},
        success: function (data) {
            // 1 微信 2支付宝 3银行卡
            // 处理数据
            let $select;
            if (!advertid) {
                $select = $("#add_paymentway")
            } else {
                $select = $("#edit_paymentWay")
            }

            let weixin = [], zhifubao = [], bankcard = [];
            data.payWay && data.payWay.map((val) => {
                if (val.paymentWay == '1') {
                    weixin.push(val)
                } else if (val.paymentWay == '2') {
                    zhifubao.push(val)
                } else if (val.paymentWay == '3') {
                    bankcard.push(val)
                }
            })

            // 是否今日额满
            let limitStatus = (limitStatus) => {
                if (limitStatus == '1') {
                    return `class="limited"`
                } else {
                    return ''
                }
            }
            // 拼html
            let option1 = `<optgroup label="微信账户">`, option2 = `<optgroup label="支付宝">`,
                option3 = `<optgroup label="银行卡账户">`;

            weixin.map((val) => {
                option1 += `<option ` + limitStatus(val.limitStatus) + `value="` + val.paymentWayId + `">` + val.paymentAccount + `</option>`
            })
            option1 += `</optgroup>`;
            zhifubao.map((val) => {
                option2 += `<option ` + limitStatus(val.limitStatus) + `value="` + val.paymentWayId + `">` + val.paymentAccount + `</option>`
            })
            option2 += `</optgroup>`;
            bankcard.map((val) => {
                option3 += `<option ` + limitStatus(val.limitStatus) + `value="` + val.paymentWayId + `">` + val.paymentAccount + `</option>`
            })
            option3 += `</optgroup>`;
            let optgroups = option1 + option2 + option3
            $select.html(optgroups)
            if (!advertid) {
                //js 初始化
                $('.demo').fSelect()
                //取值
                $('.fs-label').text()
            } else {
                //js 初始化
                $('.demo1').fSelect()
                //取值
                $('.fs-label').text()
                reShowDetail(advertid);
            }
        }
    })
}

var Advert = function () {
    return {
        init: function () {
            // 顺序有影响 (先抓选单, 再抓暂存选单, 再执行其他)
            this.initHelper();
            this.reload();
        },
        initHelper: function () {
            //编辑保存
            // $('#update_advert').on('click',function(e){
            // 	//判断 校验密码 && 谷歌验证码是否填写
            // 	//获取from中都值，然后调用接口
            // 	// var edit_form1 = $("#edit_form1").serializeObject();
            // 	$.ajax({
            // 		type: 'POST',
            // 		url: "ug/mer/pbuas.do",
            // 		dataType: 'json',
            // 		contentType: "application/json;charset=utf-8",
            // 		async: false,
            // 		isMask: true,
            // 		data: JSON.stringify(edit_form1),
            // 		success: function(ret) {
            // 			if(ret.err_code == "0"){
            // 				bootbox.alert(ret.msg);
            // 			xw.update();
            // 			}else{
            // 			bootbox.alert("修改成功");
            // 			xw.update();
            // 			}
            // 		},
            // 		error: function() {
            // 			bootbox.alert("修改失败");
            // 			xw.update();
            // 		}
            // 	});
            // });

            $('#add_advert_button').on('click', function (e) {
                //先清空所有信息
                document.getElementById("add_advert_form").reset();
                $("form[name='add_advert_form'] .fs-options .fs-option.selected").click()
                $('#add_advert_modal').modal("show");
                if ($('#add_amounttype').val() == '1') {
                    $('.showlimitmax').show();
                    $('.showlimitmin').show();
                    $('.showfix').hide();//初始：显示限额，隐藏固额
                }
                // 获取可用余额
                // var res = {'reqresource': '1'}
                // $.ajax({
                // 	url: "/ug/usr/pblbi.do?bd="+JSON.stringify(res),
                // 	type: 'GET',
                // 	contentType: "application/json;charset=utf-8",
                // 	dataType: "json",
                // 	// parmas: JSON.stringify(reqresource),
                // 	// data: {},
                // 	success: function (data) {
                // 		// var resNum = data.usablefund
                // 		document.getElementById('add_limitmaxamount').value=data.usablefund
                // 		// window.open(data.payUrl)
                // 	}
                // })
                moreSelect(null)
                //	判定是否绑定了谷歌验证码
                let valigooglesecret = JSON.parse(localStorage.getItem("user_info")).valigooglesecret
                if (valigooglesecret == '1') {
                    $("#showGoogle").show()
                } else {
                    $("#showGoogle").hide()
                }
            });
            $('#submit_advert').on('click', function (e) {//发布广告
                //校验信息 -- 支付密码是否为空
                var add_number = $('#add_number').val();
                var add_amounttype = $('#add_amounttype').val();
                var add_limitmaxamount = $('#add_limitmaxamount').val();
                var add_limitminamount = $('#add_limitminamount').val();
                var add_fixedamount = $('#add_fixedamount').val();
                var add_price = $('#add_price').val();
                var add_type = $('#add_type').val();
                var add_prompt = $('#add_prompt').val();

                var add_paymentway = $('#add_paymentway').val(), add_coinid = $('#add_coinid').val();
                var add_cointype = $('#add_cointype').val(), add_autoreplycontent = $('#add_autoreplycontent').val(),
                    add_isseniorcertification = $('#add_isseniorcertification').val();
                var add_ismerchantstrade = $('#add_ismerchantstrade').val(),
                    add_transactionPassword = $.md5($('#add_transactionPassword').val()),
                    add_googlecode = $('#add_googlecode').val();
                //谷歌验证码是否为空
                //校验是否是数字
                if (!add_number) {
                    bootbox.alert("请填写数量");
                    return;
                }
                var reg = /^[1-9]\d*$/;
                if (!reg.test(add_number)) {
                    bootbox.alert("填写数量需为正整数");
                    return;
                }
                if (add_number < 50 || add_number === 50) {
                    bootbox.alert("数量需大于50");
                    return;
                }
                if (!add_prompt) {
                    bootbox.alert('请填写付款期限');
                    return;
                }
                if (add_prompt < 1 || add_prompt > 15) {
                    bootbox.alert("需在1-15分钟之间");
                    return;
                }
                if (!add_transactionPassword) {
                    bootbox.alert("填写支付密码");
                    return;
                }
                // 是否绑定了谷歌验证码
                let valigooglesecret = JSON.parse(localStorage.getItem("user_info")).valigooglesecret
                if (valigooglesecret == '1') {
                    if (!add_googlecode) {
                        bootbox.alert("请填写谷歌验证码");
                        return;
                    }
                }
                if (!add_amounttype) {
                    bootbox.alert("请选择金额类型");
                    return;
                }
                // 金额类型
                // if(add_amounttype == '1'){
                // 	if(!add_limitminamount){
                // 		bootbox.alert("请填写最小限额");return;
                // 	}
                // 	if(!reg.test(add_limitminamount)){
                // 		bootbox.alert("填写最小限额需为正整数");return;
                // 	}
                // 	if(!add_limitmaxamount){
                // 		bootbox.alert("请填写最大限额");return;
                // 	}
                // 	if(!reg.test(add_limitmaxamount)){
                // 		bootbox.alert("请填写最大限额需为正整数");return;
                // 	}
                // 	if(add_limitminamount>add_limitmaxamount || add_limitminamount===add_limitmaxamount){
                // 		bootbox.alert("最大限额需大于最小限额");return;
                // 	}
                //     if(add_number<add_limitmaxamount){
                //         bootbox.alert('最大限额不能超过总数量');return
                //     }
                // }else if(add_amounttype == '2'){
                // 	if(!add_fixedamount){
                // 		bootbox.alert("请填写固额");return;
                // 	}
                // 	if(!reg.test(add_fixedamount)){
                // 		bootbox.alert("填写固额需为正整数");return;
                // 	}
                // 	if(add_number%add_fixedamount!==0){
                // 		bootbox.alert("填写数量需为固额的整倍数");return;
                // 	}
                // 	if(add_fixedamount!==100 || add_fixedamount!==200 || add_fixedamount!==300 || add_fixedamount!==500 || add_fixedamount!==1000){
                // 		bootbox.alert("固定额只有100,200,300,500,1000额度");return;
                // 	}
                // }
                // if(!add_type){
                // 	bootbox.alert("请选择类型");return;
                // }
                if (!add_price) {
                    bootbox.alert("请填写单价");
                    return;
                }
                // if(!reg.test(add_price)){
                // 	bootbox.alert("填写单价需为正整数");return;
                // }
                // if(!add_paymentway){
                // 	bootbox.alert('请选择付款方式');return;
                // }
                // if(!add_coinid){
                // 	bootbox.alert('请填写币种');return;
                // }
                // if(!add_cointype){
                // 	bootbox.alert('请选择货币类型');return;
                // }
                // if(!add_isseniorcertification){
                // 	bootbox.alert('请选择 是否需要高级认证');return;
                // }
                // if(!add_ismerchantstrade){
                // 	bootbox.alert('请选择 是否允许平台内都商家购买');return;
                // }
                let isSeniorCertification = '';
                let isIdCertification = '';
                if (add_isseniorcertification === '1') {
                    isSeniorCertification = 0;
                    isIdCertification = 0;
                } else if (add_isseniorcertification === '2') {
                    isSeniorCertification = 0;
                    isIdCertification = 1;
                } else {
                    isSeniorCertification = 1;
                    isIdCertification = 1;
                }

                var advdata = {};
                advdata.number = add_number;
                advdata.amountType = add_amounttype;
                advdata.limitMaxAmount = add_limitmaxamount;
                advdata.limitMinAmount = add_limitminamount;
                advdata.fixedAmount = add_fixedamount;
                advdata.price = add_price;
                advdata.type = add_type;
                advdata.pamentWayIds = add_paymentway;
                advdata.coinId = add_coinid;
                advdata.coinType = add_cointype;
                advdata.prompt = add_prompt;
                advdata.autoReplyContent = add_autoreplycontent;
                advdata.isSeniorCertification = isSeniorCertification;
                advdata.isIdCertification = isIdCertification;
                advdata.isMerchantsTrade = '2';
                advdata.transactionPassword = add_transactionPassword;
                advdata.googlecode = add_googlecode;
                // console.log(advdata);
                $.ajax({
                    type: 'POST',
                    url: "/ug/mer/pbpas.do",
                    dataType: 'json',
                    contentType: "application/json;charset=utf-8",
                    async: false,
                    isMask: true,
                    data: JSON.stringify(advdata),
                    success: function (ret) {
                        if (ret.errcode == "1") {
                            bootbox.alert("添加成功");
                            $("#add_advert_modal").modal("hide");
                            xw.update();
                        } else {
                            bootbox.alert(ret.msg);
                            return;
                            // xw.update();
                        }
                    },
                    error: function () {
                        bootbox.alert("添加失败");
                        // xw.update();
                        return;
                    }
                });

            });
            $('#add_amounttype').on('change', function () {
                if ($('#add_amounttype').val() == '1') {//限额
                    $('.showlimitmax').show();
                    $('.showlimitmin').show();
                    $('.showfix').hide();
                } else if ($('#add_amounttype').val() == '2') {//固额
                    // 获取固额数据
                    $.ajax({
                        url: "/ug/pws/pbsap.do",
                        type: 'GET',
                        contentType: "application/json;charset=utf-8",
                        dataType: "json",
                        // parmas: JSON.stringify(reqresource),
                        // data: {},
                        success: function (data) {
                            // console.log("data", data);
                            // console.log("data.map[0].value", data.map[0].value);
                            let $fixedamount = $("#add_fixedamount"), option = ``
                            data.map[0].value.map((val) => {
                                option += `<option value="` + val + `">` + val + `</option>`
                            })
                            $fixedamount.html(option)
                        }
                    })

                    $('.showfix').show();
                    $('.showlimitmax').hide();
                    $('.showlimitmin').hide();
                }
            });
            $(document).on('input', '#put_paypwd', function () {
                //alert(1);
                var _this = this;
                var newPassword = _this.value;
                var oldPassword = _this.getAttribute("password");
                var deta = newPassword.length - oldPassword.length;

                var truePassword = "";
                var p = _this.selectionEnd;//光标结束时的位置

                for (var i = 0; i < newPassword.length; i++) {
                    var c = newPassword.charAt(i);
                    if (i < p && c != '●') {
                        truePassword += c;
                    } else if (i < p && c == '●') {
                        truePassword += oldPassword.charAt(i);
                    } else {
                        truePassword += oldPassword.substr(oldPassword.length - newPassword.length + p, newPassword.length - p);
                        break;
                    }
                }
                newPassword = truePassword.replace(/\S/g, '●');

                _this.setAttribute('password', truePassword);
                _this.value = newPassword;
                // 解决在win8中光标总是到input框的最后
                _this.selectionEnd = p;
                _this.selectionStart = p;
                //console.log(truePassword);
            });

            $(document).on('input', '#down_paypwd', function () {
                //alert(1);
                var _this = this;
                var newPassword = _this.value;
                var oldPassword = _this.getAttribute("password");
                var deta = newPassword.length - oldPassword.length;

                var truePassword = "";
                var p = _this.selectionEnd;//光标结束时的位置

                for (var i = 0; i < newPassword.length; i++) {
                    var c = newPassword.charAt(i);
                    if (i < p && c != '●') {
                        truePassword += c;
                    } else if (i < p && c == '●') {
                        truePassword += oldPassword.charAt(i);
                    } else {
                        truePassword += oldPassword.substr(oldPassword.length - newPassword.length + p, newPassword.length - p);
                        break;
                    }
                }
                newPassword = truePassword.replace(/\S/g, '●');

                _this.setAttribute('password', truePassword);
                _this.value = newPassword;
                // 解决在win8中光标总是到input框的最后
                _this.selectionEnd = p;
                _this.selectionStart = p;
                //console.log(truePassword);
            });

            //保存修改
            $('#update_advert').on('click', function (e) {
                // 多选下拉选中项
                let selectIds=[];
                $("form[name='advertEdit'] .selected").map((i,el)=>{
                    selectIds.push($(el).attr('data-value'));
                });
                var edit_pamentWay = selectIds
                //校验
                var edit_advertId = $('#edit_advertId').val(), edit_number = $('#edit_number').val(),
                    edit_amountType = $('#edit_amountType').val(),
                    edit_limitMaxAmount = $('#edit_limitMaxAmount').val();
                var edit_limitMinAmount = $('#edit_limitMinAmount').val(),
                    edit_fixedAmount = $('#edit_fixedAmount').val(), edit_price = $('#edit_price').val();
                var edit_type = $('#edit_type').val(), edit_coinId = $('#edit_coinId').val(), edit_coinType = $('#edit_coinType').val();
                var edit_prompt = $('#edit_prompt').val(), edit_autoReplyContent = $('#edit_autoReplyContent').val(),
                    edit_isMerchantsTrade = $('#edit_isMerchantsTrade').val();
                var edit_isSeniorCertification = $('#edit_isSeniorCertification').val(),
                    edit_transactionPassword = $('#edit_transactionPassword').val(),
                    edit_googlecode = $('#edit_googlecode').val();
                if (!edit_advertId) {
                    bootbox.alert("广告ID为空");
                    return;
                }
                if (!edit_transactionPassword) {
                    bootbox.alert("填写支付密码");
                    return;
                }
                if (!edit_googlecode) {
                    bootbox.alert("请填写谷歌验证码");
                    return;
                }
                if (!edit_number) {
                    bootbox.alert("请填写 数量");
                    return;
                }
                if (!edit_amountType) {
                    bootbox.alert("请选择金额类型");
                    return;
                }
                if (edit_amountType == '1') {
                    if (!edit_limitMinAmount) {
                        bootbox.alert("请填写最小限额");
                        return;
                    }
                    if (!edit_limitMaxAmount) {
                        bootbox.alert("请填写最大限额");
                        return;
                    }
                } else if (edit_amountType == '2') {
                    if (!edit_fixedAmount) {
                        bootbox.alert("请填写固额");
                        return;
                    }
                }
                if (!edit_type) {
                    bootbox.alert("请选择类型");
                    return;
                }
                if (!edit_price) {
                    bootbox.alert("请填写单价");
                    return;
                }
                if (edit_pamentWay===[]) {
                    bootbox.alert('请选择付款方式');
                    return;
                }
                if (!edit_coinId) {
                    bootbox.alert('请填写币种');
                    return;
                }
                // if (!edit_coinType) {
                //     bootbox.alert('请选择货币类型');
                //     return;
                // }
                if (!edit_prompt) {
                    bootbox.alert('请填写付款期限');
                    return;
                }
                if (!edit_isSeniorCertification) {
                    bootbox.alert('请选择 是否需要高级认证');
                    return;
                }
                // if (!edit_isMerchantsTrade) {
                //     bootbox.alert('请选择 是否允许平台内都商家购买');
                //     return;
                // }
                var editadvdata = {};
                editadvdata.advertId = edit_advertId;
                editadvdata.number = edit_number, editadvdata.AmountType = edit_amountType , editadvdata.limitMaxAmount = edit_limitMaxAmount , editadvdata.limitMinAmount = edit_limitMinAmount;
                editadvdata.fixedAmount = edit_fixedAmount , editadvdata.price = edit_price , editadvdata.type = edit_type, editadvdata.pamentWayIds = edit_pamentWay, editadvdata.coinId = edit_coinId;
                editadvdata.coinType = edit_coinType , editadvdata.prompt = edit_prompt, editadvdata.autoReplyContent = edit_autoReplyContent , editadvdata.isSeniorCertification = edit_isSeniorCertification;
                editadvdata.isMerchantsTrade = edit_isMerchantsTrade, editadvdata.transactionPassword = $.md5(edit_transactionPassword), editadvdata.googlecode = edit_googlecode;
                $.ajax({
                    type: 'POST',
                    url: "/ug/mer/pbuas.do",
                    dataType: 'json',
                    contentType: "application/json;charset=utf-8",
                    async: false,
                    isMask: true,
                    data: JSON.stringify(editadvdata),
                    success: function (ret) {
                        if (ret.errcode == "1") {
                            bootbox.alert("修改成功");
                            xw.update();
                        } else {
                            bootbox.alert(ret.msg);
                            return;
                            // xw.update();
                        }
                    },
                    error: function () {
                        bootbox.alert("修改失败");
                        // xw.update();
                        return;
                    }
                });
            })
        },

        reload: function () {

            $('#divtable').html('');

            xw = XWATable.init({
                divname: "divtable",
                //----------------table的选项-------
                pageSize: 10,
                // columnPicker: true,
                transition: 'fade',
                checkboxes: false,
                checkAllToggle: true,
                //----------------基本restful地址---
                restURL: "/ug/mer/pbmas.do?bd={'':''}",
                coldefs: [
                    {
                        col: "ugOtcAdvertId",
                        friendly: "广告ID",
                        validate: "ugotcadvertid",
                        nonedit: "nosend",
                        // hidden:"true",
                        unique: "true",
                        // format:"",
                        index: 1
                    },
                    {
                        col: "userId",
                        friendly: "创建人",
                        // validate: "userid",
                        index: 2
                    },
                    {
                        col: "number",
                        friendly: "数量",
                        validate: "number",
                        index: 3
                    },
                    {
                        col: "volume",
                        friendly: "已放行数量",
                        // validate: "number",
                        index: 3
                    },
                    {
                        col: "prompt",
                        friendly: "付款期限",
                        validate: "prompt",
                        index: 4
                    },
                    {
                        col: "amountType",
                        friendly: "金额类型",
                        // validate: "amounttype",
                        format: OtcAdvBas.amountTypeFormat,
                        index: 7
                    },
                    {
                        col: "type",
                        friendly: "类型",
                        validate: "type",
                        format: OtcAdvBas.typeFormat,
                        index: 8
                    },
                    {
                        col: "status",
                        friendly: "广告状态",
                        validate: "status",
                        format: OtcAdvBas.advertStatusFormat,
                        index: 9
                    },
                    {
                        col: "paymentWay",
                        friendly: "收款方式",
                        validate: "paymentWay",
                        format: OtcAdvBas.paymentWayStrFormat,
                        index: 10
                    },

                    {
                        col: "createdTime",
                        friendly: "创建时间",
                        index: 13
                    },
                    {
                        col: "volume",
                        friendly: "成交量",
                        hidden: true,
                        index: 14
                    },
                    {
                        col: "freezeAmount",
                        friendly: "冻结量",
                        hidden: true,
                        index: 15
                    },
                    {
                        col: "modifyTime",
                        friendly: "广告修改时间",
                        hidden: true,
                        index: 16
                    },
                    {
                        col: "shelveTime",
                        friendly: "广告上架时间",
                        hidden: true,
                        index: 17
                    },
                    {
                        col: "nickName",
                        friendly: "商家昵称",
                        hidden: true,
                        index: 18
                    },
                    {
                        col: "coinId",
                        friendly: "币种",
                        hidden: true,
                        index: 19
                    },
                    {
                        col: "coinType",
                        friendly: "货币类型",
                        hidden: true,
                        index: 20
                    },
                    {
                        col: "autoReplyContent",
                        friendly: "自动回复内容",
                        hidden: true,
                        index: 21
                    },
                    {
                        col: "isSeniorCertification",
                        friendly: "是否需要高级认证",
                        hidden: true,
                        index: 22
                    },
                    {
                        col: "isMerchantsTrade",
                        friendly: "是否与平台商家交易",
                        hidden: true,
                        index: 23
                    },
                    {
                        col: "operateid",
                        friendly: "操作",
                        nonedit: "nosend",
                        // format:"",
                        format: OperateFunc,
                        index: 24
                    },

                ],
                // 查询过滤条件
                findFilter: function () {
                    var finddb = {};
                    if ($('#find_advertid').val()) {
                        finddb.advid = $('#find_advertid').val();
                    }
                    if ($('#find_type').val()) {
                        finddb.type = $('#find_type').val();
                    }
                    if ($('#find_status').val()) {
                        finddb.status = $('#find_status').val();
                    }
                    if ($('#find_paymentway').val()) {
                        finddb.paymentway = $('#find_paymentway').val();
                    }
                    if ($('#find_begintime').val()) {
                        finddb.begintime = $('#find_begintime').val();
                    }
                    if ($('#find_endtime').val()) {
                        finddb.endtime = $('#find_endtime').val();
                    }

                    xw.setRestURL("/ug/mer/pbmas.do?bd=" + (JSON.stringify(finddb)));
                },

            })
        }
    }
}();


$("#update_gp").click(function () {

    $('[disabled]').attr("disabled", false);

    var edit_form1 = $("#edit_form1").serializeObject();

    $.ajax({
        type: 'POST',
        url: "/ug/adv/pbgai.do",
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        async: false,
        isMask: true,
        data: JSON.stringify(edit_form1),
        success: function (ret) {
            if (ret.err_code == "0") {
                bootbox.alert(ret.msg);
                xw.update();
            } else {
                bootbox.alert("修改成功");
                xw.update();
            }
        },
        error: function () {
            bootbox.alert("修改失败");
            xw.update();
        }
    });

});

//$(document).on('click','#delete2',function(){
//	var index = $(this).closest('tr').index();
//	var data = xw.getTable().getData();
//	//var edit_form2 = $("#edit_form1").serializeObject();
//	//console.log(edit_form2);
//	$.ajax({
//		type: 'POST',
//		url: "/ug/adv/pbsha.do",
//		dataType: 'json',
//		contentType: "application/json;charset=utf-8",
//		async: false,
//		isMask: true,
//		data: JSON.stringify(data.rows[index]),
//		success: function(ret) {
//			if(ret.err_code == "0"){
//				bootbox.alert("删除失败");
//			xw.update();
//			}else{
//			bootbox.alert("删除成功");
//			xw.update();
//			}
//		},
//		error: function() {
//			bootbox.alert("删除失败");
//			xw.update();
//		}
//	});
//
//});
//$("#delete2").click(function() {
//console.log(123456)
//	//var edit_form1 = $("#edit_form1").serializeObject();
//
//	$.ajax({
//		type: 'POST',
//		url: "/ug/adv/pbsha.do",
//		dataType: 'json',
//		contentType: "application/json;charset=utf-8",
//		async: false,
//		isMask: true,
//		//data: JSON.stringify(edit_form1),
//		success: function(ret) {
//			console.log(ret.err_code);
//			if(ret.err_code == "0"){
//				bootbox.alert("删除失败");
//			xw.update();
//			}else{
//			bootbox.alert("删除成功");
//			xw.update();
//			}
//		},
//		error: function() {
//			bootbox.alert("删除失败");
//			xw.update();
//		}
//	});
//
//});


// /*查看详细信息*/

// $(document).on('click','#edit_btn',function() {
// 	var index = $(this).closest('tr').index();
// 	var data = xw.getTable().getData();
// 	$("#idphoto1").attr("src",data.rows[index].idPhoto)
// //	if(data.rows.length == 0) {
// //		bootbox.alert("<br><center><h4>请选择一条数据！</h4></center><br>");
// //		return false;
// //	}
// //	if(data.rows.length > 1) {
// //		bootbox.alert("<br><center><h4>只能选择一行！</h4></center><br>");
// //		return false;
// //	}

// 	$.each(data.rows[index], function(key, val) {
// 		/*模态框关闭后清空模态框里填写的数据*/
// 		$("#edit_gp_btn").on("hidden.bs.modal", function() {
// 			document.getElementById("edit_form").reset();
// 		});
// 		/*-----------------------*/
// 		key = key + "_select";
// 		$("form[name='edit_form'] input[name='" + key + "']").val(val);

// 		/*金额类型*/
// 		if(data.rows[index].amounttype == 1) {
// 			$("#amounttype_select option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].amounttype == 2) {
// 			$("#amounttype_select option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
// 		}
// 		/*类型*/
// 		if(data.rows[index].type == 1) {
// 			$("#type_select option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].type == 2) {
// 			$("#type_select option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
// 		}
// 		/*广告状态*/
// 		if(data.rows[index].status == 1) {
// 			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].status == 2) {
// 			$("#status_select option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
// 		}
// 		/*支付方式*/
// 		if(data.rows[index].paymentway == 1) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 2) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 3) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 1,2) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 1,3) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 2,3) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 1,2,3) {
// 			$("#paymentway_select option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		}
// 		/*货币类型*/
// 		if(data.rows[index].cointype == 1) {
// 			$("#cointype_select option[value='" + data.rows[index].cointype + "']").attr('selected', 'selected');
// 		}
// 		/*是否需要高级认证*/
// 		if(data.rows[index].isseniorcertification == 1) {
// 			$("#isseniorcertification_select option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].isseniorcertification == 2) {
// 			$("#isseniorcertification_select option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
// 		}
// 		/*是否需要高级认证*/
// 		if(data.rows[index].ismerchantstrade == 1) {
// 			$("#ismerchantstrade_select option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].ismerchantstrade == 2) {
// 			$("#ismerchantstrade_select option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
// 		}

// 	});

// });

// /*审批*/
// $(document).on('click','#edit_gp',function() {
// 	var index = $(this).closest('tr').index();
// 	var data = xw.getTable().getData();

// 	$("#amounttype").attr("disabled", true);
// 	$("#type").attr("disabled", true);
// 	$("#paymentway").attr("disabled", true);
// 	$.each(data.rows[index], function(key, val) {

// 		/*模态框关闭后清空模态框里填写的数据*/
// 		$("#edit_gp_btn1").on("hidden.bs.modal", function() {
// 			document.getElementById("edit_form1").reset();
// 		});
// 		/*-----------------------*/

// 		$("form[name='edit_form1'] input[name='" + key + "']").val(val);

// 		/*金额类型*/
// 		if(data.rows[index].amounttype == 1) {
// 			$("#amounttype option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].amounttype == 2) {
// 			$("#amounttype option[value='" + data.rows[index].amounttype + "']").attr('selected', 'selected');
// 		}
// 		/*类型*/
// 		if(data.rows[index].type == 1) {
// 			$("#type option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].type == 2) {
// 			$("#type option[value='" + data.rows[index].type + "']").attr('selected', 'selected');
// 		}
// 		/*广告状态*/
// 		if(data.rows[index].status == 1) {
// 			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].status == 2) {
// 			$("#status option[value='" + data.rows[index].status + "']").attr('selected', 'selected');
// 		}
// 		/*支付方式*/
// 		if(data.rows[index].paymentway == 1) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 2) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 3) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 1,2) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 1,3) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 2,3) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].paymentway == 1,2,3) {
// 			$("#paymentway option[value='" + data.rows[index].paymentway + "']").attr('selected', 'selected');
// 		}
// 		/*货币类型*/
// 		if(data.rows[index].cointype == 1) {
// 			$("#cointype option[value='" + data.rows[index].cointype + "']").attr('selected', 'selected');
// 		}
// 		/*是否需要高级认证*/
// 		if(data.rows[index].isseniorcertification == 1) {
// 			$("#isseniorcertification option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].isseniorcertification == 2) {
// 			$("#isseniorcertification option[value='" + data.rows[index].isseniorcertification + "']").attr('selected', 'selected');
// 		}
// 		/*是否与平台商家交易*/
// 		if(data.rows[index].ismerchantstrade == 1) {
// 			$("#ismerchantstrade option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
// 		} else if(data.rows[index].ismerchantstrade == 2) {
// 			$("#ismerchantstrade option[value='" + data.rows[index].ismerchantstrade + "']").attr('selected', 'selected');
// 		}

// 	});

// });

layui.use('laydate', function () {
    var laydate = layui.laydate;
    //常规用法
    laydate.render({
        elem: '#find_endtime'
    });
    laydate.render({
        elem: '#find_begintime'
    });
});
