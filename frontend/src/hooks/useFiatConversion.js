import { useState, useEffect, useCallback } from "react";
import { convertXlmToFiat } from "../services/currencyService";

/**
 * Hook for live real-time XLM to fiat (USD/USDC) price conversion.
 *
 * @param {number} xlmAmount
 * @param {string} [currency="USD"]
 * @returns {{ fiatAmount: number|null, rate: number|null, currency: string, loading: boolean, error: string|null, refresh: Function }}
 */
export function useFiatConversion(xlmAmount = 0, currency = "USD") {
  const [fiatAmount, setFiatAmount] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const convert = useCallback(async () => {
    if (xlmAmount == null || isNaN(xlmAmount) || xlmAmount < 0) {
      setFiatAmount(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await convertXlmToFiat(Number(xlmAmount), currency);
      setFiatAmount(res.fiatAmount);
      setRate(res.rate);
    } catch (err) {
      setError(err.message || "Unable to fetch live price feed");
    } finally {
      setLoading(false);
    }
  }, [xlmAmount, currency]);

  useEffect(() => {
    convert();
  }, [convert]);

  return {
    fiatAmount,
    rate,
    currency,
    loading,
    error,
    refresh: convert,
  };
}

export default useFiatConversion;
