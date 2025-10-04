// DOM Elements
const rateInput = document.getElementById('rate');
const makeRegularInput = document.getElementById('makeRegular');
const gstGoldInput = document.getElementById('gstGold');
const gstMakingInput = document.getElementById('gstMaking');
const totalGInput = document.getElementById('totalG');
const reservedGInput = document.getElementById('reservedG');
const waiveReservedInput = document.getElementById('waiveReserved');
const resultsContainer = document.getElementById('results');

// Format number as Indian Rupees
function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(amount || 0);
}

// Format number with 2 decimal places
function formatDecimal(number) {
    return Number(number || 0).toFixed(2);
}

// Calculate all values
function calculate() {
    // Get input values with defaults
    const rate = parseFloat(rateInput.value) || 0;
    const makeRegular = parseFloat(makeRegularInput.value) || 0;
    const gstGold = parseFloat(gstGoldInput.value) || 0;
    const gstMaking = parseFloat(gstMakingInput.value) || 0;
    const totalG = parseFloat(totalGInput.value) || 0;
    const reservedG = parseFloat(reservedGInput.value) || 0;
    const waiveReserved = parseFloat(waiveReservedInput.value) || 0;

    // Calculate derived values
    const regularG = Math.max(0, totalG - reservedG);
    
    // Price calculations
    const priceOfGold = totalG * rate;
    const priceOfGoldReserved = reservedG * rate;
    const priceOfGoldRegular = regularG * rate;
    
    // Making charges calculations
    const makingPerGram = (makeRegular / 100) * rate;
    const totalMakingBeforeWaiver = totalG * makingPerGram;
    const makingWaivedOff = reservedG * rate * (waiveReserved / 100);
    const payableMaking = totalMakingBeforeWaiver - makingWaivedOff;
    
    // GST calculations
    const gstGoldAmt = (gstGold / 100) * priceOfGold;
    const gstMakingAmt = (gstMaking / 100) * totalMakingBeforeWaiver;
    const totalGST = gstGoldAmt + gstMakingAmt;
    
    // Final amounts
    const subTotal = priceOfGoldRegular + payableMaking;
    const finalAmt = subTotal + totalGST;

    // Update the UI with results
    updateResults({
        priceOfGold,
        priceOfGoldReserved,
        totalMakingBeforeWaiver,
        makingWaivedOff,
        payableGold: priceOfGoldRegular,
        payableMaking,
        gstGoldAmt,
        gstMakingAmt,
        finalAmt
    });
}

// Update the results in the UI
function updateResults(results) {
    resultsContainer.innerHTML = `
        <div class="result-row">
            <span class="result-label">Price Of Gold</span>
            <span class="result-value">${formatINR(results.priceOfGold)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Price Of Gold - Reserved via Scheme</span>
            <span class="result-value">${formatINR(results.priceOfGoldReserved)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Making Charges</span>
            <span class="result-value">${formatINR(results.totalMakingBeforeWaiver)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Making Charges - Waived Off</span>
            <span class="result-value">${formatINR(results.makingWaivedOff)}</span>
        </div>
        <div class="result-row" style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid var(--divider);">
            <span class="result-label">Payable - Price Of Gold</span>
            <span class="result-value">${formatINR(results.payableGold)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Payable - Making Charges</span>
            <span class="result-value">${formatINR(results.payableMaking)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">GST - Gold (${gstGoldInput.value}%)</span>
            <span class="result-value">${formatINR(results.gstGoldAmt)}</span>
        </div>
        <div class="result-row">
            <span class="result-label">GST - Making (${gstMakingInput.value}%)</span>
            <span class="result-value">${formatINR(results.gstMakingAmt)}</span>
        </div>
        <div class="result-row" style="margin-top: 1rem; padding-top: 1rem; border-top: 2px solid var(--divider);">
            <span class="result-label" style="font-weight: bold;">Total Payable</span>
            <span class="result-value highlight">${formatINR(results.finalAmt)}</span>
        </div>
    `;
}

// Add event listeners to all inputs
[rateInput, makeRegularInput, gstGoldInput, gstMakingInput, totalGInput, reservedGInput, waiveReservedInput].forEach(input => {
    input.addEventListener('input', calculate);
    input.addEventListener('change', calculate);
});

// Initial calculation
calculate();
