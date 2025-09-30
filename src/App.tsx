import SmartForm from "./components/SmartForm";
import * as Yup from "yup";
import "../src/index.css";

function App() {
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    subscribe: Yup.boolean().oneOf([true], "You must agree to subscribe"),
  });

  return (
    <div className="w-fit mx-auto p-4">
      <SmartForm
        isLoading={true}
        validationSchema={validationSchema}
        labelTextColor="text-green-800 dark:text-green-100"
        buttonBgColor="bg-green-600 hover:bg-green-700"
        buttonTextColor="text-white"
        formValues={[
          { name: "name", type: "text", label: "Name", required: true },
          { name: "email", type: "email", label: "Email", required: true },
          {
            name: "subscribe",
            type: "checkbox",
            label: "Subscribe",
            required: true,
          },
        ]}
        formSubmit={(values) => {
          console.log("Submitted Values:", values);
        }}
      />
    </div>
  );
}

export default App;
