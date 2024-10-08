import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

const keyTypeSelect = document.getElementById("valkeytype");
const keySizeDiv = document.getElementById("keysize");
const keyCurveDiv = document.getElementById("keycurve");
const domainInput = document.getElementById("valdomain");
const emailInput = document.getElementById("valemail");
const domainError = document.getElementById("domainError");
const emailError = document.getElementById("emailError");
const generatebtn = document.getElementById("generatebtn");

// Key Type Select
keyTypeSelect.addEventListener("change", function () {
  const selectedKeyType = this.value;
  if (selectedKeyType === "rsa") {
    keySizeDiv.classList.remove("visually-hidden");
    keyCurveDiv.classList.add("visually-hidden");
  } else if (selectedKeyType === "ecc") {
    keySizeDiv.classList.add("visually-hidden");
    keyCurveDiv.classList.remove("visually-hidden");
  }
});

// Function to validate domains
function validateDomains() {
  const domains = domainInput.value.split(",").map((domain) => domain.trim());
  const domainPattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+$/; // Regex for valid domains
  const wildcardPattern = /^\*\.[A-Za-z0-9-]{1,63}(\.[A-Za-z]{2,})+$/; // Regex for wildcard domains
  let isValid = true;
  domainError.textContent = "";
  for (let domain of domains) {
    if (!domain) {
      continue;
    } else if (!domainPattern.test(domain) && !wildcardPattern.test(domain)) {
      isValid = false;
      domainError.textContent += `Invalid domain: ${domain}. Please enter valid domains. `;
      generatebtn.classList.add("disabled");
    }
  }
  if (isValid) {
    generatebtn.classList.remove("disabled");
  } else {
    generatebtn.classList.add("disabled");
  }
  return isValid;
}
document.querySelector("form").addEventListener("submit", function (event) {
  if (!validateDomains()) {
    event.preventDefault();
    generatebtn.classList.add("disabled");
    domainError.style.display = "block";
  } else {
    domainError.style.display = "none";
    generatebtn.classList.remove("disabled");
  }
});
domainInput.addEventListener("input", function () {
  validateDomains();
  validateEmails();
});

// Function to validate emails
function validateEmails() {
  const emails = emailInput.value.split(",").map((email) => email.trim());
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for valid email format
  const forbiddenDomains = ["example", "demo", "dummy", "test", "domain"]; // Fake domains to be restricted
  let isValid = true;
  emailError.textContent = "";
  for (let email of emails) {
    if (!email) {
      isValid = false;
      continue;
    }
    if (!emailPattern.test(email)) {
      isValid = false;
      emailError.textContent += `Invalid email: ${email}. Please enter valid emails. `;
      continue;
    }
    const emailDomain = email.split("@")[1];
    if (emailDomain) {
      const domainName = emailDomain.split(".")[0];
      if (forbiddenDomains.includes(domainName.toLowerCase())) {
        isValid = false;
        emailError.textContent += `Invalid domain: ${emailDomain} in ${email}. Please avoid fake domains. `;
      }
    }
  }
  if (isValid) {
    generatebtn.classList.remove("disabled");
  } else {
    generatebtn.classList.add("disabled");
  }
  return isValid;
}
document.querySelector("form").addEventListener("submit", function (event) {
  if (!validateEmails()) {
    event.preventDefault(); // Prevent form submission if validation fails
    emailError.style.display = "block";
  } else {
    emailError.style.display = "none";
  }
});
emailInput.addEventListener("input", function () {
  validateEmails(); // Validate emails on input change
});

// generate pvtcsr
async function generate(event) {
  event.preventDefault(); // Prevent default form submission
  const domain = document.getElementById("valdomain").value;
  const email = document.getElementById("valemail").value;
  const keyType = document.getElementById("valkeytype").value;
  const keySize = document.getElementById("valkeysize").value;
  const keyCurve = document.getElementById("valkeycurve").value;
  const button = document.getElementById("generatebtn");
  const pvtkeydata = document.getElementById("privatekeydata");
  const csrdata = document.getElementById("csrdata");
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
  button.classList.add("disabled");
  button.classList.add("placeholder");
  button.classList.add("placeholder-wave");
  pvtkeydata.textContent = "Generating Private Key...";
  csrdata.textContent = "Generating CSR...";
  pvtkeydata.classList.add("placeholder");
  csrdata.classList.add("placeholder");
  pvtkeydata.classList.add("placeholder-wave");
  csrdata.classList.add("placeholder-wave");
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
  button.innerHTML = "Generate";
  button.classList.remove("disabled");
  button.classList.remove("placeholder");
  button.classList.remove("placeholder-wave");
  pvtkeydata.classList.remove("placeholder");
  csrdata.classList.remove("placeholder");
  pvtkeydata.classList.remove("placeholder-wave");
  csrdata.classList.remove("placeholder-wave");
}
document.getElementById("generate").addEventListener("submit", generate);
