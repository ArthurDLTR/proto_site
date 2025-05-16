window.addEventListener("DOMContentLoaded", () => {
    /**
     * Elements for the page
    */
   // Getting the button to know the theme to display
   const button = document.querySelector(".lightdarkbutton")
   // Getting the elements to display the button
   const circle = document.querySelector(".circle")
   // Getting all the elements in the first row of each table
   const headTable = document.querySelectorAll(".table-row-title")
   // Gettting all the document
   const all = document.querySelector("html")
   // Getting the three span elements
   const first = document.querySelector(".first")
   const second = document.querySelector(".second")
   const third = document.querySelector(".third")
   // Getting the container of the span elements
   const burger = document.querySelector(".burger")
   // Getting the links' panel
   const links = document.querySelector(".home-link")
    
    
    /**
     * Part for the dark/light mode
     */
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

    /**
     * Part for the burger menu animation
     */
    let menuOpened = 0

    burger.addEventListener("click", () => {
        if (menuOpened == 0){
            burger.disabled = true
            first.style.transform = 'translateY(14px)'
            second.style.transform = 'scale(0)'
            third.style.transform = 'translateY(-14px)'
            window.setTimeout(() => {
                links.style.transform = 'translateX(200px)'
                links.style.background = 'rgba(0, 0, 0, .9)'
                first.style.transform += 'rotate(-135deg)'
                third.style.transform += 'rotate(-225deg)'
            }, 1200)
            menuOpened = 1
        } else if (menuOpened == 1){
            menuOpened = 2
            links.style.transform = ''
            links.style.background = 'rgba(0, 0, 0, 0)'
            first.style.transform = 'translateY(14px) rotate(0deg)'
            third.style.transform = 'translateY(-14px) rotate(0deg)'
            window.setTimeout(() => {
                first.style.transform = ''
                second.style.transform = 'scale(1)'
                third.style.transform = ''
            }, 1000)
            menuOpened = 0
        }
    })
});