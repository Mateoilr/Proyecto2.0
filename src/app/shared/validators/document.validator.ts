import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function documentValidator(tipoDocumentoControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) {
      return null;
    }

    const tipoControl = control.parent.get(tipoDocumentoControlName);
    const tipo = tipoControl ? tipoControl.value : 'CEDULA';
    const documento = control.value;

    if (!documento) {
      return null; // Let Validators.required handle empty fields
    }

    const isValid = validarDocumentoEcuador(documento, tipo);

    if (!isValid) {
      return { invalidDocument: true };
    }

    return null;
  };
}

function validarDocumentoEcuador(documento: string, tipo: string): boolean {
    const limpio = documento.trim().toUpperCase();

    if (tipo === 'PASAPORTE') {
        const regexPasaporte = /^[A-Z0-9]{6,12}$/;
        return regexPasaporte.test(limpio);
    }

    if (!/^\d+$/.test(limpio)) return false;

    const provincia = parseInt(limpio.substring(0, 2), 10);
    if (provincia < 1 || (provincia > 24 && provincia !== 30)) return false;

    const tercerDigito = parseInt(limpio[2], 10);

    if (tipo === 'CEDULA') {
        if (limpio.length !== 10) return false;
        if (tercerDigito >= 6) return false; 

        const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let suma = 0;

        for (let i = 0; i < 9; i++) {
            let paso = parseInt(limpio[i], 10) * coeficientes[i];
            if (paso >= 10) paso -= 9; 
            suma += paso;
        }

        const residuo = suma % 10;
        const verifEsperado = residuo === 0 ? 0 : 10 - residuo;
        return verifEsperado === parseInt(limpio[9], 10);
    }

    if (tipo === 'RUC') {
        if (limpio.length !== 13) return false;
        if (limpio.substring(10, 13) === "000") return false; 

        if (tercerDigito < 6) {
            const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
            let suma = 0;
            for (let i = 0; i < 9; i++) {
                let paso = parseInt(limpio[i], 10) * coeficientes[i];
                if (paso >= 10) paso -= 9;
                suma += paso;
            }
            const residuo = suma % 10;
            const verifEsperado = residuo === 0 ? 0 : 10 - residuo;
            return verifEsperado === parseInt(limpio[9], 10);
        }

        if (tercerDigito === 9) {
            const coeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];
            let suma = 0;
            for (let i = 0; i < 9; i++) {
                suma += parseInt(limpio[i], 10) * coeficientes[i];
            }
            const residuo = suma % 11;
            const verifEsperado = residuo === 0 ? 0 : 11 - residuo;
            return verifEsperado === parseInt(limpio[9], 10);
        }

        if (tercerDigito === 6) {
            const coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
            let suma = 0;
            for (let i = 0; i < 8; i++) {
                suma += parseInt(limpio[i], 10) * coeficientes[i];
            }
            const residuo = suma % 11;
            const verifEsperado = residuo === 0 ? 0 : 11 - residuo;
            return verifEsperado === parseInt(limpio[8], 10);
        }
    }

    return false;
}
