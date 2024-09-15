import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

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

// generate pvtcsr
async function generate(event) {
    event.preventDefault(); // Prevent default form submission
    const domain = document.getElementById('valdomain').value;
    const email = document.getElementById('valemail').value;
    const keyType = document.getElementById('valkeytype').value;
    const keySize = document.getElementById('valkeysize').value;
    const keyCurve = document.getElementById('valkeycurve').value;
    const button = document.getElementById('generatebtn');
    const pvtkeydata = document.getElementById('privatekeydata');
    const csrdata = document.getElementById('csrdata')
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
    button.classList.add('disabled');
    button.classList.add('placeholder');
    button.classList.add('placeholder-wave');
    pvtkeydata.textContent = 'Generating Private Key...';
    csrdata.textContent = 'Generating CSR...';
    pvtkeydata.classList.add('placeholder');
    csrdata.classList.add('placeholder');
    pvtkeydata.classList.add('placeholder-wave');
    csrdata.classList.add('placeholder-wave');
    const client = await Client.connect("raannakasturi/generate-pvt-csr");
    const result = await client.predict("/privcsr", {
        domains_input: domain,
        email: email,
        key_type: keyType,
        key_size: keySize,
        key_curve: keyCurve,
    });
    pvtkeydata.textContent = result.data[0];
    csrdata.textContent = result.data[1];
    button.innerHTML = 'Generate';
    button.classList.remove('disabled');
    button.classList.remove('placeholder');
    button.classList.remove('placeholder-wave');
    pvtkeydata.classList.remove('placeholder');
    csrdata.classList.remove('placeholder');
    pvtkeydata.classList.remove('placeholder-wave');
    csrdata.classList.remove('placeholder-wave');
}
document.getElementById('generate').addEventListener('submit', generate);