
let liveRates = { "3m": 3.12, "6m": 3.05 }; 
let activeType = "3m";

const bankData = {
  swed: { margin: 1.4, years: 30, max: 145000 },
  seb: { margin: 1.45, years: 20, max: 110000 },
  big: { margin: 1.8, years: 30, max: 150000 },
  citadele: { margin: 1.85, years: 28, max: 165000 }
};

function formatEuro(val) {
  return new Intl.NumberFormat('lt-LT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
}
function formatEuroPrecise(val) {
  return new Intl.NumberFormat('lt-LT', { style: 'currency', currency: 'EUR' }).format(val);
}

function calculate() {
  const price = parseFloat(document.getElementById('price').value) || 0;
  const annualRate = parseFloat(document.getElementById('interest').value) / 100 || 0;
  const years = parseInt(document.getElementById('years').value) || 0;
  const downPercent = parseFloat(document.getElementById('downPercent').value) || 0;

  const downpayment = price * (downPercent / 100);
  const principal = price - downpayment;
  const monthlyRate = annualRate / 12;
  const totalPayments = years * 12;

  let monthly = 0;
  if (monthlyRate > 0 && totalPayments > 0) {
    const x = Math.pow(1 + monthlyRate, totalPayments);
    monthly = (principal * x * monthlyRate) / (x - 1);
  }
  
  const totalPaid = (monthly * totalPayments) + downpayment;
  const totalInterest = totalPaid - price;
  const estMonthlyRent = (price * 0.055) / 12;

  // Display
  document.getElementById('resLoan').innerText = formatEuro(principal);
  document.getElementById('resMonthly').innerText = formatEuroPrecise(monthly);
  document.getElementById('resDown').innerText = formatEuro(downpayment);
  document.getElementById('resTotalInterest').innerText = formatEuro(totalInterest);
  document.getElementById('resTotalCost').innerText = formatEuro(totalPaid);

  const compBox = document.getElementById('comparison');
  const diff = monthly - estMonthlyRent;
  if (diff > 0) {
    compBox.innerText = `Mortgage is ${formatEuro(diff)} more than estimated rent`;
    compBox.style.color = "#d93025";
  } else {
    compBox.innerText = `Mortgage is ${formatEuro(Math.abs(diff))} cheaper than rent!`;
    compBox.style.color = "#1e8e3e";
  }

  const bankKey = document.getElementById('bankSelect').value;
  const warnDiv = document.getElementById('bankWarning');
  if (bankKey !== 'custom' && principal > bankData[bankKey].max) {
    warnDiv.innerText = `⚠️ Loan exceeds ${bankKey.toUpperCase()} limit of ${formatEuro(bankData[bankKey].max)}`;
    warnDiv.style.display = 'block';
  } else {
    warnDiv.style.display = 'none';
  }
}

function updateInterestField() {
  const bankKey = document.getElementById('bankSelect').value;
  const margin = bankKey !== 'custom' ? bankData[bankKey].margin : 1.5;
  const total = margin + liveRates[activeType];
  document.getElementById('interest').value = total.toFixed(3);
  calculate();
}

['price', 'years', 'interest', 'downPercent'].forEach(id => {
  document.getElementById(id).addEventListener('input', calculate);
});

document.getElementById('bankSelect').addEventListener('change', (e) => {
  const bank = bankData[e.target.value];
  if (bank) document.getElementById('years').value = bank.years;
  updateInterestField();
});

updateInterestField();
