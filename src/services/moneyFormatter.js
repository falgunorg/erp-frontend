import api from "services/api";
import ls from "services/ls";

class moneyFormatter {
  async getConversionRates() {
    var rates = await api.get("/get-latest-exchange-rates");
    if (rates.status === 200) {
      ls.set("conversionRates", rates.data);
      return rates.data;
    } else {
      console.log("/get-latest-exchange-rates failed");
      return null;
    }
  }

  getFiatValue(amount, currencyFrom, currencyTo) {
    if (currencyFrom === currencyTo) {
      return amount;
    }
    var pair = currencyFrom + currencyTo;
    var rates = ls.get("conversionRates");
    if (!rates || !rates[pair]) {
      return "...";
    }
    return parseFloat(rates[pair].rate) * amount;
  }

  convertCurrencyToFiat(amount, currencyFrom, currencyTo) {
    var iconsMap = {
      USD: "$",
      EUR: "€",
    };

    var rate = 0;
    if (currencyFrom === currencyTo) {
      rate = 1;
    } else {
      var pair = currencyFrom + currencyTo;

      var rates = ls.get("conversionRates");
      if (!rates || !rates[pair]) {
        return "...";
      }
      rate = parseFloat(rates[pair].rate);
    }
    return this.balanceFormat(rate * amount, currencyTo);
  }
  balanceFormat(amount, currency) {
    if (currency === undefined) {
      currency = "USD";
    }
    // return parseFloat(amount).toFixed(2);
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,

      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return formatter.format(amount);
  }
  balanceFormatBAK(amount, currency) {
    return parseFloat(amount).toFixed(2);
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,

      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return formatter.format(amount);
  }

  numberFormat(number) {
    var formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
    });

    return formatter.format(number);
  }

  currencyWithIcon(currency) {
    return (
      <>
        {this.currencyIcon(currency)}{" "}
        <span className="currency_name">{currency}</span>
      </>
    );
  }

  currencyName(currency) {
    var namesMap = {
      BTC: "Bitcoin",
      ETH: "Ethereum",
      USDTE: "Tether (Erc-20)",
      USDTT: "Tether (Trc-20)",
      DOGE: "Dogecoin",
      LTC: "Litecoin",
      XRP: "XRP",
      TRX: "TRON (TRX)",
      USD: "US Dollar",
      EUR: "Euro",
      BNB: "Binance (BSC) BEP-2",
      "BNB-BSC": "Binance BNB-BSC BEP-20",
    };
    return namesMap[currency];
  }

  currencyFullWithIcon(currency) {
    return (
      <>
        {this.currencyIcon(currency)}{" "}
        <span className="amount">{this.currencyName(currency)}</span>
      </>
    );
  }

  currencyIcon(currency) {
    var iconsMap = {
      BTC: "btc",
      ETH: "eth",
      USDTE: "usdt",
      USDTT: "usdt",
      DOGE: "doge",
      LTC: "ltc",
      XRP: "xrp",
      TRX: "trx",
      USD: "usd",
      EUR: "eur",
      BNB: "bnb",
      "BNB-BSC": "bnb-bsc",
    };

    return (
      <span className="currency_icon">
        <svg className="svg_icon">
          <use xlinkHref={"/icons.svg#icon-currency-" + iconsMap[currency]} />
        </svg>
      </span>
    );
  }
}
export default new moneyFormatter();
