window.addEventListener("DOMContentLoaded", () => {
    // Getting the button to know the theme to display
    const button = document.querySelector(".lightdarkbutton")
    // Getting the elements to display the button
    const circle = document.querySelector(".circle")
    // Gettting all the document
    const headTable = document.querySelectorAll(".table-row-title")
    const all = document.querySelector("html")
    
    // Default theme
    let mode = "dark"
    
    button.addEventListener("click", () => {
        if(mode == "dark"){
            // console.log("Changing from dark to light")
            circle.style.marginLeft = "27.5px"
            all.style.background = "#fff"
            all.style.color = "black"
            headTable.forEach((elt) =>
                elt.style.background = "#d8d8d8"
            )
            mode = "light"
        } else if (mode == "light"){
            // console.log("Changing from light to dark")
            circle.style.marginLeft = "2.5px"
            all.style.background = "#191919"
            all.style.color = "white"
            headTable.forEach((elt) =>
                elt.style.background = "#383838"
            )
            mode = "dark"
        }
    })
});