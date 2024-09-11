const keyTypeSelect = document.getElementById('valkeytype');
const keySizeDiv = document.getElementById('keysize');
const keyCurveDiv = document.getElementById('keycurve');
const domainInput = document.getElementById('valdomain');
const domainError = document.getElementById('domainError');

// Key Type Select
keyTypeSelect.addEventListener('change', function () {
    const selectedKeyType = this.value;
    if (selectedKeyType === 'rsa') {
        keySizeDiv.classList.remove('visually-hidden');
        keyCurveDiv.classList.add('visually-hidden');
    } else if (selectedKeyType === 'ecc') {
        keySizeDiv.classList.add('visually-hidden');
        keyCurveDiv.classList.remove('visually-hidden');
    }
});

// Function to validate domains
function validateDomains() {
    const domains = domainInput.value.split(',').map(domain => domain.trim());
    const domainPattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+$/; // Regex for valid domains
    const wildcardPattern = /^\*\.[A-Za-z0-9-]{1,63}(\.[A-Za-z]{2,})+$/; // Regex for wildcard domains
    let isValid = true;
    domainError.textContent = '';
    for (let domain of domains) {
        if (!domain) {
            continue;
        } else if (!domainPattern.test(domain) && !wildcardPattern.test(domain)) {
            isValid = false;
            domainError.textContent += `Invalid domain: ${domain}. Please enter valid domains. `;
        }
    }
    return isValid;
}
document.querySelector('form').addEventListener('submit', function (event) {
    if (!validateDomains()) {
        event.preventDefault();
        domainError.style.display = 'block';
    } else {
        domainError.style.display = 'none';
    }
});
domainInput.addEventListener('input', function () {
    validateDomains();
});
