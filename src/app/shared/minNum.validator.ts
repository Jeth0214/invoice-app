import { AbstractControl } from '@angular/forms';

export function ValidateMinNum(control: AbstractControl) {
    return control.value > -1 ? null : { minNum: true }
}