import Header from "./components/Header.jsx";
import FileList from "./components/FilesList.jsx";
import {Toaster} from "react-hot-toast";


function App() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <Header />
      <FileList />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;