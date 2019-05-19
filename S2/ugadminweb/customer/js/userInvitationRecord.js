var xw;
var UserInvitationRecord = function () {
    return {
        init: function () {
            this.reload();
        },
        reload: function () {

            $('#divtable').html('');
            xw = XWATable.init(
                {
                    divname: "divtable",
                    //----------------table的选项-------
                    pageSize: 50,
                    columnPicker: true,
                    transition: 'fade',
                    checkboxes: true,
                    checkAllToggle: true,
                    //----------------基本restful地址---
                    restbase: 'txtpsinvitationrecord?sort=-createdTime',
                    key_column: 'txTpsInvitationRecordId',
                    coldefs: [
                        {
                            col: "txTpsInvitationRecordId",
                            friendly: "邀请记录ID",
                            unique: "true",
                            nonedit: "nosend",
                            hidden: false,
                            readonly: "readonly",
                            width:200,
                            index: 1
                        },
                        {
                            col: "inviterUserId",
                            friendly: "邀请人",
                            validate:"required",
                            index: 2
                        },
                        {
                            col: "inviteeUserId",
                            friendly: "被邀请人",
                            validate:"required",
                            index: 3
                        },
                        {
                            col: "createdTime",
                            friendly: "创建时间",
                            index: 4
                        }
                    ],
                    // 查询过滤条件
                    findFilter: function () {
                        var txTpsInvitationRecordId,inviterUserId,inviteeUserId;
                        if ($('#txTpsInvitationRecordId').val()) {
                            txTpsInvitationRecordId = RQLBuilder.equal("txTpsInvitationRecordId", $.trim($('#txTpsInvitationRecordId').val()));
                        }
                        if ($('#inviterUserId').val()) {
                            inviterUserId = RQLBuilder.equal("inviterUserId", $.trim($('#inviterUserId').val()));
                        }
                        if ($('#inviteeUserId').val()) {
                            inviteeUserId = RQLBuilder.equal("inviteeUserId", $.trim($('#inviteeUserId').val()));
                        }
                        var filter = RQLBuilder.and([
                            txTpsInvitationRecordId,inviterUserId,inviteeUserId
                        ]);
                        return filter.rql();
                    }
                })
        }
    }
}();


