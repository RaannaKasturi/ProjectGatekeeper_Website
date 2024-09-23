import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

const domainInput = document.getElementById("domainname");

// Function to validate a single domain
function validateDomain() {
  const domain = domainInput.value.trim();
  const domainPattern = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.[A-Za-z]{2,})+$/; // Regex for valid domains
  const wildcardPattern = /^\*\.[A-Za-z0-9-]{1,63}(\.[A-Za-z]{2,})+$/; // Regex for wildcard domains
  let isValid = true;
  domainError.textContent = "";

  if (!domain) {
    isValid = false;
    domainError.textContent = "Domain field cannot be empty.";
  } else if (!domainPattern.test(domain) && !wildcardPattern.test(domain)) {
    isValid = false;
    domainError.textContent = `Invalid domain: ${domain}. Please enter a valid domain.`;
  }

  return isValid;
}
document.querySelector("form").addEventListener("submit", function (event) {
  if (!validateDomain()) {
    event.preventDefault();
    domainError.style.display = "block";
  } else {
    domainError.style.display = "none";
  }
});
domainInput.addEventListener("input", function () {
  validateDomain();
});

async function getdata(domain) {
  const client = await Client.connect("raannakasturi/sslintegrity");
  try {
    const result = await client.predict("/requestAPI", { domain });
    const parsedData = JSON.parse(result.data[0]);
    return parsedData; // Return the first result
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function handleFormSubmit(event) {
  event.preventDefault(); // Prevent form submission (no page reload)
  event.stopPropagation(); // Prevent event bubbling

  const domain = document.getElementById("domainname").value.trim();
  const port = document.getElementById("port").value;

  const result = await getdata(domain);
  const statusElement = document.getElementById("status");
  const tabledata = document.getElementById("outputdata");

  if (result.Status === "error") {
    statusElement.value = `Check failed for ${domain}: This might be the wrong host or server error!`;
    statusElement.classList.remove("border-success");
    statusElement.classList.add("border-danger");
    tabledata.classList.remove("d-block");
    tabledata.classList.add("d-none");
  } else {
    statusElement.value = result.Status;
    statusElement.classList.remove("border-danger");
    statusElement.classList.add("border-success");
    tabledata.classList.remove("d-none");
    tabledata.classList.add("d-block");

    // Clear the previous table data (if any)
    const tableBody = document.getElementById("ssl-result-table");

    if (tableBody) {
      tableBody.innerHTML = ""; // Clear the table before populating new data
      populateTable(result, tableBody);
    } else {
      console.error("Table body not found!");
    }
  }
}

document
  .getElementById("ssl-integrity")
  .addEventListener("submit", handleFormSubmit);

function populateTable(data, tableBody) {
  for (const key in data) {
    addRow(tableBody, key, data[key]);
  }
}

function addRow(tableBody, attribute, value) {
  const row = document.createElement("tr");

  // Create and append the attribute cell with h4
  const attrCell = document.createElement("td");
  const attrHeader = document.createElement("h4");
  attrHeader.textContent = attribute;
  attrCell.appendChild(attrHeader);
  row.appendChild(attrCell);

  // Create and append the value cell with h5
  const valueCell = document.createElement("td");
  const valueHeader = document.createElement("h5");
  valueHeader.textContent = value !== null ? value : "N/A"; // Handle null values
  valueCell.appendChild(valueHeader);
  row.appendChild(valueCell);

  // Append the row to the table body
  tableBody.appendChild(row);
}
