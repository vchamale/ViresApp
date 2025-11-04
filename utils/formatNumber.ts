export const formatNumber = (value: string) => {
    if (!value) return "";
    const clean = value.replace(/[^0-9.]/g, "");
    const parts = clean.split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const decimalPart = parts[1] ? `.${parts[1].slice(0, 2)}` : "";
    return integerPart + decimalPart;
  };