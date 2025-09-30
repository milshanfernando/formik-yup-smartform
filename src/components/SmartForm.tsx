import { useFormik } from "formik";

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
  width?: string; // Tailwind max-width class or custom width
  formSubmit: (values: Record<string, unknown>) => void;
};

const SmartForm = ({ formValues, width = "max-w-xl", formSubmit }: Props) => {
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

  return (
    <form
      onSubmit={handleSubmit}
      className={`${width} mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg space-y-5`}
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
        Smart Form
      </h2>

      {formValues.map((field) => {
        const { name, type, label, placeholder, options } = field;

        if (type === "checkbox") {
          return (
            <label
              key={name}
              className="flex items-center space-x-3 cursor-pointer text-gray-800 dark:text-gray-100"
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
              <p className="font-medium text-gray-800 dark:text-gray-100">
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
                    <span className="text-gray-800 dark:text-gray-100">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        }

        if (type === "file") {
          return (
            <div key={name} className="space-y-1">
              <label className="font-medium text-gray-800 dark:text-gray-100">
                {label || name}
              </label>
              <input
                type="file"
                name={name}
                onChange={(e) =>
                  setFieldValue(name, e.currentTarget.files?.[0] || null)
                }
                className="block w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          );
        }

        return (
          <div key={name} className="space-y-1">
            <label className="block font-medium text-gray-800 dark:text-gray-100">
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
              className="block w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div>
        );
      })}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-200"
      >
        Submit
      </button>
    </form>
  );
};

export default SmartForm;
