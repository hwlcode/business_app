import {FormControl} from "@angular/forms";

export function phoneValidator(control: FormControl) {
    const val = (control.value || '') + '';
    const reg = /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
    const valid = reg.test(val);
    return valid ? null : {phoneValidator: true};
}

export function numberValidator(control: FormControl) {
    const val = (control.value || '') + '';
    const reg = /^\d{6}$/;
    const valid = reg.test(val);
    return valid ? null : {numberValidator: true};
}
