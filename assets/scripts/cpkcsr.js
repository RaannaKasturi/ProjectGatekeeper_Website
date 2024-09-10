// Key Type Select
const keyTypeSelect = document.getElementById('valkeytype');
const keySizeDiv = document.getElementById('keysize');
const keyCurveDiv = document.getElementById('keycurve');
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

// Get the generate select element
const generateSelect = document.getElementById('generate');
const customCsrDiv = document.getElementById('customcsrdiv');
generateSelect.addEventListener('change', function () {
    const selectedValue = this.value;
    if (selectedValue === 'pkcsr' || selectedValue === 'csr') {
        customCsrDiv.classList.remove('visually-hidden');
    } else {
        customCsrDiv.classList.add('visually-hidden');
    }
});

// Custom CSR Validation
const customCsrCheckbox = document.getElementById('customcsr');
const customCsrDataDiv = document.getElementById('customcsrdata');
const customCsrFields = customCsrDataDiv.querySelectorAll('input, select, textarea');
const form = document.querySelector('form'); // Ensure this matches your form element
if (customCsrCheckbox && customCsrDataDiv && customCsrFields.length > 0 && form) {
    customCsrCheckbox.addEventListener('change', function () {
        const isChecked = this.checked;
        if (isChecked) {
            customCsrDataDiv.classList.remove('visually-hidden');
            customCsrFields.forEach(field => {
                field.setAttribute('required', 'true');
            });
        } else {
            customCsrDataDiv.classList.add('visually-hidden');
            customCsrFields.forEach(field => {
                field.removeAttribute('required');
            });
        }
    });
    form.addEventListener('submit', function (event) {
        let isValid = true;
        if (customCsrCheckbox.checked) {
            customCsrFields.forEach(field => {
                if (field.hasAttribute('required') && !field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid'); // Add Bootstrap error class
                } else {
                    field.classList.remove('is-invalid'); // Remove error class if valid
                }
            });
        }
        if (!isValid) {
            event.preventDefault();
            alert('Please fill out all required fields.');
        }
    });
}

// Function to validate domains
const domainInput = document.getElementById('valdomain');
const domainError = document.getElementById('domainError');
function validateDomains() {
    const domains = domainInput.value.split(',').map(domain => domain.trim());
    const domainPattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+$/; // Regex for valid domains
    const wildcardPattern = /^\*\.[A-Za-z0-9-]{1,63}(\.[A-Za-z]{2,})+$/; // Regex for wildcard domains
    let isValid = true;
    domainError.textContent = ''; // Clear previous error messages
    for (let domain of domains) {
        if (!domainPattern.test(domain) && !wildcardPattern.test(domain)) {
            isValid = false;
            domainError.textContent += `Invalid domain: ${domain}. Please enter valid domains. `;
        }
    }
    return isValid;
}
document.querySelector('form').addEventListener('submit', function (event) {
    if (!validateDomains()) {
        event.preventDefault(); // Prevent form submission if validation fails
        domainError.style.display = 'block'; // Show error message
    } else {
        domainError.style.display = 'none'; // Hide error message if valid
    }
});
domainInput.addEventListener('input', function () {
    validateDomains();
});
