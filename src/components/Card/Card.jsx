import { useEffect, useState } from 'react';
import { useGetCurrenciesQuery, useGetRatesByBaseRateQuery, useGetRatesQuery } from '../../api/apiSlice';
import CurrencyChange from '../../assets/changeCurrency.png';

const Card = ({ amount, setAmount, setFrom, setTo, setTotal }) => {
  const { data: rates, isLoading: isLoadingRates } = useGetRatesQuery({});
  const { data: dataCurrencies, isLoading: isLoadingCurrencies } = useGetCurrenciesQuery({});
  const [fromCurrency, setFromCurrency] = useState('Euro');
  const [toCurrency, setToCurrency] = useState('US Dollar');
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    if (dataCurrencies) {
      setCurrencies(Object.values(dataCurrencies));
    }
  }, [dataCurrencies]);

  const findCurrencyCodeByName = (currencyName) => {
    for (const code in dataCurrencies) {
      console.log(code);
      if (dataCurrencies[code].name === currencyName) {
        return code;
      }
    }
    return null; // Si no se encuentra ninguna coincidencia
  };

  useEffect(() => {
    if (rates && rates.rates) {
      const calculation = amount * rates.rates[findCurrencyCodeByName(fromCurrency)] * rates.rates[findCurrencyCodeByName(toCurrency)];
      setTotal(calculation);
    }
  }, [findCurrencyCodeByName, fromCurrency, rates, setTotal, toCurrency]);

  const { data: ratesByBaseFrom, isLoading: isLoadingRatesByBaseFrom } = useGetRatesByBaseRateQuery(
    findCurrencyCodeByName(fromCurrency) || 'EUR',
  );
  const { data: ratesByBaseTo, isLoading: isLoadingRatesByBaseTo } = useGetRatesByBaseRateQuery(
    findCurrencyCodeByName(toCurrency) || 'USD',
  );

  const onChangeAmount = (e) => {
    const inputAmount = Number(e.target.value);
    const positiveAmount = Math.abs(inputAmount);

    e.target.value = positiveAmount;

    setAmount(positiveAmount);
    const fromCurrencyCode = findCurrencyCodeByName(fromCurrency);
    const toCurrencyCode = findCurrencyCodeByName(toCurrency);
    setFrom(fromCurrency);
    setTo(toCurrency);
    const calculation = positiveAmount * rates.rates[fromCurrencyCode] * rates.rates[toCurrencyCode];
    setTotal(calculation);
  };

  if (isLoadingRates || isLoadingCurrencies || isLoadingRatesByBaseFrom || isLoadingRatesByBaseTo) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '90%', minHeight: 400 }} className='card relative'>
        <div className='row' style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 50 }}>
          <div className='col-sm-12 col-md-6 col-lg-6 col-xl-3'>
            <label htmlFor=''>Amount</label>
            <div className='d-flex flex-row'>
              <span
                style={{ backgroundColor: 'white', borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                className='input-group-text'>
                $
              </span>
              <input
                style={{ borderLeft: 'none', paddingLeft: 0, width: '100%', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                type='number'
                onChange={onChangeAmount}
                defaultValue={amount}
                className='form-control'
                aria-label='Amount (to the nearest dollar)'
              />
            </div>
          </div>

          <div className='col-sm-12 col-md-6 col-lg-6 col-xl-4'>
            <label htmlFor=''>From</label>
            <div className='d-flex flex-row'>
              <select
                value={fromCurrency}
                onChange={(event) => {
                  setFromCurrency(event.target.value);
                  setFrom(event.target.value);
                }}
                className='form-select'
                aria-label='Default select example'>
                {currencies &&
                  currencies.map((currency, index) => {
                    return (
                      <option key={index} value={currency.name}>
                        {currency.name}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>

          <div
            className='col-sm-12 col-md-6 col-lg-6 col-xl-3'
            onClick={() => {
              setFromCurrency(toCurrency);
              setToCurrency(fromCurrency);
              setFrom(toCurrency);
              setTo(fromCurrency);
            }}
            style={{
              width: 42,
              height: 42,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              cursor: 'pointer',
            }}>
            <img style={{ border: 'solid', borderColor: '#177FE5', borderRadius: 25 }} src={CurrencyChange} height='30' width='30' />
          </div>

          <div className='col-sm-12 col-md-6 col-lg-6 col-xl-4'>
            <label htmlFor=''>To</label>
            <div className='d-flex flex-row'>
              <select
                value={toCurrency}
                onChange={(event) => {
                  setToCurrency(event.target.value);
                  setTo(event.target.value);
                }}
                className='form-select'
                aria-label='Default select example'>
                {currencies &&
                  currencies.map((currency, index) => {
                    return (
                      <option key={index} value={currency.name}>
                        {currency.name}
                      </option>
                    );
                  })}
              </select>
            </div>
          </div>
        </div>

        <h4 style={{ fontWeight: 'bold', fontSize: 32 }}>{`1.00 ${fromCurrency} = ${ratesByBaseFrom.rates[
          findCurrencyCodeByName(toCurrency)
        ].toFixed(6)} ${toCurrency}`}</h4>
        <p style={{ color: '#757575', fontSize: 16 }}>{`1 ${findCurrencyCodeByName(toCurrency)} = ${ratesByBaseTo.rates[
          findCurrencyCodeByName(fromCurrency)
        ].toFixed(6)} ${findCurrencyCodeByName(fromCurrency)}`}</p>

        <div
          className='d-none d-lg-block'
          style={{ background: '#E8F3FF', position: 'absolute', bottom: 52, right: 20, width: 500, padding: 15, borderRadius: 8 }}>
          <p style={{ fontSize: 14, lineHeight: 2 }}>
            We use the mid-market rate for our Converter. This is for informational purposes only. You won’t receive this rate when sending
            money.
          </p>
        </div>

        <div className='d-none d-lg-block' style={{ position: 'absolute', bottom: 0, right: 20, borderRadius: 8 }}>
          <p style={{ padding: 0, fontSize: 12 }}>
            <a href='https://www.xe.com/currency/eur-euro/' target='_blank' style={{ color: '#000', textDecoration: 'underline' }}>
              Euro
            </a>{' '}
            to{' '}
            <a href='https://www.xe.com/currency/usd-us-dollar/' target='_blank' style={{ color: '#000', textDecoration: 'underline' }}>
              US Dollar
            </a>{' '}
            conversion — Last updated Dec 15, 2022, 19:17 UTC
          </p>
        </div>
      </div>
      <div className='d-block d-md-none mt-2'>
        <p style={{ padding: 0, fontSize: 12 }}>
          <a href='https://www.xe.com/currency/eur-euro/' target='_blank' style={{ color: '#000', textDecoration: 'underline' }}>
            Euro
          </a>{' '}
          to{' '}
          <a href='https://www.xe.com/currency/usd-us-dollar/' target='_blank' style={{ color: '#000', textDecoration: 'underline' }}>
            US Dollar
          </a>{' '}
          conversion — Last updated Dec 15, 2022, 19:17 UTC
        </p>
      </div>
    </div>
  );
};

export default Card;
