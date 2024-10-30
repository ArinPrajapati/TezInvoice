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
   <style>
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
      </style>
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
    <title>Invoice Template</title>
   <style>
        @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
      </style>
  </head>
  <body class="bg-purple-50 min-h-screen flex items-center justify-center p-6">
    <div class="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      <!-- Header -->
      <div class="bg-purple-600 p-6">
        <h1 class="text-3xl font-bold text-white text-center">INVOICE</h1>
        <p class="text-purple-200 text-center mt-2">#INV-2024-001</p>
      </div>
      
      <!-- Content -->
      <div class="p-8">
        <!-- Job Description -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-purple-800 mb-4">Web Development Project</h2>
          <div class="h-1 w-20 bg-purple-500 rounded"></div>
        </div>

        <!-- Invoice Details -->
        <div class="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 class="text-sm font-medium text-purple-600 uppercase mb-2">Due Date</h3>
            <p class="text-gray-800">May 15, 2024</p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-purple-600 uppercase mb-2">Amount Due</h3>
            <p class="text-2xl font-bold text-gray-800">$2,500.00</p>
          </div>
        </div>

        <!-- Message -->
        <div class="bg-purple-50 rounded-lg p-6 mb-8">
          <p class="text-gray-700 leading-relaxed">
            Thank you for choosing our services. Please find your invoice details above. Payment is due by the specified date.
          </p>
        </div>

        <!-- Footer -->
        <div class="border-t border-purple-100 pt-6">
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-2">
              Questions? We're here to help.
            </p>
            <p class="text-purple-600 font-medium">support@company.com</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
};

export { magicLinkTemplate, verifyEmailTemplate, invoiceTemplate };
