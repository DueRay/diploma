export const required = (value) => value ? undefined : "Це поле є обов'язковим";
export const password = (value) => value.length > 3 ? undefined : "Мінімум 4 цифри";
