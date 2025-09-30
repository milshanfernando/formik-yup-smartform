import SmartForm from "./components/SmartForm";
import "../src/index.css";
function App() {
  return (
    <div className=" w-fit mx-auto p-4 ">
      <SmartForm
        formValues={[
          { name: "name", type: "text", label: "Name" },
          { name: "email", type: "email", label: "Email" },
          { name: "subscribe", type: "checkbox", label: "Subscribe" },
        ]}
        formSubmit={(values) => {
          console.log("Submitted Values:", values);
        }}
      />
    </div>
  );
}

export default App;
