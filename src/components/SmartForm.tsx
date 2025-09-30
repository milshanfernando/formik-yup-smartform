import { useFormik } from "formik";
import * as Yup from "yup";

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
  options?: string[];
  required?: boolean;
};

type Props = {
  formValues: Field[];
  width?: string;
  formSubmit: (values: Record<string, unknown>) => void;
  validationSchema?: Yup.ObjectSchema<any>;
  isLoading?: boolean;
  buttonBgColor?: string;
  buttonTextColor?: string;
  labelTextColor?: string;
};

const SmartForm = ({
  formValues,
  width = "max-w-xl",
  formSubmit,
  validationSchema,
  isLoading = false,
  buttonBgColor = "bg-blue-600 hover:bg-blue-700",
  buttonTextColor = "text-white",
  labelTextColor = "text-gray-800 dark:text-gray-100",
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

  const schema =
    validationSchema ||
    Yup.object().shape(
      formValues.reduce((shape, field) => {
        if (!field.required) {
          shape[field.name] = Yup.mixed();
          return shape;
        }

        switch (field.type) {
          case "checkbox":
            shape[field.name] = Yup.boolean().oneOf(
              [true],
              `${field.label || field.name} is required`
            );
            break;
          case "email":
            shape[field.name] = Yup.string()
              .email("Invalid email")
              .required(`${field.label || field.name} is required`);
            break;
          case "number":
          case "range":
            shape[field.name] = Yup.number()
              .typeError(`${field.label || field.name} must be a number`)
              .required(`${field.label || field.name} is required`);
            break;
          case "file":
            shape[field.name] = Yup.mixed().required(
              `${field.label || field.name} is required`
            );
            break;
          default:
            shape[field.name] = Yup.string().required(
              `${field.label || field.name} is required`
            );
        }

        return shape;
      }, {} as Record<string, Yup.AnySchema>)
    );

  const {
    handleChange,
    values,
    handleSubmit,
    setFieldValue,
    resetForm,
    errors,
    touched,
    handleBlur,
  } = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (vals) => {
      formSubmit(vals);
      resetForm();
    },
  });

  return (
    <form onSubmit={handleSubmit} className={`${width} mx-auto p-6 space-y-5`}>
      {formValues.map((field) => {
        const { name, type, label, placeholder, options } = field;

        // Checkbox
        if (type === "checkbox") {
          return (
            <div key={name} className="space-y-1">
              <label
                className={`flex items-center space-x-3 cursor-pointer ${labelTextColor}`}
              >
                <input
                  type="checkbox"
                  name={name}
                  checked={values[name] as boolean}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-400"
                />
                <span className="font-medium">{label || name}</span>
              </label>
              {touched[name] && errors[name] && (
                <p className="text-red-500 text-sm">{errors[name] as string}</p>
              )}
            </div>
          );
        }

        // Radio
        if (type === "radio" && options) {
          return (
            <div key={name} className="space-y-1">
              <p className={`font-medium ${labelTextColor}`}>{label || name}</p>
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
                      onBlur={handleBlur}
                      className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-400"
                    />
                    <span className={`font-medium`}>{opt}</span>
                  </label>
                ))}
              </div>
              {touched[name] && errors[name] && (
                <p className="text-red-500 text-sm">{errors[name] as string}</p>
              )}
            </div>
          );
        }

        // File
        if (type === "file") {
          return (
            <div key={name} className="space-y-1">
              <label className={`font-medium ${labelTextColor}`}>
                {label || name}
              </label>
              <input
                type="file"
                name={name}
                onChange={(e) =>
                  setFieldValue(name, e.currentTarget.files?.[0] || null)
                }
                onBlur={handleBlur}
                className={`block w-full ${labelTextColor} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              {touched[name] && errors[name] && (
                <p className="text-red-500 text-sm">{errors[name] as string}</p>
              )}
            </div>
          );
        }

        // Default input
        return (
          <div key={name} className="space-y-1">
            <label className={`block font-medium ${labelTextColor}`}>
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
              onBlur={handleBlur}
              className={`block w-full ${labelTextColor} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400`}
            />
            {touched[name] && errors[name] && (
              <p className="text-red-500 text-sm">{errors[name] as string}</p>
            )}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 ${buttonBgColor} ${buttonTextColor} font-semibold py-2 rounded-lg shadow-md transition-all duration-200`}
      >
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        )}
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default SmartForm;
