//Validator Constructor
function Validator(options){
    
    //Hàm thực hiện validate
    function validate(inputElement, rule){
        var errorElement = inputElement.parentElement.querySelector('.form-message')
        var errorMessage = rule.test(inputElement.value);
            if(errorMessage){
                errorElement.innerText = errorMessage;
                inputElement.parentElement.classList.add('invalid');
            }else {
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid');
            }
    }

    //Lấy element của form cần validate
    var formElement = document.querySelector(options.form);
    if(formElement){
        options.rules.forEach((rule) => {
            var inputElement = formElement.querySelector(rule.selector);
            console.log(inputElement);
            if(inputElement){
                inputElement.onblur = () => {
                    validate(inputElement, rule);
                }
            }
        });
    }
}

//Define rules
//Nguyên tắc của các rules
//1. Khi có lỗi => Trả ra message lỗi
//2. Khi hợp lệ => Không trả ra cái gì cả (undefined)
Validator.isRequired = function(selector){
    return {
        selector: selector,
        test: (value) => {
            return value.trim() ? undefined : 'Vui lòng nhập tên!';
        }
    }
}

Validator.isEmail = function(selector){
    return {
        selector: selector,
        test: (value) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập đúng định dạng email!';
        }
    }
}