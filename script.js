function calculateTenure(principal, emi, interestRate) {
  const interest = parseFloat(interestRate) / 100 / 12;
  let months = 0;

  while (principal > 0) {
    const interestPayment = principal * interest;
    const principalPayment = emi - interestPayment;
    principal -= principalPayment;
    months++;
  }

  return months;
}

function calculateEMI(loanAmount, interestRate, emiAmount) {
  const principal = parseFloat(loanAmount);
  const interest = parseFloat(interestRate) / 100 / 12;
  const emi = parseFloat(emiAmount);

  return emi.toFixed(2);
}

function generateRepaymentTable(
  loanAmount,
  interestRate,
  emiAmount,
  lumpSumAmount
) {
  const emi = calculateEMI(loanAmount, interestRate, emiAmount);

  const table = document.getElementById("resultTable");
  table.innerHTML = ""; // Clear previous results

  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalLumpSum = 0;
  let reducingPrincipal;

  let loanBalance = parseFloat(loanAmount);
  let lumpSumPayment = parseFloat(lumpSumAmount);

  let months = calculateTenure(loanBalance, emi, interestRate);

  // Get the current year and month based on the calculation start date
  const currentDate = new Date();
  const startYear = currentDate.getFullYear();
  const startMonth = currentDate.getMonth();

  // Add table header
  const headerRow = table.insertRow();
  headerRow.classList.add("bg-gray-800");
  headerRow.innerHTML = `
      <th class="p-2 border">Year</th>
      <th class="p-2 border">Month</th>
      <th class="p-2 border text-right">EMI Amount</th>
      <th class="p-2 border text-right">Interest Repaid</th>
      <th class="p-2 border text-right">Principal Repaid</th>
      <th class="p-2 border text-right">Reducing Principal</th>
      <th class="p-2 border text-right">Lump Sum Payment</th>
    `;

  let currentYear = startYear;
  let currentMonth = startMonth;

  for (let i = 1; i <= months; i++) {
    const interestPayment = (loanBalance * interestRate) / 100 / 12;
    const principalPayment = emi - interestPayment;
    reducingPrincipal = loanBalance - principalPayment;
    totalInterest += interestPayment;
    totalPrincipal += principalPayment;

    loanBalance -= principalPayment;

    // Check if a lump sum payment is made in the current year
    if (i % 12 === 0) {
      loanBalance -= lumpSumPayment;
      totalLumpSum += lumpSumPayment;
      currentYear++;
    }

    const row = table.insertRow();
    if (i % 12 === 0) {
      const monthName = new Intl.DateTimeFormat("en-US", {
        month: "short",
      }).format(new Date(currentYear, currentMonth));
      row.innerHTML = `
          <td class="p-2 border text-center">${currentYear}</td>
          <td class="p-2 border text-center">${monthName}</td>
          <td class="p-2 border text-right">${emi}</td>
          <td class="p-2 border text-right">${interestPayment.toFixed(2)}</td>
          <td class="p-2 border text-right">${principalPayment.toFixed(2)}</td>
          <td class="p-2 border text-right">${reducingPrincipal.toFixed(2)}</td>
          <td class="p-2 border text-right">${lumpSumPayment.toFixed(2)}</td>
        `;
      lumpSumPayment = parseFloat(lumpSumAmount); // Reset the lump sum payment for the next year
      currentMonth = (currentMonth + 1) % 12;
    } else {
      const monthName = new Intl.DateTimeFormat("en-US", {
        month: "short",
      }).format(new Date(currentYear, currentMonth));
      row.innerHTML = `
          <td class="p-2 border"></td>
          <td class="p-2 border text-center">${monthName}</td>
          <td class="p-2 border text-right">${emi}</td>
          <td class="p-2 border text-right">${interestPayment.toFixed(2)}</td>
          <td class="p-2 border text-right">${principalPayment.toFixed(2)}</td>
          <td class="p-2 border text-right">${reducingPrincipal.toFixed(2)}</td>
          <td class="p-2 border text-right"></td>
        `;
      currentMonth = (currentMonth + 1) % 12;
    }

    if (loanBalance <= 0) {
      break;
    }
  }

  // Add summary row
  const totalRow = table.insertRow();
  const finalPrincipal = totalPrincipal + reducingPrincipal;
  totalRow.classList.add("bg-gray-800");
  totalRow.innerHTML = `
      <td class="p-2 border"></td>
      <td class="p-2 border"></td>
      <td class="p-2 border"></td>
      <td class="p-2 border text-right">${totalInterest.toFixed(2)}</td>
      <td class="p-2 border text-right">${finalPrincipal.toFixed(2)}</td>
      <td class="p-2 border"></td>
      <td class="p-2 border text-right">${totalLumpSum.toFixed(2)}</td>
    `;

  const totalAmountRepaid = totalInterest + finalPrincipal + totalLumpSum;
  const totalAmountRepaidRow = table.insertRow();
  totalAmountRepaidRow.innerHTML = `
      <td class="p-2 border"></td>
      <td class="p-2 border"></td>
      <td class="p-2 border"></td>
      <td class="p-2 border"></td>
      <td class="p-2 border"></td>
      <td class="p-2 border"></td>
      <td class="p-2 border text-right">${totalAmountRepaid.toFixed(2)}</td>
    `;
}

// Calculate button click event handler
// Form submit event handler
const loanForm = document.getElementById("loanForm");
loanForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form submission

  if (loanForm.checkValidity()) {
    const loanAmount = document.getElementById("loanAmount").value;
    const interestRate = document.getElementById("interestRate").value;
    const emiAmount = document.getElementById("emiAmount").value;
    const lumpSumAmount = document.getElementById("lumpSum").value;

    generateRepaymentTable(loanAmount, interestRate, emiAmount, lumpSumAmount);
  }
});
