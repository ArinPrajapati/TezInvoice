const magicLinkTemplate = (link: string) => {
  return `
       <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Magic Link Login</title>
      <style>
        /* Add your custom styles here */
        .bg-gray-100 { background-color: #f3f4f6; }
        .max-w-lg { max-width: 32rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .mt-10 { margin-top: 2.5rem; }
        .p-6 { padding: 1.5rem; }
        .bg-white { background-color: white; }
        .rounded-lg { border-radius: 0.5rem; }
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .text-2xl { font-size: 1.5rem; }
        .font-semibold { font-weight: 600; }
        .text-gray-800 { color: #1f2937; }
        .mb-4 { margin-bottom: 1rem; }
        .text-gray-700 { color: #374151; }
        .mb-6 { margin-bottom: 1.5rem; }
        .inline-block { display: inline-block; }
        .bg-blue-600 { background-color: #2563eb; }
        .text-white { color: white; }
        .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .text-center { text-align: center; }
        .font-medium { font-weight: 500; }
        .hover\:bg-blue-700:hover { background-color: #1d4ed8; }
        .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; }
      </style>
    </head>
    <body class="bg-gray-100 my-10">
      <div class="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-800 mb-4">Login with Magic Link</h1>
        <p class="text-gray-700 mb-6">
          Hello! Click the button below to securely log into your account.
        </p>
        <a target="_blank" href="${link}" 
           class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg text-center font-medium hover:bg-blue-700 transition-colors">
          Login Now
        </a>
        <p class="mt-6 text-sm text-gray-500">
          If you didn’t request this email, you can safely ignore it.
        </p>
      </div>
    </body>
    </html>
    `;
};

const verifyEmailTemplate = (link: string) => {
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Email</title>
  </head>
      <body style="background-color: #f3f4f6; color: #1f2937;">
        <div style="max-width: 32rem; margin: 2.5rem auto; background-color: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <h2 style="font-size: 1.5rem; font-weight: bold; text-align: center; color: #2563eb; margin-bottom: 1.5rem;">
        Verify Your Email
      </h2>
          <p style="color: #4b5563; margin-bottom: 1rem;">
        Hi there, please verify your email address by clicking the button below.
      </p>
      <a
        href="${link}"
            style="display: block; text-align: center; background-color: #2563eb; color: white; padding: 0.75rem 1rem; border-radius: 0.5rem; text-decoration: none; margin: 1rem 0;"
      >
        Click Here to Verify
      </a>
          <p style="color: #6b7280; font-size: 0.875rem; margin-top: 1.5rem; text-align: center;">
            If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  </body>
</html>
    `;
};

const invoiceTemplate = (
  invoiceNumber: string,
  JobDescription: string,
  dueDate: string,
  amountDue: string,
  by: string
) => {
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice Template</title>
  </head>
      <body style="background-color: #faf5ff; min-height: 100vh; padding: 1.5rem;">
        <div style="max-width: 42rem; width: 100%; margin: 0 auto; background-color: white; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); overflow: hidden;">
      <!-- Header -->
          <div style="background-color: #7c3aed; padding: 1.5rem;">
            <h1 style="font-size: 1.875rem; font-weight: bold; color: white; text-align: center; margin: 0;">INVOICE</h1>
            <p style="color: #e9d5ff; text-align: center; margin-top: 0.5rem;">${invoiceNumber}</p>
      </div>
      
      <!-- Content -->
          <div style="padding: 2rem;">
            <div style="margin-bottom: 2rem;">
              <h2 style="font-size: 1.5rem; font-weight: 600; color: #5b21b6; margin-bottom: 1rem;">${JobDescription}</h2>
              <p style="font-size: 1rem; color: #6b7280; margin-bottom: 1rem;">Service Provider: ${by}</p>
              <div style="height: 0.25rem; width: 5rem; background-color: #7c3aed; border-radius: 0.25rem;"></div>
        </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
          <div>
                <h3 style="font-size: 0.875rem; font-weight: 500; color: #7c3aed; text-transform: uppercase; margin-bottom: 0.5rem;">Due Date</h3>
                <p style="color: #1f2937;">${dueDate}</p>
          </div>
          <div>
                <h3 style="font-size: 0.875rem; font-weight: 500; color: #7c3aed; text-transform: uppercase; margin-bottom: 0.5rem;">Amount Due</h3>
                <p style="font-size: 1.5rem; font-weight: bold; color: #1f2937;">${amountDue}</p>
          </div>
        </div>

            <div style="background-color: #faf5ff; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 2rem;">
              <p style="color: #4b5563; line-height: 1.625;">
            Thank you for choosing our services. Please find your invoice details above. Payment is due by the specified date.
          </p>
        </div>

            <div style="border-top: 1px solid #e9d5ff; padding-top: 1.5rem;">
              <div style="text-align: center;">
                <p style="font-size: 0.875rem; color: #4b5563; margin-bottom: 0.5rem;">
              Questions? We're here to help.
            </p>
                <p style="color: #7c3aed; font-weight: 500;">support@company.com</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
};

// Classic invoice template with table layout and serif font
const classicInvoiceTemplate = (
  invoiceNumber: string,
  JobDescription: string,
  dueDate: string,
  amountDue: string,
  by: string
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice #${invoiceNumber}</title>
</head>
<body style="font-family: Georgia, serif; padding: 2rem; color: #000;">
  <h1>Invoice #${invoiceNumber}</h1>
  <p><strong>Description:</strong> ${JobDescription}</p>
  <p><strong>Provider:</strong> ${by}</p>
  <table style="width:100%; border-collapse: collapse; margin-top: 1rem;">
    <thead>
      <tr>
        <th style="border:1px solid #000; padding:8px; text-align:left;">Due Date</th>
        <th style="border:1px solid #000; padding:8px; text-align:left;">Amount Due</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border:1px solid #000; padding:8px;">${dueDate}</td>
        <td style="border:1px solid #000; padding:8px;">${amountDue}</td>
      </tr>
    </tbody>
  </table>
</body>
</html>
  `;
};

// Modern invoice template with accent colors and grid
const modernInvoiceTemplate = (
  invoiceNumber: string,
  JobDescription: string,
  dueDate: string,
  amountDue: string,
  by: string
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice #${invoiceNumber}</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 2rem; background-color: #f0f4f8;">
  <div style="max-width:600px; margin:0 auto; background:white; border-radius:8px; overflow:hidden;">
    <header style="background-color:#2a4365; color:white; padding:1rem; text-align:center;">
      <h2>Invoice #${invoiceNumber}</h2>
    </header>
    <main style="padding:1.5rem; display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
      <div>
        <h3 style="margin:0; color:#2a4365;">Description</h3>
        <p style="margin:0.5rem 0;">${JobDescription}</p>
      </div>
      <div>
        <h3 style="margin:0; color:#2a4365;">Provider</h3>
        <p style="margin:0.5rem 0;">${by}</p>
      </div>
      <div>
        <h3 style="margin:0; color:#2a4365;">Due Date</h3>
        <p style="margin:0.5rem 0;">${dueDate}</p>
      </div>
      <div>
        <h3 style="margin:0; color:#2a4365;">Amount Due</h3>
        <p style="margin:0.5rem 0; font-size:1.25rem; font-weight:bold;">${amountDue}</p>
      </div>
    </main>
  </div>
</body>
</html>
  `;
};

// Minimalist invoice template with clean, black-and-white layout
const minimalistInvoiceTemplate = (
  invoiceNumber: string,
  JobDescription: string,
  dueDate: string,
  amountDue: string,
  by: string
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice #${invoiceNumber}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; margin:2rem; color:#333; }
    .container { max-width:600px; margin:0 auto; }
    .header { text-align:center; margin-bottom:2rem; }
    .header h1 { margin:0; font-weight:300; }
    .details p { margin:0.5rem 0; }
    .footer { margin-top:3rem; text-align:center; font-size:0.875rem; color:#777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Invoice #${invoiceNumber}</h1>
    </div>
    <div class="details">
      <p><strong>Description:</strong> ${JobDescription}</p>
      <p><strong>Provider:</strong> ${by}</p>
      <p><strong>Due Date:</strong> ${dueDate}</p>
      <p><strong>Amount Due:</strong> ${amountDue}</p>
    </div>
    <div class="footer">Thank you for your business.</div>
  </div>
</body>
</html>
  `;
};

export { magicLinkTemplate, verifyEmailTemplate, invoiceTemplate, classicInvoiceTemplate, modernInvoiceTemplate, minimalistInvoiceTemplate };
