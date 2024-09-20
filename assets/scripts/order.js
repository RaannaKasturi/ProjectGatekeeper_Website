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

//reload page
function reloadPage() {
  location.reload();
}
document.getElementById("reset").addEventListener("click", reloadPage);

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
    }
  }
  if (isValid) {
  }
  return isValid;
}
document.querySelector("form").addEventListener("submit", function (event) {
  if (!validateDomains()) {
    event.preventDefault();
    domainError.style.display = "block";
  } else {
    domainError.style.display = "none";
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
  } else {
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

async function get_cnames(domains) {
  const client = await Client.connect("raannakasturi/gencname");
  const result = await client.predict("/get_cnames", {
    i_domains: domains,
    wildcard: wildcard.checked,
  });
  return result;
}

async function generatecnames(event) {
  event.preventDefault(); // Prevent the form from submitting and reloading the page
  generatebtn.classList.add("disabled");
  // Clear existing rows in the table
  const tableHead = document.querySelector("#resultTable thead");
  const tableBody = document.querySelector("#resultTable tbody");
  const message1 = document.getElementById("message1").classList;
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";
  message1.add("d-none");

  try {
    const domainInput = document.getElementById("domains").value; // Get input value
    const result = await get_cnames(domainInput); // Fetch CNAMES from API
    const responseData = result.data[0]; // Assuming the first element contains the headers and data

    // Destructure headers and data from response
    const { headers, data } = responseData;
    message1.remove("d-none");

    let cnames = new Map();

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
    data.forEach((row) => {
      row.forEach((cell) => {
        cnames.set(cell, row);
      });
    });
    return cnames;
  } catch (error) {
    console.error("Error in generating CNAMES:", error);
    return null;
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
let cnames = null;
document
  .getElementById("generatecnames")
  .addEventListener("submit", async function (event) {
    cnames = await generatecnames(event); // Await the result of generatecnames
    if (cnames) {
      console.log("CNAMEs generated:", cnames); // Log CNAMEs if successfully generated
    } else {
      console.log("Failed to generate CNAMEs.");
    }
  });

// gotostep2 function
function gotostep2(event) {
  event.preventDefault();
  document.getElementById("generate-cname-tab").classList.remove("active");
  document.getElementById("generate-cname-tab").classList.add("disabled");
  document.getElementById("generate-cname").classList.remove("active");
  document.getElementById("verify-cname-tab").classList.add("active");
  document.getElementById("verify-cname").classList.add("active");
}
document.getElementById("gotostep2").addEventListener("click", gotostep2);

// verifycnames function
async function vercnames(domainInput) {
  const client = await Client.connect("raannakasturi/verifycname");
  const result = await client.predict("/verify_cnames", {
    i_domains: domainInput,
    wildcard: wildcard.checked,
  });
  return result;
}

async function verifycnames(event) {
  event.preventDefault();
  document.getElementById("verifycnames").classList.add("disabled");
  const tableHead = document.querySelector("#verifycname thead");
  const tableBody = document.querySelector("#verifycname tbody");
  const message2 = document.getElementById("message2").classList;
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";
  message2.add("d-none");

  try {
    const domainInput = document.getElementById("domains").value;
    const result = await vercnames(domainInput);
    const responseData = result.data[0];
    const { headers, data } = responseData;
    message2.remove("d-none");
    const headerRow = document.createElement("tr");
    headers.forEach((header) => {
      const th = document.createElement("th");
      const h4 = document.createElement("h4");
      h4.textContent = header;
      th.appendChild(h4);
      headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);
    data.forEach((rowData) => {
      const row = document.createElement("tr");
      const isVerified = rowData.includes("Verified");
      row.classList.add(isVerified ? "table-success" : "table-danger");
      if (!isVerified) {
        document.getElementById("gotostep3").classList.add("disabled");
      }
      rowData.forEach((cellData) => {
        const td = document.createElement("td");
        td.textContent = cellData;
        td.style.cursor = "pointer";
        td.addEventListener("click", () => copyTextFromCell(cellData));
        row.appendChild(td);
      });

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error in generating CNAMES:", error);
    return null;
  }
}
document.getElementById("verifycnames").addEventListener("click", verifycnames);

// gotostep3 function
function gotostep3(event) {
  event.preventDefault();
  document.getElementById("verify-cname-tab").classList.remove("active");
  document.getElementById("verify-cname-tab").classList.add("disabled");
  document.getElementById("verify-cname").classList.remove("active");
  document.getElementById("order-ssl-tab").classList.add("active");
  document.getElementById("order-ssl").classList.add("active");
}
document.getElementById("gotostep3").addEventListener("click", gotostep3);

// Function to generate SSL order
async function generatessl(event) {
  event.preventDefault();
  console.log("Generating SSL order...");
  // domains, wildcard, email, keyType, keySize, keyCurve, provider
  const client = await Client.connect("raannakasturi/orderSSL");
  const result = await client.predict("/gen_ssl", {
    i_domains: "thenayankasturi.eu.org",
    wildcard: true,
    email: "raannakasturi@gmail.com",
    ca_server: "Let's Encrypt (Testing)",
    key_type: "ecc",
    key_size: "2048",
    key_curve: "SECP256R1",
  });
  console.log(result);
}
document.getElementById("orderssl").addEventListener("click", generatessl);
