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
  options?: string[]; // For checkbox & radio
  required?: boolean; // Optional custom required
};

type Props = {
  formValues: Field[];
  width?: string;
  formSubmit: (values: Record<string, unknown>) => void;
  validationSchema?: Yup.ObjectSchema<any>; // optional
};

const SmartForm = ({
  formValues,
  width = "max-w-xl",
  formSubmit,
  validationSchema,
}: Props) => {
  // Step 1: Initial values
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

  // Step 2: Auto-generate simple validation **only if user didn't provide one**
  const schema =
    validationSchema ||
    Yup.object().shape(
      formValues.reduce((shape, field) => {
        if (!field.required) {
          shape[field.name] = Yup.mixed(); // optional field
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

  // Step 3: Setup Formik
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
              <label className="flex items-center space-x-3 cursor-pointer text-gray-800 dark:text-gray-100">
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
                      onBlur={handleBlur}
                      className="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-400"
                    />
                    <span className="text-gray-800 dark:text-gray-100">
                      {opt}
                    </span>
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
              <label className="font-medium text-gray-800 dark:text-gray-100">
                {label || name}
              </label>
              <input
                type="file"
                name={name}
                onChange={(e) =>
                  setFieldValue(name, e.currentTarget.files?.[0] || null)
                }
                onBlur={handleBlur}
                className="block w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              onBlur={handleBlur}
              className="block w-full text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            {touched[name] && errors[name] && (
              <p className="text-red-500 text-sm">{errors[name] as string}</p>
            )}
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
