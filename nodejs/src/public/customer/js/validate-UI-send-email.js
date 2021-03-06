
$("#frmForgotPass").validate({
    rules: {
        EMAIL: {
            required: true,
            email: true,
            remote: {
                url: "/customer/auth/is-available-mail"
              }
        }
    },
    messages: {
        EMAIL: {
            required: "Bạn cần nhập địa chỉ email.",
            email: "Địa chỉ email không hợp lệ.",
            remote:"Địa chỉ mail này không tồn tại hoặc chưa được đăng ký"
        },
    },

    errorElement: "small",
    errorClass: "help-block text-danger is-invalid",
    validClass: "is-valid",
    submitHandler: function (form) {
        $.ajax({
            url: "/customer/auth/forgot-pass",
            type: "POST",
            data: $(form).serialize(),
            success: function (result) {
                if (result.success == true) {
                    $("#checkmail-modal").modal();
                } else {
                    $("#alert-send-mail").remove();
                    var alert =
                      '<div class="alert alert-warning alert-dismissible fade show" id="alert-send-mail" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Lỗi hệ thống. Gửi mail thất bại!</div>';
                    $("#frmForgotPass").prepend(alert);
                }
            }
        });
    }
});
