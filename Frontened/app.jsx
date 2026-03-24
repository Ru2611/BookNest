import { BrowserRouter } from "react-router-dom";
import BookCard from "./Components/Card";
import Header from "./Components/Header"
import React from "react";



function App() {
    
    return(
        <BrowserRouter>
        <div>
     
        <Header/>
        <BookCard/>
        </div>
        </BrowserRouter>
        
    )
}

export default App;