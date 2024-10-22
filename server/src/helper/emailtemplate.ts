const magicLinkTemplate = (link: string) => {
  return `
       <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Magic Link Login</title>
      <style>
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
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
    <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
      rel="stylesheet"
    />
  </head>
  <body class="bg-gray-100 text-gray-800">
    <div class="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">
        Verify Your Email
      </h2>
      <p class="text-gray-600 mb-4">
        Hi there, please verify your email address by clicking the button below.
      </p>
      <a
        href="${link}"
        class="block text-center bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Click Here to Verify
      </a>
      <p class="text-gray-500 text-sm mt-6 text-center">
        If you didn’t request this, you can safely ignore this email.
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
  amountDue: string
) => {
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice #${invoiceNumber}</title>
    <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
      rel="stylesheet"
    />
  </head>
  <body class="bg-gray-100 text-gray-800">
    <div class="max-w-lg mx-auto my-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">
        Invoice for ${JobDescription}
      </h2>
      
      <p class="text-gray-600 mb-4">
        Hello, please find your invoice attached below. The total amount due is <strong>$${amountDue}</strong>.
      </p>
      <p class="text-gray-600 mb-4">
        The payment is due by <strong>${dueDate}</strong>. You can view or download your invoice in attachment.
      </p>
      
      <p class="text-gray-500 text-sm mt-6 text-center">
        If you have any questions, feel free to contact us. Thank you for your business!
      </p>
    </div>
  </body>
</html>
  `;
};

export { magicLinkTemplate, verifyEmailTemplate, invoiceTemplate };
