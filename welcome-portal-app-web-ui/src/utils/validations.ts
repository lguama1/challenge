export class Validations {
    public static readonly isValidName = (value: string): boolean => {
        return typeof value === 'string' &&
        value.trim().length >= 3 &&
        value.trim().length <= 120 &&
        /^\s*([A-Za-zÁÉÍÓÚáéíóúÑñ']+\x20+)+[A-Za-zÁÉÍÓÚáéíóúÑñ']+\s*$/.test(value);
    }

    public static readonly isValidArea = (value: string): boolean => {
        return typeof value === 'string' &&
        value.trim().length >= 4 &&
        value.trim().length <= 80 &&
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(value)
    }

    public static readonly isValidEmail = (value: string): boolean => {
        return typeof value === 'string' &&
        value.trim().length >= 23 &&
        value.trim().length <= 50 &&
        /^[a-zA-Z0-9._%+-]+@bancodebogota\.com\.co$/.test(value)
    }

    public static readonly isValidOptionsAccess = (optionsAccess: string[]): boolean => {
        return optionsAccess.length > 0;
    }
}
