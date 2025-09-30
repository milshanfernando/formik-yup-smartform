# formik-yup-smartform

A **dynamic, customizable React form component** built with Formik and Tailwind CSS. `SmartForm` automatically generates form fields based on a configuration object and supports themes, file inputs, checkboxes, radios, and more. Perfect for reducing boilerplate in React forms.

---

## Features

- Generate forms from a simple configuration array.
- Supports **all common input types**: text, number, email, password, date, checkbox, radio, file, color, range, tel, time.
- Custom **themes**: `white` and `black`.
- Tailwind CSS compatible and fully responsive.
- Automatically handles **initial values** and form submission.
- Easily extensible for **checkbox groups, radio buttons, and file uploads**.

---

## Installation

```bash
npm install formik-yup-smartform
# or
yarn add formik-yup-smartform
```

example >>>>>>>>>>

import React from "react";
import SmartForm from "formik-yup-smartform";
import \* as Yup from "yup";
import "formik-yup-smartform/dist/index.css"; // optional if Tailwind not installed

function App() {
// Step 1: Create Yup validation schema
const validationSchema = Yup.object().shape({
name: Yup.string()
.required("Name is required")
.min(3, "Name must be at least 3 characters"),
email: Yup.string()
.required("Email is required")
.email("Invalid email address"),
subscribe: Yup.boolean().oneOf([true], "You must agree to subscribe"),
});

// Step 2: Define form fields
const formFields = [
{ name: "name", type: "text", label: "Name", required: true },
{ name: "email", type: "email", label: "Email", required: true },
{ name: "subscribe", type: "checkbox", label: "Subscribe", required: true },
];

// Step 3: Handle form submission
const handleSubmit = (values: Record<string, unknown>) => {
console.log("Submitted Values:", values);
alert(JSON.stringify(values, null, 2));
};

return (
<div className="w-fit mx-auto p-4">
<h1 className="text-2xl font-bold mb-4">SmartForm Example</h1>
<SmartForm
validationSchema={validationSchema} // pass Yup schema
formValues={formFields} // pass fields array
formSubmit={handleSubmit} // submit callback
width="max-w-md" // optional: adjust width
/>
</div>
);
}

export default App;

> > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > >
