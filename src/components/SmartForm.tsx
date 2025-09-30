import { useFormik } from "formik";
import "./index.css";
type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "date"
  | "checkbox"
  | "radio"
  | "file"
  | "color"
  | "range"
  | "tel"
  | "time";

type Field = {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  options?: string[]; // For checkbox & radio
};

type Props = {
  formValues: Field[];
  theme?: "white" | "black";
  width?: string; // Tailwind max-width class or custom width
  formSubmit: (values: Record<string, unknown>) => void;
};

const SmartForm = ({
  formValues,
  theme = "white",
  width = "max-w-xl",
  formSubmit,
}: Props) => {
  const initialValues = formValues.reduce((acc, field) => {
    switch (field.type) {
      case "checkbox":
        acc[field.name] = false;
        break;
      case "file":
        acc[field.name] = null;
        break;
      default:
        acc[field.name] = "";
    }
    return acc;
  }, {} as Record<string, unknown>);

  const { handleChange, values, handleSubmit, setFieldValue, resetForm } =
    useFormik({
      initialValues,
      onSubmit: (vals) => {
        formSubmit?.(vals);
        resetForm();
      },
    });

  const themeClasses = {
    white: {
      formBg: "bg-white",
      text: "text-gray-800",
      inputBg: "bg-white",
      inputText: "text-gray-800",
      border: "border-gray-300",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      buttonText: "text-white",
    },
    black: {
      formBg: "bg-gray-900",
      text: "text-gray-100",
      inputBg: "bg-gray-800",
      inputText: "text-gray-100",
      border: "border-gray-700",
      buttonBg: "bg-gray-700 hover:bg-gray-800",
      buttonText: "text-white",
    },
  };

  const themeStyle = themeClasses[theme];

  return (
    <form
      onSubmit={handleSubmit}
      className={`${width} mx-auto p-6 ${themeStyle.formBg} shadow-lg rounded-lg space-y-5`}
    >
      <h2 className={`text-2xl font-bold mb-4 text-center ${themeStyle.text}`}>
        Smart Form
      </h2>

      {formValues.map((field) => {
        const { name, type, label, placeholder, options } = field;

        if (type === "checkbox") {
          return (
            <label
              key={name}
              className={`flex items-center space-x-3 cursor-pointer ${themeStyle.text}`}
            >
              <input
                type="checkbox"
                name={name}
                checked={values[name] as boolean}
                onChange={handleChange}
                className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
              />
              <span className="font-medium">{label || name}</span>
            </label>
          );
        }

        if (type === "radio" && options) {
          return (
            <div key={name} className="space-y-1">
              <p className={`font-medium ${themeStyle.text}`}>
                {label || name}
              </p>
              <div className="flex space-x-4">
                {options.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={name}
                      value={opt}
                      checked={values[name] === opt}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-400"
                    />
                    <span className={themeStyle.text}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        }

        if (type === "file") {
          return (
            <div key={name} className="space-y-1">
              <label className={`font-medium ${themeStyle.text}`}>
                {label || name}
              </label>
              <input
                type="file"
                name={name}
                onChange={(e) =>
                  setFieldValue(name, e.currentTarget.files?.[0] || null)
                }
                className={`block w-full ${themeStyle.inputText} ${themeStyle.inputBg} border ${themeStyle.border} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
            </div>
          );
        }

        return (
          <div key={name} className="space-y-1">
            <label className={`block font-medium ${themeStyle.text}`}>
              {label || name}
            </label>
            <input
              type={type}
              name={name}
              placeholder={placeholder || `Enter ${label || name}`}
              value={
                values[name] as string | number | readonly string[] | undefined
              }
              onChange={handleChange}
              className={`block w-full ${themeStyle.inputText} ${themeStyle.inputBg} border ${themeStyle.border} rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
            />
          </div>
        );
      })}

      <button
        type="submit"
        className={`w-full ${themeStyle.buttonBg} ${themeStyle.buttonText} font-semibold py-2 rounded-lg shadow-md transition-all duration-200`}
      >
        Submit
      </button>
    </form>
  );
};

export default SmartForm;
