import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

const keyTypeSelect = document.getElementById("valkeytype");
const keySizeDiv = document.getElementById("keysize");
const keyCurveDiv = document.getElementById("keycurve");
const keycurve = document.getElementById("valkeycurve");
const domainInput = document.getElementById("domains");
const emailInput = document.getElementById("email");
const domainError = document.getElementById("domainError");
const emailError = document.getElementById("emailError");
const generatebtn = document.getElementById("order");
const provider = document.getElementById("provider");
const wildcard = document.getElementById("wildcard");
const ecc384 = document.getElementById("ecc384");
const buypass = document.getElementById("buypass");
const providertocs = document.getElementById("providertocs");

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
  validateEmails();
});

// Function for Buypass provider
function removeecc() {
  ecc384.setAttribute("disabled", true);
  ecc384.textContent = "ECC-384 (Disabled)";
  wildcard.setAttribute("disabled", true); // Disable the wildcard option
  wildcard.checked = false; // Uncheck the wildcard checkbox if it was selected
}
function enableecc() {
  ecc384.removeAttribute("disabled");
  ecc384.textContent = "ECC-384"; // Set the default value for ECC
  const wildcard = document.getElementById("wildcard");
  wildcard.removeAttribute("disabled"); // Enable wildcard checkbox
}
provider.addEventListener("change", function () {
  if (this.value === "Buypass") {
    removeecc(); // Disable options for BuyPass provider
  } else {
    enableecc(); // Enable options for other providers
  }
});

//funtion to disable buypass as provider when wildcard is on or ECC-384 is selected
function disablebuypass() {
  buypass.setAttribute("disabled", true);
  buypass.textContent = "BuyPass (Disabled)";
}
function enablebuypass() {
  buypass.removeAttribute("disabled");
  buypass.textContent = "BuyPass";
}
document.getElementById("wildcard").addEventListener("change", function () {
  if (this.checked) {
    disablebuypass();
  } else {
    enablebuypass(); // Re-enable BuyPass if wildcard is unchecked
  }
});

// Disable BuyPass if ECC-384 is selected
document.getElementById("valkeycurve").addEventListener("change", function () {
  if (this.value === "SECP384R1") {
    // ECC-384 selected
    disablebuypass();
  } else {
    enablebuypass(); // Re-enable BuyPass if another curve is selected
  }
});

// // order ssl
// async function generate(event) {
//   event.preventDefault(); // Prevent default form submission
//   const domain = document.getElementById("valdomain").value;
//   const email = document.getElementById("valemail").value;
//   const keyType = document.getElementById("valkeytype").value;
//   const keySize = document.getElementById("valkeysize").value;
//   const keyCurve = document.getElementById("valkeycurve").value;
//   const button = document.getElementById("generatebtn");
//   const pvtkeydata = document.getElementById("privatekeydata");
//   const csrdata = document.getElementById("csrdata");
//   button.innerHTML =
//     '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
//   button.classList.add("disabled");
//   button.classList.add("placeholder");
//   button.classList.add("placeholder-wave");
//   pvtkeydata.textContent = "Generating Private Key...";
//   csrdata.textContent = "Generating CSR...";
//   pvtkeydata.classList.add("placeholder");
//   csrdata.classList.add("placeholder");
//   pvtkeydata.classList.add("placeholder-wave");
//   csrdata.classList.add("placeholder-wave");
//   const client = await Client.connect("raannakasturi/generate-pvt-csr");
//   const result = await client.predict("/privcsr", {
//     domains_input: domain,
//     email: email,
//     key_type: keyType,
//     key_size: keySize,
//     key_curve: keyCurve,
//   });
//   pvtkeydata.textContent = result.data[0];
//   csrdata.textContent = result.data[1];
//   button.innerHTML = "Generate";
//   button.classList.remove("disabled");
//   button.classList.remove("placeholder");
//   button.classList.remove("placeholder-wave");
//   pvtkeydata.classList.remove("placeholder");
//   csrdata.classList.remove("placeholder");
//   pvtkeydata.classList.remove("placeholder-wave");
//   csrdata.classList.remove("placeholder-wave");
// }
// document.getElementById("generate").addEventListener("submit", generate);

async function get_cnames(domains) {
  const client = await Client.connect("raannakasturi/gencname");
  const result = await client.predict("/get_cnames", {
    i_domains: domains,
  });
  return result;
}

async function generatecnames(event) {
  event.preventDefault(); // Prevent the form from submitting and reloading the page

  // Clear existing rows in the table
  const tableHead = document.querySelector("#resultTable thead");
  const tableBody = document.querySelector("#resultTable tbody");
  const copyMessage = document.getElementById("copyMessage").classList;
  const gotostep2 = document.getElementById("gotostep2").classList;
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";
  copyMessage.add("d-none");
  gotostep2.add("d-none");

  try {
    const domainInput = document.getElementById("domains").value; // Get input value
    const result = await get_cnames(domainInput); // Fetch CNAMES from API
    const responseData = result.data[0]; // Assuming the first element contains the headers and data

    // Destructure headers and data from response
    const { headers, data } = responseData;

    // Create the header row
    const headerRow = document.createElement("tr");
    headers.forEach((header) => {
      const th = document.createElement("th"); // Create th element
      const h4 = document.createElement("h4"); // Create h4 element
      h4.textContent = header; // Set header text inside h4
      th.appendChild(h4); // Append h4 inside th
      headerRow.appendChild(th); // Append th to the header row
    });
    tableHead.appendChild(headerRow); // Append header row to the table head

    // Populate the table body with data and add copy event
    data.forEach((rowData) => {
      const row = document.createElement("tr");

      rowData.forEach((cellData) => {
        const td = document.createElement("td");
        td.textContent = cellData;

        // Add click event to copy content on click
        td.style.cursor = "pointer"; // Show pointer cursor to indicate clickable
        td.addEventListener("click", () => copyTextFromCell(cellData));

        row.appendChild(td);
      });

      tableBody.appendChild(row);
    });
    copyMessage.remove("d-none");
    gotostep2.remove("d-none");

    console.log("CNAMEs generated:", data);
  } catch (error) {
    console.error("Error in generating CNAMES:", error);
  }
}

// Copy function for each cell
function copyTextFromCell(text) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    console.log("Text copied using fallback method");
  }
}

// Attach event listener to the form to prevent reloading
document
  .getElementById("generatecnames")
  .addEventListener("submit", generatecnames);
