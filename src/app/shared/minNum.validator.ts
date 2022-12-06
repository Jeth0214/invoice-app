import { AbstractControl } from '@angular/forms';

export function ValidateMinNum(control: AbstractControl) {
    return control.value > 0 ? null : { minNum: true }
}