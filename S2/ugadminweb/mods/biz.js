
var GasModBIZ = function() {

    var enumMeterKind = {'01':'�ձ�','02':'IC��������','03':'IC������','04':'�����','05':'Զ����'};

    return {

        meterKindFormat:{
            f: function(val){
                return enumMeterKind[val];
            },
        },
        init: function(xwajson) {



        }
    }
}();