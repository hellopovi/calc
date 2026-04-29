
const liveEuribor = { "3m": 2.165, "6m": 2.427 };
let activeType = "3m";

const bankMargins = {
  swed: 1.40,
  seb: 1.45,
  big: 1.80,
  citadele: 1.85
};

function formatEuro(val, decimals = 0) {
  return new Intl.NumberFormat('lt-LT', { style: 'currency', currency: 'EUR', maximumFractionDigits: decimals }).format(val);
}

function calculate() {
  const price = parseFloat(document.getElementById('price').value) || 0;
  const downPercent = parseFloat(document.getElementById('downPercent').value) || 0;
  const years = parseInt(document.getElementById('years').value) || 0;
  
  const margin = bankMargins[document.getElementById('bankSelect').value];
  const totalRate = margin + liveEuribor[activeType];
  
  document.getElementById('totalRateDisp').innerText = totalRate.toFixed(3) + '%';

  const downpayment = price * (downPercent / 100);
  const principal = price - downpayment;
  const monthlyRate = (totalRate / 100) / 12;
  const totalPayments = years * 12;

  let monthly = 0;
  if (monthlyRate > 0 && totalPayments > 0) {
    const x = Math.pow(1 + monthlyRate, totalPayments);
    monthly = (principal * x * monthlyRate) / (x - 1);
  }

  // 10-year appreciation at 4.5% (Compounded)
  const futureVal = price * Math.pow(1 + 0.045, 10);
  const profit = futureVal - price;

  document.getElementById('resLoan').innerText = formatEuro(principal);
  document.getElementById('resMonthly').innerText = formatEuro(monthly, 2);
  document.getElementById('resFutureVal').innerText = formatEuro(futureVal);
  document.getElementById('resProfit').innerText = '+' + formatEuro(profit);
}

document.getElementById('btn3m').addEventListener('click', () => {
  activeType = "3m";
  document.getElementById('btn3m').classList.add('active');
  document.getElementById('btn6m').classList.remove('active');
  calculate();
});

document.getElementById('btn6m').addEventListener('click', () => {
  activeType = "6m";
  document.getElementById('btn6m').classList.add('active');
  document.getElementById('btn3m').classList.remove('active');
  calculate();
});

document.getElementById('bankSelect').addEventListener('change', calculate);
['price', 'years', 'downPercent'].forEach(id => {
  document.getElementById(id).addEventListener('input', calculate);
});

calculate();
