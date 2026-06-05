import { BrowserRouter, Routes, Route } from "react-router-dom";

import ChecklistBuilder from "./pages/ChecklistBuilder";

import LandingPage from "./pages/LandingPage";
import TemplateList from "./pages/TemplateList";

import CorrectiveActionList from "./pages/CorrectiveAction";
import CorrectiveActionForm from "./pages/CorrectiveActionForm";

function App() {
  return (
    

    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/checklist" element={<TemplateList />} />
        <Route path = "/checklist/add" element={<ChecklistBuilder/>}/>
        <Route path="/actions" element={<CorrectiveActionList />} />
         <Route path="/actions/add" element={<CorrectiveActionForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;