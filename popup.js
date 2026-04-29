
let liveRates = { "3m": 3.12, "6m": 3.05 }; 
let activeType = "3m";

const bankData = {
  swed: { margin: 1.4, years: 30, max: 145000 },
  seb: { margin: 1.45, years: 20, max: 110000 },
  big: { margin: 1.8, years: 30, max: 150000 },
  citadele: { margin: 1.85, years: 28, max: 165000 }
};

function formatEuro(val) {
  return new Intl.NumberFormat('lt-LT', { style: 'currency', currency: 'EUR' }).format(val);
}

function calculate() {
  const price = parseFloat(document.getElementById('price').value);
  const annualRate = parseFloat(document.getElementById('interest').value) / 100;
  const years = parseInt(document.getElementById('years').value);
  const downPercent = parseFloat(document.getElementById('downPercent').value);
  
  if (!price || price <= 0 || !years || years <= 0 || isNaN(downPercent)) {
    return;
  }

  const downpayment = price * (downPercent / 100);
  const principal = price - downpayment;
  const monthlyRate = annualRate / 12;
  const totalPayments = years * 12;

  const x = Math.pow(1 + monthlyRate, totalPayments);
  const monthly = (principal * x * monthlyRate) / (x - 1);
  
  const totalPaid = (monthly * totalPayments) + downpayment;
  const totalInterest = totalPaid - price;

  const estMonthlyRent = (price * 0.055) / 12;
  const rentDiff = monthly - estMonthlyRent;

  document.getElementById('resMonthly').innerText = formatEuro(monthly);
  document.getElementById('resTotalInterest').innerText = formatEuro(totalInterest);
  document.getElementById('resTotalCost').innerText = formatEuro(totalPaid);
  document.getElementById('resDown').innerText = formatEuro(downpayment);
  
  const compBox = document.getElementById('comparison');
  if (rentDiff > 0) {
    compBox.innerText = `Mortgage is ${formatEuro(rentDiff)} more than rent`;
    compBox.style.color = "#d93025";
  } else {
    compBox.innerText = `Mortgage is ${formatEuro(Math.abs(rentDiff))} cheaper than rent!`;
    compBox.style.color = "#1e8e3e";
  }

  const bankKey = document.getElementById('bankSelect').value;
  const warnDiv = document.getElementById('bankWarning');
  if (bankKey !== 'custom' && principal > bankData[bankKey].max) {
    warnDiv.innerText = `⚠️ Loan exceeds limit of ${formatEuro(bankData[bankKey].max)}`;
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

document.getElementById('btn3m').addEventListener('click', () => {
  activeType = "3m";
  document.getElementById('btn3m').classList.add('active');
  document.getElementById('btn6m').classList.remove('active');
  updateInterestField();
});

document.getElementById('btn6m').addEventListener('click', () => {
  activeType = "6m";
  document.getElementById('btn6m').classList.add('active');
  document.getElementById('btn3m').classList.remove('active');
  updateInterestField();
});

document.getElementById('bankSelect').addEventListener('change', (e) => {
  const bank = bankData[e.target.value];
  if (bank) document.getElementById('years').value = bank.years;
  updateInterestField();
});

updateInterestField();
calculate();
