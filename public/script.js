let refresh = document.getElementById("refresh")
refresh.remove()

if (!!window.EventSource) {
    const evtSource = new EventSource('/eventstream');
    evtSource.addEventListener('message', event => {
        const data = JSON.parse(event.data);

        let values = {
            shoarma: data.data.shoarma.integerValue,
            boerenkool: data.data.boerenkool.integerValue,
            spaghetti: data.data.spaghetti.integerValue,
            friet: data.data.friet.integerValue
        }

        let frietChart = document.getElementById("frietChart")
        let boerenkoolChart = document.getElementById("boerenkoolChart")
        let spaghettiChart = document.getElementById("spaghettiChart")
        let shoarmaChart = document.getElementById("shoarmaChart")

        frietChart.setAttribute("style", `height:${values.friet}%;"`);
        boerenkoolChart.setAttribute("style", `height:${values.boerenkool}%;"`);
        spaghettiChart.setAttribute("style", `height:${values.spaghetti}%;"`);
        shoarmaChart.setAttribute("style", `height:${values.shoarma}%;"`);

        document.getElementById("frietText").innerHTML = `${values.friet}` + "pt"
        document.getElementById("boerenkoolText").innerHTML = `${values.boerenkool}` + "pt"
        document.getElementById("spaghettiText").innerHTML = `${values.spaghetti}` + "pt"
        document.getElementById("shoarmaText").innerHTML = `${values.shoarma}` + "pt"

        document.getElementById("frietTextTable").innerHTML = `${values.friet}` + "pt"
        document.getElementById("spaghettiTextTable").innerHTML = `${values.boerenkool}` + "pt"
        document.getElementById("boerenkoolTextTable").innerHTML = `${values.spaghetti}` + "pt"
        document.getElementById("shoarmaTextTable").innerHTML = `${values.shoarma}` + "pt"

    })

} else {
    console.log("Your browser doesn't support SSE")
}

