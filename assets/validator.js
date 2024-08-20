//Validator Constructor
function Validator(options){
    var selectorRules = {};

    //Hàm thực hiện validate
    function validate(inputElement, rule){
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        //Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        //Lặp qua từng rules và kiểm tra
        //Nếu có lỗi thì dừng việc kiểm tra
        for(var i = 0; i < rules.length; ++i){
            errorMessage = rules[i](inputElement.value);
            if(errorMessage){
                break;
            }
        }

        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }

    //Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if(formElement){
        //Loại bỏ hành vi mặc định khi submit form
        formElement.onsubmit = function(e){
            e.preventDefault();

            var isFormValid = true;


            //Thực hiện lặp qua từng rules và validate
            options.rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid){
                    isFormValid = false;
                }
            });
            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]'); 
                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        return (values[input.name] = input.value) && values;
                    }, {})
                    options.onSubmit(formValues);
                }
            }
        }

        //Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
        options.rules.forEach((rule) => {
            //Lưu lại rules cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);
            if(inputElement){
                //Xử lý trường hợp blur khỏi input
                inputElement.onblur = () => {
                    validate(inputElement, rule);
                }

                //Xử lý mỗi khi người dùng đang nhập vào input
                inputElement.oninput = () => {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
}

//Define rules
//Nguyên tắc của các rules
//1. Khi có lỗi => Trả ra message lỗi
//2. Khi hợp lệ => Không trả ra cái gì cả (undefined)
Validator.isRequired = function(selector, message){
    return {
        selector: selector,
        test: (value) => {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này!';
        }
    }
}

Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: (value) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Vui lòng nhập đúng định dạng email';
        }
    }
}

//Rule for password validation
Validator.isPassword = function(selector, message){
    return {
        selector: selector,
        test: (value) => {
            var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            // return regex.test(value) ? undefined : 'Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 kí tự in hoa, 1 kí tự in thường, 1 số và 1 kí tự đặc biệt!';
            if(value.trim() === '') {
                return message;
            } else {
                return regex.test(value) ? undefined : 'Mật khẩu phải có ít nhất 8 kí tự, bao gồm 1 kí tự in hoa, 1 kí tự in thường, 1 số và 1 kí tự đặc biệt!';
            }
        }
    }
}

Validator.isConfirmPassword = function(selector, getconfirmValue, message){
    return {
        selector: selector,
        test: (value) => {
            return value === getconfirmValue() ? undefined : message || 'Vui lòng kiểm tra lại!';
        }
    }
}